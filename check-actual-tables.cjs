#!/usr/bin/env node

/**
 * Check Actual Tables in Supabase
 * 
 * This script directly checks which tables actually exist by trying to query them
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

// List of all possible tables to check
const TABLES_TO_CHECK = [
  // Old system tables
  'careers',
  'career_paths', 
  'translations',
  'career_trends',
  'career_trend_translations',
  'industries',
  'industry_translations',
  'career_content',
  'careers_new',
  'industries_new',
  
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
  
  // Other possible tables
  'bookmarks',
  'user_progress',
  'trend_update_log'
];

async function checkTableExists(tableName) {
  try {
    // Try to query the table with a limit of 1
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      // If error code is 42P01, table doesn't exist
      if (error.code === '42P01') {
        return { exists: false, error: null };
      }
      // Other errors might mean table exists but has issues
      return { exists: true, error: error.message, rowCount: 0 };
    }
    
    return { exists: true, error: null, rowCount: data ? data.length : 0 };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

async function getTableRowCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    return 0;
  }
}

async function main() {
  console.log('🔍 Checking Actual Tables in Supabase');
  console.log('=' * 50);
  
  const results = {
    oldSystem: [],
    core: [],
    languageSpecific: [],
    other: [],
    notFound: []
  };
  
  console.log('\n📊 Checking tables...\n');
  
  for (const tableName of TABLES_TO_CHECK) {
    const result = await checkTableExists(tableName);
    
    if (!result.exists) {
      results.notFound.push(tableName);
      continue;
    }
    
    const rowCount = result.exists ? await getTableRowCount(tableName) : 0;
    
    // Categorize the table
    if (['careers', 'career_paths', 'translations', 'career_trends', 'career_trend_translations', 'industries', 'industry_translations', 'career_content', 'careers_new', 'industries_new'].includes(tableName)) {
      results.oldSystem.push({ name: tableName, rows: rowCount, error: result.error });
    } else if (tableName.endsWith('_core')) {
      results.core.push({ name: tableName, rows: rowCount, error: result.error });
    } else if (tableName.match(/^(careers_|industries_|career_trends_)[a-z]{2}$/)) {
      results.languageSpecific.push({ name: tableName, rows: rowCount, error: result.error });
    } else {
      results.other.push({ name: tableName, rows: rowCount, error: result.error });
    }
  }
  
  // Display results
  console.log('🗑️  OLD SYSTEM TABLES (Should be removed):');
  console.log('-' * 40);
  if (results.oldSystem.length === 0) {
    console.log('   ✅ No old system tables found');
  } else {
    results.oldSystem.forEach(table => {
      const status = table.error ? `❌ (Error: ${table.error})` : `✅`;
      console.log(`   ${status} ${table.name}: ${table.rows} rows`);
    });
  }
  
  console.log('\n🏗️  CORE TABLES:');
  console.log('-' * 40);
  if (results.core.length === 0) {
    console.log('   ❌ No core tables found');
  } else {
    results.core.forEach(table => {
      const status = table.error ? `❌ (Error: ${table.error})` : `✅`;
      console.log(`   ${status} ${table.name}: ${table.rows} rows`);
    });
  }
  
  console.log('\n🌍 LANGUAGE-SPECIFIC TABLES:');
  console.log('-' * 40);
  if (results.languageSpecific.length === 0) {
    console.log('   ❌ No language-specific tables found');
  } else {
    // Group by language
    const byLanguage = {};
    results.languageSpecific.forEach(table => {
      const match = table.name.match(/^(careers_|industries_|career_trends_)([a-z]{2})$/);
      if (match) {
        const [, type, lang] = match;
        if (!byLanguage[lang]) byLanguage[lang] = [];
        byLanguage[lang].push(table);
      }
    });
    
    for (const [lang, langTables] of Object.entries(byLanguage)) {
      console.log(`\n   📝 ${lang.toUpperCase()}:`);
      langTables.forEach(table => {
        const status = table.error ? `❌ (Error: ${table.error})` : `✅`;
        console.log(`      ${status} ${table.name}: ${table.rows} rows`);
      });
    }
  }
  
  console.log('\n📋 OTHER TABLES:');
  console.log('-' * 40);
  if (results.other.length === 0) {
    console.log('   No other tables found');
  } else {
    results.other.forEach(table => {
      const status = table.error ? `❌ (Error: ${table.error})` : `✅`;
      console.log(`   ${status} ${table.name}: ${table.rows} rows`);
    });
  }
  
  console.log('\n❌ TABLES NOT FOUND:');
  console.log('-' * 40);
  if (results.notFound.length === 0) {
    console.log('   All expected tables found');
  } else {
    results.notFound.forEach(table => {
      console.log(`   ❌ ${table}`);
    });
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log('=' * 50);
  console.log(`   Old System Tables: ${results.oldSystem.length}`);
  console.log(`   Core Tables: ${results.core.length}`);
  console.log(`   Language-Specific Tables: ${results.languageSpecific.length}`);
  console.log(`   Other Tables: ${results.other.length}`);
  console.log(`   Not Found: ${results.notFound.length}`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (results.oldSystem.length > 0) {
    console.log('\n🗑️  To use ONLY language-specific tables, remove these old tables:');
    results.oldSystem.forEach(table => {
      console.log(`   DROP TABLE ${table.name};`);
    });
  }
  
  if (results.core.length === 0 && results.languageSpecific.length > 0) {
    console.log('\n⚠️  You have language-specific tables but no core tables.');
    console.log('   Consider creating careers_core and industries_core tables.');
  }
  
  if (results.languageSpecific.length === 0) {
    console.log('\n⚠️  No language-specific tables found.');
    console.log('   You need to create the new table structure.');
  }
}

main();
