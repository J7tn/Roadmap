import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTranslationLoading() {
  console.log('🧪 Testing translation loading from Supabase...');

  try {
    // Test loading Spanish translations
    console.log('\n📝 Testing Spanish (es) translations...');
    const { data: esData, error: esError } = await supabase
      .from('translations')
      .select('translation_data')
      .eq('language_code', 'es')
      .single();

    if (esError) {
      console.error('❌ Error loading Spanish translations:', esError);
    } else {
      console.log('✅ Spanish translations loaded successfully');
      console.log('📊 Sample keys:');
      const sampleKeys = Object.keys(esData.translation_data).slice(0, 10);
      sampleKeys.forEach(key => {
        console.log(`   - ${key}: "${esData.translation_data[key]}"`);
      });
      console.log(`   ... and ${Object.keys(esData.translation_data).length - 10} more keys`);
    }

    // Test loading Japanese translations
    console.log('\n📝 Testing Japanese (ja) translations...');
    const { data: jaData, error: jaError } = await supabase
      .from('translations')
      .select('translation_data')
      .eq('language_code', 'ja')
      .single();

    if (jaError) {
      console.error('❌ Error loading Japanese translations:', jaError);
    } else {
      console.log('✅ Japanese translations loaded successfully');
      console.log('📊 Sample keys:');
      const sampleKeys = Object.keys(jaData.translation_data).slice(0, 10);
      sampleKeys.forEach(key => {
        console.log(`   - ${key}: "${jaData.translation_data[key]}"`);
      });
      console.log(`   ... and ${Object.keys(jaData.translation_data).length - 10} more keys`);
    }

    // Check if navigation keys exist
    console.log('\n🔍 Checking navigation translations...');
    if (esData?.translation_data) {
      console.log('Spanish navigation keys:');
      console.log(`   - navigation.assessment: "${esData.translation_data['navigation.assessment']}"`);
      console.log(`   - navigation.home: "${esData.translation_data['navigation.home']}"`);
      console.log(`   - navigation.search: "${esData.translation_data['navigation.search']}"`);
    }

    if (jaData?.translation_data) {
      console.log('Japanese navigation keys:');
      console.log(`   - navigation.assessment: "${jaData.translation_data['navigation.assessment']}"`);
      console.log(`   - navigation.home: "${jaData.translation_data['navigation.home']}"`);
      console.log(`   - navigation.search: "${jaData.translation_data['navigation.search']}"`);
    }

  } catch (error) {
    console.error('❌ Error during translation testing:', error);
  }
}

// Run the test
testTranslationLoading();
