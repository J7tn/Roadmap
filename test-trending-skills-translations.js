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

async function testTrendingSkillsTranslations() {
  console.log('🧪 Testing trending skills translations across all languages...');

  try {
    const languages = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'it', 'ko', 'zh', 'ru', 'ar'];
    
    for (const lang of languages) {
      console.log(`\n📝 Testing ${lang} trending skills translation:`);
      
      const { data: translationData, error } = await supabase
        .from('translations')
        .select('translation_data')
        .eq('language_code', lang)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error(`❌ Error fetching ${lang}:`, error);
        continue;
      }

      const translations = translationData?.translation_data;
      if (!translations) {
        console.error(`❌ No translation data found for ${lang}`);
        continue;
      }

      // Test trending skills key
      const trendingSkills = translations?.marketTrends?.trendingSkills;
      if (trendingSkills) {
        console.log(`  ✅ marketTrends.trendingSkills: "${trendingSkills}"`);
      } else {
        console.log(`  ❌ marketTrends.trendingSkills: Not found`);
      }
    }

    console.log('\n✅ Trending skills translation testing completed!');

  } catch (error) {
    console.error('❌ Error during translation testing:', error);
  }
}

// Run the test
testTrendingSkillsTranslations();
