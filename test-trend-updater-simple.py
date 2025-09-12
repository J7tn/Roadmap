#!/usr/bin/env python3
"""
Simple Trend Updater Test
Tests the trend updater with the working chat2api
"""

import os
import asyncio
import sys
from datetime import datetime

# Add the chat2api_app directory to the path
sys.path.append('chat2api_app')

from monthly_trend_updater import MonthlyTrendUpdater, CareerTrendData

async def test_trend_updater():
    """Test the trend updater with a small sample"""
    print("🧪 Testing Monthly Trend Updater with working chat2api...")
    
    try:
        # Initialize updater
        updater = MonthlyTrendUpdater()
        await updater.initialize()
        
        print("✅ Updater initialized successfully")
        
        # Test getting careers to update (limit to 3 for testing)
        careers = await updater.get_careers_to_update()
        print(f"📊 Found {len(careers)} careers to update")
        
        if len(careers) > 0:
            # Test with just the first career
            test_career = careers[0]
            print(f"🧪 Testing with career: {test_career['title']}")
            
            # Test trend analysis with real chat2api
            try:
                trend_data = await updater.analyze_career_trend(test_career)
                if trend_data:
                    print("✅ Trend analysis successful!")
                    print(f"   Trend Score: {trend_data.trend_score}")
                    print(f"   Direction: {trend_data.trend_direction}")
                    print(f"   Demand: {trend_data.demand_level}")
                    print(f"   Growth Rate: {trend_data.growth_rate}%")
                    print(f"   Market Insights: {trend_data.market_insights[:100]}...")
                    
                    # Test saving trend data
                    print("🧪 Testing trend data saving...")
                    success = await updater.save_trend_data(trend_data)
                    if success:
                        print("✅ Trend data saving successful!")
                        print("🎉 Full trend updater is working!")
                    else:
                        print("❌ Trend data saving failed")
                else:
                    print("❌ Trend analysis returned no data")
            except Exception as e:
                print(f"❌ Trend analysis failed: {e}")
                import traceback
                traceback.print_exc()
        
        await updater.cleanup()
        print("🎉 Test completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_trend_updater())
