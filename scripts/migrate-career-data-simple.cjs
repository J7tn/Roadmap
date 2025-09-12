#!/usr/bin/env node

/**
 * Simple Career Data Migration Script
 * Works with existing Supabase table structure
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

// Career paths directory
const CAREER_PATHS_DIR = path.join(__dirname, '../src/data/careerPaths');

/**
 * Check existing table structure
 */
async function checkExistingTable() {
  console.log('🔍 Checking existing table structure...');
  
  try {
    // Get a sample record to see what columns exist
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing careers table:', error.message);
      return null;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('✅ Existing columns:', columns.join(', '));
      return columns;
    } else {
      console.log('✅ Table exists but is empty');
      return [];
    }
  } catch (error) {
    console.error('❌ Failed to check table structure:', error.message);
    return null;
  }
}

/**
 * Load all career path JSON files
 */
function loadCareerPathFiles() {
  const files = fs.readdirSync(CAREER_PATHS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(CAREER_PATHS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    });
  
  console.log(`📁 Loaded ${files.length} career path files`);
  return files;
}

/**
 * Convert career node to Supabase format (compatible with existing schema)
 */
function convertCareerNodeToSupabase(careerNode, careerPath, existingColumns) {
  const baseCareer = {
    id: careerNode.id,
    title: careerNode.t,
    description: careerNode.d,
    skills: careerNode.s || [],
    salary: careerNode.sr || '',
    experience: careerNode.te || '',
    level: careerNode.l,
    industry: careerPath.cat,
    job_titles: careerNode.jt || [],
    certifications: careerNode.c || [],
    requirements: careerNode.r || {}
  };
  
  // Add additional columns if they exist in the table
  if (existingColumns.includes('career_path_id')) {
    baseCareer.career_path_id = careerPath.id;
  }
  
  if (existingColumns.includes('career_path_name')) {
    baseCareer.career_path_name = careerPath.n;
  }
  
  if (existingColumns.includes('career_path_category')) {
    baseCareer.career_path_category = careerPath.cat;
  }
  
  return baseCareer;
}

/**
 * Migrate careers to Supabase
 */
async function migrateCareers(careerPaths, existingColumns) {
  console.log('🔄 Migrating careers...');
  
  const allCareers = [];
  
  for (const careerPath of careerPaths) {
    if (!careerPath.nodes) continue;
    
    for (const careerNode of careerPath.nodes) {
      const supabaseCareer = convertCareerNodeToSupabase(careerNode, careerPath, existingColumns);
      allCareers.push(supabaseCareer);
    }
  }

  console.log(`📊 Total careers to migrate: ${allCareers.length}`);

  // Migrate in batches
  const batchSize = 50;
  let migratedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < allCareers.length; i += batchSize) {
    const batch = allCareers.slice(i, i + batchSize);
    
    try {
      const { data, error } = await supabase
        .from('careers')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error migrating batch ${Math.floor(i / batchSize) + 1}:`, error);
        failedCount += batch.length;
        
        // Try individual inserts for this batch
        console.log(`🔄 Trying individual inserts for batch ${Math.floor(i / batchSize) + 1}...`);
        for (const career of batch) {
          try {
            const { error: individualError } = await supabase
              .from('careers')
              .upsert([career], { onConflict: 'id' });
            
            if (individualError) {
              console.error(`❌ Failed to migrate career ${career.id}:`, individualError.message);
              failedCount++;
            } else {
              migratedCount++;
            }
          } catch (err) {
            console.error(`❌ Failed to migrate career ${career.id}:`, err.message);
            failedCount++;
          }
        }
      } else {
        migratedCount += batch.length;
        console.log(`✅ Migrated batch ${Math.floor(i / batchSize) + 1}: ${migratedCount}/${allCareers.length} careers`);
      }
    } catch (err) {
      console.error(`❌ Exception in batch ${Math.floor(i / batchSize) + 1}:`, err.message);
      failedCount += batch.length;
    }
  }

  console.log(`✅ Migration completed: ${migratedCount} successful, ${failedCount} failed`);
  return { migratedCount, failedCount };
}

/**
 * Test the migration with a small sample
 */
async function testMigration(careerPaths, existingColumns) {
  console.log('🧪 Testing migration with sample data...');
  
  const testCareer = careerPaths[0];
  if (!testCareer || !testCareer.nodes || testCareer.nodes.length === 0) {
    console.log('⚠️  No test data available');
    return true;
  }
  
  const testCareerNode = testCareer.nodes[0];
  const testSupabaseCareer = convertCareerNodeToSupabase(testCareerNode, testCareer, existingColumns);
  
  try {
    const { data, error } = await supabase
      .from('careers')
      .upsert([testSupabaseCareer], { onConflict: 'id' });
    
    if (error) {
      console.error('❌ Test migration failed:', error);
      return false;
    } else {
      console.log('✅ Test migration successful');
      return true;
    }
  } catch (err) {
    console.error('❌ Test migration failed:', err.message);
    return false;
  }
}

/**
 * Main migration function
 */
async function main() {
  try {
    console.log('🚀 Starting simple career data migration...');
    
    // Check existing table structure
    const existingColumns = await checkExistingTable();
    if (existingColumns === null) {
      console.log('❌ Cannot proceed without access to careers table');
      process.exit(1);
    }
    
    // Load career path files
    const careerPaths = loadCareerPathFiles();
    
    // Test migration first
    const testPassed = await testMigration(careerPaths, existingColumns);
    if (!testPassed) {
      console.log('❌ Test migration failed. Please check your table structure.');
      process.exit(1);
    }
    
    // Migrate all careers
    const result = await migrateCareers(careerPaths, existingColumns);
    
    console.log('🎉 Migration completed!');
    
    // Display summary
    const totalCareers = careerPaths.reduce((sum, path) => sum + (path.nodes?.length || 0), 0);
    
    console.log('\n📊 Migration Summary:');
    console.log(`   Career Paths: ${careerPaths.length}`);
    console.log(`   Careers: ${result.migratedCount}/${totalCareers} (${result.failedCount} failed)`);
    console.log(`   Table Columns: ${existingColumns.join(', ')}`);
    
    if (result.failedCount > 0) {
      console.log('\n⚠️  Some careers failed to migrate. Check the logs above for details.');
    } else {
      console.log('\n✅ All careers migrated successfully!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  main();
}

module.exports = { main };
