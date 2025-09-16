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

async function testComprehensiveTranslations() {
  console.log('🧪 Testing comprehensive translations...');

  try {
    const languages = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'it', 'ko', 'zh', 'ru', 'ar'];
    
    for (const lang of languages) {
      console.log(`\n📝 Testing ${lang} translations:`);
      
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

      // Test specific keys
      const testKeys = [
        'common.unknown',
        'common.various',
        'common.salaryNotSpecified',
        'skills.problemSolving',
        'skills.machineLearning',
        'skills.javascript',
        'skills.python',
        'priority.high',
        'pages.roadmap.levelUpYourCareer'
      ];

      let foundKeys = 0;
      for (const key of testKeys) {
        const keys = key.split('.');
        let value = translations;
        for (const k of keys) {
          value = value?.[k];
        }
        if (value) {
          foundKeys++;
          console.log(`  ✅ ${key}: ${value}`);
        } else {
          console.log(`  ❌ ${key}: Not found`);
        }
      }

      console.log(`  📊 Found ${foundKeys}/${testKeys.length} test keys`);
    }

    console.log('\n✅ Comprehensive translation testing completed!');

  } catch (error) {
    console.error('❌ Error during translation testing:', error);
  }
}

// Run the test
testComprehensiveTranslations();
