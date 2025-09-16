import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyCareerTranslationsSchema() {
  console.log('🚀 Applying career translations schema directly...');

  try {
    // Create career_translations table
    console.log('📝 Creating career_translations table...');
    const { error: careerTranslationsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS career_translations (
          id SERIAL PRIMARY KEY,
          career_id TEXT NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
          language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          skills TEXT[] NOT NULL,
          job_titles TEXT[] NOT NULL,
          certifications TEXT[] NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(career_id, language_code)
        );
      `
    });

    if (careerTranslationsError) {
      console.error('❌ Error creating career_translations table:', careerTranslationsError);
    } else {
      console.log('✅ career_translations table created successfully');
    }

    // Create career_trend_translations table
    console.log('📝 Creating career_trend_translations table...');
    const { error: trendTranslationsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS career_trend_translations (
          id SERIAL PRIMARY KEY,
          career_trend_id INTEGER NOT NULL REFERENCES career_trends(id) ON DELETE CASCADE,
          language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
          trend_description TEXT,
          market_insights TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(career_trend_id, language_code)
        );
      `
    });

    if (trendTranslationsError) {
      console.error('❌ Error creating career_trend_translations table:', trendTranslationsError);
    } else {
      console.log('✅ career_trend_translations table created successfully');
    }

    // Create industry_translations table
    console.log('📝 Creating industry_translations table...');
    const { error: industryTranslationsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS industry_translations (
          id SERIAL PRIMARY KEY,
          industry_key TEXT NOT NULL,
          language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
          industry_name TEXT NOT NULL,
          industry_description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(industry_key, language_code)
        );
      `
    });

    if (industryTranslationsError) {
      console.error('❌ Error creating industry_translations table:', industryTranslationsError);
    } else {
      console.log('✅ industry_translations table created successfully');
    }

    // Create skill_translations table
    console.log('📝 Creating skill_translations table...');
    const { error: skillTranslationsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS skill_translations (
          id SERIAL PRIMARY KEY,
          skill_key TEXT NOT NULL,
          language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
          skill_name TEXT NOT NULL,
          skill_category TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(skill_key, language_code)
        );
      `
    });

    if (skillTranslationsError) {
      console.error('❌ Error creating skill_translations table:', skillTranslationsError);
    } else {
      console.log('✅ skill_translations table created successfully');
    }

    // Enable RLS
    console.log('🔒 Enabling Row Level Security...');
    const rlsTables = ['career_translations', 'career_trend_translations', 'industry_translations', 'skill_translations'];
    
    for (const table of rlsTables) {
      const { error: rlsError } = await supabase.rpc('exec', {
        sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
      });
      
      if (rlsError) {
        console.error(`❌ Error enabling RLS for ${table}:`, rlsError);
      } else {
        console.log(`✅ RLS enabled for ${table}`);
      }
    }

    // Create read policies
    console.log('📋 Creating read policies...');
    const readPolicies = [
      'CREATE POLICY "Allow read access to career_translations" ON career_translations FOR SELECT USING (true);',
      'CREATE POLICY "Allow read access to career_trend_translations" ON career_trend_translations FOR SELECT USING (true);',
      'CREATE POLICY "Allow read access to industry_translations" ON industry_translations FOR SELECT USING (true);',
      'CREATE POLICY "Allow read access to skill_translations" ON skill_translations FOR SELECT USING (true);'
    ];

    for (const policy of readPolicies) {
      const { error: policyError } = await supabase.rpc('exec', { sql: policy });
      if (policyError) {
        console.error('❌ Error creating read policy:', policyError);
      } else {
        console.log('✅ Read policy created');
      }
    }

    // Create admin policies
    console.log('👑 Creating admin policies...');
    const adminPolicies = [
      'CREATE POLICY "Allow admin insert to career_translations" ON career_translations FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Allow admin update to career_translations" ON career_translations FOR UPDATE USING (true);',
      'CREATE POLICY "Allow admin insert to career_trend_translations" ON career_trend_translations FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Allow admin update to career_trend_translations" ON career_trend_translations FOR UPDATE USING (true);',
      'CREATE POLICY "Allow admin insert to industry_translations" ON industry_translations FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Allow admin update to industry_translations" ON industry_translations FOR UPDATE USING (true);',
      'CREATE POLICY "Allow admin insert to skill_translations" ON skill_translations FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Allow admin update to skill_translations" ON skill_translations FOR UPDATE USING (true);'
    ];

    for (const policy of adminPolicies) {
      const { error: policyError } = await supabase.rpc('exec', { sql: policy });
      if (policyError) {
        console.error('❌ Error creating admin policy:', policyError);
      } else {
        console.log('✅ Admin policy created');
      }
    }

    console.log('✅ Career translations schema applied successfully!');

  } catch (error) {
    console.error('❌ Error applying career translations schema:', error);
  }
}

// Run the schema application
applyCareerTranslationsSchema();
