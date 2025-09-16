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

// All new translation keys
const newTranslationKeys = {
  "pages.search.filterByIndustry": {
    en: "Filter by Industry",
    es: "Filtrar por Industria",
    ja: "業界でフィルター"
  },
  "pages.roadmap.setAsNextGoal": {
    en: "Set as Next Goal",
    es: "Establecer como Siguiente Meta",
    ja: "次の目標として設定"
  },
  "pages.roadmap.setAsTargetCareer": {
    en: "Set as Target Career",
    es: "Establecer como Carrera Objetivo",
    ja: "目標キャリアとして設定"
  },
  "pages.jobDetails.title": {
    en: "Job Details",
    es: "Detalles del Trabajo",
    ja: "求人詳細"
  },
  "pages.jobDetails.loadingCareerDetails": {
    en: "Loading career details...",
    es: "Cargando detalles de la carrera...",
    ja: "キャリア詳細を読み込み中..."
  },
  "pages.jobDetails.careerNotFound": {
    en: "Career not found",
    es: "Carrera no encontrada",
    ja: "キャリアが見つかりません"
  },
  "pages.jobDetails.backToCareers": {
    en: "Back to Careers",
    es: "Volver a Carreras",
    ja: "キャリアに戻る"
  }
};

async function updateAllTranslations() {
  console.log('🔧 Updating all final translations...');

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
      
      // Add missing translation keys
      for (const [keyPath, translations] of Object.entries(newTranslationKeys)) {
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

    console.log('\n✅ All final translations update completed successfully!');

  } catch (error) {
    console.error('❌ Error during translations update:', error);
  }
}

// Run the update
updateAllTranslations();
