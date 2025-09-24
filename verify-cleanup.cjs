#!/usr/bin/env node

/**
 * Verify Cleanup Script
 * 
 * This script verifies that only the new language-specific tables remain
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Expected tables after cleanup
const EXPECTED_TABLES = [
  // Core tables
  'careers_core',
  'industries_core',
  
  // Language-specific tables
  'careers_en',
  'careers_ja',
  'careers_de', 
  'careers_es',
  'careers_fr',
  'industries_en',
  'industries_ja',
  'industries_de',
  'industries_es', 
  'industries_fr',
  'career_trends_en',
  'career_trends_ja',
  'career_trends_de',
  
  // Other useful tables
  'trend_update_log'
];

// Old tables that should be gone
const OLD_TABLES = [
  'careers',
  'career_paths',
  'translations',
  'career_trends',
  'career_trend_translations',
  'industries',
  'industry_translations',
  'career_content',
  'careers_new',
  'industries_new'
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

async function main() {
  console.log('🔍 Verifying Database Cleanup');
  console.log('=' * 50);
  
  // Check expected tables
  console.log('\n✅ EXPECTED TABLES (should exist):');
  console.log('-' * 40);
  let expectedFound = 0;
  let expectedMissing = 0;
  
  for (const tableName of EXPECTED_TABLES) {
    const exists = await checkTableExists(tableName);
    const rowCount = exists ? await getTableRowCount(tableName) : 0;
    
    if (exists) {
      console.log(`   ✅ ${tableName}: ${rowCount} rows`);
      expectedFound++;
    } else {
      console.log(`   ❌ ${tableName}: MISSING`);
      expectedMissing++;
    }
  }
  
  // Check old tables
  console.log('\n🗑️  OLD TABLES (should be gone):');
  console.log('-' * 40);
  let oldTablesRemaining = 0;
  let oldTablesRemoved = 0;
  
  for (const tableName of OLD_TABLES) {
    const exists = await checkTableExists(tableName);
    const rowCount = exists ? await getTableRowCount(tableName) : 0;
    
    if (exists) {
      console.log(`   ❌ ${tableName}: ${rowCount} rows (STILL EXISTS)`);
      oldTablesRemaining++;
    } else {
      console.log(`   ✅ ${tableName}: REMOVED`);
      oldTablesRemoved++;
    }
  }
  
  // Summary
  console.log('\n📊 CLEANUP VERIFICATION SUMMARY:');
  console.log('=' * 50);
  console.log(`   Expected tables found: ${expectedFound}/${EXPECTED_TABLES.length}`);
  console.log(`   Expected tables missing: ${expectedMissing}`);
  console.log(`   Old tables removed: ${oldTablesRemoved}/${OLD_TABLES.length}`);
  console.log(`   Old tables remaining: ${oldTablesRemaining}`);
  
  // Status
  if (expectedMissing === 0 && oldTablesRemaining === 0) {
    console.log('\n🎉 PERFECT! Database is clean and ready!');
    console.log('   ✅ All expected tables exist');
    console.log('   ✅ All old tables removed');
    console.log('   ✅ Ready to use language-specific tables only');
  } else if (oldTablesRemaining > 0) {
    console.log('\n⚠️  INCOMPLETE CLEANUP');
    console.log('   ❌ Some old tables still exist');
    console.log('   💡 Run the SQL cleanup commands in Supabase SQL Editor');
  } else if (expectedMissing > 0) {
    console.log('\n⚠️  MISSING NEW TABLES');
    console.log('   ❌ Some expected tables are missing');
    console.log('   💡 You may need to create the language-specific tables');
  } else {
    console.log('\n✅ CLEANUP COMPLETE');
    console.log('   ✅ All old tables removed');
    console.log('   ✅ All expected tables exist');
  }
  
  // Language coverage analysis
  if (expectedFound > 0) {
    console.log('\n🌍 LANGUAGE COVERAGE:');
    console.log('-' * 40);
    
    const languages = ['en', 'ja', 'de', 'es', 'fr'];
    for (const lang of languages) {
      const careersExists = await checkTableExists(`careers_${lang}`);
      const industriesExists = await checkTableExists(`industries_${lang}`);
      const trendsExists = await checkTableExists(`career_trends_${lang}`);
      
      const careersCount = careersExists ? await getTableRowCount(`careers_${lang}`) : 0;
      const industriesCount = industriesExists ? await getTableRowCount(`industries_${lang}`) : 0;
      const trendsCount = trendsExists ? await getTableRowCount(`career_trends_${lang}`) : 0;
      
      console.log(`   ${lang.toUpperCase()}:`);
      console.log(`     Careers: ${careersCount} rows`);
      console.log(`     Industries: ${industriesCount} rows`);
      console.log(`     Trends: ${trendsCount} rows`);
    }
  }
}

main();
