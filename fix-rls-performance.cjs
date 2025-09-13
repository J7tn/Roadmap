#!/usr/bin/env node

/**
 * RLS Performance Optimization Script
 * Fixes auth_rls_initplan and multiple_permissive_policies warnings
 * Created: 2025-01-12
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      console.error('❌ SQL Error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ Execution Error:', err.message);
    return false;
  }
}

async function fixRLSPerformance() {
  console.log('🚀 Starting RLS Performance Optimization...\n');

  // Read the SQL file
  const sqlFile = path.join(__dirname, 'rls-performance-optimization.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  // Split into individual statements
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

  let successCount = 0;
  let totalCount = statements.length;

  console.log(`📊 Executing ${totalCount} SQL statements...\n`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    // Skip comments and empty statements
    if (statement.startsWith('--') || statement.length === 0) {
      continue;
    }

    try {
      console.log(`[${i + 1}/${totalCount}] Executing statement...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: statement + ';' 
      });

      if (error) {
        console.error(`❌ Error in statement ${i + 1}:`, error.message);
        console.error(`   Statement: ${statement.substring(0, 100)}...`);
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception in statement ${i + 1}:`, err.message);
    }

    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📊 Results: ${successCount}/${totalCount} statements executed successfully`);

  if (successCount === totalCount) {
    console.log('🎉 All RLS performance optimizations applied successfully!');
    console.log('\n📈 Expected improvements:');
    console.log('   • Reduced policy evaluation overhead');
    console.log('   • Eliminated per-row auth function re-evaluation');
    console.log('   • Consolidated multiple policies for better performance');
    console.log('   • Maintained same security model');
  } else {
    console.log('⚠️  Some optimizations may not have been applied. Check the errors above.');
  }
}

// Alternative approach using direct SQL execution
async function fixRLSPerformanceDirect() {
  console.log('🚀 Starting RLS Performance Optimization (Direct Method)...\n');

  const optimizations = [
    {
      name: 'Fix career_trends policies',
      sql: `
        DROP POLICY IF EXISTS "Allow service role full access to career trends" ON public.career_trends;
        DROP POLICY IF EXISTS "Allow public read access to career trends" ON public.career_trends;
        
        CREATE POLICY "career_trends_access_policy" ON public.career_trends
        FOR ALL
        USING (
          (auth.role() IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND true) OR
          (auth.role() = 'service_role')
        )
        WITH CHECK (
          (auth.role() = 'service_role')
        );
      `
    },
    {
      name: 'Fix career_trend_history policies',
      sql: `
        DROP POLICY IF EXISTS "Allow service role full access to trend history" ON public.career_trend_history;
        DROP POLICY IF EXISTS "Allow public read access to trend history" ON public.career_trend_history;
        
        CREATE POLICY "career_trend_history_access_policy" ON public.career_trend_history
        FOR ALL
        USING (
          (auth.role() IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND true) OR
          (auth.role() = 'service_role')
        )
        WITH CHECK (
          (auth.role() = 'service_role')
        );
      `
    },
    {
      name: 'Fix industry_trends policies',
      sql: `
        DROP POLICY IF EXISTS "Allow service role full access to industry trends" ON public.industry_trends;
        DROP POLICY IF EXISTS "Allow public read access to industry trends" ON public.industry_trends;
        
        CREATE POLICY "industry_trends_access_policy" ON public.industry_trends
        FOR ALL
        USING (
          (auth.role() IN ('anon', 'authenticated', 'authenticator', 'dashboard_user') AND true) OR
          (auth.role() = 'service_role')
        )
        WITH CHECK (
          (auth.role() = 'service_role')
        );
      `
    },
    {
      name: 'Fix trend_update_log policies',
      sql: `
        DROP POLICY IF EXISTS "Allow service role full access to update log" ON public.trend_update_log;
        
        CREATE POLICY "trend_update_log_access_policy" ON public.trend_update_log
        FOR ALL
        USING (
          (auth.role() = 'service_role')
        )
        WITH CHECK (
          (auth.role() = 'service_role')
        );
      `
    }
  ];

  let successCount = 0;

  for (const optimization of optimizations) {
    try {
      console.log(`🔧 ${optimization.name}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_query: optimization.sql 
      });

      if (error) {
        console.error(`❌ Error:`, error.message);
      } else {
        console.log(`✅ Success`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Exception:`, err.message);
    }
  }

  console.log(`\n📊 Results: ${successCount}/${optimizations.length} optimizations applied successfully`);

  if (successCount === optimizations.length) {
    console.log('🎉 RLS performance optimizations completed!');
  }
}

// Check if exec_sql function exists, if not use alternative approach
async function checkExecSQLFunction() {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: 'SELECT 1;' });
    return !error;
  } catch (err) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking database connection and available functions...');
  
  const hasExecSQL = await checkExecSQLFunction();
  
  if (hasExecSQL) {
    console.log('✅ exec_sql function available, using direct SQL execution');
    await fixRLSPerformanceDirect();
  } else {
    console.log('⚠️  exec_sql function not available, trying alternative approach...');
    console.log('💡 You may need to run the SQL script directly in your Supabase dashboard');
    console.log('📁 SQL file location: rls-performance-optimization.sql');
  }
}

main().catch(console.error);
