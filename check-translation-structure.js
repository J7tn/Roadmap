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

async function checkTranslationStructure() {
  console.log('🔍 Checking translation structure...');

  try {
    // Check Spanish translations
    console.log('\n📝 Spanish (es) translation structure:');
    const { data: esData, error: esError } = await supabase
      .from('translations')
      .select('translation_data')
      .eq('language_code', 'es')
      .single();

    if (esError) {
      console.error('❌ Error loading Spanish translations:', esError);
    } else {
      console.log('Top-level keys:', Object.keys(esData.translation_data));
      console.log('Navigation object:', esData.translation_data.navigation);
      console.log('Navigation keys:', Object.keys(esData.translation_data.navigation || {}));
      
      if (esData.translation_data.navigation) {
        console.log('Navigation values:');
        Object.entries(esData.translation_data.navigation).forEach(([key, value]) => {
          console.log(`  - ${key}: "${value}"`);
        });
      }
    }

    // Check English translations
    console.log('\n📝 English (en) translation structure:');
    const { data: enData, error: enError } = await supabase
      .from('translations')
      .select('translation_data')
      .eq('language_code', 'en')
      .single();

    if (enError) {
      console.error('❌ Error loading English translations:', enError);
    } else {
      console.log('Top-level keys:', Object.keys(enData.translation_data));
      console.log('Navigation object:', enData.translation_data.navigation);
      console.log('Navigation keys:', Object.keys(enData.translation_data.navigation || {}));
      
      if (enData.translation_data.navigation) {
        console.log('Navigation values:');
        Object.entries(enData.translation_data.navigation).forEach(([key, value]) => {
          console.log(`  - ${key}: "${value}"`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error during translation structure check:', error);
  }
}

// Run the check
checkTranslationStructure();
