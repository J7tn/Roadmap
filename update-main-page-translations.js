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

// New translation keys for main page
const newMainPageKeys = {
  "marketTrends.dataUpToDate": {
    en: "Data up to date",
    es: "Datos actualizados",
    ja: "データ最新"
  },
  "marketTrends.updatingData": {
    en: "Updating data...",
    es: "Actualizando datos...",
    ja: "データを更新中..."
  },
  "marketTrends.dataStatus": {
    en: "Data Status",
    es: "Estado de Datos",
    ja: "データステータス"
  },
  "marketTrends.refresh": {
    en: "Refresh",
    es: "Actualizar",
    ja: "更新"
  },
  "marketTrends.trendingData": {
    en: "Trending Data",
    es: "Datos de Tendencias",
    ja: "トレンドデータ"
  },
  "marketTrends.careerData": {
    en: "Career Data",
    es: "Datos de Carrera",
    ja: "キャリアデータ"
  },
  "marketTrends.dataUpdateInfo": {
    en: "Data is updated monthly by our AI system.",
    es: "Los datos se actualizan mensualmente por nuestro sistema de IA.",
    ja: "データは月次でAIシステムによって更新されます。"
  },
  "marketTrends.dataFallbackInfo": {
    en: "Your app remembers the most recent data even when updates fail.",
    es: "Tu aplicación recuerda los datos más recientes incluso cuando las actualizaciones fallan.",
    ja: "更新に失敗した場合でも、アプリは最新のデータを記憶します。"
  },
  "marketTrends.careerTransitionOpportunities": {
    en: "Career Transition Opportunities",
    es: "Oportunidades de Transición Profesional",
    ja: "キャリア移行機会"
  },
  "marketTrends.autoUpdatingTrends": {
    en: "Auto-updating career trends monthly",
    es: "Actualización automática de tendencias profesionales mensualmente",
    ja: "キャリアトレンドを月次で自動更新"
  }
};

async function updateMainPageTranslations() {
  console.log('🔧 Updating main page translations...');

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
      
      // Add new main page keys
      for (const [keyPath, translations] of Object.entries(newMainPageKeys)) {
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

    console.log('\n✅ Main page translations update completed successfully!');

  } catch (error) {
    console.error('❌ Error during main page translations update:', error);
  }
}

// Run the update
updateMainPageTranslations();
