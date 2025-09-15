"""
Supabase Trending Data Service for chat2api
Handles monthly updates of trending skills, industries, and emerging roles
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

class SupabaseTrendingService:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            logger.warning("Supabase credentials not found. Trending updates will be disabled.")
            self.supabase: Optional[Client] = None
        else:
            self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
            logger.info("Supabase trending service initialized successfully")

    async def update_trending_data(self, 
                                 trending_skills: List[Dict[str, Any]], 
                                 trending_industries: List[Dict[str, Any]], 
                                 emerging_roles: List[Dict[str, Any]], 
                                 update_type: str = "monthly") -> bool:
        """
        Update trending data in Supabase database
        """
        if not self.supabase:
            logger.error("Supabase client not initialized")
            return False

        try:
            logger.info(f"Starting {update_type} trending data update")
            logger.info(f"Skills: {len(trending_skills)}, Industries: {len(trending_industries)}, Roles: {len(emerging_roles)}")
            
            # Clear existing data
            await self._clear_existing_trending_data()
            
            # Insert new trending data
            skills_inserted = await self._insert_trending_skills(trending_skills)
            industries_inserted = await self._insert_trending_industries(trending_industries)
            roles_inserted = await self._insert_emerging_roles(emerging_roles)
            
            # Log the update
            await self._log_trending_update(update_type, skills_inserted, industries_inserted, roles_inserted)
            
            logger.info(f"Successfully updated trending data: {skills_inserted} skills, {industries_inserted} industries, {roles_inserted} roles")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update trending data: {str(e)}")
            return False

    async def _clear_existing_trending_data(self):
        """Clear existing trending data"""
        try:
            # Clear trending skills
            skills_result = self.supabase.table('trending_skills').delete().neq('id', 0).execute()
            logger.info(f"Cleared {len(skills_result.data)} existing trending skills")
            
            # Clear trending industries
            industries_result = self.supabase.table('trending_industries').delete().neq('id', 0).execute()
            logger.info(f"Cleared {len(industries_result.data)} existing trending industries")
            
            # Clear emerging roles
            roles_result = self.supabase.table('emerging_roles').delete().neq('id', 0).execute()
            logger.info(f"Cleared {len(roles_result.data)} existing emerging roles")
            
        except Exception as e:
            logger.error(f"Failed to clear existing trending data: {str(e)}")
            raise

    async def _insert_trending_skills(self, skills_data: List[Dict[str, Any]]) -> int:
        """Insert new trending skills data"""
        try:
            transformed_skills = []
            for skill in skills_data:
                transformed_skill = {
                    'skill': skill['skill'],
                    'demand': skill['demand'],
                    'growth': skill['growth'],
                    'salary': skill.get('salary'),
                    'category': skill.get('category', 'tech'),
                    'is_trending': skill.get('is_trending', True),
                    'is_declining': skill.get('is_declining', False)
                }
                transformed_skills.append(transformed_skill)

            # Insert in batches
            batch_size = 50
            total_inserted = 0
            
            for i in range(0, len(transformed_skills), batch_size):
                batch = transformed_skills[i:i + batch_size]
                result = self.supabase.table('trending_skills').insert(batch).execute()
                total_inserted += len(result.data)
                logger.info(f"Inserted trending skills batch {i//batch_size + 1}: {len(result.data)} skills")
            
            return total_inserted
            
        except Exception as e:
            logger.error(f"Failed to insert trending skills: {str(e)}")
            raise

    async def _insert_trending_industries(self, industries_data: List[Dict[str, Any]]) -> int:
        """Insert new trending industries data"""
        try:
            transformed_industries = []
            for industry in industries_data:
                transformed_industry = {
                    'industry': industry['industry'],
                    'growth': industry['growth'],
                    'job_count': industry['jobCount'],
                    'avg_salary': industry.get('avgSalary'),
                    'category': industry.get('category', 'business'),
                    'is_trending': industry.get('is_trending', True),
                    'is_declining': industry.get('is_declining', False)
                }
                transformed_industries.append(transformed_industry)

            # Insert in batches
            batch_size = 50
            total_inserted = 0
            
            for i in range(0, len(transformed_industries), batch_size):
                batch = transformed_industries[i:i + batch_size]
                result = self.supabase.table('trending_industries').insert(batch).execute()
                total_inserted += len(result.data)
                logger.info(f"Inserted trending industries batch {i//batch_size + 1}: {len(result.data)} industries")
            
            return total_inserted
            
        except Exception as e:
            logger.error(f"Failed to insert trending industries: {str(e)}")
            raise

    async def _insert_emerging_roles(self, roles_data: List[Dict[str, Any]]) -> int:
        """Insert new emerging roles data"""
        try:
            transformed_roles = []
            for role in roles_data:
                transformed_role = {
                    'title': role['title'],
                    'description': role['description'],
                    'growth': role['growth'],
                    'skills': role['skills'],
                    'industry': role.get('industry', 'tech'),
                    'salary_range': role.get('salary_range'),
                    'experience_level': role.get('experience_level')
                }
                transformed_roles.append(transformed_role)

            # Insert in batches
            batch_size = 50
            total_inserted = 0
            
            for i in range(0, len(transformed_roles), batch_size):
                batch = transformed_roles[i:i + batch_size]
                result = self.supabase.table('emerging_roles').insert(batch).execute()
                total_inserted += len(result.data)
                logger.info(f"Inserted emerging roles batch {i//batch_size + 1}: {len(result.data)} roles")
            
            return total_inserted
            
        except Exception as e:
            logger.error(f"Failed to insert emerging roles: {str(e)}")
            raise

    async def _log_trending_update(self, update_type: str, skills_updated: int, industries_updated: int, roles_updated: int):
        """Log the trending update in the trending_update_log table"""
        try:
            log_entry = {
                'update_type': update_type,
                'skills_updated': skills_updated,
                'industries_updated': industries_updated,
                'roles_updated': roles_updated,
                'chat2api_version': '1.0.0',
                'notes': f'Automated {update_type} trending data update via chat2api'
            }
            
            result = self.supabase.table('trending_update_log').insert(log_entry).execute()
            logger.info(f"Logged trending update: {result.data}")
            
        except Exception as e:
            logger.error(f"Failed to log trending update: {str(e)}")

    async def get_trending_stats(self) -> Dict[str, Any]:
        """Get statistics about trending data"""
        if not self.supabase:
            return {"error": "Supabase client not initialized"}

        try:
            # Get trending skills count
            skills_result = self.supabase.table('trending_skills').select('id', count='exact').execute()
            total_skills = skills_result.count

            # Get trending industries count
            industries_result = self.supabase.table('trending_industries').select('id', count='exact').execute()
            total_industries = industries_result.count

            # Get emerging roles count
            roles_result = self.supabase.table('emerging_roles').select('id', count='exact').execute()
            total_roles = roles_result.count

            # Get last update info
            last_update_result = self.supabase.table('trending_update_log').select('*').order('update_timestamp', desc=True).limit(1).execute()
            last_update = last_update_result.data[0] if last_update_result.data else None

            return {
                'total_trending_skills': total_skills,
                'total_trending_industries': total_industries,
                'total_emerging_roles': total_roles,
                'last_update': last_update
            }
            
        except Exception as e:
            logger.error(f"Failed to get trending stats: {str(e)}")
            return {"error": str(e)}

    async def should_update_trending_data(self) -> bool:
        """Check if trending data should be updated (monthly check)"""
        if not self.supabase:
            return False

        try:
            # Get the last update
            result = self.supabase.table('trending_update_log').select('update_timestamp').order('update_timestamp', desc=True).limit(1).execute()
            
            if not result.data:
                logger.info("No previous trending updates found, should update")
                return True

            last_update = datetime.fromisoformat(result.data[0]['update_timestamp'].replace('Z', '+00:00'))
            days_since_update = (datetime.now() - last_update.replace(tzinfo=None)).days
            
            should_update = days_since_update >= 30  # 30 days = monthly
            logger.info(f"Days since last trending update: {days_since_update}, should update: {should_update}")
            
            return should_update
            
        except Exception as e:
            logger.error(f"Failed to check trending update status: {str(e)}")
            return False

# Global instance
supabase_trending_service = SupabaseTrendingService()
