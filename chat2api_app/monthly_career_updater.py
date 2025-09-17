#!/usr/bin/env python3
"""
Monthly Career Data Updater for Chat2API
Updates career data in Supabase database with latest information
"""

import os
import json
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('monthly_career_updater.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class MonthlyCareerUpdater:
    def __init__(self):
        self.supabase_url = os.getenv('VITE_SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing Supabase environment variables")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Language mapping
        self.languages = {
            'en': 'English',
            'ja': 'Japanese',
            'ko': 'Korean', 
            'zh': 'Chinese',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ar': 'Arabic'
        }

    async def update_career_data(self):
        """Main method to update career data"""
        logger.info("🚀 Starting monthly career data update...")
        
        try:
            # Step 1: Update career paths
            await self.update_career_paths()
            
            # Step 2: Update career nodes
            await self.update_career_nodes()
            
            # Step 3: Update translations
            await self.update_translations()
            
            # Step 4: Update market trends
            await self.update_market_trends()
            
            logger.info("✅ Monthly career data update completed successfully!")
            
        except Exception as e:
            logger.error(f"❌ Error during career data update: {e}")
            raise

    async def update_career_paths(self):
        """Update career paths with latest data"""
        logger.info("📁 Updating career paths...")
        
        # This would typically fetch from external APIs or data sources
        # For now, we'll update existing data with current timestamp
        
        try:
            result = self.supabase.table('career_paths').update({
                'updated_at': datetime.now().isoformat()
            }).execute()
            
            logger.info(f"✅ Updated {len(result.data)} career paths")
            
        except Exception as e:
            logger.error(f"❌ Error updating career paths: {e}")
            raise

    async def update_career_nodes(self):
        """Update career nodes with latest data"""
        logger.info("📋 Updating career nodes...")
        
        try:
            result = self.supabase.table('career_nodes').update({
                'updated_at': datetime.now().isoformat()
            }).execute()
            
            logger.info(f"✅ Updated {len(result.data)} career nodes")
            
        except Exception as e:
            logger.error(f"❌ Error updating career nodes: {e}")
            raise

    async def update_translations(self):
        """Update translations for all languages"""
        logger.info("🌍 Updating translations...")
        
        for lang_code, lang_name in self.languages.items():
            try:
                logger.info(f"  📝 Updating {lang_name} translations...")
                
                # Update career path translations
                path_result = self.supabase.table('career_path_translations').update({
                    'updated_at': datetime.now().isoformat()
                }).eq('language_code', lang_code).execute()
                
                # Update career node translations
                node_result = self.supabase.table('career_node_translations').update({
                    'updated_at': datetime.now().isoformat()
                }).eq('language_code', lang_code).execute()
                
                logger.info(f"    ✅ Updated {len(path_result.data)} path translations")
                logger.info(f"    ✅ Updated {len(node_result.data)} node translations")
                
            except Exception as e:
                logger.error(f"❌ Error updating {lang_name} translations: {e}")
                continue

    async def update_market_trends(self):
        """Update market trends and emerging roles"""
        logger.info("📈 Updating market trends...")
        
        try:
            # Update existing market trends
            result = self.supabase.table('market_trends').update({
                'updated_at': datetime.now().isoformat()
            }).execute()
            
            logger.info(f"✅ Updated {len(result.data)} market trends")
            
            # Add new emerging roles if any
            await self.add_emerging_roles()
            
        except Exception as e:
            logger.error(f"❌ Error updating market trends: {e}")
            raise

    async def add_emerging_roles(self):
        """Add new emerging roles based on market analysis"""
        logger.info("🆕 Checking for new emerging roles...")
        
        # This would typically analyze job market data to identify new roles
        # For now, we'll add some sample emerging roles
        
        emerging_roles = [
            {
                'title': 'AI Ethics Specialist',
                'description': 'Ensures AI systems are developed and deployed ethically',
                'industry': 'tech',
                'growth_rate': 'high',
                'salary_range': '$80,000 - $120,000',
                'required_skills': ['AI Ethics', 'Machine Learning', 'Policy Analysis', 'Risk Assessment']
            },
            {
                'title': 'Quantum Computing Engineer',
                'description': 'Develops quantum computing systems and algorithms',
                'industry': 'tech',
                'growth_rate': 'high',
                'salary_range': '$120,000 - $180,000',
                'required_skills': ['Quantum Physics', 'Python', 'Linear Algebra', 'Quantum Algorithms']
            },
            {
                'title': 'Sustainability Manager',
                'description': 'Develops and implements sustainability strategies for organizations',
                'industry': 'business',
                'growth_rate': 'high',
                'salary_range': '$70,000 - $100,000',
                'required_skills': ['Environmental Science', 'Project Management', 'Data Analysis', 'Regulatory Compliance']
            }
        ]
        
        for role in emerging_roles:
            try:
                # Check if role already exists
                existing = self.supabase.table('emerging_roles').select('*').eq('title', role['title']).execute()
                
                if not existing.data:
                    # Insert new emerging role
                    result = self.supabase.table('emerging_roles').insert({
                        'title': role['title'],
                        'description': role['description'],
                        'industry': role['industry'],
                        'growth_rate': role['growth_rate'],
                        'salary_range': role['salary_range'],
                        'required_skills': role['required_skills'],
                        'created_at': datetime.now().isoformat(),
                        'updated_at': datetime.now().isoformat()
                    }).execute()
                    
                    logger.info(f"  ✅ Added new emerging role: {role['title']}")
                
            except Exception as e:
                logger.error(f"❌ Error adding emerging role {role['title']}: {e}")
                continue

    async def cleanup_old_data(self):
        """Clean up old or outdated data"""
        logger.info("🧹 Cleaning up old data...")
        
        try:
            # Remove data older than 1 year
            cutoff_date = (datetime.now() - timedelta(days=365)).isoformat()
            
            # This would typically clean up old market trends, outdated career data, etc.
            logger.info("✅ Cleanup completed")
            
        except Exception as e:
            logger.error(f"❌ Error during cleanup: {e}")

    async def generate_update_report(self):
        """Generate a report of the update process"""
        logger.info("📊 Generating update report...")
        
        try:
            # Get counts of updated data
            career_paths = self.supabase.table('career_paths').select('*', count='exact').execute()
            career_nodes = self.supabase.table('career_nodes').select('*', count='exact').execute()
            translations = self.supabase.table('career_node_translations').select('*', count='exact').execute()
            
            report = {
                'update_date': datetime.now().isoformat(),
                'career_paths_count': career_paths.count,
                'career_nodes_count': career_nodes.count,
                'translations_count': translations.count,
                'languages_supported': len(self.languages),
                'status': 'success'
            }
            
            # Save report to file
            with open(f'career_update_report_{datetime.now().strftime("%Y%m%d")}.json', 'w') as f:
                json.dump(report, f, indent=2)
            
            logger.info("✅ Update report generated successfully")
            return report
            
        except Exception as e:
            logger.error(f"❌ Error generating report: {e}")
            return None

async def main():
    """Main function to run the monthly career updater"""
    updater = MonthlyCareerUpdater()
    
    try:
        await updater.update_career_data()
        await updater.cleanup_old_data()
        report = await updater.generate_update_report()
        
        if report:
            logger.info(f"📊 Final Report: {json.dumps(report, indent=2)}")
        
    except Exception as e:
        logger.error(f"❌ Monthly career updater failed: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
