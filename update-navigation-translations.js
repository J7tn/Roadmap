import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Shorter navigation translations to prevent layout issues
const navigationTranslations = {
  en: {
    "navigation": {
      "home": "Home",
      "search": "Search", 
      "roadmap": "Roadmap",
      "careerPaths": "My Paths",
      "assessment": "Skills"
    }
  },
  ja: {
    "navigation": {
      "home": "ホーム",
      "search": "検索",
      "roadmap": "ロードマップ", 
      "careerPaths": "マイパス",
      "assessment": "スキル"
    }
  },
  es: {
    "navigation": {
      "home": "Inicio",
      "search": "Buscar",
      "roadmap": "Ruta",
      "careerPaths": "Mis Rutas", 
      "assessment": "Habilidades"
    }
  },
  fr: {
    "navigation": {
      "home": "Accueil",
      "search": "Rechercher",
      "roadmap": "Route",
      "careerPaths": "Mes Chemins",
      "assessment": "Compétences"
    }
  },
  de: {
    "navigation": {
      "home": "Start",
      "search": "Suchen",
      "roadmap": "Route",
      "careerPaths": "Meine Wege",
      "assessment": "Fähigkeiten"
    }
  },
  pt: {
    "navigation": {
      "home": "Início",
      "search": "Pesquisar",
      "roadmap": "Rota",
      "careerPaths": "Minhas Rotas",
      "assessment": "Habilidades"
    }
  },
  it: {
    "navigation": {
      "home": "Home",
      "search": "Cerca",
      "roadmap": "Percorso",
      "careerPaths": "I Miei Percorsi",
      "assessment": "Competenze"
    }
  },
  ko: {
    "navigation": {
      "home": "홈",
      "search": "검색",
      "roadmap": "로드맵",
      "careerPaths": "내 경로",
      "assessment": "스킬"
    }
  },
  zh: {
    "navigation": {
      "home": "首页",
      "search": "搜索",
      "roadmap": "路线图",
      "careerPaths": "我的路径",
      "assessment": "技能"
    }
  },
  ru: {
    "navigation": {
      "home": "Главная",
      "search": "Поиск",
      "roadmap": "Маршрут",
      "careerPaths": "Мои Пути",
      "assessment": "Навыки"
    }
  },
  ar: {
    "navigation": {
      "home": "الرئيسية",
      "search": "بحث",
      "roadmap": "الطريق",
      "careerPaths": "مساراتي",
      "assessment": "المهارات"
    }
  }
};

async function updateNavigationTranslations() {
  console.log('Updating navigation translations with shorter text...');
  
  for (const [languageCode, translationData] of Object.entries(navigationTranslations)) {
    console.log(`Updating ${languageCode} navigation translations...`);
    
    try {
      // Get existing translation data
      const { data: existingData, error: fetchError } = await supabase
        .from('translations')
        .select('translation_data')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error(`Error fetching existing data for ${languageCode}:`, fetchError);
        continue;
      }

      let updatedTranslationData = translationData;
      
      if (existingData && existingData.length > 0) {
        // Merge with existing data
        updatedTranslationData = {
          ...existingData[0].translation_data,
          ...translationData
        };
      }

      const { data, error } = await supabase
        .from('translations')
        .upsert({
          language_code: languageCode,
          translation_data: updatedTranslationData,
          version: '1.3.0',
          is_active: true
        }, {
          onConflict: 'language_code,version'
        });

      if (error) {
        console.error(`Error updating ${languageCode}:`, error);
        continue;
      }

      console.log(`✅ Successfully updated ${languageCode} navigation translations`);
      
    } catch (error) {
      console.error(`Error processing ${languageCode}:`, error);
    }
  }

  console.log('Navigation translation update completed!');
}

// Run the update
updateNavigationTranslations().catch(console.error);
