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

async function checkTranslationsTable() {
  console.log('🔍 Checking translations table structure...');

  try {
    // Get all translation records
    const { data: allTranslations, error: allError } = await supabase
      .from('translations')
      .select('*')
      .order('language_code', { ascending: true });

    if (allError) {
      console.error('❌ Error loading all translations:', allError);
      return;
    }

    console.log(`📊 Found ${allTranslations.length} translation records:`);
    
    // Group by language code
    const groupedByLanguage = {};
    allTranslations.forEach(record => {
      if (!groupedByLanguage[record.language_code]) {
        groupedByLanguage[record.language_code] = [];
      }
      groupedByLanguage[record.language_code].push(record);
    });

    // Display grouped results
    Object.entries(groupedByLanguage).forEach(([languageCode, records]) => {
      console.log(`\n🌍 ${languageCode.toUpperCase()} (${records.length} records):`);
      records.forEach((record, index) => {
        console.log(`   ${index + 1}. ID: ${record.id}, Version: ${record.version}, Active: ${record.is_active}, Created: ${record.created_at}`);
        console.log(`      Keys: ${Object.keys(record.translation_data || {}).length} translation keys`);
      });
    });

    // Check for duplicates
    const duplicates = Object.entries(groupedByLanguage).filter(([_, records]) => records.length > 1);
    if (duplicates.length > 0) {
      console.log('\n⚠️  DUPLICATE LANGUAGE CODES FOUND:');
      duplicates.forEach(([languageCode, records]) => {
        console.log(`   ${languageCode}: ${records.length} records`);
      });
      console.log('\n🔧 This is causing the translation loading to fail!');
      console.log('   The app expects only one record per language code.');
    } else {
      console.log('\n✅ No duplicate language codes found.');
    }

  } catch (error) {
    console.error('❌ Error during translations table check:', error);
  }
}

// Run the check
checkTranslationsTable();
