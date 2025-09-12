#!/usr/bin/env python3
"""
Test database connection to Supabase
"""

import os
import asyncio
import asyncpg
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_db_connection():
    """Test connection to Supabase database"""
    print("🧪 Testing Supabase database connection...")
    
    try:
        # Get environment variables
        supabase_url = os.getenv('VITE_SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            print("❌ Missing Supabase environment variables")
            return False
        
        print(f"📋 Supabase URL: {supabase_url}")
        print(f"📋 Service Key: {supabase_key[:20]}...{supabase_key[-10:]}")
        
        # Extract host from URL
        host = supabase_url.replace('https://', '').replace('http://', '')
        print(f"📋 Host: {host}")
        
        # Test connection
        print("🔌 Attempting to connect to database...")
        
        conn = await asyncpg.connect(
            host=host,
            port=5432,
            user='postgres',
            password=supabase_key,
            database='postgres',
            ssl='require'
        )
        
        print("✅ Database connection successful!")
        
        # Test a simple query
        print("🧪 Testing database query...")
        result = await conn.fetchval("SELECT COUNT(*) FROM careers")
        print(f"✅ Found {result} careers in database")
        
        # Test trend tables
        try:
            trend_count = await conn.fetchval("SELECT COUNT(*) FROM career_trends")
            print(f"✅ Found {trend_count} trend records")
        except Exception as e:
            print(f"⚠️  Trend tables not found: {e}")
        
        await conn.close()
        print("🎉 Database test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    asyncio.run(test_db_connection())
