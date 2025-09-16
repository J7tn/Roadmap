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
    "pages.roadmap.yourCareerTransitionOptions": "Your Career Transition Options",
    "pages.roadmap.basedOnCurrentRole": "Based on your current role as {role}, here are potential career paths to explore",
    "pages.roadmap.lateralCareerMove": "Lateral Career Move",
    "pages.roadmap.numberOfOptions": "A number of options",
    "pages.roadmap.exploreSimilarRoles": "Explore similar roles at your current level",
    "pages.roadmap.skillBasedTransitions": "Skill Based Transitions",
    "pages.roadmap.yourRoadmapProgress": "Your Roadmap Progress",
    "pages.roadmap.noResultsFound": "No results found",
    "pages.roadmap.searchCareers": "Search careers",
    "pages.roadmap.filters": "Filters",
    "search.allIndustries": "All Industries",
    "search.allLevels": "All Levels",
    "search.entryLevel": "Entry Level",
    "search.midLevel": "Mid Level",
    "search.seniorLevel": "Senior Level",
    "search.expertLevel": "Expert Level"
  },
  es: {
    "pages.roadmap.yourCareerTransitionOptions": "Tus Opciones de Transición Profesional",
    "pages.roadmap.basedOnCurrentRole": "Basado en tu rol actual como {role}, aquí tienes rutas profesionales potenciales para explorar",
    "pages.roadmap.lateralCareerMove": "Movimiento Profesional Lateral",
    "pages.roadmap.numberOfOptions": "Varias opciones",
    "pages.roadmap.exploreSimilarRoles": "Explora roles similares en tu nivel actual",
    "pages.roadmap.skillBasedTransitions": "Transiciones Basadas en Habilidades",
    "pages.roadmap.yourRoadmapProgress": "Tu Progreso del Roadmap",
    "pages.roadmap.noResultsFound": "No se encontraron resultados",
    "pages.roadmap.searchCareers": "Buscar carreras",
    "pages.roadmap.filters": "Filtros",
    "search.allIndustries": "Todas las Industrias",
    "search.allLevels": "Todos los Niveles",
    "search.entryLevel": "Nivel de Entrada",
    "search.midLevel": "Nivel Medio",
    "search.seniorLevel": "Nivel Senior",
    "search.expertLevel": "Nivel Experto"
  },
  fr: {
    "pages.roadmap.yourCareerTransitionOptions": "Vos Options de Transition de Carrière",
    "pages.roadmap.basedOnCurrentRole": "Basé sur votre rôle actuel en tant que {role}, voici des parcours professionnels potentiels à explorer",
    "pages.roadmap.lateralCareerMove": "Mouvement de Carrière Latéral",
    "pages.roadmap.numberOfOptions": "Plusieurs options",
    "pages.roadmap.exploreSimilarRoles": "Explorez des rôles similaires à votre niveau actuel",
    "pages.roadmap.skillBasedTransitions": "Transitions Basées sur les Compétences",
    "pages.roadmap.yourRoadmapProgress": "Votre Progrès du Roadmap",
    "pages.roadmap.noResultsFound": "Aucun résultat trouvé",
    "pages.roadmap.searchCareers": "Rechercher des carrières",
    "pages.roadmap.filters": "Filtres",
    "search.allIndustries": "Toutes les Industries",
    "search.allLevels": "Tous les Niveaux",
    "search.entryLevel": "Niveau Débutant",
    "search.midLevel": "Niveau Intermédiaire",
    "search.seniorLevel": "Niveau Senior",
    "search.expertLevel": "Niveau Expert"
  },
  de: {
    "pages.roadmap.yourCareerTransitionOptions": "Ihre Karriereübergangsoptionen",
    "pages.roadmap.basedOnCurrentRole": "Basierend auf Ihrer aktuellen Rolle als {role}, hier sind potenzielle Karrierewege zu erkunden",
    "pages.roadmap.lateralCareerMove": "Seitlicher Karriereschritt",
    "pages.roadmap.numberOfOptions": "Mehrere Optionen",
    "pages.roadmap.exploreSimilarRoles": "Ähnliche Rollen auf Ihrem aktuellen Niveau erkunden",
    "pages.roadmap.skillBasedTransitions": "Fähigkeitsbasierte Übergänge",
    "pages.roadmap.yourRoadmapProgress": "Ihr Roadmap-Fortschritt",
    "pages.roadmap.noResultsFound": "Keine Ergebnisse gefunden",
    "pages.roadmap.searchCareers": "Karrieren suchen",
    "pages.roadmap.filters": "Filter",
    "search.allIndustries": "Alle Branchen",
    "search.allLevels": "Alle Ebenen",
    "search.entryLevel": "Einstiegslevel",
    "search.midLevel": "Mittleres Level",
    "search.seniorLevel": "Senior Level",
    "search.expertLevel": "Expertenlevel"
  },
  pt: {
    "pages.roadmap.yourCareerTransitionOptions": "Suas Opções de Transição de Carreira",
    "pages.roadmap.basedOnCurrentRole": "Com base no seu papel atual como {role}, aqui estão caminhos de carreira potenciais para explorar",
    "pages.roadmap.lateralCareerMove": "Movimento de Carreira Lateral",
    "pages.roadmap.numberOfOptions": "Várias opções",
    "pages.roadmap.exploreSimilarRoles": "Explore papéis similares no seu nível atual",
    "pages.roadmap.skillBasedTransitions": "Transições Baseadas em Habilidades",
    "pages.roadmap.yourRoadmapProgress": "Seu Progresso do Roadmap",
    "pages.roadmap.noResultsFound": "Nenhum resultado encontrado",
    "pages.roadmap.searchCareers": "Buscar carreiras",
    "pages.roadmap.filters": "Filtros",
    "search.allIndustries": "Todas as Indústrias",
    "search.allLevels": "Todos os Níveis",
    "search.entryLevel": "Nível de Entrada",
    "search.midLevel": "Nível Médio",
    "search.seniorLevel": "Nível Sênior",
    "search.expertLevel": "Nível Especialista"
  },
  ja: {
    "pages.roadmap.yourCareerTransitionOptions": "キャリア移行オプション",
    "pages.roadmap.basedOnCurrentRole": "現在の{role}としての役割に基づいて、探索できる潜在的なキャリアパスを以下に示します",
    "pages.roadmap.lateralCareerMove": "横断的キャリア移動",
    "pages.roadmap.numberOfOptions": "複数のオプション",
    "pages.roadmap.exploreSimilarRoles": "現在のレベルで類似の役割を探索する",
    "pages.roadmap.skillBasedTransitions": "スキルベースの移行",
    "pages.roadmap.yourRoadmapProgress": "ロードマップの進捗",
    "pages.roadmap.noResultsFound": "結果が見つかりません",
    "pages.roadmap.searchCareers": "キャリアを検索",
    "pages.roadmap.filters": "フィルター",
    "search.allIndustries": "すべての業界",
    "search.allLevels": "すべてのレベル",
    "search.entryLevel": "エントリーレベル",
    "search.midLevel": "ミドルレベル",
    "search.seniorLevel": "シニアレベル",
    "search.expertLevel": "エキスパートレベル"
  },
  ko: {
    "pages.roadmap.yourCareerTransitionOptions": "커리어 전환 옵션",
    "pages.roadmap.basedOnCurrentRole": "현재 {role} 역할을 기반으로 탐색할 수 있는 잠재적 커리어 경로는 다음과 같습니다",
    "pages.roadmap.lateralCareerMove": "수평적 커리어 이동",
    "pages.roadmap.numberOfOptions": "여러 옵션",
    "pages.roadmap.exploreSimilarRoles": "현재 레벨에서 유사한 역할 탐색",
    "pages.roadmap.skillBasedTransitions": "스킬 기반 전환",
    "pages.roadmap.yourRoadmapProgress": "로드맵 진행 상황",
    "pages.roadmap.noResultsFound": "결과를 찾을 수 없습니다",
    "pages.roadmap.searchCareers": "커리어 검색",
    "pages.roadmap.filters": "필터",
    "search.allIndustries": "모든 산업",
    "search.allLevels": "모든 레벨",
    "search.entryLevel": "엔트리 레벨",
    "search.midLevel": "미드 레벨",
    "search.seniorLevel": "시니어 레벨",
    "search.expertLevel": "전문가 레벨"
  },
  zh: {
    "pages.roadmap.yourCareerTransitionOptions": "职业转换选项",
    "pages.roadmap.basedOnCurrentRole": "基于您当前作为{role}的角色，以下是可探索的潜在职业道路",
    "pages.roadmap.lateralCareerMove": "横向职业移动",
    "pages.roadmap.numberOfOptions": "多个选项",
    "pages.roadmap.exploreSimilarRoles": "探索您当前级别的类似角色",
    "pages.roadmap.skillBasedTransitions": "基于技能的转换",
    "pages.roadmap.yourRoadmapProgress": "您的路线图进度",
    "pages.roadmap.noResultsFound": "未找到结果",
    "pages.roadmap.searchCareers": "搜索职业",
    "pages.roadmap.filters": "过滤器",
    "search.allIndustries": "所有行业",
    "search.allLevels": "所有级别",
    "search.entryLevel": "入门级",
    "search.midLevel": "中级",
    "search.seniorLevel": "高级",
    "search.expertLevel": "专家级"
  },
  ru: {
    "pages.roadmap.yourCareerTransitionOptions": "Ваши варианты карьерного перехода",
    "pages.roadmap.basedOnCurrentRole": "Основываясь на вашей текущей роли как {role}, вот потенциальные карьерные пути для изучения",
    "pages.roadmap.lateralCareerMove": "Боковое карьерное движение",
    "pages.roadmap.numberOfOptions": "Несколько вариантов",
    "pages.roadmap.exploreSimilarRoles": "Изучите похожие роли на вашем текущем уровне",
    "pages.roadmap.skillBasedTransitions": "Переходы на основе навыков",
    "pages.roadmap.yourRoadmapProgress": "Ваш прогресс по дорожной карте",
    "pages.roadmap.noResultsFound": "Результаты не найдены",
    "pages.roadmap.searchCareers": "Поиск карьер",
    "pages.roadmap.filters": "Фильтры",
    "search.allIndustries": "Все отрасли",
    "search.allLevels": "Все уровни",
    "search.entryLevel": "Начальный уровень",
    "search.midLevel": "Средний уровень",
    "search.seniorLevel": "Старший уровень",
    "search.expertLevel": "Экспертный уровень"
  },
  ar: {
    "pages.roadmap.yourCareerTransitionOptions": "خيارات انتقالك المهني",
    "pages.roadmap.basedOnCurrentRole": "بناءً على دورك الحالي كـ {role}، إليك مسارات مهنية محتملة للاستكشاف",
    "pages.roadmap.lateralCareerMove": "حركة مهنية جانبية",
    "pages.roadmap.numberOfOptions": "خيارات متعددة",
    "pages.roadmap.exploreSimilarRoles": "استكشف أدواراً مماثلة في مستواك الحالي",
    "pages.roadmap.skillBasedTransitions": "انتقالات قائمة على المهارات",
    "pages.roadmap.yourRoadmapProgress": "تقدم خريطتك المهنية",
    "pages.roadmap.noResultsFound": "لم يتم العثور على نتائج",
    "pages.roadmap.searchCareers": "البحث عن المهن",
    "pages.roadmap.filters": "المرشحات",
    "search.allIndustries": "جميع الصناعات",
    "search.allLevels": "جميع المستويات",
    "search.entryLevel": "مستوى المبتدئين",
    "search.midLevel": "المستوى المتوسط",
    "search.seniorLevel": "المستوى المتقدم",
    "search.expertLevel": "مستوى الخبير"
  },
  it: {
    "pages.roadmap.yourCareerTransitionOptions": "Le Tue Opzioni di Transizione di Carriera",
    "pages.roadmap.basedOnCurrentRole": "Basato sul tuo ruolo attuale come {role}, ecco percorsi di carriera potenziali da esplorare",
    "pages.roadmap.lateralCareerMove": "Movimento di Carriera Laterale",
    "pages.roadmap.numberOfOptions": "Diverse opzioni",
    "pages.roadmap.exploreSimilarRoles": "Esplora ruoli simili al tuo livello attuale",
    "pages.roadmap.skillBasedTransitions": "Transizioni Basate sulle Competenze",
    "pages.roadmap.yourRoadmapProgress": "Il Tuo Progresso della Roadmap",
    "pages.roadmap.noResultsFound": "Nessun risultato trovato",
    "pages.roadmap.searchCareers": "Cerca carriere",
    "pages.roadmap.filters": "Filtri",
    "search.allIndustries": "Tutte le Industrie",
    "search.allLevels": "Tutti i Livelli",
    "search.entryLevel": "Livello di Ingresso",
    "search.midLevel": "Livello Medio",
    "search.seniorLevel": "Livello Senior",
    "search.expertLevel": "Livello Esperto"
  }
};

async function updateMissingTranslations() {
  console.log('🌍 Updating missing translations for all languages...');

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

      // Update in database
      const { error: updateError } = await supabase
        .from('translations')
        .upsert({
          language_code: languageCode,
          translation_data: updatedData,
          version: '1.0.0',
          is_active: true
        }, {
          onConflict: 'language_code'
        });

      if (updateError) {
        console.error(`❌ Error updating ${languageCode} translations:`, updateError);
      } else {
        console.log(`✅ Updated ${Object.keys(translations).length} translations for ${languageCode}`);
        console.log(`   - Roadmap translations: ${Object.keys(translations).filter(k => k.includes('roadmap')).length}`);
        console.log(`   - Search translations: ${Object.keys(translations).filter(k => k.includes('search')).length}`);
      }
    }

    console.log('\n✅ Missing translations update completed successfully!');
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
