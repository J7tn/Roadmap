#!/usr/bin/env python3
"""
Trend updater using Supabase REST API instead of direct PostgreSQL connection
"""

import os
import sys
import asyncio
import aiohttp
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RestTrendUpdater:
    """Trend updater using Supabase REST API"""
    
    def __init__(self):
        self.supabase_url = os.getenv('VITE_SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        self.chat2api_url = os.getenv('CHAT2API_URL', 'http://localhost:8000')
        self.chat2api_key = os.getenv('CHAT2API_API_KEY')
        
        if not all([self.supabase_url, self.supabase_key]):
            raise ValueError("Missing required Supabase environment variables")
        
        self.headers = {
            'apikey': self.supabase_key,
            'Authorization': f'Bearer {self.supabase_key}',
            'Content-Type': 'application/json'
        }
    
    async def get_careers(self):
        """Get careers from Supabase using REST API"""
        print("📊 Fetching careers from Supabase...")
        
        async with aiohttp.ClientSession() as session:
            url = f"{self.supabase_url}/rest/v1/careers?select=*&limit=10"  # Start with 10 for testing
            async with session.get(url, headers=self.headers) as response:
                if response.status == 200:
                    careers = await response.json()
                    print(f"✅ Found {len(careers)} careers")
                    return careers
                else:
                    print(f"❌ Failed to fetch careers: {response.status}")
                    text = await response.text()
                    print(f"Response: {text}")
                    return []
    
    async def analyze_career_trend(self, career):
        """Analyze career trend using chat2api"""
        print(f"🧪 Analyzing trend for: {career.get('title', 'Unknown')}")
        
        try:
            # Create prompt for trend analysis
            prompt = f"""
            Analyze the current market trend for the career: {career.get('title', 'Unknown')}
            
            Please provide a comprehensive analysis including:
            1. Trend score (0-10 scale)
            2. Trend direction (rising/stable/declining)
            3. Demand level (high/medium/low)
            4. Growth rate percentage
            5. Market insights (2-3 sentences)
            6. Key trending skills (3-5 skills)
            7. Salary trend description
            8. Job availability score (0-10)
            9. Top locations (3-5 cities)
            10. Remote work trend (0-10)
            11. Future outlook (2-3 sentences)
            
            Return the response in JSON format.
            """
            
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1000
                }
                
                url = f"{self.chat2api_url}/v1/chat/completions"
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.chat2api_key}"
                }
                
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        content = data['choices'][0]['message']['content']
                        
                        # Try to parse JSON response
                        try:
                            trend_data = json.loads(content)
                            print(f"✅ Trend analysis completed for {career.get('title')}")
                            return trend_data
                        except json.JSONDecodeError:
                            print(f"⚠️  Could not parse JSON response for {career.get('title')}")
                            return None
                    else:
                        print(f"❌ Chat2API request failed: {response.status}")
                        return None
        
        except Exception as e:
            print(f"❌ Error analyzing trend for {career.get('title')}: {e}")
            return None
    
    async def save_trend_data(self, career_id, trend_data):
        """Save trend data to Supabase using REST API"""
        print(f"💾 Saving trend data for career: {career_id}")
        
        try:
            # Prepare trend data for database
            trend_record = {
                "career_id": career_id,
                "trend_score": float(trend_data.get('trend_score', 5.0)),
                "trend_direction": trend_data.get('trend_direction', 'stable'),
                "demand_level": trend_data.get('demand_level', 'medium'),
                "growth_rate": float(trend_data.get('growth_rate', 0.0)),
                "market_insights": trend_data.get('market_insights', 'No insights available'),
                "key_skills_trending": trend_data.get('key_skills_trending', []),
                "salary_trend": trend_data.get('salary_trend', 'Stable'),
                "job_availability_score": float(trend_data.get('job_availability_score', 5.0)),
                "top_locations": trend_data.get('top_locations', []),
                "remote_work_trend": float(trend_data.get('remote_work_trend', 5.0)),
                "future_outlook": trend_data.get('future_outlook', 'Positive outlook'),
                "updated_at": datetime.now().isoformat()
            }
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.supabase_url}/rest/v1/career_trends"
                async with session.post(url, json=trend_record, headers=self.headers) as response:
                    if response.status in [200, 201]:
                        print(f"✅ Trend data saved for {career_id}")
                        return True
                    else:
                        print(f"❌ Failed to save trend data: {response.status}")
                        text = await response.text()
                        print(f"Response: {text}")
                        return False
        
        except Exception as e:
            print(f"❌ Error saving trend data: {e}")
            return False
    
    async def run_update(self):
        """Run the complete trend update process"""
        print("🚀 Starting trend update process...")
        
        try:
            # Get careers to analyze
            careers = await self.get_careers()
            if not careers:
                print("❌ No careers found to analyze")
                return
            
            print(f"📊 Analyzing trends for {len(careers)} careers...")
            
            success_count = 0
            for i, career in enumerate(careers, 1):
                print(f"\n--- Career {i}/{len(careers)} ---")
                
                # Analyze trend
                trend_data = await self.analyze_career_trend(career)
                if trend_data:
                    # Save trend data
                    success = await self.save_trend_data(career['id'], trend_data)
                    if success:
                        success_count += 1
                
                # Small delay to avoid overwhelming the APIs
                await asyncio.sleep(1)
            
            print(f"\n🎉 Trend update completed!")
            print(f"✅ Successfully analyzed {success_count}/{len(careers)} careers")
            
        except Exception as e:
            print(f"❌ Error during trend update: {e}")
            import traceback
            traceback.print_exc()

async def main():
    """Main function"""
    print("🚀 Starting Monthly Trend Updater (REST API Version)...")
    print("📊 This will analyze career trends using chat2api and update your Supabase database")
    print("⏱️  This may take a few minutes...")
    print()
    
    try:
        updater = RestTrendUpdater()
        await updater.run_update()
    except KeyboardInterrupt:
        print("\n⏹️  Trend updater stopped by user")
    except Exception as e:
        print(f"\n❌ Error running trend updater: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
