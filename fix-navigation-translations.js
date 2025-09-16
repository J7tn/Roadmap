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

// Navigation translations for all languages
const navigationTranslations = {
  en: { "navigation.assessment": "Skills" },
  es: { "navigation.assessment": "Habilidades" },
  fr: { "navigation.assessment": "Compétences" },
  de: { "navigation.assessment": "Fähigkeiten" },
  pt: { "navigation.assessment": "Habilidades" },
  ja: { "navigation.assessment": "スキル" },
  ko: { "navigation.assessment": "기술" },
  zh: { "navigation.assessment": "技能" },
  ru: { "navigation.assessment": "Навыки" },
  ar: { "navigation.assessment": "المهارات" },
  it: { "navigation.assessment": "Competenze" }
};

async function updateNavigationTranslations() {
  console.log('🔧 Fixing navigation translations for all languages...');

  try {
    for (const [languageCode, translations] of Object.entries(navigationTranslations)) {
      console.log(`\n📝 Processing ${languageCode.toUpperCase()} navigation translations...`);
      
      // Get current translation data
      const { data: currentData, error: fetchError } = await supabase
        .from('translations')
        .select('translation_data')
        .eq('language_code', languageCode)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(`❌ Error fetching ${languageCode} translations:`, fetchError);
        continue;
      }

      let updatedData = currentData?.translation_data || {};
      
      // Merge navigation translations
      Object.entries(translations).forEach(([key, value]) => {
        updatedData[key] = value;
      });

      // Update existing record
      const { error: updateError } = await supabase
        .from('translations')
        .update({
          translation_data: updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('language_code', languageCode);

      if (updateError) {
        console.error(`❌ Error updating ${languageCode} translations:`, updateError);
      } else {
        console.log(`✅ Updated navigation translation for ${languageCode}: "${translations['navigation.assessment']}"`);
      }
    }

    console.log('\n✅ Navigation translations update completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${Object.keys(navigationTranslations).length} languages updated`);
    console.log(`   - Navigation key "assessment" changed to "Skills" in all languages`);

  } catch (error) {
    console.error('❌ Error during navigation translations update:', error);
  }
}

// Run the update
updateNavigationTranslations();
