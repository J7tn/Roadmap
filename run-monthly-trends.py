#!/usr/bin/env python3
"""
Simple Monthly Trend Runner
Run this script monthly to update career trends
"""

import os
import sys
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to the path
sys.path.append('.')

def main():
    """Run monthly trend update"""
    print("🚀 Monthly Career Trend Update")
    print("💰 FREE trend updates - no API keys required!")
    print("📅 " + datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    print("=" * 50)
    
    try:
        # Import and run the free trend updater
        from run_trend_updater_free import FreeTrendUpdater
        
        print("🔄 Starting trend update process...")
        updater = FreeTrendUpdater()
        asyncio.run(updater.run_update())
        
        print("\n✅ Monthly trend update completed successfully!")
        print("📅 Your career database now has the latest trend data")
        print("💰 Total cost: $0.00 (completely free!)")
        print("\n🎯 Next steps:")
        print("   1. Your app will now show updated trend data")
        print("   2. Run this script again next month")
        print("   3. Consider setting up automated scheduling")
        
    except Exception as e:
        print(f"\n❌ Error during trend update: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = main()
    input("\nPress Enter to continue...")
    sys.exit(exit_code)
