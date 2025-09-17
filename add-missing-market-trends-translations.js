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

// Market trends translations for all languages
const marketTrendsTranslations = {
  en: {
    decliningSkills: "Declining Skills",
    industryGrowth: "Industry Growth", 
    decliningIndustries: "Declining Industries",
    emergingRoles: "Emerging Roles",
    skillsInHighDemand: "Skills in High Demand",
    industryGrowthAnalysis: "Industry Growth Analysis"
  },
  es: {
    decliningSkills: "Habilidades en Declive",
    industryGrowth: "Crecimiento de la Industria",
    decliningIndustries: "Industrias en Declive", 
    emergingRoles: "Roles Emergentes",
    skillsInHighDemand: "Habilidades en Alta Demanda",
    industryGrowthAnalysis: "Análisis de Crecimiento de la Industria"
  },
  ja: {
    decliningSkills: "衰退スキル",
    industryGrowth: "業界成長",
    decliningIndustries: "衰退業界",
    emergingRoles: "新興ロール",
    skillsInHighDemand: "高需要スキル",
    industryGrowthAnalysis: "業界成長分析"
  },
  fr: {
    decliningSkills: "Compétences en Déclin",
    industryGrowth: "Croissance de l'Industrie",
    decliningIndustries: "Industries en Déclin",
    emergingRoles: "Rôles Émergents", 
    skillsInHighDemand: "Compétences Très Demandées",
    industryGrowthAnalysis: "Analyse de Croissance de l'Industrie"
  },
  de: {
    decliningSkills: "Rückläufige Fähigkeiten",
    industryGrowth: "Branchenwachstum",
    decliningIndustries: "Rückläufige Branchen",
    emergingRoles: "Aufkommende Rollen",
    skillsInHighDemand: "Hochgefragte Fähigkeiten", 
    industryGrowthAnalysis: "Branchenwachstumsanalyse"
  },
  pt: {
    decliningSkills: "Habilidades em Declínio",
    industryGrowth: "Crescimento da Indústria",
    decliningIndustries: "Indústrias em Declínio",
    emergingRoles: "Funções Emergentes",
    skillsInHighDemand: "Habilidades em Alta Demanda",
    industryGrowthAnalysis: "Análise de Crescimento da Indústria"
  },
  it: {
    decliningSkills: "Competenze in Declino",
    industryGrowth: "Crescita dell'Industria", 
    decliningIndustries: "Industrie in Declino",
    emergingRoles: "Ruoli Emergenti",
    skillsInHighDemand: "Competenze Molto Richieste",
    industryGrowthAnalysis: "Analisi della Crescita dell'Industria"
  },
  ko: {
    decliningSkills: "쇠퇴 스킬",
    industryGrowth: "산업 성장",
    decliningIndustries: "쇠퇴 산업",
    emergingRoles: "신흥 역할",
    skillsInHighDemand: "고수요 스킬",
    industryGrowthAnalysis: "산업 성장 분석"
  },
  zh: {
    decliningSkills: "衰退技能",
    industryGrowth: "行业增长",
    decliningIndustries: "衰退行业", 
    emergingRoles: "新兴角色",
    skillsInHighDemand: "高需求技能",
    industryGrowthAnalysis: "行业增长分析"
  },
  ru: {
    decliningSkills: "Убывающие Навыки",
    industryGrowth: "Рост Отрасли",
    decliningIndustries: "Убывающие Отрасли",
    emergingRoles: "Новые Роли",
    skillsInHighDemand: "Высокий Спрос на Навыки",
    industryGrowthAnalysis: "Анализ Роста Отрасли"
  },
  ar: {
    decliningSkills: "المهارات المتراجعة",
    industryGrowth: "نمو الصناعة",
    decliningIndustries: "الصناعات المتراجعة",
    emergingRoles: "الأدوار الناشئة",
    skillsInHighDemand: "المهارات عالية الطلب",
    industryGrowthAnalysis: "تحليل نمو الصناعة"
  }
};

async function addMarketTrendsTranslations() {
  console.log('🌍 Adding market trends translations to all languages...');

  try {
    for (const [languageCode, translations] of Object.entries(marketTrendsTranslations)) {
      console.log(`\n📝 Updating ${languageCode} with market trends translations...`);
      
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
      
      // Ensure marketTrends section exists
      if (!existingTranslations.marketTrends) {
        existingTranslations.marketTrends = {};
      }
      
      // Add all market trends translations
      Object.entries(translations).forEach(([key, value]) => {
        existingTranslations.marketTrends[key] = value;
        console.log(`  ✅ Added marketTrends.${key}: "${value}"`);
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
          console.log(`✅ Successfully inserted ${languageCode} with market trends translations`);
        }
      } else {
        console.log(`✅ Successfully updated ${languageCode} with market trends translations`);
      }
    }

    console.log('\n✅ All market trends translations added!');

  } catch (error) {
    console.error('❌ Error during translation updates:', error);
  }
}

// Run the update
addMarketTrendsTranslations();
