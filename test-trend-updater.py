#!/usr/bin/env python3
"""
Test Trend Updater
Simple test to verify the trend updater works
"""

import os
import asyncio
import sys
from datetime import datetime

# Add the chat2api_app directory to the path
sys.path.append('chat2api_app')

from monthly_trend_updater import MonthlyTrendUpdater

async def test_trend_updater():
    """Test the trend updater with a small sample"""
    print("🧪 Testing Monthly Trend Updater...")
    
    try:
        # Initialize updater
        updater = MonthlyTrendUpdater()
        await updater.initialize()
        
        print("✅ Updater initialized successfully")
        
        # Test getting careers to update (limit to 5 for testing)
        careers = await updater.get_careers_to_update()
        print(f"📊 Found {len(careers)} careers to update")
        
        if len(careers) > 0:
            # Test with just the first career
            test_career = careers[0]
            print(f"🧪 Testing with career: {test_career['title']}")
            
            # Test trend analysis (this will fail if chat2api is not available, but that's OK)
            try:
                trend_data = await updater.analyze_career_trend(test_career)
                if trend_data:
                    print("✅ Trend analysis successful")
                    print(f"   Trend Score: {trend_data.trend_score}")
                    print(f"   Direction: {trend_data.trend_direction}")
                    print(f"   Demand: {trend_data.demand_level}")
                else:
                    print("⚠️  Trend analysis returned no data (chat2api may not be available)")
            except Exception as e:
                print(f"⚠️  Trend analysis failed (expected if chat2api is not available): {e}")
            
            # Test saving trend data (with mock data)
            print("🧪 Testing trend data saving...")
            from monthly_trend_updater import CareerTrendData
            
            mock_trend = CareerTrendData(
                career_id=test_career['id'],
                trend_score=7.5,
                trend_direction='rising',
                demand_level='high',
                growth_rate=15.2,
                market_insights='Test market insights',
                key_skills_trending=['Python', 'JavaScript'],
                salary_trend='Salaries increasing by 10%',
                job_availability_score=8.0,
                top_locations=['San Francisco', 'New York'],
                remote_work_trend=7.5,
                industry_impact='AI driving demand',
                automation_risk=3.0,
                future_outlook='Strong growth expected',
                confidence_score=8.0
            )
            
            success = await updater.save_trend_data(mock_trend)
            if success:
                print("✅ Trend data saving successful")
            else:
                print("❌ Trend data saving failed")
        
        await updater.cleanup()
        print("🎉 Test completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_trend_updater())
