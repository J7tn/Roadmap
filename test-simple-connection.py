#!/usr/bin/env python3
"""
Simple connection test to identify the issue
"""

import os
import asyncio
import aiohttp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_connections():
    """Test both chat2api and Supabase connections"""
    print("🧪 Testing connections...")
    
    # Test 1: Chat2API connection
    print("1. Testing Chat2API connection...")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get('http://localhost:8000/health', timeout=5) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"   ✅ Chat2API is working: {data}")
                else:
                    print(f"   ❌ Chat2API returned status: {response.status}")
    except Exception as e:
        print(f"   ❌ Chat2API connection failed: {e}")
    
    # Test 2: Supabase REST API connection
    print("2. Testing Supabase REST API connection...")
    try:
        supabase_url = os.getenv('VITE_SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            print("   ❌ Missing Supabase environment variables")
            return
        
        # Test REST API endpoint
        headers = {
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}',
            'Content-Type': 'application/json'
        }
        
        async with aiohttp.ClientSession() as session:
            # Test a simple query
            url = f"{supabase_url}/rest/v1/careers?select=count&limit=1"
            async with session.get(url, headers=headers, timeout=10) as response:
                if response.status == 200:
                    print("   ✅ Supabase REST API is working")
                else:
                    print(f"   ❌ Supabase REST API returned status: {response.status}")
                    text = await response.text()
                    print(f"   Response: {text[:200]}...")
    except Exception as e:
        print(f"   ❌ Supabase REST API connection failed: {e}")
    
    # Test 3: Check if we can reach Supabase at all
    print("3. Testing basic Supabase connectivity...")
    try:
        supabase_url = os.getenv('VITE_SUPABASE_URL')
        host = supabase_url.replace('https://', '').replace('http://', '')
        
        async with aiohttp.ClientSession() as session:
            async with session.get(f"https://{host}", timeout=10) as response:
                if response.status in [200, 404, 405]:  # Any response means we can reach it
                    print(f"   ✅ Can reach Supabase host: {host}")
                else:
                    print(f"   ⚠️  Supabase host responded with status: {response.status}")
    except Exception as e:
        print(f"   ❌ Cannot reach Supabase host: {e}")

if __name__ == "__main__":
    asyncio.run(test_connections())
