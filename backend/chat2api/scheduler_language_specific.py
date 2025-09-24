#!/usr/bin/env python3
"""
Scheduler for Monthly Career Trend Updates - Language Specific Version
Runs the monthly trend updater on a schedule
"""

import os
import asyncio
import logging
import schedule
import time
from datetime import datetime
from monthly_trend_updater_language_specific import MonthlyTrendUpdaterLanguageSpecific

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scheduler_language_specific.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class TrendUpdateScheduler:
    def __init__(self):
        self.updater = MonthlyTrendUpdaterLanguageSpecific()
        self.is_running = False

    async def run_monthly_update(self):
        """Run the monthly trend update"""
        if self.is_running:
            logger.warning("Update already running, skipping this scheduled run")
            return
        
        self.is_running = True
        logger.info("Starting scheduled monthly trend update...")
        
        try:
            await self.updater.initialize()
            successful, failed = await self.updater.update_all_languages()
            
            logger.info(f"Scheduled update completed: {successful} successful, {failed} failed")
            
            # Log to a status file for monitoring
            status = {
                'last_run': datetime.now().isoformat(),
                'successful': successful,
                'failed': failed,
                'status': 'completed' if failed == 0 else 'completed_with_errors'
            }
            
            with open('last_update_status.json', 'w') as f:
                import json
                json.dump(status, f, indent=2)
                
        except Exception as e:
            logger.error(f"Scheduled update failed: {e}")
            
            # Log error status
            status = {
                'last_run': datetime.now().isoformat(),
                'successful': 0,
                'failed': 0,
                'status': 'failed',
                'error': str(e)
            }
            
            with open('last_update_status.json', 'w') as f:
                import json
                json.dump(status, f, indent=2)
            
            raise
        finally:
            await self.updater.close()
            self.is_running = False

    def schedule_monthly_updates(self):
        """Schedule monthly updates"""
        # Schedule for the 1st of every month at 2 AM UTC
        schedule.every().month.do(lambda: asyncio.run(self.run_monthly_update()))
        
        # Also schedule a weekly update for testing (remove in production)
        schedule.every().sunday.at("02:00").do(lambda: asyncio.run(self.run_monthly_update()))
        
        logger.info("Monthly trend updates scheduled for 1st of every month at 2 AM UTC")
        logger.info("Weekly test updates scheduled for Sundays at 2 AM UTC")

    async def run_immediate_update(self):
        """Run an immediate update (for testing)"""
        logger.info("Running immediate trend update...")
        await self.run_monthly_update()

    def start_scheduler(self):
        """Start the scheduler"""
        self.schedule_monthly_updates()
        
        logger.info("Trend update scheduler started")
        logger.info("Press Ctrl+C to stop")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            logger.info("Scheduler stopped by user")

async def main():
    """Main execution function"""
    scheduler = TrendUpdateScheduler()
    
    # Check if we should run an immediate update
    if os.getenv('RUN_IMMEDIATE_UPDATE') == 'true':
        await scheduler.run_immediate_update()
    else:
        # Start the scheduler
        scheduler.start_scheduler()

if __name__ == "__main__":
    asyncio.run(main())
