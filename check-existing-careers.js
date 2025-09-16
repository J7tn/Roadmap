import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkExistingData() {
  console.log('🔍 Checking existing data in Supabase...');

  try {
    // Check careers
    const { data: careers, error: careersError } = await supabase
      .from('careers')
      .select('id, title, description, skills, job_titles, certifications')
      .limit(10);

    if (careersError) {
      console.error('❌ Error fetching careers:', careersError);
    } else {
      console.log(`\n📊 Found ${careers?.length || 0} careers (showing first 10):`);
      careers?.forEach(career => {
        console.log(`  - ${career.id}: ${career.title}`);
        console.log(`    Skills: ${career.skills?.slice(0, 3).join(', ')}...`);
        console.log(`    Job Titles: ${career.job_titles?.slice(0, 2).join(', ')}...`);
      });
    }

    // Check career trends
    const { data: trends, error: trendsError } = await supabase
      .from('career_trends')
      .select('id, career_id, trend_description, market_insights')
      .limit(5);

    if (trendsError) {
      console.error('❌ Error fetching trends:', trendsError);
    } else {
      console.log(`\n📈 Found ${trends?.length || 0} career trends (showing first 5):`);
      trends?.forEach(trend => {
        console.log(`  - ${trend.id}: ${trend.trend_description?.substring(0, 50)}...`);
      });
    }

    // Check existing translations
    const { data: careerTranslations, error: careerTransError } = await supabase
      .from('career_translations')
      .select('career_id, language_code, title')
      .limit(5);

    if (careerTransError) {
      console.error('❌ Error fetching career translations:', careerTransError);
    } else {
      console.log(`\n🌍 Found ${careerTranslations?.length || 0} career translations (showing first 5):`);
      careerTranslations?.forEach(trans => {
        console.log(`  - ${trans.career_id} (${trans.language_code}): ${trans.title}`);
      });
    }

    // Check if translation tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['career_translations', 'career_trend_translations', 'industry_translations', 'skill_translations']);

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError);
    } else {
      console.log(`\n🗄️ Translation tables found: ${tables?.map(t => t.table_name).join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Error during data check:', error);
  }
}

// Run the check
checkExistingData();