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

      // Update in database using INSERT with ON CONFLICT
      const { error: updateError } = await supabase
        .from('translations')
        .upsert({
          language_code: languageCode,
          translation_data: updatedData,
          version: '1.0.0',
          is_active: true
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
