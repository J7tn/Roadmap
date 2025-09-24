#!/usr/bin/env node

/**
 * Cleanup Old Tables Script
 * 
 * This script safely removes old system tables to use only the new language-specific tables
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

// Tables to remove (old system)
const TABLES_TO_REMOVE = [
  'career_trend_translations',  // Remove first (has foreign keys)
  'career_trends',              // Remove second
  'career_paths',               // Remove third
  'careers',                    // Remove fourth
  'industries',                 // Remove fifth
  'translations'                // Remove last
];

// Tables to keep (new system)
const TABLES_TO_KEEP = [
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

async function dropTable(tableName) {
  try {
    console.log(`🗑️  Dropping table: ${tableName}...`);
    
    // Use raw SQL to drop the table
    const { error } = await supabase.rpc('exec_sql', {
      sql: `DROP TABLE IF EXISTS ${tableName} CASCADE;`
    });
    
    if (error) {
      console.error(`❌ Error dropping ${tableName}:`, error.message);
      return false;
    }
    
    console.log(`✅ Successfully dropped: ${tableName}`);
    return true;
  } catch (error) {
    console.error(`❌ Exception dropping ${tableName}:`, error.message);
    return false;
  }
}

async function verifyCleanup() {
  console.log('\n🔍 Verifying cleanup...');
  
  let oldTablesRemaining = 0;
  let newTablesIntact = 0;
  
  // Check old tables are gone
  console.log('\n🗑️  Checking old tables are removed:');
  for (const tableName of TABLES_TO_REMOVE) {
    const exists = await checkTableExists(tableName);
    if (exists) {
      console.log(`   ❌ ${tableName} still exists`);
      oldTablesRemaining++;
    } else {
      console.log(`   ✅ ${tableName} removed`);
    }
  }
  
  // Check new tables are intact
  console.log('\n✅ Checking new tables are intact:');
  for (const tableName of TABLES_TO_KEEP) {
    const exists = await checkTableExists(tableName);
    const rowCount = exists ? await getTableRowCount(tableName) : 0;
    
    if (exists) {
      console.log(`   ✅ ${tableName}: ${rowCount} rows`);
      newTablesIntact++;
    } else {
      console.log(`   ❌ ${tableName} missing`);
    }
  }
  
  return { oldTablesRemaining, newTablesIntact };
}

async function main() {
  console.log('🧹 Supabase Table Cleanup');
  console.log('=' * 50);
  console.log('This will remove old system tables and keep only language-specific tables.\n');
  
  // Show what will be removed
  console.log('🗑️  TABLES TO BE REMOVED:');
  for (const tableName of TABLES_TO_REMOVE) {
    const exists = await checkTableExists(tableName);
    const rowCount = exists ? await getTableRowCount(tableName) : 0;
    console.log(`   ${exists ? '✅' : '❌'} ${tableName}: ${rowCount} rows`);
  }
  
  // Show what will be kept
  console.log('\n✅ TABLES TO BE KEPT:');
  for (const tableName of TABLES_TO_KEEP) {
    const exists = await checkTableExists(tableName);
    const rowCount = exists ? await getTableRowCount(tableName) : 0;
    console.log(`   ${exists ? '✅' : '❌'} ${tableName}: ${rowCount} rows`);
  }
  
  // Confirmation
  console.log('\n⚠️  WARNING: This will permanently delete the old system tables!');
  console.log('   Make sure you have backups if needed.');
  console.log('\n🤔 Do you want to proceed? (This script will continue automatically)');
  
  // Wait a moment for user to read
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('\n🚀 Starting cleanup...\n');
  
  // Remove old tables
  let successCount = 0;
  for (const tableName of TABLES_TO_REMOVE) {
    const exists = await checkTableExists(tableName);
    if (exists) {
      const success = await dropTable(tableName);
      if (success) successCount++;
      
      // Add delay between drops
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`⏭️  Skipping ${tableName} (doesn't exist)`);
    }
  }
  
  // Verify cleanup
  const { oldTablesRemaining, newTablesIntact } = await verifyCleanup();
  
  // Summary
  console.log('\n📊 CLEANUP SUMMARY:');
  console.log('=' * 50);
  console.log(`   Old tables removed: ${successCount}/${TABLES_TO_REMOVE.length}`);
  console.log(`   Old tables remaining: ${oldTablesRemaining}`);
  console.log(`   New tables intact: ${newTablesIntact}/${TABLES_TO_KEEP.length}`);
  
  if (oldTablesRemaining === 0 && newTablesIntact > 0) {
    console.log('\n🎉 SUCCESS! Database cleaned up successfully!');
    console.log('   You now have only language-specific tables.');
    console.log('   The app should work with the new translation system.');
  } else {
    console.log('\n⚠️  Cleanup incomplete. Some issues remain.');
    if (oldTablesRemaining > 0) {
      console.log('   Some old tables could not be removed.');
    }
    if (newTablesIntact === 0) {
      console.log('   No new tables found - you may need to create them first.');
    }
  }
  
  console.log('\n💡 NEXT STEPS:');
  console.log('   1. Test the app to ensure it works with the new tables');
  console.log('   2. Verify language switching works correctly');
  console.log('   3. Check that all pages display translated content');
}

main();
