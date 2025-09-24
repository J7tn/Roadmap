#!/usr/bin/env node

/**
 * Comprehensive Supabase Table Audit
 * 
 * This script audits all tables in your Supabase database to see what actually exists
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

async function getAllTables() {
  console.log('🔍 Fetching all tables from Supabase...');
  
  try {
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) {
      console.error('❌ Error fetching tables:', error.message);
      return [];
    }
    
    return tables || [];
  } catch (error) {
    console.error('❌ Error accessing information_schema:', error.message);
    return [];
  }
}

async function getTableRowCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(`❌ Error counting rows in ${tableName}:`, error.message);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    return 0;
  }
}

async function getTableSchema(tableName) {
  try {
    const { data: columns, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .order('ordinal_position');
    
    if (error) {
      return [];
    }
    
    return columns || [];
  } catch (error) {
    return [];
  }
}

async function categorizeTables(tables) {
  const categories = {
    oldSystem: [],
    newLanguageSpecific: [],
    core: [],
    other: []
  };
  
  for (const table of tables) {
    const tableName = table.table_name;
    
    // Old system tables
    if (['careers', 'career_paths', 'translations', 'career_trends', 'career_trend_translations', 'industries', 'industry_translations', 'career_content', 'careers_new', 'industries_new'].includes(tableName)) {
      categories.oldSystem.push(table);
    }
    // New language-specific tables
    else if (tableName.match(/^(careers_|industries_|career_trends_)[a-z]{2}$/)) {
      categories.newLanguageSpecific.push(table);
    }
    // Core tables
    else if (tableName.match(/_(core)$/)) {
      categories.core.push(table);
    }
    // Other tables
    else {
      categories.other.push(table);
    }
  }
  
  return categories;
}

async function main() {
  console.log('🔍 Comprehensive Supabase Table Audit');
  console.log('=' * 50);
  
  try {
    // Get all tables
    const tables = await getAllTables();
    
    if (tables.length === 0) {
      console.log('❌ No tables found in the database');
      return;
    }
    
    console.log(`\n📊 Found ${tables.length} tables total\n`);
    
    // Categorize tables
    const categories = await categorizeTables(tables);
    
    // Display Old System Tables
    console.log('🗑️  OLD SYSTEM TABLES (Should be removed):');
    console.log('-' * 40);
    if (categories.oldSystem.length === 0) {
      console.log('   ✅ No old system tables found');
    } else {
      for (const table of categories.oldSystem) {
        const rowCount = await getTableRowCount(table.table_name);
        console.log(`   📋 ${table.table_name}: ${rowCount} rows`);
      }
    }
    
    // Display Core Tables
    console.log('\n🏗️  CORE TABLES (Language-agnostic data):');
    console.log('-' * 40);
    if (categories.core.length === 0) {
      console.log('   ❌ No core tables found');
    } else {
      for (const table of categories.core) {
        const rowCount = await getTableRowCount(table.table_name);
        console.log(`   ✅ ${table.table_name}: ${rowCount} rows`);
      }
    }
    
    // Display Language-Specific Tables
    console.log('\n🌍 LANGUAGE-SPECIFIC TABLES:');
    console.log('-' * 40);
    if (categories.newLanguageSpecific.length === 0) {
      console.log('   ❌ No language-specific tables found');
    } else {
      // Group by language
      const byLanguage = {};
      for (const table of categories.newLanguageSpecific) {
        const match = table.table_name.match(/^(careers_|industries_|career_trends_)([a-z]{2})$/);
        if (match) {
          const [, type, lang] = match;
          if (!byLanguage[lang]) byLanguage[lang] = [];
          byLanguage[lang].push(table);
        }
      }
      
      for (const [lang, langTables] of Object.entries(byLanguage)) {
        console.log(`\n   📝 ${lang.toUpperCase()}:`);
        for (const table of langTables) {
          const rowCount = await getTableRowCount(table.table_name);
          console.log(`      ${table.table_name}: ${rowCount} rows`);
        }
      }
    }
    
    // Display Other Tables
    console.log('\n📋 OTHER TABLES:');
    console.log('-' * 40);
    if (categories.other.length === 0) {
      console.log('   No other tables found');
    } else {
      for (const table of categories.other) {
        const rowCount = await getTableRowCount(table.table_name);
        console.log(`   ${table.table_name}: ${rowCount} rows`);
      }
    }
    
    // Summary and Recommendations
    console.log('\n📋 SUMMARY & RECOMMENDATIONS:');
    console.log('=' * 50);
    
    if (categories.oldSystem.length > 0) {
      console.log(`\n🗑️  REMOVE ${categories.oldSystem.length} OLD SYSTEM TABLES:`);
      categories.oldSystem.forEach(table => {
        console.log(`   DROP TABLE ${table.table_name};`);
      });
    }
    
    if (categories.core.length === 0) {
      console.log('\n⚠️  MISSING CORE TABLES:');
      console.log('   You need to create: careers_core, industries_core');
    }
    
    if (categories.newLanguageSpecific.length === 0) {
      console.log('\n⚠️  MISSING LANGUAGE-SPECIFIC TABLES:');
      console.log('   You need to create: careers_en, careers_ja, etc.');
    } else {
      console.log(`\n✅ FOUND ${categories.newLanguageSpecific.length} LANGUAGE-SPECIFIC TABLES`);
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('   1. Remove old system tables if you want to use only language-specific tables');
    console.log('   2. Create missing core tables if needed');
    console.log('   3. Verify language-specific tables have proper data');
    
  } catch (error) {
    console.error('❌ Error during audit:', error);
    process.exit(1);
  }
}

main();
