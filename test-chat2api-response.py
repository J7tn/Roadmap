#!/usr/bin/env python3
"""
Test chat2api response format
"""

import os
import asyncio
import aiohttp
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_chat2api_response():
    """Test what chat2api actually returns"""
    print("🧪 Testing chat2api response format...")
    
    chat2api_url = os.getenv('CHAT2API_URL', 'http://localhost:8000')
    chat2api_key = os.getenv('CHAT2API_API_KEY', 'test_key')
    
    try:
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": "Analyze the market trend for Software Engineer. Return only a JSON object with: trend_score (0-10), trend_direction (rising/stable/declining), demand_level (high/medium/low), growth_rate (percentage), market_insights (short description)."
                }
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        async with aiohttp.ClientSession() as session:
            url = f"{chat2api_url}/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {chat2api_key}"
            }
            
            async with session.post(url, json=payload, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    content = data['choices'][0]['message']['content']
                    
                    print("✅ Chat2API Response:")
                    print("=" * 50)
                    print(content)
                    print("=" * 50)
                    
                    # Try to parse as JSON
                    try:
                        trend_data = json.loads(content)
                        print("✅ Successfully parsed as JSON!")
                        print(f"Trend Score: {trend_data.get('trend_score')}")
                        print(f"Direction: {trend_data.get('trend_direction')}")
                        print(f"Demand: {trend_data.get('demand_level')}")
                    except json.JSONDecodeError as e:
                        print(f"❌ Could not parse as JSON: {e}")
                        print("📝 Response is not in JSON format")
                        
                        # Try to extract JSON from the response
                        import re
                        json_match = re.search(r'\{.*\}', content, re.DOTALL)
                        if json_match:
                            try:
                                extracted_json = json.loads(json_match.group())
                                print("✅ Found and parsed JSON within response!")
                                print(f"Trend Score: {extracted_json.get('trend_score')}")
                            except:
                                print("❌ Could not parse extracted JSON")
                
                else:
                    print(f"❌ Chat2API request failed: {response.status}")
                    text = await response.text()
                    print(f"Response: {text}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_chat2api_response())
