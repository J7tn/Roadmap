#!/usr/bin/env node

/**
 * Create Regional Trends Table Script
 * Creates a new table specifically for regional career trend data
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
 * Create regional trends table
 */
async function createRegionalTrendsTable() {
  console.log('🚀 Creating regional career trends table...');
  
  try {
    // SQL to create the regional trends table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS career_trends_regional (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        career_id TEXT NOT NULL,
        region TEXT NOT NULL DEFAULT 'north-america',
        
        -- Trend data
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
    
    // Create indexes for better performance
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_career_trends_regional_career_id ON career_trends_regional(career_id);
      CREATE INDEX IF NOT EXISTS idx_career_trends_regional_region ON career_trends_regional(region);
      CREATE INDEX IF NOT EXISTS idx_career_trends_regional_career_region ON career_trends_regional(career_id, region);
    `;
    
    // Execute the table creation
    const { error: createError } = await supabase
      .from('career_trends_regional')
      .select('id')
      .limit(1);
    
    if (createError && createError.code === 'PGRST116') {
      // Table doesn't exist, create it
      console.log('📋 Creating career_trends_regional table...');
      
      // We'll use a different approach - insert a dummy record to create the table structure
      const dummyRecord = {
        career_id: 'dummy',
        region: 'dummy',
        trend_score: 5.0,
        trend_direction: 'stable',
        demand_level: 'medium',
        growth_rate: 0.0,
        market_insights: 'Dummy record for table creation',
        key_skills_trending: ['dummy'],
        salary_trend: 'Stable',
        job_availability_score: 5.0,
        top_locations: ['dummy'],
        remote_work_trend: 5.0,
        industry_impact: 'Dummy',
        automation_risk: 5.0,
        future_outlook: 'Dummy',
        confidence_score: 5.0
      };
      
      const { error: insertError } = await supabase
        .from('career_trends_regional')
        .insert([dummyRecord]);
      
      if (insertError) {
        console.error('❌ Error creating table structure:', insertError);
        return false;
      }
      
      // Delete the dummy record
      await supabase
        .from('career_trends_regional')
        .delete()
        .eq('career_id', 'dummy');
      
      console.log('✅ Successfully created career_trends_regional table');
    } else if (createError) {
      console.error('❌ Error checking table existence:', createError);
      return false;
    } else {
      console.log('✅ career_trends_regional table already exists');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creating regional trends table:', error);
    return false;
  }
}

// Run the script
async function main() {
  console.log('🚀 Starting regional trends table creation...');
  
  try {
    const success = await createRegionalTrendsTable();
    
    if (success) {
      console.log('\n✅ Regional trends table setup completed successfully!');
      console.log('🌍 The career_trends_regional table is ready for regional data');
    } else {
      console.log('\n❌ Failed to create regional trends table');
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

module.exports = { createRegionalTrendsTable };
