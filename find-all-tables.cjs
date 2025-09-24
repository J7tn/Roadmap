#!/usr/bin/env node

/**
 * Find All Tables Script
 * 
 * This script tries to discover ALL tables in the database by testing common table names
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

// Comprehensive list of possible table names
const ALL_POSSIBLE_TABLES = [
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
  
  // Translation-related tables
  'career_node_translations',
  'career_translations',
  'skill_translations',
  'industry_translations',
  'node_translations',
  'content_translations',
  
  // Core tables (keep these)
  'careers_core',
  'industries_core',
  
  // Language-specific tables (keep these)
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
  'career_trends_es',
  'career_trends_fr',
  
  // Other tables
  'bookmarks',
  'user_progress',
  'trend_update_log',
  'users',
  'profiles',
  'sessions',
  'auth_users'
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
  console.log('🔍 Finding ALL Tables in Supabase Database');
  console.log('=' * 60);
  
  const foundTables = [];
  const notFoundTables = [];
  
  console.log('\n📊 Checking all possible tables...\n');
  
  for (const tableName of ALL_POSSIBLE_TABLES) {
    const exists = await checkTableExists(tableName);
    
    if (exists) {
      const rowCount = await getTableRowCount(tableName);
      foundTables.push({ name: tableName, rows: rowCount });
    } else {
      notFoundTables.push(tableName);
    }
  }
  
  // Categorize found tables
  const categories = {
    oldSystem: [],
    translations: [],
    core: [],
    languageSpecific: [],
    other: []
  };
  
  for (const table of foundTables) {
    const name = table.name;
    
    if (['careers', 'career_paths', 'translations', 'career_trends', 'career_trend_translations', 'industries', 'career_content', 'careers_new', 'industries_new'].includes(name)) {
      categories.oldSystem.push(table);
    } else if (name.includes('translation') || name.includes('_translation')) {
      categories.translations.push(table);
    } else if (name.endsWith('_core')) {
      categories.core.push(table);
    } else if (name.match(/^(careers_|industries_|career_trends_)[a-z]{2}$/)) {
      categories.languageSpecific.push(table);
    } else {
      categories.other.push(table);
    }
  }
  
  // Display results
  console.log('🗑️  OLD SYSTEM TABLES:');
  console.log('-' * 40);
  if (categories.oldSystem.length === 0) {
    console.log('   ✅ No old system tables found');
  } else {
    categories.oldSystem.forEach(table => {
      console.log(`   ❌ ${table.name}: ${table.rows} rows`);
    });
  }
  
  console.log('\n🔄 TRANSLATION TABLES:');
  console.log('-' * 40);
  if (categories.translations.length === 0) {
    console.log('   ✅ No old translation tables found');
  } else {
    categories.translations.forEach(table => {
      console.log(`   ❌ ${table.name}: ${table.rows} rows`);
    });
  }
  
  console.log('\n🏗️  CORE TABLES (keep):');
  console.log('-' * 40);
  if (categories.core.length === 0) {
    console.log('   ❌ No core tables found');
  } else {
    categories.core.forEach(table => {
      console.log(`   ✅ ${table.name}: ${table.rows} rows`);
    });
  }
  
  console.log('\n🌍 LANGUAGE-SPECIFIC TABLES (keep):');
  console.log('-' * 40);
  if (categories.languageSpecific.length === 0) {
    console.log('   ❌ No language-specific tables found');
  } else {
    // Group by language
    const byLanguage = {};
    categories.languageSpecific.forEach(table => {
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
        console.log(`      ✅ ${table.name}: ${table.rows} rows`);
      });
    }
  }
  
  console.log('\n📋 OTHER TABLES:');
  console.log('-' * 40);
  if (categories.other.length === 0) {
    console.log('   No other tables found');
  } else {
    categories.other.forEach(table => {
      console.log(`   ? ${table.name}: ${table.rows} rows`);
    });
  }
  
  // Generate cleanup SQL
  const tablesToRemove = [...categories.oldSystem, ...categories.translations];
  
  if (tablesToRemove.length > 0) {
    console.log('\n🗑️  TABLES TO REMOVE:');
    console.log('-' * 40);
    console.log('Copy and paste these SQL commands into Supabase SQL Editor:');
    console.log('\n```sql');
    tablesToRemove.forEach(table => {
      console.log(`DROP TABLE IF EXISTS ${table.name} CASCADE;`);
    });
    console.log('```\n');
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('=' * 60);
  console.log(`   Total tables found: ${foundTables.length}`);
  console.log(`   Old system tables: ${categories.oldSystem.length}`);
  console.log(`   Translation tables: ${categories.translations.length}`);
  console.log(`   Core tables: ${categories.core.length}`);
  console.log(`   Language-specific tables: ${categories.languageSpecific.length}`);
  console.log(`   Other tables: ${categories.other.length}`);
  console.log(`   Tables to remove: ${tablesToRemove.length}`);
}

main();
