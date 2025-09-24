#!/usr/bin/env python3
"""
Test script for the language-specific monthly trend updater
"""

import asyncio
import os
import sys
from monthly_trend_updater_language_specific import MonthlyTrendUpdaterLanguageSpecific

async def test_updater():
    """Test the language-specific trend updater"""
    print("🧪 Testing Language-Specific Trend Updater...")
    
    # Check environment variables
    required_vars = ['CHAT2API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these variables before running the test")
        return False
    
    print("✅ All required environment variables are set")
    
    # Initialize updater
    updater = MonthlyTrendUpdaterLanguageSpecific()
    
    try:
        print("\n🔌 Initializing database connection...")
        await updater.initialize()
        print("✅ Database connection established")
        
        print("\n📊 Testing career data retrieval...")
        careers = await updater.get_careers_from_core_table()
        print(f"✅ Found {len(careers)} careers in core table")
        
        if len(careers) == 0:
            print("⚠️  No careers found in core table. Please ensure data is migrated.")
            return False
        
        # Test getting career content for a specific language
        test_career = careers[0]
        print(f"\n🌍 Testing career content retrieval for: {test_career['id']}")
        
        for language in ['en', 'ja', 'de']:
            content = await updater.get_career_content_for_language(test_career['id'], language)
            if content:
                print(f"✅ Found {language} content for {test_career['id']}")
            else:
                print(f"⚠️  No {language} content found for {test_career['id']}")
        
        # Test trend analysis (only for English to avoid API costs)
        print(f"\n🤖 Testing trend analysis for: {test_career['id']}")
        english_content = await updater.get_career_content_for_language(test_career['id'], 'en')
        
        if english_content:
            print("🔄 Analyzing trend with chat2api...")
            trend_data = await updater.analyze_career_trend(test_career['id'], english_content, 'en')
            
            if trend_data:
                print("✅ Trend analysis successful!")
                print(f"   Trend Score: {trend_data.trend_score}")
                print(f"   Direction: {trend_data.trend_direction}")
                print(f"   Demand Level: {trend_data.demand_level}")
                print(f"   Currency: {trend_data.currency_code}")
                
                # Test saving trend data
                print("\n💾 Testing trend data save...")
                if await updater.save_trend_data(trend_data, 'en'):
                    print("✅ Trend data saved successfully!")
                else:
                    print("❌ Failed to save trend data")
            else:
                print("❌ Trend analysis failed")
        else:
            print("⚠️  No English content found, skipping trend analysis")
        
        print("\n🎉 Test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        await updater.close()
        print("🔌 Database connection closed")

async def test_small_update():
    """Test updating trends for a small subset of careers"""
    print("\n🚀 Testing small trend update...")
    
    updater = MonthlyTrendUpdaterLanguageSpecific()
    
    try:
        await updater.initialize()
        
        # Get first 3 careers for testing
        careers = await updater.get_careers_from_core_table()[:3]
        print(f"📊 Testing with {len(careers)} careers")
        
        successful = 0
        failed = 0
        
        for career in careers:
            career_id = career['id']
            print(f"🔄 Processing: {career_id}")
            
            # Get English content
            content = await updater.get_career_content_for_language(career_id, 'en')
            
            if content:
                # Analyze trend
                trend_data = await updater.analyze_career_trend(career_id, content, 'en')
                
                if trend_data:
                    # Save trend data
                    if await updater.save_trend_data(trend_data, 'en'):
                        successful += 1
                        print(f"✅ {career_id}: Success")
                    else:
                        failed += 1
                        print(f"❌ {career_id}: Save failed")
                else:
                    failed += 1
                    print(f"❌ {career_id}: Analysis failed")
            else:
                failed += 1
                print(f"❌ {career_id}: No content found")
            
            # Rate limiting
            await asyncio.sleep(2)
        
        print(f"\n📊 Small update results:")
        print(f"   Successful: {successful}")
        print(f"   Failed: {failed}")
        
        return successful > 0
        
    except Exception as e:
        print(f"❌ Small update test failed: {e}")
        return False
    finally:
        await updater.close()

async def main():
    """Main test function"""
    print("🧪 Language-Specific Trend Updater Test Suite")
    print("=" * 50)
    
    # Basic functionality test
    basic_test_passed = await test_updater()
    
    if basic_test_passed:
        print("\n" + "=" * 50)
        print("🎯 Basic tests passed! Running small update test...")
        
        # Small update test
        update_test_passed = await test_small_update()
        
        if update_test_passed:
            print("\n🎉 All tests passed! The updater is ready for production.")
        else:
            print("\n⚠️  Update test failed. Check configuration and try again.")
    else:
        print("\n❌ Basic tests failed. Please check configuration and database setup.")
    
    print("\n" + "=" * 50)
    print("Test completed.")

if __name__ == "__main__":
    asyncio.run(main())
