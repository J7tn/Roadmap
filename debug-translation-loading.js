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

async function debugTranslationLoading() {
  console.log('🐛 Debugging translation loading...');

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
      console.log('📊 Translation structure:');
      console.log(`   - Total top-level keys: ${Object.keys(esData.translation_data).length}`);
      console.log(`   - Top-level keys: ${Object.keys(esData.translation_data).join(', ')}`);
      
      // Check specific keys that should exist
      const requiredKeys = ['navigation', 'pages', 'assessment', 'notifications', 'search', 'careers'];
      requiredKeys.forEach(key => {
        const exists = esData.translation_data[key] !== undefined;
        const type = typeof esData.translation_data[key];
        const keyCount = exists && type === 'object' ? Object.keys(esData.translation_data[key]).length : 'N/A';
        console.log(`   - ${key}: ${exists ? `✅ (${type}, ${keyCount} sub-keys)` : '❌ Missing'}`);
      });

      // Check navigation specifically
      if (esData.translation_data.navigation) {
        console.log('\n🧭 Navigation keys:');
        Object.entries(esData.translation_data.navigation).forEach(([key, value]) => {
          console.log(`   - ${key}: "${value}"`);
        });
      }

      // Check pages specifically
      if (esData.translation_data.pages) {
        console.log('\n📄 Pages keys:');
        Object.keys(esData.translation_data.pages).forEach(key => {
          console.log(`   - ${key}: ${typeof esData.translation_data.pages[key]}`);
        });
      }
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
      console.log('📊 Translation structure:');
      console.log(`   - Total top-level keys: ${Object.keys(jaData.translation_data).length}`);
      console.log(`   - Top-level keys: ${Object.keys(jaData.translation_data).join(', ')}`);
      
      // Check navigation specifically
      if (jaData.translation_data.navigation) {
        console.log('\n🧭 Navigation keys:');
        Object.entries(jaData.translation_data.navigation).forEach(([key, value]) => {
          console.log(`   - ${key}: "${value}"`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error during translation debugging:', error);
  }
}

// Run the debug
debugTranslationLoading();
