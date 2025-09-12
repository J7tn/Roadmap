#!/usr/bin/env python3
"""
Free Trend Updater - No API Keys Required!
Uses intelligent trend generation based on industry knowledge
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

# Add the chat2api_app directory to the path
sys.path.append('chat2api_app')
from free_trend_generator import free_trend_generator

class FreeTrendUpdater:
    """Free trend updater using intelligent trend generation"""
    
    def __init__(self):
        self.supabase_url = os.getenv('VITE_SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
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
            url = f"{self.supabase_url}/rest/v1/careers?select=*&limit=20"  # Start with 20 for testing
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
    
    def generate_trend_data(self, career):
        """Generate trend data using the free trend generator"""
        print(f"🧪 Generating trend data for: {career.get('title', 'Unknown')}")
        
        try:
            # Use the free trend generator
            trend_data = free_trend_generator.generate_trend_data(career)
            
            print(f"✅ Trend data generated for {career.get('title')}")
            print(f"   Trend Score: {trend_data['trend_score']}/10")
            print(f"   Direction: {trend_data['trend_direction']}")
            print(f"   Demand: {trend_data['demand_level']}")
            print(f"   Growth: {trend_data['growth_rate']}%")
            
            return trend_data
        
        except Exception as e:
            print(f"❌ Error generating trend data for {career.get('title')}: {e}")
            return None
    
    async def save_trend_data(self, career_id, trend_data):
        """Save trend data to Supabase using REST API"""
        print(f"💾 Saving trend data for career: {career_id}")
        
        try:
            # Prepare trend data for database
            trend_record = {
                "career_id": career_id,
                "trend_score": min(9.99, float(trend_data.get('trend_score', 5.0))),
                "trend_direction": trend_data.get('trend_direction', 'stable'),
                "demand_level": trend_data.get('demand_level', 'medium'),
                "growth_rate": float(trend_data.get('growth_rate', 0.0)),
                "market_insights": trend_data.get('market_insights', 'No insights available'),
                "key_skills_trending": trend_data.get('key_skills_trending', []),
                "salary_trend": trend_data.get('salary_trend', 'Stable'),
                "job_availability_score": min(9.99, float(trend_data.get('job_availability_score', 5.0))),
                "top_locations": trend_data.get('top_locations', []),
                "remote_work_trend": min(9.99, float(trend_data.get('remote_work_trend', 5.0))),
                "automation_risk": min(9.99, float(trend_data.get('automation_risk_score', 5.0))),
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
        print("🚀 Starting FREE trend update process...")
        print("💰 No API keys required - using intelligent trend generation!")
        print()
        
        try:
            # Get careers to analyze
            careers = await self.get_careers()
            if not careers:
                print("❌ No careers found to analyze")
                return
            
            print(f"📊 Generating trends for {len(careers)} careers...")
            
            success_count = 0
            for i, career in enumerate(careers, 1):
                print(f"\n--- Career {i}/{len(careers)} ---")
                
                # Generate trend data
                trend_data = self.generate_trend_data(career)
                if trend_data:
                    # Save trend data
                    success = await self.save_trend_data(career['id'], trend_data)
                    if success:
                        success_count += 1
                
                # Small delay to avoid overwhelming the database
                await asyncio.sleep(0.5)
            
            print(f"\n🎉 FREE trend update completed!")
            print(f"✅ Successfully generated trends for {success_count}/{len(careers)} careers")
            print(f"💰 Total cost: $0.00 (completely free!)")
            
        except Exception as e:
            print(f"❌ Error during trend update: {e}")
            import traceback
            traceback.print_exc()

async def main():
    """Main function"""
    print("🚀 Starting FREE Monthly Trend Updater...")
    print("💰 No API keys required - completely free!")
    print("🧠 Using intelligent trend generation based on industry knowledge")
    print("⏱️  This will take a few minutes...")
    print()
    
    try:
        updater = FreeTrendUpdater()
        await updater.run_update()
    except KeyboardInterrupt:
        print("\n⏹️  Trend updater stopped by user")
    except Exception as e:
        print(f"\n❌ Error running trend updater: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
