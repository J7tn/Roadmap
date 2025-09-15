"""
Supabase Career Service for chat2api
Handles monthly updates of career data to Supabase database
"""

import os
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import httpx
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SupabaseCareerService:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not found. Career updates will be disabled.")
            self.supabase: Optional[Client] = None
        else:
            self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
            logger.info("Supabase client initialized successfully")

    async def update_career_data(self, careers_data: List[Dict[str, Any]], update_type: str = "monthly") -> bool:
        """
        Update career data in Supabase database
        """
        if not self.supabase:
            logger.error("Supabase client not initialized")
            return False

        try:
            logger.info(f"Starting {update_type} career data update with {len(careers_data)} careers")
            
            # Clear existing data
            await self._clear_existing_careers()
            
            # Insert new career data
            careers_inserted = await self._insert_careers(careers_data)
            
            # Log the update
            await self._log_update(update_type, careers_inserted)
            
            logger.info(f"Successfully updated {careers_inserted} careers in Supabase")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update career data: {str(e)}")
            return False

    async def _clear_existing_careers(self):
        """Clear existing career data"""
        try:
            result = self.supabase.table('careers').delete().neq('id', '').execute()
            logger.info(f"Cleared {len(result.data)} existing careers")
        except Exception as e:
            logger.error(f"Failed to clear existing careers: {str(e)}")
            raise

    async def _insert_careers(self, careers_data: List[Dict[str, Any]]) -> int:
        """Insert new career data"""
        try:
            # Transform data to match Supabase schema
            transformed_careers = []
            for career in careers_data:
                transformed_career = {
                    'id': career['id'],
                    'title': career['title'],
                    'description': career['description'],
                    'skills': career['skills'],
                    'salary': career['salary'],
                    'experience': career['experience'],
                    'level': career['level'],
                    'industry': career['industry'],
                    'job_titles': career['jobTitles'],
                    'certifications': career['certifications'],
                    'requirements': career['requirements'],
                    'last_updated_by': 'chat2api'
                }
                transformed_careers.append(transformed_career)

            # Insert in batches to avoid payload size limits
            batch_size = 50
            total_inserted = 0
            
            for i in range(0, len(transformed_careers), batch_size):
                batch = transformed_careers[i:i + batch_size]
                result = self.supabase.table('careers').insert(batch).execute()
                total_inserted += len(result.data)
                logger.info(f"Inserted batch {i//batch_size + 1}: {len(result.data)} careers")
            
            return total_inserted
            
        except Exception as e:
            logger.error(f"Failed to insert careers: {str(e)}")
            raise

    async def _log_update(self, update_type: str, careers_updated: int):
        """Log the update in the career_update_log table"""
        try:
            log_entry = {
                'update_type': update_type,
                'careers_updated': careers_updated,
                'chat2api_version': '1.0.0',
                'notes': f'Automated {update_type} update via chat2api'
            }
            
            result = self.supabase.table('career_update_log').insert(log_entry).execute()
            logger.info(f"Logged update: {result.data}")
            
        except Exception as e:
            logger.error(f"Failed to log update: {str(e)}")

    async def get_career_stats(self) -> Dict[str, Any]:
        """Get statistics about career data"""
        if not self.supabase:
            return {"error": "Supabase client not initialized"}

        try:
            # Get total careers count
            careers_result = self.supabase.table('careers').select('id', count='exact').execute()
            total_careers = careers_result.count

            # Get careers by industry
            industry_result = self.supabase.table('careers').select('industry').execute()
            industry_counts = {}
            for career in industry_result.data:
                industry = career['industry']
                industry_counts[industry] = industry_counts.get(industry, 0) + 1

            # Get last update info
            last_update_result = self.supabase.table('career_update_log').select('*').order('update_timestamp', desc=True).limit(1).execute()
            last_update = last_update_result.data[0] if last_update_result.data else None

            return {
                'total_careers': total_careers,
                'industry_breakdown': industry_counts,
                'last_update': last_update
            }
            
        except Exception as e:
            logger.error(f"Failed to get career stats: {str(e)}")
            return {"error": str(e)}

    async def should_update_careers(self) -> bool:
        """Check if careers should be updated (monthly check)"""
        if not self.supabase:
            return False

        try:
            # Get the last update
            result = self.supabase.table('career_update_log').select('update_timestamp').order('update_timestamp', desc=True).limit(1).execute()
            
            if not result.data:
                logger.info("No previous updates found, should update")
                return True

            last_update = datetime.fromisoformat(result.data[0]['update_timestamp'].replace('Z', '+00:00'))
            days_since_update = (datetime.now() - last_update.replace(tzinfo=None)).days
            
            should_update = days_since_update >= 30  # 30 days = monthly
            logger.info(f"Days since last update: {days_since_update}, should update: {should_update}")
            
            return should_update
            
        except Exception as e:
            logger.error(f"Failed to check update status: {str(e)}")
            return False

# Global instance
supabase_career_service = SupabaseCareerService()
