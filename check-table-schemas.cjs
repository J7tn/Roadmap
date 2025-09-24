#!/usr/bin/env node

/**
 * Check Table Schemas Script
 * 
 * This script checks the actual schema of the language-specific tables
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

const TABLES_TO_CHECK = [
  'industries_core',
  'careers_core', 
  'industries_en',
  'industries_ja',
  'careers_en',
  'careers_ja'
];

async function getTableSchema(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ ${tableName}: ${error.message}`);
      return null;
    }
    
    if (data && data.length > 0) {
      return Object.keys(data[0]);
    }
    
    // If no data, try to get schema from information_schema
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', tableName)
      .eq('table_schema', 'public');
    
    if (schemaError) {
      console.log(`❌ ${tableName}: Could not get schema info`);
      return null;
    }
    
    if (schemaData && schemaData.length > 0) {
      return schemaData.map(col => col.column_name);
    }
    
    console.log(`⚠️  ${tableName}: No data and no schema info available`);
    return [];
    
  } catch (error) {
    console.log(`❌ ${tableName}: ${error.message}`);
    return null;
  }
}

async function getTableRowCount(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${tableName}: ${error.message}`);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.log(`❌ ${tableName}: ${error.message}`);
    return 0;
  }
}

async function main() {
  console.log('🔍 Checking Table Schemas and Row Counts');
  console.log('=' * 50);
  
  for (const tableName of TABLES_TO_CHECK) {
    console.log(`\n📊 ${tableName.toUpperCase()}:`);
    console.log('-' * 30);
    
    const schema = await getTableSchema(tableName);
    const rowCount = await getTableRowCount(tableName);
    
    if (schema) {
      console.log(`   📋 Schema: [${schema.join(', ')}]`);
    }
    
    console.log(`   📊 Rows: ${rowCount}`);
    
    // Show sample data if available
    if (rowCount > 0) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error && data && data.length > 0) {
          console.log(`   📝 Sample:`, JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
        }
      } catch (error) {
        console.log(`   ❌ Could not fetch sample data`);
      }
    }
  }
}

main();
