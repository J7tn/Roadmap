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

// Search page translations for all languages
const searchPageTranslations = {
  en: {
    title: "Search Careers",
    placeholder: "Search for careers...",
    loadingCareers: "Loading careers...",
    filters: "Filters",
    industry: "Industry",
    allIndustries: "All Industries",
    experience: "Experience Level",
    allLevels: "All Levels",
    entryLevel: "Entry Level",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert",
    noResults: "No careers found",
    tryAdjustingSearch: "Try adjusting your search or filters",
    clearSearch: "Clear Search",
    careersFound: "careers found",
    careerFound: "career found"
  },
  es: {
    title: "Buscar Carreras",
    placeholder: "Buscar carreras...",
    loadingCareers: "Cargando carreras...",
    filters: "Filtros",
    industry: "Industria",
    allIndustries: "Todas las Industrias",
    experience: "Nivel de Experiencia",
    allLevels: "Todos los Niveles",
    entryLevel: "Nivel de Entrada",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    expert: "Experto",
    noResults: "No se encontraron carreras",
    tryAdjustingSearch: "Intenta ajustar tu búsqueda o filtros",
    clearSearch: "Limpiar Búsqueda",
    careersFound: "carreras encontradas",
    careerFound: "carrera encontrada"
  },
  ja: {
    title: "キャリア検索",
    placeholder: "キャリアを検索...",
    loadingCareers: "キャリアを読み込み中...",
    filters: "フィルター",
    industry: "業界",
    allIndustries: "すべての業界",
    experience: "経験レベル",
    allLevels: "すべてのレベル",
    entryLevel: "エントリーレベル",
    intermediate: "中級",
    advanced: "上級",
    expert: "エキスパート",
    noResults: "キャリアが見つかりません",
    tryAdjustingSearch: "検索またはフィルターを調整してみてください",
    clearSearch: "検索をクリア",
    careersFound: "件のキャリアが見つかりました",
    careerFound: "件のキャリアが見つかりました"
  },
  fr: {
    title: "Rechercher des Carrières",
    placeholder: "Rechercher des carrières...",
    loadingCareers: "Chargement des carrières...",
    filters: "Filtres",
    industry: "Industrie",
    allIndustries: "Toutes les Industries",
    experience: "Niveau d'Expérience",
    allLevels: "Tous les Niveaux",
    entryLevel: "Niveau Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    expert: "Expert",
    noResults: "Aucune carrière trouvée",
    tryAdjustingSearch: "Essayez d'ajuster votre recherche ou vos filtres",
    clearSearch: "Effacer la Recherche",
    careersFound: "carrières trouvées",
    careerFound: "carrière trouvée"
  },
  de: {
    title: "Karrieren Suchen",
    placeholder: "Karrieren suchen...",
    loadingCareers: "Karrieren werden geladen...",
    filters: "Filter",
    industry: "Branche",
    allIndustries: "Alle Branchen",
    experience: "Erfahrungsstufe",
    allLevels: "Alle Stufen",
    entryLevel: "Einsteiger",
    intermediate: "Mittelstufe",
    advanced: "Fortgeschritten",
    expert: "Experte",
    noResults: "Keine Karrieren gefunden",
    tryAdjustingSearch: "Versuchen Sie, Ihre Suche oder Filter anzupassen",
    clearSearch: "Suche Löschen",
    careersFound: "Karrieren gefunden",
    careerFound: "Karriere gefunden"
  },
  pt: {
    title: "Buscar Carreiras",
    placeholder: "Buscar carreiras...",
    loadingCareers: "Carregando carreiras...",
    filters: "Filtros",
    industry: "Indústria",
    allIndustries: "Todas as Indústrias",
    experience: "Nível de Experiência",
    allLevels: "Todos os Níveis",
    entryLevel: "Nível Inicial",
    intermediate: "Intermediário",
    advanced: "Avançado",
    expert: "Especialista",
    noResults: "Nenhuma carreira encontrada",
    tryAdjustingSearch: "Tente ajustar sua pesquisa ou filtros",
    clearSearch: "Limpar Pesquisa",
    careersFound: "carreiras encontradas",
    careerFound: "carreira encontrada"
  },
  it: {
    title: "Cerca Carriere",
    placeholder: "Cerca carriere...",
    loadingCareers: "Caricamento carriere...",
    filters: "Filtri",
    industry: "Settore",
    allIndustries: "Tutti i Settori",
    experience: "Livello di Esperienza",
    allLevels: "Tutti i Livelli",
    entryLevel: "Livello Base",
    intermediate: "Intermedio",
    advanced: "Avanzato",
    expert: "Esperto",
    noResults: "Nessuna carriera trovata",
    tryAdjustingSearch: "Prova ad aggiustare la tua ricerca o i filtri",
    clearSearch: "Cancella Ricerca",
    careersFound: "carriere trovate",
    careerFound: "carriera trovata"
  },
  ko: {
    title: "캐리어 검색",
    placeholder: "캐리어 검색...",
    loadingCareers: "캐리어 로딩 중...",
    filters: "필터",
    industry: "산업",
    allIndustries: "모든 산업",
    experience: "경험 수준",
    allLevels: "모든 수준",
    entryLevel: "초급",
    intermediate: "중급",
    advanced: "고급",
    expert: "전문가",
    noResults: "캐리어를 찾을 수 없습니다",
    tryAdjustingSearch: "검색어나 필터를 조정해보세요",
    clearSearch: "검색 지우기",
    careersFound: "개의 캐리어를 찾았습니다",
    careerFound: "개의 캐리어를 찾았습니다"
  },
  zh: {
    title: "搜索职业",
    placeholder: "搜索职业...",
    loadingCareers: "正在加载职业...",
    filters: "筛选",
    industry: "行业",
    allIndustries: "所有行业",
    experience: "经验水平",
    allLevels: "所有水平",
    entryLevel: "入门级",
    intermediate: "中级",
    advanced: "高级",
    expert: "专家",
    noResults: "未找到职业",
    tryAdjustingSearch: "尝试调整您的搜索或筛选条件",
    clearSearch: "清除搜索",
    careersFound: "个职业",
    careerFound: "个职业"
  },
  ru: {
    title: "Поиск Карьеры",
    placeholder: "Поиск карьеры...",
    loadingCareers: "Загрузка карьеры...",
    filters: "Фильтры",
    industry: "Отрасль",
    allIndustries: "Все Отрасли",
    experience: "Уровень Опыта",
    allLevels: "Все Уровни",
    entryLevel: "Начальный",
    intermediate: "Средний",
    advanced: "Продвинутый",
    expert: "Эксперт",
    noResults: "Карьера не найдена",
    tryAdjustingSearch: "Попробуйте изменить поиск или фильтры",
    clearSearch: "Очистить Поиск",
    careersFound: "карьер найдено",
    careerFound: "карьера найдена"
  },
  ar: {
    title: "البحث عن المهن",
    placeholder: "البحث عن المهن...",
    loadingCareers: "جاري تحميل المهن...",
    filters: "المرشحات",
    industry: "الصناعة",
    allIndustries: "جميع الصناعات",
    experience: "مستوى الخبرة",
    allLevels: "جميع المستويات",
    entryLevel: "مستوى المبتدئين",
    intermediate: "متوسط",
    advanced: "متقدم",
    expert: "خبير",
    noResults: "لم يتم العثور على مهن",
    tryAdjustingSearch: "حاول تعديل البحث أو المرشحات",
    clearSearch: "مسح البحث",
    careersFound: "مهنة موجودة",
    careerFound: "مهنة موجودة"
  }
};

async function addSearchPageTranslations() {
  console.log('🔍 Adding search page translations to all languages...');

  try {
    for (const [languageCode, translations] of Object.entries(searchPageTranslations)) {
      console.log(`\n📝 Updating ${languageCode} with search page translations...`);
      
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
      
      // Ensure pages section exists
      if (!existingTranslations.pages) {
        existingTranslations.pages = {};
      }
      
      // Ensure search section exists
      if (!existingTranslations.pages.search) {
        existingTranslations.pages.search = {};
      }
      
      // Add all search page translations
      Object.entries(translations).forEach(([key, value]) => {
        existingTranslations.pages.search[key] = value;
        console.log(`  ✅ Added pages.search.${key}: "${value}"`);
      });

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
          console.log(`✅ Successfully inserted ${languageCode} with search page translations`);
        }
      } else {
        console.log(`✅ Successfully updated ${languageCode} with search page translations`);
      }
    }

    console.log('\n✅ All search page translations added!');

  } catch (error) {
    console.error('❌ Error during translation updates:', error);
  }
}

// Run the update
addSearchPageTranslations();
