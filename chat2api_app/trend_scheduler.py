#!/usr/bin/env python3
"""
Career Trend Scheduler
Automatically runs monthly trend updates using cron-like scheduling
"""

import os
import asyncio
import logging
from datetime import datetime, timedelta
import schedule
import time
from monthly_trend_updater import MonthlyTrendUpdater

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('trend_scheduler.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class TrendScheduler:
    """Scheduler for running monthly trend updates"""
    
    def __init__(self):
        self.updater = MonthlyTrendUpdater()
        self.is_running = False
        
    async def run_scheduled_update(self):
        """Run the scheduled monthly update"""
        if self.is_running:
            logger.warning("Update already running, skipping this execution")
            return
        
        self.is_running = True
        logger.info("Starting scheduled monthly trend update")
        
        try:
            await self.updater.initialize()
            await self.updater.run_monthly_update()
        except Exception as e:
            logger.error(f"Scheduled update failed: {e}")
        finally:
            await self.updater.cleanup()
            self.is_running = False
            logger.info("Scheduled update completed")
    
    def schedule_monthly_updates(self):
        """Set up monthly scheduling"""
        # Run on the 1st of every month at 2 AM
        schedule.every().month.do(self._run_async_update)
        
        # Also run on the 15th as a backup
        schedule.every().month.do(self._run_async_update)
        
        logger.info("Scheduled monthly trend updates for 1st and 15th of each month")
    
    def _run_async_update(self):
        """Wrapper to run async update in sync context"""
        asyncio.create_task(self.run_scheduled_update())
    
    def run_scheduler(self):
        """Run the scheduler loop"""
        logger.info("Starting trend scheduler")
        
        # Set up schedules
        self.schedule_monthly_updates()
        
        # Run initial update if needed
        self._check_and_run_initial_update()
        
        # Main scheduler loop
        while True:
            try:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
            except KeyboardInterrupt:
                logger.info("Scheduler stopped by user")
                break
            except Exception as e:
                logger.error(f"Scheduler error: {e}")
                time.sleep(60)
    
    def _check_and_run_initial_update(self):
        """Check if initial update is needed"""
        try:
            # Check if we need to run an initial update
            # This could check the database for last update time
            logger.info("Checking if initial update is needed...")
            
            # For now, we'll skip the initial update check
            # In production, you might want to check the last update time
            # and run an update if it's been more than a month
            
        except Exception as e:
            logger.error(f"Failed to check initial update: {e}")

def main():
    """Main function to run the scheduler"""
    scheduler = TrendScheduler()
    
    try:
        scheduler.run_scheduler()
    except KeyboardInterrupt:
        logger.info("Scheduler stopped")
    except Exception as e:
        logger.error(f"Scheduler failed: {e}")

if __name__ == "__main__":
    main()
