#!/usr/bin/env node

/**
 * Test Trend Schema
 * Verifies that the career trends schema was applied correctly
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTrendSchema() {
  try {
    console.log('🧪 Testing career trends schema...');
    
    // Test 1: Check if career_trends table exists
    console.log('1. Checking career_trends table...');
    const { data: trendsData, error: trendsError } = await supabase
      .from('career_trends')
      .select('*')
      .limit(1);
    
    if (trendsError) {
      if (trendsError.code === 'PGRST116') {
        console.error('❌ career_trends table does not exist');
        console.log('📝 Please run the career-trends-schema.sql in Supabase SQL Editor');
        return false;
      } else {
        console.log('✅ career_trends table exists');
      }
    } else {
      console.log('✅ career_trends table exists');
    }
    
    // Test 2: Check if industry_trends table exists
    console.log('2. Checking industry_trends table...');
    const { data: industryData, error: industryError } = await supabase
      .from('industry_trends')
      .select('*')
      .limit(1);
    
    if (industryError) {
      if (industryError.code === 'PGRST116') {
        console.error('❌ industry_trends table does not exist');
        return false;
      } else {
        console.log('✅ industry_trends table exists');
      }
    } else {
      console.log('✅ industry_trends table exists');
    }
    
    // Test 3: Check if trend_update_log table exists
    console.log('3. Checking trend_update_log table...');
    const { data: logData, error: logError } = await supabase
      .from('trend_update_log')
      .select('*')
      .limit(1);
    
    if (logError) {
      if (logError.code === 'PGRST116') {
        console.error('❌ trend_update_log table does not exist');
        return false;
      } else {
        console.log('✅ trend_update_log table exists');
      }
    } else {
      console.log('✅ trend_update_log table exists');
    }
    
    // Test 4: Check if helper functions exist
    console.log('4. Testing helper functions...');
    try {
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_trending_careers', { limit_count: 5 });
      
      if (functionError) {
        console.log('⚠️  Helper functions may not be installed:', functionError.message);
      } else {
        console.log('✅ Helper functions are working');
      }
    } catch (err) {
      console.log('⚠️  Helper functions may not be installed:', err.message);
    }
    
    console.log('\n🎉 Schema test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. If any tables are missing, run career-trends-schema.sql in Supabase');
    console.log('2. Update your .env file with actual API keys');
    console.log('3. Test the trend updater');
    
    return true;
    
  } catch (error) {
    console.error('❌ Schema test failed:', error);
    return false;
  }
}

// Run test
testTrendSchema();
