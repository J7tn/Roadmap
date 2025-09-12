#!/usr/bin/env python3
"""
Wrapper script to run the monthly trend updater with proper environment setup
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set environment variables for the trend updater
os.environ['SUPABASE_URL'] = os.getenv('VITE_SUPABASE_URL')
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
os.environ['CHAT2API_URL'] = os.getenv('CHAT2API_URL')
os.environ['CHAT2API_API_KEY'] = os.getenv('CHAT2API_API_KEY')

# Add the chat2api_app directory to the path
sys.path.append('chat2api_app')

# Import and run the trend updater
import asyncio
from monthly_trend_updater import main

if __name__ == "__main__":
    print("🚀 Starting Monthly Trend Updater...")
    print("📊 This will analyze career trends using chat2api and update your Supabase database")
    print("⏱️  This may take a few minutes...")
    print()
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n⏹️  Trend updater stopped by user")
    except Exception as e:
        print(f"\n❌ Error running trend updater: {e}")
        import traceback
        traceback.print_exc()
