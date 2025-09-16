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

// Missing settings translation keys
const missingSettingsKeys = {
  "settings.customizeLookFeel": {
    en: "Customize the look and feel of the app",
    es: "Personaliza la apariencia y sensación de la aplicación",
    ja: "アプリの外観と感触をカスタマイズ"
  },
  "settings.darkMode": {
    en: "Dark Mode",
    es: "Modo Oscuro",
    ja: "ダークモード"
  },
  "settings.switchThemes": {
    en: "Switch between light and dark themes",
    es: "Cambiar entre temas claro y oscuro",
    ja: "ライトテーマとダークテーマを切り替え"
  },
  "settings.about": {
    en: "About",
    es: "Acerca de",
    ja: "について"
  },
  "settings.lastUpdated": {
    en: "Last updated",
    es: "Última actualización",
    ja: "最終更新"
  }
};

async function updateSettingsTranslations() {
  console.log('🔧 Updating settings translations...');

  try {
    // Get all existing translations
    const { data: existingTranslations, error: fetchError } = await supabase
      .from('translations')
      .select('language_code, translation_data');

    if (fetchError) {
      console.error('❌ Error fetching existing translations:', fetchError);
      return;
    }

    console.log(`📝 Found ${existingTranslations.length} existing translation records`);

    for (const translation of existingTranslations) {
      const languageCode = translation.language_code;
      const translationData = translation.translation_data;
      
      console.log(`\n🔍 Processing ${languageCode.toUpperCase()} translations...`);
      
      let updated = false;
      
      // Add missing settings keys
      for (const [keyPath, translations] of Object.entries(missingSettingsKeys)) {
        if (translations[languageCode]) {
          // Navigate to the nested object and set the value
          const keys = keyPath.split('.');
          let current = translationData;
          
          // Navigate to the parent object
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }
          
          // Set the final value
          const finalKey = keys[keys.length - 1];
          if (!current[finalKey]) {
            current[finalKey] = translations[languageCode];
            updated = true;
            console.log(`   ✅ Added: ${keyPath} = "${translations[languageCode]}"`);
          }
        }
      }
      
      if (updated) {
        // Update the translation record
        const { error: updateError } = await supabase
          .from('translations')
          .update({
            translation_data: translationData,
            updated_at: new Date().toISOString()
          })
          .eq('language_code', languageCode);

        if (updateError) {
          console.error(`❌ Error updating ${languageCode} translations:`, updateError);
        } else {
          console.log(`✅ Updated ${languageCode} translations successfully`);
        }
      } else {
        console.log(`   ℹ️  No updates needed for ${languageCode}`);
      }
    }

    console.log('\n✅ Settings translations update completed successfully!');

  } catch (error) {
    console.error('❌ Error during settings translations update:', error);
  }
}

// Run the update
updateSettingsTranslations();
