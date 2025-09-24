#!/usr/bin/env node

/**
 * Final Cleanup Verification
 * 
 * This script verifies that ONLY the new language-specific tables remain
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

// Tables that should exist after cleanup
const SHOULD_EXIST = [
  'careers_core',
  'industries_core',
  'careers_en', 'careers_ja', 'careers_de', 'careers_es', 'careers_fr',
  'industries_en', 'industries_ja', 'industries_de', 'industries_es', 'industries_fr',
  'career_trends_en', 'career_trends_ja', 'career_trends_de', 'career_trends_es', 'career_trends_fr',
  'trend_update_log'
];

// Tables that should NOT exist after cleanup
const SHOULD_NOT_EXIST = [
  'careers', 'career_paths', 'translations', 'career_trends', 'career_trend_translations',
  'industries', 'career_content', 'careers_new', 'industries_new', 'industry_translations',
  'career_node_translations', 'career_translations', 'skill_translations', 'node_translations', 'content_translations'
];

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    return !error || error.code !== '42P01';
  } catch (error) {
    return false;
  }
}

async function getTableRowCount(tableName) {
  try {
    const { count, error } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
    return error ? 0 : (count || 0);
  } catch (error) {
    return 0;
  }
}

async function main() {
  console.log('🎉 Final Database Cleanup Verification');
  console.log('=' * 50);
  
  // Check tables that should exist
  console.log('\n✅ TABLES THAT SHOULD EXIST:');
  console.log('-' * 40);
  let existingCount = 0;
  for (const tableName of SHOULD_EXIST) {
    const exists = await checkTableExists(tableName);
    const rowCount = exists ? await getTableRowCount(tableName) : 0;
    
    if (exists) {
      console.log(`   ✅ ${tableName}: ${rowCount} rows`);
      existingCount++;
    } else {
      console.log(`   ❌ ${tableName}: MISSING`);
    }
  }
  
  // Check tables that should NOT exist
  console.log('\n🗑️  TABLES THAT SHOULD BE GONE:');
  console.log('-' * 40);
  let removedCount = 0;
  for (const tableName of SHOULD_NOT_EXIST) {
    const exists = await checkTableExists(tableName);
    
    if (!exists) {
      console.log(`   ✅ ${tableName}: REMOVED`);
      removedCount++;
    } else {
      const rowCount = await getTableRowCount(tableName);
      console.log(`   ❌ ${tableName}: STILL EXISTS (${rowCount} rows)`);
    }
  }
  
  // Final status
  console.log('\n📊 FINAL STATUS:');
  console.log('=' * 50);
  console.log(`   Expected tables found: ${existingCount}/${SHOULD_EXIST.length}`);
  console.log(`   Old tables removed: ${removedCount}/${SHOULD_NOT_EXIST.length}`);
  
  if (existingCount === SHOULD_EXIST.length && removedCount === SHOULD_NOT_EXIST.length) {
    console.log('\n🎉 PERFECT! Database is completely clean!');
    console.log('   ✅ All new language-specific tables exist');
    console.log('   ✅ All old system tables removed');
    console.log('   ✅ Ready to use the new translation system');
    console.log('\n🚀 Your app should now work perfectly with language-specific tables only!');
  } else {
    console.log('\n⚠️  Cleanup incomplete');
    if (existingCount < SHOULD_EXIST.length) {
      console.log('   ❌ Some expected tables are missing');
    }
    if (removedCount < SHOULD_NOT_EXIST.length) {
      console.log('   ❌ Some old tables still exist');
    }
  }
}

main();
