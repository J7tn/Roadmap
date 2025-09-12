#!/usr/bin/env python3
"""
Monthly Trend Scheduler
Automatically runs the free trend updater once per month
"""

import os
import sys
import asyncio
import schedule
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to the path
sys.path.append('.')

class MonthlyTrendScheduler:
    """Scheduler for monthly trend updates"""
    
    def __init__(self):
        self.is_running = False
        self.last_run = None
        self.next_run = None
        
    def run_trend_update(self):
        """Run the trend update process"""
        print(f"\n🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Starting scheduled trend update...")
        
        try:
            # Import and run the free trend updater
            from run_trend_updater_free import FreeTrendUpdater
            
            # Run the update
            updater = FreeTrendUpdater()
            asyncio.run(updater.run_update())
            
            self.last_run = datetime.now()
            self.next_run = self.last_run + timedelta(days=30)
            
            print(f"✅ Trend update completed successfully at {self.last_run.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"📅 Next scheduled update: {self.next_run.strftime('%Y-%m-%d %H:%M:%S')}")
            
        except Exception as e:
            print(f"❌ Error during scheduled trend update: {e}")
            import traceback
            traceback.print_exc()
    
    def schedule_monthly_updates(self):
        """Schedule monthly trend updates"""
        print("📅 Setting up monthly trend update schedule...")
        
        # Schedule for the 1st of every month at 2:00 AM
        schedule.every().month.do(self.run_trend_update)
        
        # Also schedule for the 15th of every month as a backup
        schedule.every().month.do(self.run_trend_update)
        
        print("✅ Monthly trend updates scheduled!")
        print("📅 Updates will run on the 1st and 15th of each month at 2:00 AM")
        
        # Calculate next run time
        now = datetime.now()
        if now.day <= 1:
            self.next_run = now.replace(day=1, hour=2, minute=0, second=0, microsecond=0)
        elif now.day <= 15:
            self.next_run = now.replace(day=15, hour=2, minute=0, second=0, microsecond=0)
        else:
            # Next month's 1st
            next_month = now.replace(day=1) + timedelta(days=32)
            self.next_run = next_month.replace(day=1, hour=2, minute=0, second=0, microsecond=0)
        
        print(f"📅 Next scheduled update: {self.next_run.strftime('%Y-%m-%d %H:%M:%S')}")
    
    def run_scheduler(self):
        """Run the scheduler continuously"""
        print("🚀 Starting Monthly Trend Scheduler...")
        print("💰 FREE trend updates - no API keys required!")
        print("📅 Updates will run automatically every month")
        print("⏹️  Press Ctrl+C to stop the scheduler")
        print()
        
        self.schedule_monthly_updates()
        self.is_running = True
        
        try:
            while self.is_running:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
                
        except KeyboardInterrupt:
            print("\n⏹️  Scheduler stopped by user")
            self.is_running = False
    
    def stop_scheduler(self):
        """Stop the scheduler"""
        self.is_running = False
        print("⏹️  Scheduler stopped")

def main():
    """Main function"""
    scheduler = MonthlyTrendScheduler()
    
    print("🎯 Monthly Trend Scheduler Options:")
    print("1. Run scheduler (continuous)")
    print("2. Run trend update now (one-time)")
    print("3. Show schedule info")
    
    try:
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == "1":
            scheduler.run_scheduler()
        elif choice == "2":
            print("🔄 Running trend update now...")
            scheduler.run_trend_update()
        elif choice == "3":
            print("📅 Schedule Information:")
            print("- Updates run on the 1st and 15th of each month")
            print("- Time: 2:00 AM")
            print("- Cost: $0.00 (completely free!)")
            print("- No API keys required")
        else:
            print("❌ Invalid choice. Please run again and select 1, 2, or 3.")
    
    except KeyboardInterrupt:
        print("\n⏹️  Scheduler stopped by user")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
