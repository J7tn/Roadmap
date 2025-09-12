#!/usr/bin/env node

/**
 * Fix RLS Policies Script
 * Disables or fixes Row Level Security policies for career data migration
 */

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
 * Check RLS status
 */
async function checkRLSStatus() {
  console.log('🔍 Checking RLS status...');
  
  try {
    // Try to insert a test record to see if RLS is blocking us
    const { data, error } = await supabase
      .from('careers')
      .insert([{
        id: 'test-rls-check',
        title: 'Test Career',
        description: 'Test description',
        skills: ['test'],
        salary: 'Test salary',
        experience: 'Test experience',
        level: 'E',
        industry: 'tech',
        job_titles: ['Test Job'],
        certifications: [],
        requirements: {}
      }]);
    
    if (error) {
      if (error.code === '42501') {
        console.log('❌ RLS is blocking inserts');
        return false;
      } else {
        console.log('⚠️  Other error:', error.message);
        return false;
      }
    } else {
      console.log('✅ RLS allows inserts');
      // Clean up test record
      await supabase.from('careers').delete().eq('id', 'test-rls-check');
      return true;
    }
  } catch (error) {
    console.log('❌ Error checking RLS:', error.message);
    return false;
  }
}

/**
 * Create a simple RLS policy that allows all operations
 */
async function createPermissivePolicy() {
  console.log('🔧 Creating permissive RLS policy...');
  
  const policySQL = `
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow all operations on careers" ON careers;
    
    -- Create a permissive policy that allows all operations
    CREATE POLICY "Allow all operations on careers" ON careers
    FOR ALL
    USING (true)
    WITH CHECK (true);
  `;
  
  try {
    // Note: This requires service role key, not anon key
    console.log('⚠️  This requires service role permissions.');
    console.log('📝 Please run this SQL in your Supabase SQL editor:');
    console.log('\n' + policySQL + '\n');
    
    return false; // We can't run this with anon key
  } catch (error) {
    console.error('❌ Failed to create policy:', error.message);
    return false;
  }
}

/**
 * Alternative: Disable RLS temporarily
 */
async function disableRLSTemporarily() {
  console.log('🔧 Instructions to disable RLS temporarily...');
  
  const disableRLSSQL = `
    -- Temporarily disable RLS for migration
    ALTER TABLE careers DISABLE ROW LEVEL SECURITY;
    
    -- After migration, re-enable RLS
    -- ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
  `;
  
  console.log('📝 To disable RLS temporarily, run this SQL in Supabase SQL editor:');
  console.log('\n' + disableRLSSQL + '\n');
  
  console.log('⚠️  Remember to re-enable RLS after migration for security!');
}

/**
 * Check if we can use service role
 */
async function checkServiceRole() {
  console.log('🔍 Checking if we have service role access...');
  
  // Try to access a system table that requires elevated permissions
  try {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(1);
    
    if (error) {
      console.log('❌ No service role access available');
      return false;
    } else {
      console.log('✅ Service role access available');
      return true;
    }
  } catch (error) {
    console.log('❌ No service role access available');
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting RLS policy fix...');
    
    // Check RLS status
    const rlsAllowsInserts = await checkRLSStatus();
    
    if (rlsAllowsInserts) {
      console.log('✅ RLS is not blocking inserts. Migration should work.');
      return;
    }
    
    // Check service role access
    const hasServiceRole = await checkServiceRole();
    
    if (hasServiceRole) {
      console.log('🔧 Attempting to create permissive policy...');
      await createPermissivePolicy();
    } else {
      console.log('📝 Manual intervention required:');
      console.log('\n🔧 Option 1: Disable RLS temporarily');
      await disableRLSTemporarily();
      
      console.log('\n🔧 Option 2: Create permissive policy');
      await createPermissivePolicy();
      
      console.log('\n🔧 Option 3: Use service role key');
      console.log('Set VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file');
    }
    
  } catch (error) {
    console.error('❌ RLS fix failed:', error);
    process.exit(1);
  }
}

// Run fix
if (require.main === module) {
  main();
}

module.exports = { main };
