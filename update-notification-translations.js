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

// New notification translation keys
const notificationKeys = {
  "notifications.personalizedForYou": {
    en: "Personalized for you:",
    es: "Personalizado para ti:",
    ja: "あなた用にパーソナライズ:"
  },
  "notifications.viewAll": {
    en: "View All",
    es: "Ver Todo",
    ja: "すべて表示"
  },
  "notifications.noNotificationsDescription": {
    en: "We'll notify you when there are updates relevant to your career interests.",
    es: "Te notificaremos cuando haya actualizaciones relevantes para tus intereses profesionales.",
    ja: "あなたのキャリアの興味に関連する更新があるときに通知します。"
  },
  "notifications.markAsRead": {
    en: "Mark as read",
    es: "Marcar como leído",
    ja: "既読にする"
  },
  "notifications.delete": {
    en: "Delete",
    es: "Eliminar",
    ja: "削除"
  },
  "notifications.careerUpdate": {
    en: "Career Update",
    es: "Actualización de Carrera",
    ja: "キャリア更新"
  },
  "notifications.skillDevelopmentOpportunity": {
    en: "Skill Development Opportunity",
    es: "Oportunidad de Desarrollo de Habilidades",
    ja: "スキル開発の機会"
  },
  "notifications.newJobOpportunities": {
    en: "New Job Opportunities",
    es: "Nuevas Oportunidades de Trabajo",
    ja: "新しい求人機会"
  },
  "notifications.careerPathCompleted": {
    en: "Career Path Completed!",
    es: "¡Ruta de Carrera Completada!",
    ja: "キャリアパス完了！"
  },
  "notifications.greatProgress": {
    en: "Great Progress!",
    es: "¡Excelente Progreso!",
    ja: "素晴らしい進歩！"
  },
  "notifications.newTrendingSkills": {
    en: "New trending skills for {{career}}: {{skills}}",
    es: "Nuevas habilidades en tendencia para {{career}}: {{skills}}",
    ja: "{{career}}の新しいトレンドスキル: {{skills}}"
  },
  "notifications.learnSkillToAdvance": {
    en: "Learn {{skill}} to advance in {{careers}}",
    es: "Aprende {{skill}} para avanzar en {{careers}}",
    ja: "{{careers}}で進歩するために{{skill}}を学ぶ"
  },
  "notifications.newPositionsAvailable": {
    en: "New {{career}} positions available in your area",
    es: "Nuevas posiciones de {{career}} disponibles en tu área",
    ja: "あなたの地域で新しい{{career}}のポジションが利用可能"
  },
  "notifications.careerPathCompletedMessage": {
    en: "You've completed the {{pathName}} career path!",
    es: "¡Has completado la ruta de carrera {{pathName}}!",
    ja: "{{pathName}}のキャリアパスを完了しました！"
  },
  "notifications.careerPathProgressMessage": {
    en: "You're {{percentage}}% through the {{pathName}} career path",
    es: "Estás al {{percentage}}% de la ruta de carrera {{pathName}}",
    ja: "{{pathName}}のキャリアパスを{{percentage}}%完了しています"
  },
  "notifications.justNow": {
    en: "Just now",
    es: "Ahora mismo",
    ja: "たった今"
  },
  "notifications.minutesAgo": {
    en: "{{minutes}}m ago",
    es: "hace {{minutes}}m",
    ja: "{{minutes}}分前"
  },
  "notifications.hoursAgo": {
    en: "{{hours}}h ago",
    es: "hace {{hours}}h",
    ja: "{{hours}}時間前"
  },
  "notifications.daysAgo": {
    en: "{{days}}d ago",
    es: "hace {{days}}d",
    ja: "{{days}}日前"
  }
};

async function updateNotificationTranslations() {
  console.log('🔧 Updating notification translations...');

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
      
      // Add missing notification keys
      for (const [keyPath, translations] of Object.entries(notificationKeys)) {
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

    console.log('\n✅ Notification translations update completed successfully!');

  } catch (error) {
    console.error('❌ Error during notification translations update:', error);
  }
}

// Run the update
updateNotificationTranslations();
