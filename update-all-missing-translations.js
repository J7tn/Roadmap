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

// Complete translations for all languages
const completeTranslations = {
  en: {
    "pages.roadmap.loadingRoadmap": "Loading your career roadmap...",
    "pages.roadmap.tryAgain": "Try Again",
    "pages.roadmap.exploreCareers": "Explore Careers",
    "pages.roadmap.selectCurrentCareer": "Select your current career to begin planning your professional journey",
    "pages.roadmap.failedToLoadData": "Failed to load career data",
    "assessment.selectSkills": "Select the skills you're proficient in. You can add custom skills too.",
    "assessment.selectRelevantSkills": "Select relevant skills from this category",
    "assessment.selectCareerDirection": "Select the career direction that interests you most.",
    "assessment.failedToGenerateRecommendations": "Failed to generate recommendations",
    "assessment.tryAgain": "Try Again",
    "notifications.filter": "Filter",
    "notifications.allNotifications": "All Notifications",
    "notifications.personalizedNotifications": "Personalized",
    "notifications.generalNotifications": "General"
  },
  es: {
    "pages.roadmap.loadingRoadmap": "Cargando tu hoja de ruta profesional...",
    "pages.roadmap.tryAgain": "Intentar de nuevo",
    "pages.roadmap.exploreCareers": "Explorar Carreras",
    "pages.roadmap.selectCurrentCareer": "Selecciona tu carrera actual para comenzar a planificar tu viaje profesional",
    "pages.roadmap.failedToLoadData": "Error al cargar los datos de carrera",
    "assessment.selectSkills": "Selecciona las habilidades en las que eres competente. También puedes agregar habilidades personalizadas.",
    "assessment.selectRelevantSkills": "Selecciona habilidades relevantes de esta categoría",
    "assessment.selectCareerDirection": "Selecciona la dirección profesional que más te interese.",
    "assessment.failedToGenerateRecommendations": "Error al generar recomendaciones",
    "assessment.tryAgain": "Intentar de nuevo",
    "notifications.filter": "Filtrar",
    "notifications.allNotifications": "Todas las Notificaciones",
    "notifications.personalizedNotifications": "Personalizadas",
    "notifications.generalNotifications": "Generales"
  },
  fr: {
    "pages.roadmap.loadingRoadmap": "Chargement de votre feuille de route professionnelle...",
    "pages.roadmap.tryAgain": "Réessayer",
    "pages.roadmap.exploreCareers": "Explorer les Carrières",
    "pages.roadmap.selectCurrentCareer": "Sélectionnez votre carrière actuelle pour commencer à planifier votre parcours professionnel",
    "pages.roadmap.failedToLoadData": "Échec du chargement des données de carrière",
    "assessment.selectSkills": "Sélectionnez les compétences dans lesquelles vous êtes compétent. Vous pouvez également ajouter des compétences personnalisées.",
    "assessment.selectRelevantSkills": "Sélectionnez les compétences pertinentes de cette catégorie",
    "assessment.selectCareerDirection": "Sélectionnez la direction de carrière qui vous intéresse le plus.",
    "assessment.failedToGenerateRecommendations": "Échec de la génération de recommandations",
    "assessment.tryAgain": "Réessayer",
    "notifications.filter": "Filtrer",
    "notifications.allNotifications": "Toutes les Notifications",
    "notifications.personalizedNotifications": "Personnalisées",
    "notifications.generalNotifications": "Générales"
  },
  de: {
    "pages.roadmap.loadingRoadmap": "Ihre Karriere-Roadmap wird geladen...",
    "pages.roadmap.tryAgain": "Erneut versuchen",
    "pages.roadmap.exploreCareers": "Karrieren erkunden",
    "pages.roadmap.selectCurrentCareer": "Wählen Sie Ihre aktuelle Karriere aus, um Ihre berufliche Reise zu planen",
    "pages.roadmap.failedToLoadData": "Fehler beim Laden der Karrieredaten",
    "assessment.selectSkills": "Wählen Sie die Fähigkeiten aus, in denen Sie kompetent sind. Sie können auch benutzerdefinierte Fähigkeiten hinzufügen.",
    "assessment.selectRelevantSkills": "Wählen Sie relevante Fähigkeiten aus dieser Kategorie aus",
    "assessment.selectCareerDirection": "Wählen Sie die Karriererichtung aus, die Sie am meisten interessiert.",
    "assessment.failedToGenerateRecommendations": "Fehler beim Generieren von Empfehlungen",
    "assessment.tryAgain": "Erneut versuchen",
    "notifications.filter": "Filtern",
    "notifications.allNotifications": "Alle Benachrichtigungen",
    "notifications.personalizedNotifications": "Personalisierte",
    "notifications.generalNotifications": "Allgemeine"
  },
  pt: {
    "pages.roadmap.loadingRoadmap": "Carregando seu roteiro de carreira...",
    "pages.roadmap.tryAgain": "Tentar novamente",
    "pages.roadmap.exploreCareers": "Explorar Carreiras",
    "pages.roadmap.selectCurrentCareer": "Selecione sua carreira atual para começar a planejar sua jornada profissional",
    "pages.roadmap.failedToLoadData": "Falha ao carregar dados de carreira",
    "assessment.selectSkills": "Selecione as habilidades em que você é competente. Você também pode adicionar habilidades personalizadas.",
    "assessment.selectRelevantSkills": "Selecione habilidades relevantes desta categoria",
    "assessment.selectCareerDirection": "Selecione a direção de carreira que mais lhe interessa.",
    "assessment.failedToGenerateRecommendations": "Falha ao gerar recomendações",
    "assessment.tryAgain": "Tentar novamente",
    "notifications.filter": "Filtrar",
    "notifications.allNotifications": "Todas as Notificações",
    "notifications.personalizedNotifications": "Personalizadas",
    "notifications.generalNotifications": "Gerais"
  },
  ja: {
    "pages.roadmap.loadingRoadmap": "キャリアロードマップを読み込み中...",
    "pages.roadmap.tryAgain": "再試行",
    "pages.roadmap.exploreCareers": "キャリアを探索",
    "pages.roadmap.selectCurrentCareer": "現在のキャリアを選択して、プロフェッショナルな旅路の計画を始めましょう",
    "pages.roadmap.failedToLoadData": "キャリアデータの読み込みに失敗しました",
    "assessment.selectSkills": "あなたが得意なスキルを選択してください。カスタムスキルも追加できます。",
    "assessment.selectRelevantSkills": "このカテゴリから関連するスキルを選択してください",
    "assessment.selectCareerDirection": "最も興味のあるキャリアの方向性を選択してください。",
    "assessment.failedToGenerateRecommendations": "推奨事項の生成に失敗しました",
    "assessment.tryAgain": "再試行",
    "notifications.filter": "フィルター",
    "notifications.allNotifications": "すべての通知",
    "notifications.personalizedNotifications": "パーソナライズ",
    "notifications.generalNotifications": "一般"
  },
  ko: {
    "pages.roadmap.loadingRoadmap": "커리어 로드맵을 로딩 중...",
    "pages.roadmap.tryAgain": "다시 시도",
    "pages.roadmap.exploreCareers": "커리어 탐색",
    "pages.roadmap.selectCurrentCareer": "현재 커리어를 선택하여 전문적인 여정 계획을 시작하세요",
    "pages.roadmap.failedToLoadData": "커리어 데이터 로딩 실패",
    "assessment.selectSkills": "숙련된 기술을 선택하세요. 사용자 정의 기술도 추가할 수 있습니다.",
    "assessment.selectRelevantSkills": "이 카테고리에서 관련 기술을 선택하세요",
    "assessment.selectCareerDirection": "가장 관심 있는 커리어 방향을 선택하세요.",
    "assessment.failedToGenerateRecommendations": "추천사항 생성 실패",
    "assessment.tryAgain": "다시 시도",
    "notifications.filter": "필터",
    "notifications.allNotifications": "모든 알림",
    "notifications.personalizedNotifications": "개인화",
    "notifications.generalNotifications": "일반"
  },
  zh: {
    "pages.roadmap.loadingRoadmap": "正在加载您的职业路线图...",
    "pages.roadmap.tryAgain": "重试",
    "pages.roadmap.exploreCareers": "探索职业",
    "pages.roadmap.selectCurrentCareer": "选择您当前的职业，开始规划您的专业旅程",
    "pages.roadmap.failedToLoadData": "加载职业数据失败",
    "assessment.selectSkills": "选择您精通的技能。您也可以添加自定义技能。",
    "assessment.selectRelevantSkills": "从此类别中选择相关技能",
    "assessment.selectCareerDirection": "选择您最感兴趣的职业方向。",
    "assessment.failedToGenerateRecommendations": "生成推荐失败",
    "assessment.tryAgain": "重试",
    "notifications.filter": "过滤器",
    "notifications.allNotifications": "所有通知",
    "notifications.personalizedNotifications": "个性化",
    "notifications.generalNotifications": "一般"
  },
  ru: {
    "pages.roadmap.loadingRoadmap": "Загрузка вашей карьерной дорожной карты...",
    "pages.roadmap.tryAgain": "Попробовать снова",
    "pages.roadmap.exploreCareers": "Исследовать карьеры",
    "pages.roadmap.selectCurrentCareer": "Выберите вашу текущую карьеру, чтобы начать планирование вашего профессионального пути",
    "pages.roadmap.failedToLoadData": "Ошибка загрузки данных карьеры",
    "assessment.selectSkills": "Выберите навыки, в которых вы компетентны. Вы также можете добавить пользовательские навыки.",
    "assessment.selectRelevantSkills": "Выберите релевантные навыки из этой категории",
    "assessment.selectCareerDirection": "Выберите направление карьеры, которое вас больше всего интересует.",
    "assessment.failedToGenerateRecommendations": "Ошибка генерации рекомендаций",
    "assessment.tryAgain": "Попробовать снова",
    "notifications.filter": "Фильтр",
    "notifications.allNotifications": "Все уведомления",
    "notifications.personalizedNotifications": "Персонализированные",
    "notifications.generalNotifications": "Общие"
  },
  ar: {
    "pages.roadmap.loadingRoadmap": "جاري تحميل خريطتك المهنية...",
    "pages.roadmap.tryAgain": "حاول مرة أخرى",
    "pages.roadmap.exploreCareers": "استكشف المهن",
    "pages.roadmap.selectCurrentCareer": "اختر مهنتك الحالية لبدء التخطيط لرحلتك المهنية",
    "pages.roadmap.failedToLoadData": "فشل في تحميل بيانات المهنة",
    "assessment.selectSkills": "اختر المهارات التي تجيدها. يمكنك أيضاً إضافة مهارات مخصصة.",
    "assessment.selectRelevantSkills": "اختر المهارات ذات الصلة من هذه الفئة",
    "assessment.selectCareerDirection": "اختر اتجاه المهنة الذي يهمك أكثر.",
    "assessment.failedToGenerateRecommendations": "فشل في توليد التوصيات",
    "assessment.tryAgain": "حاول مرة أخرى",
    "notifications.filter": "مرشح",
    "notifications.allNotifications": "جميع الإشعارات",
    "notifications.personalizedNotifications": "مخصصة",
    "notifications.generalNotifications": "عامة"
  },
  it: {
    "pages.roadmap.loadingRoadmap": "Caricamento della tua roadmap di carriera...",
    "pages.roadmap.tryAgain": "Riprova",
    "pages.roadmap.exploreCareers": "Esplora Carriere",
    "pages.roadmap.selectCurrentCareer": "Seleziona la tua carriera attuale per iniziare a pianificare il tuo percorso professionale",
    "pages.roadmap.failedToLoadData": "Errore nel caricamento dei dati di carriera",
    "assessment.selectSkills": "Seleziona le competenze in cui sei competente. Puoi anche aggiungere competenze personalizzate.",
    "assessment.selectRelevantSkills": "Seleziona competenze rilevanti da questa categoria",
    "assessment.selectCareerDirection": "Seleziona la direzione di carriera che ti interessa di più.",
    "assessment.failedToGenerateRecommendations": "Errore nella generazione di raccomandazioni",
    "assessment.tryAgain": "Riprova",
    "notifications.filter": "Filtra",
    "notifications.allNotifications": "Tutte le Notifiche",
    "notifications.personalizedNotifications": "Personalizzate",
    "notifications.generalNotifications": "Generali"
  }
};

async function updateMissingTranslations() {
  console.log('🌍 Updating all missing translations for all languages...');

  try {
    for (const [languageCode, translations] of Object.entries(completeTranslations)) {
      console.log(`\n📝 Processing ${languageCode.toUpperCase()} translations...`);
      
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
      
      // Merge new translations
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
        console.log(`✅ Updated ${Object.keys(translations).length} translations for ${languageCode}`);
        console.log(`   - Roadmap translations: ${Object.keys(translations).filter(k => k.includes('roadmap')).length}`);
        console.log(`   - Assessment translations: ${Object.keys(translations).filter(k => k.includes('assessment')).length}`);
        console.log(`   - Notifications translations: ${Object.keys(translations).filter(k => k.includes('notifications')).length}`);
      }
    }

    console.log('\n✅ All missing translations update completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${Object.keys(completeTranslations).length} languages updated`);
    console.log(`   - ${Object.keys(completeTranslations.en).length} translation keys per language`);
    console.log(`   - Total: ${Object.keys(completeTranslations).length * Object.keys(completeTranslations.en).length} translations added`);

  } catch (error) {
    console.error('❌ Error during missing translations update:', error);
  }
}

// Run the update
updateMissingTranslations();
