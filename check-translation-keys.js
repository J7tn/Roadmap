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

async function checkTranslationKeys() {
  console.log('🔍 Checking translation keys in the latest records...');

  try {
    // Check Spanish translations
    console.log('\n📝 Spanish (es) translation keys:');
    const { data: esData, error: esError } = await supabase
      .from('translations')
      .select('translation_data')
      .eq('language_code', 'es')
      .single();

    if (esError) {
      console.error('❌ Error loading Spanish translations:', esError);
    } else {
      const keys = Object.keys(esData.translation_data);
      console.log(`   Total keys: ${keys.length}`);
      console.log('   Navigation keys:');
      keys.filter(k => k.startsWith('navigation.')).forEach(key => {
        console.log(`     - ${key}: "${esData.translation_data[key]}"`);
      });
      console.log('   Other sample keys:');
      keys.filter(k => !k.startsWith('navigation.')).slice(0, 10).forEach(key => {
        console.log(`     - ${key}: "${esData.translation_data[key]}"`);
      });
    }

    // Check Japanese translations
    console.log('\n📝 Japanese (ja) translation keys:');
    const { data: jaData, error: jaError } = await supabase
      .from('translations')
      .select('translation_data')
      .eq('language_code', 'ja')
      .single();

    if (jaError) {
      console.error('❌ Error loading Japanese translations:', jaError);
    } else {
      const keys = Object.keys(jaData.translation_data);
      console.log(`   Total keys: ${keys.length}`);
      console.log('   Navigation keys:');
      keys.filter(k => k.startsWith('navigation.')).forEach(key => {
        console.log(`     - ${key}: "${jaData.translation_data[key]}"`);
      });
      console.log('   Other sample keys:');
      keys.filter(k => !k.startsWith('navigation.')).slice(0, 10).forEach(key => {
        console.log(`     - ${key}: "${jaData.translation_data[key]}"`);
      });
    }

    // Check English translations
    console.log('\n📝 English (en) translation keys:');
    const { data: enData, error: enError } = await supabase
      .from('translations')
      .select('translation_data')
      .eq('language_code', 'en')
      .single();

    if (enError) {
      console.error('❌ Error loading English translations:', enError);
    } else {
      const keys = Object.keys(enData.translation_data);
      console.log(`   Total keys: ${keys.length}`);
      console.log('   Navigation keys:');
      keys.filter(k => k.startsWith('navigation.')).forEach(key => {
        console.log(`     - ${key}: "${enData.translation_data[key]}"`);
      });
    }

  } catch (error) {
    console.error('❌ Error during translation keys check:', error);
  }
}

// Run the check
checkTranslationKeys();
