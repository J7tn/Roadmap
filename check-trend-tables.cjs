#!/usr/bin/env node

/**
 * Check Trend Tables Script
 * 
 * This script checks what data is in the trend-related tables to determine if they're needed
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const TREND_TABLES = [
  'trending_updates_log',
  'trending_skills', 
  'trending_industries',
  'trend_update_log'
];

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error || error.code !== '42P01';
  } catch (error) {
    return false;
  }
}

async function getTableRowCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    return error ? 0 : (count || 0);
  } catch (error) {
    return 0;
  }
}

async function getSampleData(tableName, limit = 3) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(limit);
    
    if (error) {
      return null;
    }
    
    return data || [];
  } catch (error) {
    return null;
  }
}

async function getTableSchema(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      return null;
    }
    
    if (data && data.length > 0) {
      return Object.keys(data[0]);
    }
    
    return [];
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('🔍 Checking Trend-Related Tables');
  console.log('=' * 50);
  
  for (const tableName of TREND_TABLES) {
    console.log(`\n📊 ${tableName.toUpperCase()}:`);
    console.log('-' * 40);
    
    const exists = await checkTableExists(tableName);
    
    if (!exists) {
      console.log(`   ❌ Table does not exist`);
      continue;
    }
    
    const rowCount = await getTableRowCount(tableName);
    const schema = await getTableSchema(tableName);
    const sampleData = await getSampleData(tableName, 2);
    
    console.log(`   ✅ Exists: ${rowCount} rows`);
    
    if (schema && schema.length > 0) {
      console.log(`   📋 Columns: ${schema.join(', ')}`);
    }
    
    if (sampleData && sampleData.length > 0) {
      console.log(`   📝 Sample data:`);
      sampleData.forEach((row, index) => {
        console.log(`      Row ${index + 1}:`, JSON.stringify(row, null, 2).substring(0, 200) + '...');
      });
    }
    
    // Analysis and recommendation
    console.log(`   💡 Analysis:`);
    
    if (rowCount === 0) {
      console.log(`      - Empty table, safe to remove`);
    } else if (tableName === 'trend_update_log') {
      console.log(`      - Logging table for monthly updates`);
      console.log(`      - May be useful for monitoring update history`);
      console.log(`      - RECOMMENDATION: Keep if you want update logs`);
    } else if (tableName.includes('trending_')) {
      console.log(`      - Contains trending data`);
      console.log(`      - May be used by the old system`);
      console.log(`      - RECOMMENDATION: Check if used by frontend`);
    } else {
      console.log(`      - Unknown purpose, check usage`);
    }
  }
  
  console.log('\n🎯 RECOMMENDATIONS:');
  console.log('=' * 50);
  console.log('Based on your new language-specific system:');
  console.log('');
  console.log('✅ KEEP:');
  console.log('   - career_trends_en, career_trends_ja, etc. (your new trend data)');
  console.log('   - trend_update_log (if you want to track update history)');
  console.log('');
  console.log('🗑️  REMOVE (if not used by frontend):');
  console.log('   - trending_skills (old system data)');
  console.log('   - trending_industries (old system data)');
  console.log('   - trending_updates_log (old system logging)');
  console.log('');
  console.log('💡 To check if tables are used by your app:');
  console.log('   1. Search your codebase for these table names');
  console.log('   2. If not found in code, they can be safely removed');
}

main();
