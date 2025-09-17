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

// Last updated translations for all languages
const lastUpdatedTranslations = {
  en: "Last updated:",
  es: "Última actualización:",
  ja: "最終更新:",
  fr: "Dernière mise à jour:",
  de: "Zuletzt aktualisiert:",
  pt: "Última atualização:",
  it: "Ultimo aggiornamento:",
  ko: "마지막 업데이트:",
  zh: "最后更新:",
  ru: "Последнее обновление:",
  ar: "آخر تحديث:"
};

async function addLastUpdatedTranslations() {
  console.log('🕒 Adding "last updated" translations to all languages...');

  try {
    for (const [languageCode, translation] of Object.entries(lastUpdatedTranslations)) {
      console.log(`\n📝 Updating ${languageCode} with last updated translation...`);
      
      // Get existing translation data
      const { data: existingData, error: fetchError } = await supabase
        .from('translations')
        .select('translation_data')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`❌ Error fetching existing ${languageCode} data:`, fetchError);
        continue;
      }

      // Merge with existing data
      const existingTranslations = existingData?.translation_data || {};
      
      // Ensure marketTrends section exists
      if (!existingTranslations.marketTrends) {
        existingTranslations.marketTrends = {};
      }
      
      // Add lastUpdated translation
      existingTranslations.marketTrends.lastUpdated = translation;
      console.log(`  ✅ Added marketTrends.lastUpdated: "${translation}"`);

      // First try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('translations')
        .update({
          translation_data: existingTranslations,
          version: Date.now().toString(),
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('language_code', languageCode)
        .select();

      if (updateError || !updateData || updateData.length === 0) {
        // If update failed, try to insert new record
        console.log(`📝 No existing record found for ${languageCode}, inserting new record...`);
        
        const { error: insertError } = await supabase
          .from('translations')
          .insert({
            language_code: languageCode,
            translation_data: existingTranslations,
            version: Date.now().toString(),
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error(`❌ Error inserting ${languageCode}:`, insertError);
        } else {
          console.log(`✅ Successfully inserted ${languageCode} with last updated translation`);
        }
      } else {
        console.log(`✅ Successfully updated ${languageCode} with last updated translation`);
      }
    }

    console.log('\n✅ All "last updated" translations added!');

  } catch (error) {
    console.error('❌ Error during translation updates:', error);
  }
}

// Run the update
addLastUpdatedTranslations();
