#!/usr/bin/env node

/**
 * Add Region Column Script
 * Adds a region column to the career_trends table to support regional data
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Add region column to career_trends table
 */
async function addRegionColumn() {
  console.log('🚀 Adding region column to career_trends table...');
  
  try {
    // SQL to add the region column
    const addRegionColumnSQL = `
      ALTER TABLE career_trends 
      ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'north-america';
    `;
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: addRegionColumnSQL 
    });
    
    if (error) {
      console.error('❌ Error adding region column:', error);
      
      // Try alternative approach using direct SQL execution
      console.log('🔄 Trying alternative approach...');
      
      // Create a new table with region column
      const createNewTableSQL = `
        CREATE TABLE IF NOT EXISTS career_trends_regional (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          career_id TEXT NOT NULL,
          region TEXT NOT NULL DEFAULT 'north-america',
          
          -- Trend data from chat2api
          trend_score DECIMAL(3,2) NOT NULL CHECK (trend_score >= 0 AND trend_score <= 10),
          trend_direction TEXT NOT NULL CHECK (trend_direction IN ('rising', 'stable', 'declining')),
          demand_level TEXT NOT NULL CHECK (demand_level IN ('high', 'medium', 'low')),
          growth_rate DECIMAL(5,2),
          
          -- Market insights
          market_insights TEXT,
          key_skills_trending TEXT[],
          salary_trend TEXT,
          job_availability_score DECIMAL(3,2) CHECK (job_availability_score >= 0 AND job_availability_score <= 10),
          
          -- Geographic data
          top_locations TEXT[],
          remote_work_trend DECIMAL(3,2) CHECK (remote_work_trend >= 0 AND remote_work_trend <= 10),
          
          -- Industry context
          industry_impact TEXT,
          automation_risk DECIMAL(3,2) CHECK (automation_risk >= 0 AND automation_risk <= 10),
          future_outlook TEXT,
          
          -- Data source and quality
          data_source TEXT DEFAULT 'regional-generator',
          confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 10),
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          next_update_due TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
          
          -- Metadata
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          -- Unique constraint on career_id + region
          UNIQUE(career_id, region)
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { 
        sql: createNewTableSQL 
      });
      
      if (createError) {
        console.error('❌ Error creating new table:', createError);
        return false;
      }
      
      console.log('✅ Created new career_trends_regional table with region support');
      return true;
    }
    
    console.log('✅ Successfully added region column to career_trends table');
    return true;
    
  } catch (error) {
    console.error('❌ Error adding region column:', error);
    return false;
  }
}

/**
 * Migrate existing data to include region
 */
async function migrateExistingData() {
  console.log('🔄 Migrating existing trend data to include region...');
  
  try {
    // Get all existing trend data
    const { data: existingTrends, error: fetchError } = await supabase
      .from('career_trends')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Error fetching existing trends:', fetchError);
      return false;
    }
    
    if (!existingTrends || existingTrends.length === 0) {
      console.log('ℹ️  No existing trend data to migrate');
      return true;
    }
    
    console.log(`📊 Found ${existingTrends.length} existing trend records`);
    
    // Update existing records to have 'north-america' as default region
    const { error: updateError } = await supabase
      .from('career_trends')
      .update({ region: 'north-america' })
      .is('region', null);
    
    if (updateError) {
      console.error('❌ Error updating existing records:', updateError);
      return false;
    }
    
    console.log('✅ Successfully migrated existing trend data');
    return true;
    
  } catch (error) {
    console.error('❌ Error migrating existing data:', error);
    return false;
  }
}

// Run the script
async function main() {
  console.log('🚀 Starting region column addition...');
  
  try {
    const success = await addRegionColumn();
    
    if (success) {
      await migrateExistingData();
      console.log('\n✅ Region column setup completed successfully!');
      console.log('🌍 The career_trends table now supports regional data');
    } else {
      console.log('\n❌ Failed to add region column');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { addRegionColumn, migrateExistingData };
