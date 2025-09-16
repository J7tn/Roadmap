import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

async function createCareerTranslationsTables() {
  console.log('🚀 Creating career translation tables...');

  try {
    // Create career_translations table
    console.log('📝 Creating career_translations table...');
    const { data: careerTranslationsData, error: careerTranslationsError } = await supabase
      .from('career_translations')
      .select('*')
      .limit(1);

    if (careerTranslationsError && careerTranslationsError.code === 'PGRST116') {
      // Table doesn't exist, create it
      console.log('Creating career_translations table...');
      // We'll need to use the Supabase dashboard or SQL editor for this
      console.log('⚠️ Please run the following SQL in your Supabase SQL editor:');
      console.log(`
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

-- Enable RLS
ALTER TABLE career_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_trend_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_translations ENABLE ROW LEVEL SECURITY;

-- Create read policies
CREATE POLICY "Allow read access to career_translations" ON career_translations FOR SELECT USING (true);
CREATE POLICY "Allow read access to career_trend_translations" ON career_trend_translations FOR SELECT USING (true);
CREATE POLICY "Allow read access to industry_translations" ON industry_translations FOR SELECT USING (true);
CREATE POLICY "Allow read access to skill_translations" ON skill_translations FOR SELECT USING (true);

-- Create admin policies
CREATE POLICY "Allow admin insert to career_translations" ON career_translations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update to career_translations" ON career_translations FOR UPDATE USING (true);
CREATE POLICY "Allow admin insert to career_trend_translations" ON career_trend_translations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update to career_trend_translations" ON career_trend_translations FOR UPDATE USING (true);
CREATE POLICY "Allow admin insert to industry_translations" ON industry_translations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update to industry_translations" ON industry_translations FOR UPDATE USING (true);
CREATE POLICY "Allow admin insert to skill_translations" ON skill_translations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin update to skill_translations" ON skill_translations FOR UPDATE USING (true);
      `);
    } else if (careerTranslationsError) {
      console.error('❌ Error checking career_translations table:', careerTranslationsError);
    } else {
      console.log('✅ career_translations table already exists');
    }

  } catch (error) {
    console.error('❌ Error creating career translation tables:', error);
  }
}

// Run the table creation
createCareerTranslationsTables();
