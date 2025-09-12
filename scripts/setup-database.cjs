#!/usr/bin/env node

/**
 * Database Setup Script
 * Sets up the Supabase database schema before running migrations
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Check if tables exist
 */
async function checkTablesExist() {
  console.log('🔍 Checking if database tables exist...');
  
  const tables = ['careers', 'career_paths', 'career_transitions'];
  const existingTables = [];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        console.log(`❌ Table '${table}' does not exist`);
      } else if (error) {
        console.log(`⚠️  Error checking table '${table}':`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists`);
        existingTables.push(table);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' does not exist`);
    }
  }
  
  return existingTables;
}

/**
 * Apply schema from SQL file
 */
async function applySchema() {
  console.log('📋 Applying database schema...');
  
  try {
    const schemaPath = path.join(__dirname, '../comprehensive-career-database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
          
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            console.warn(`⚠️  Statement ${i + 1} failed:`, error.message);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.warn(`⚠️  Statement ${i + 1} failed:`, err.message);
        }
      }
    }
    
    console.log('✅ Schema application completed');
    
  } catch (error) {
    console.error('❌ Failed to apply schema:', error.message);
    throw error;
  }
}

/**
 * Create exec_sql function if it doesn't exist
 */
async function createExecSqlFunction() {
  console.log('🔧 Creating exec_sql function...');
  
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `;
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: createFunctionSQL 
    });
    
    if (error) {
      console.log('⚠️  exec_sql function creation failed:', error.message);
      console.log('📝 You may need to run the schema manually in Supabase SQL editor');
      return false;
    } else {
      console.log('✅ exec_sql function created successfully');
      return true;
    }
  } catch (err) {
    console.log('⚠️  exec_sql function creation failed:', err.message);
    console.log('📝 You may need to run the schema manually in Supabase SQL editor');
    return false;
  }
}

/**
 * Main setup function
 */
async function main() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Check if tables exist
    const existingTables = await checkTablesExist();
    
    if (existingTables.length === 0) {
      console.log('📋 No tables found. Applying schema...');
      
      // Try to create exec_sql function first
      const functionCreated = await createExecSqlFunction();
      
      if (functionCreated) {
        await applySchema();
      } else {
        console.log('\n📝 Manual Setup Required:');
        console.log('1. Go to your Supabase project dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste the contents of comprehensive-career-database-schema.sql');
        console.log('4. Run the SQL script');
        console.log('5. Then run: npm run migrate-careers');
        return;
      }
    } else {
      console.log(`✅ Found ${existingTables.length} existing tables`);
    }
    
    // Verify tables exist after setup
    const finalTables = await checkTablesExist();
    
    if (finalTables.length >= 2) {
      console.log('🎉 Database setup completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Run: npm run migrate-careers');
      console.log('2. Test the app with the new hybrid service');
    } else {
      console.log('❌ Database setup incomplete. Please check the schema manually.');
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  main();
}

module.exports = { main };
