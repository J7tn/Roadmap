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

// Missing keys that need to be added to all languages
const missingKeys = {
  "pages.search.placeholder": {
    en: "Search for careers...",
    es: "Buscar carreras...",
    ja: "キャリアを検索..."
  },
  "pages.search.tryAdjustingSearch": {
    en: "Try adjusting your search or filters",
    es: "Intenta ajustar tu búsqueda o filtros",
    ja: "検索やフィルターを調整してみてください"
  },
  "pages.search.clearSearch": {
    en: "Clear Search",
    es: "Limpiar Búsqueda",
    ja: "検索をクリア"
  },
  "assessment.whatAreYourCareerGoals": {
    en: "What are your career goals?",
    es: "¿Cuáles son tus objetivos profesionales?",
    ja: "あなたのキャリア目標は何ですか？"
  },
  "assessment.whatIsYourExperienceLevel": {
    en: "What's your experience level?",
    es: "¿Cuál es tu nivel de experiencia?",
    ja: "あなたの経験レベルは何ですか？"
  },
  "assessment.experienceLevelDescription": {
    en: "Tell us about your professional experience and background",
    es: "Cuéntanos sobre tu experiencia profesional y antecedentes",
    ja: "あなたのプロフェッショナル経験と背景について教えてください"
  },
  "assessment.currentRole": {
    en: "Current Role (if any)",
    es: "Rol Actual (si tienes uno)",
    ja: "現在の役割（ある場合）"
  },
  "assessment.currentRolePlaceholder": {
    en: "e.g., Software Developer, Marketing Manager, Student",
    es: "ej., Desarrollador de Software, Gerente de Marketing, Estudiante",
    ja: "例：ソフトウェア開発者、マーケティングマネージャー、学生"
  },
  "assessment.yearsOfExperience": {
    en: "Years of Professional Experience",
    es: "Años de Experiencia Profesional",
    ja: "プロフェッショナル経験年数"
  },
  "assessment.additionalExperienceDetails": {
    en: "Additional Experience Details",
    es: "Detalles de Experiencia Adicional",
    ja: "追加の経験詳細"
  },
  "assessment.additionalExperiencePlaceholder": {
    en: "Describe your work experience, projects, achievements, or any relevant background...",
    es: "Describe tu experiencia laboral, proyectos, logros o cualquier antecedente relevante...",
    ja: "あなたの職歴、プロジェクト、成果、または関連する背景について説明してください..."
  },
  "assessment.careerGoals.technicalLeadership": {
    en: "Technical Leadership",
    es: "Liderazgo Técnico",
    ja: "技術リーダーシップ"
  },
  "assessment.careerGoals.management": {
    en: "Management",
    es: "Gestión",
    ja: "マネジメント"
  },
  "assessment.careerGoals.entrepreneurship": {
    en: "Entrepreneurship",
    es: "Emprendimiento",
    ja: "起業"
  },
  "assessment.careerGoals.specialist": {
    en: "Specialist",
    es: "Especialista",
    ja: "スペシャリスト"
  },
  "assessment.careerGoals.creative": {
    en: "Creative",
    es: "Creativo",
    ja: "クリエイティブ"
  },
  "assessment.careerGoals.analyst": {
    en: "Analyst",
    es: "Analista",
    ja: "アナリスト"
  },
  "assessment.careerGoalDescriptions.technicalLeadership": {
    en: "Lead technical teams and projects",
    es: "Liderar equipos técnicos y proyectos",
    ja: "技術チームとプロジェクトをリードする"
  },
  "assessment.careerGoalDescriptions.management": {
    en: "Manage teams and business operations",
    es: "Gestionar equipos y operaciones comerciales",
    ja: "チームとビジネス運営を管理する"
  },
  "assessment.careerGoalDescriptions.entrepreneurship": {
    en: "Start and grow your own business",
    es: "Iniciar y hacer crecer tu propio negocio",
    ja: "自分のビジネスを立ち上げて成長させる"
  },
  "assessment.careerGoalDescriptions.specialist": {
    en: "Become an expert in a specific field",
    es: "Convertirte en un experto en un campo específico",
    ja: "特定の分野のエキスパートになる"
  },
  "assessment.careerGoalDescriptions.creative": {
    en: "Work in creative and design roles",
    es: "Trabajar en roles creativos y de diseño",
    ja: "クリエイティブやデザインの役割で働く"
  },
  "assessment.careerGoalDescriptions.analyst": {
    en: "Analyze data and business processes",
    es: "Analizar datos y procesos comerciales",
    ja: "データとビジネスプロセスを分析する"
  },
  "assessment.additionalGoals": {
    en: "Additional Goals & Interests",
    es: "Objetivos e Intereses Adicionales",
    ja: "追加の目標と興味"
  },
  "assessment.addCustomSkills": {
    en: "Add Custom Skills",
    es: "Agregar Habilidades Personalizadas",
    ja: "カスタムスキルを追加"
  },
  "assessment.customSkillsPlaceholder": {
    en: "Enter any additional skills you have (comma-separated)",
    es: "Ingresa cualquier habilidad adicional que tengas (separadas por comas)",
    ja: "持っている追加のスキルを入力してください（カンマ区切り）"
  },
  "assessment.selectAtLeastOneSkill": {
    en: "Please select at least one skill to continue",
    es: "Por favor selecciona al menos una habilidad para continuar",
    ja: "続行するには少なくとも1つのスキルを選択してください"
  },
  "assessment.assessmentComplete": {
    en: "Assessment Complete!",
    es: "¡Evaluación Completada!",
    ja: "評価完了！"
  },
  "assessment.assessmentCompleteDescription": {
    en: "Here are your personalized recommendations.",
    es: "Aquí tienes tus recomendaciones personalizadas.",
    ja: "あなたにパーソナライズされた推奨事項を以下に示します。"
  },
  "assessment.recommendedCareerPaths": {
    en: "Recommended Career Paths",
    es: "Rutas Profesionales Recomendadas",
    ja: "推奨キャリアパス"
  },
  "assessment.skillDevelopmentPlan": {
    en: "Skill Development Plan",
    es: "Plan de Desarrollo de Habilidades",
    ja: "スキル開発計画"
  },
  "assessment.careerRoadmap": {
    en: "Career Roadmap",
    es: "Hoja de Ruta Profesional",
    ja: "キャリアロードマップ"
  },
  "assessment.shortTerm": {
    en: "Short Term (3-6 months)",
    es: "Corto Plazo (3-6 meses)",
    ja: "短期（3-6ヶ月）"
  },
  "assessment.mediumTerm": {
    en: "Medium Term (6-12 months)",
    es: "Mediano Plazo (6-12 meses)",
    ja: "中期（6-12ヶ月）"
  },
  "assessment.longTerm": {
    en: "Long Term (1+ years)",
    es: "Largo Plazo (1+ años)",
    ja: "長期（1年以上）"
  },
  "assessment.saveAssessment": {
    en: "Save Assessment",
    es: "Guardar Evaluación",
    ja: "評価を保存"
  },
  "marketTrends.salaryTrend": {
    en: "Salary Trend",
    es: "Tendencia Salarial",
    ja: "給与トレンド"
  },
  "marketTrends.futureOutlook": {
    en: "Future Outlook",
    es: "Perspectiva Futura",
    ja: "将来の見通し"
  },
  "marketTrends.industryImpact": {
    en: "Industry Impact",
    es: "Impacto en la Industria",
    ja: "業界への影響"
  },
  "marketTrends.high": {
    en: "High",
    es: "Alto",
    ja: "高"
  },
  "marketTrends.medium": {
    en: "Medium",
    es: "Medio",
    ja: "中"
  },
  "marketTrends.low": {
    en: "Low",
    es: "Bajo",
    ja: "低"
  },
  "marketTrends.rising": {
    en: "Rising",
    es: "En Aumento",
    ja: "上昇中"
  },
  "marketTrends.stable": {
    en: "Stable",
    es: "Estable",
    ja: "安定"
  },
  "marketTrends.declining": {
    en: "Declining",
    es: "En Declive",
    ja: "下降中"
  },
  "pages.roadmap.currentPosition": {
    en: "Current Position",
    es: "Posición Actual",
    ja: "現在のポジション"
  },
  "pages.roadmap.nextStep": {
    en: "Next Step",
    es: "Siguiente Paso",
    ja: "次のステップ"
  },
  "pages.roadmap.target": {
    en: "Target",
    es: "Objetivo",
    ja: "目標"
  },
  "pages.roadmap.setCareer": {
    en: "Set Career",
    es: "Establecer Carrera",
    ja: "キャリアを設定"
  },
  "pages.roadmap.careerDetails": {
    en: "Career Details",
    es: "Detalles de la Carrera",
    ja: "キャリア詳細"
  },
  "pages.roadmap.various": {
    en: "Various",
    es: "Varios",
    ja: "様々"
  },
  "pages.roadmap.options": {
    en: "options",
    es: "opciones",
    ja: "オプション"
  }
};

async function fixMissingTranslationKeys() {
  console.log('🔧 Fixing missing translation keys...');

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
      
      // Add missing keys
      for (const [keyPath, translations] of Object.entries(missingKeys)) {
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

    console.log('\n✅ Missing translation keys fix completed successfully!');

  } catch (error) {
    console.error('❌ Error during missing translation keys fix:', error);
  }
}

// Run the fix
fixMissingTranslationKeys();
