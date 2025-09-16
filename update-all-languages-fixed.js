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

// Comprehensive translations for all languages
const comprehensiveTranslations = {
  en: {
    common: {
      unknown: "Unknown",
      various: "Various",
      salaryNotSpecified: "Salary not specified"
    },
    skills: {
      problemSolving: "Problem Solving",
      technicalKnowledge: "Technical Knowledge",
      analyticalThinking: "Analytical Thinking",
      productStrategy: "Product Strategy",
      userResearch: "User Research",
      stakeholderManagement: "Stakeholder Management",
      programming: "Programming",
      mathematics: "Mathematics",
      statistics: "Statistics",
      machineLearning: "Machine Learning",
      dataVisualization: "Data Visualization",
      systemUnderstanding: "System Understanding",
      cloudPlatforms: "Cloud Platforms",
      infrastructureAsCode: "Infrastructure as Code",
      monitoring: "Monitoring",
      technicalSkills: "Technical Skills",
      communication: "Communication",
      teamLeadership: "Team Leadership",
      architectureDesign: "Architecture Design",
      mentoring: "Mentoring",
      marketingStrategy: "Marketing Strategy",
      analytics: "Analytics",
      productKnowledge: "Product Knowledge",
      goToMarketStrategy: "Go-to-Market Strategy",
      customerInsights: "Customer Insights",
      abTesting: "A/B Testing",
      automation: "Automation",
      brandStrategy: "Brand Strategy",
      creativeDirection: "Creative Direction",
      dataAnalysis: "Data Analysis",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "Design",
      copywriting: "Copywriting",
      photography: "Photography",
      videoEditing: "Video Editing",
      uiUx: "UI/UX",
      branding: "Branding",
      illustration: "Illustration",
      animation: "Animation",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "Public Speaking",
      writing: "Writing",
      presentation: "Presentation",
      negotiation: "Negotiation",
      leadership: "Leadership",
      teamManagement: "Team Management",
      clientRelations: "Client Relations",
      training: "Training",
      projectManagement: "Project Management",
      marketing: "Marketing",
      sales: "Sales",
      finance: "Finance",
      strategy: "Strategy",
      operations: "Operations",
      hr: "HR",
      legal: "Legal",
      english: "English",
      spanish: "Spanish",
      french: "French",
      german: "German",
      chinese: "Chinese",
      japanese: "Japanese",
      arabic: "Arabic",
      portuguese: "Portuguese",
      creativity: "Creativity",
      deepLearning: "Deep Learning",
      modelDeployment: "Model Deployment",
      businessAcumen: "Business Acumen",
      dataStrategy: "Data Strategy",
      productMetrics: "Product Metrics"
    },
    priority: {
      high: "High",
      medium: "Medium",
      low: "Low"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "Level Up Your Career",
        advanceToNextLevel: "Advance to the next career level",
        leverageCurrentSkills: "Leverage your current skills in new areas"
      }
    }
  },
  es: {
    common: {
      unknown: "Desconocido",
      various: "Varios",
      salaryNotSpecified: "Salario no especificado"
    },
    skills: {
      problemSolving: "Resolución de Problemas",
      technicalKnowledge: "Conocimiento Técnico",
      analyticalThinking: "Pensamiento Analítico",
      productStrategy: "Estrategia de Producto",
      userResearch: "Investigación de Usuarios",
      stakeholderManagement: "Gestión de Partes Interesadas",
      programming: "Programación",
      mathematics: "Matemáticas",
      statistics: "Estadística",
      machineLearning: "Aprendizaje Automático",
      dataVisualization: "Visualización de Datos",
      systemUnderstanding: "Comprensión de Sistemas",
      cloudPlatforms: "Plataformas en la Nube",
      infrastructureAsCode: "Infraestructura como Código",
      monitoring: "Monitoreo",
      technicalSkills: "Habilidades Técnicas",
      communication: "Comunicación",
      teamLeadership: "Liderazgo de Equipo",
      architectureDesign: "Diseño de Arquitectura",
      mentoring: "Mentoría",
      marketingStrategy: "Estrategia de Marketing",
      analytics: "Analítica",
      productKnowledge: "Conocimiento de Producto",
      goToMarketStrategy: "Estrategia de Lanzamiento",
      customerInsights: "Conocimiento del Cliente",
      abTesting: "Pruebas A/B",
      automation: "Automatización",
      brandStrategy: "Estrategia de Marca",
      creativeDirection: "Dirección Creativa",
      dataAnalysis: "Análisis de Datos",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "Diseño",
      copywriting: "Redacción Publicitaria",
      photography: "Fotografía",
      videoEditing: "Edición de Video",
      uiUx: "UI/UX",
      branding: "Branding",
      illustration: "Ilustración",
      animation: "Animación",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "Oratoria",
      writing: "Escritura",
      presentation: "Presentación",
      negotiation: "Negociación",
      leadership: "Liderazgo",
      teamManagement: "Gestión de Equipos",
      clientRelations: "Relaciones con Clientes",
      training: "Capacitación",
      projectManagement: "Gestión de Proyectos",
      marketing: "Marketing",
      sales: "Ventas",
      finance: "Finanzas",
      strategy: "Estrategia",
      operations: "Operaciones",
      hr: "RRHH",
      legal: "Legal",
      english: "Inglés",
      spanish: "Español",
      french: "Francés",
      german: "Alemán",
      chinese: "Chino",
      japanese: "Japonés",
      arabic: "Árabe",
      portuguese: "Portugués",
      creativity: "Creatividad",
      deepLearning: "Aprendizaje Profundo",
      modelDeployment: "Despliegue de Modelos",
      businessAcumen: "Conocimiento Empresarial",
      dataStrategy: "Estrategia de Datos",
      productMetrics: "Métricas de Producto"
    },
    priority: {
      high: "Alta",
      medium: "Media",
      low: "Baja"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "Sube de Nivel en tu Carrera",
        advanceToNextLevel: "Avanza al siguiente nivel profesional",
        leverageCurrentSkills: "Aprovecha tus habilidades actuales en nuevas áreas"
      }
    }
  },
  ja: {
    common: {
      unknown: "不明",
      various: "様々",
      salaryNotSpecified: "給与未指定"
    },
    skills: {
      problemSolving: "問題解決",
      technicalKnowledge: "技術知識",
      analyticalThinking: "分析的思考",
      productStrategy: "プロダクト戦略",
      userResearch: "ユーザーリサーチ",
      stakeholderManagement: "ステークホルダー管理",
      programming: "プログラミング",
      mathematics: "数学",
      statistics: "統計学",
      machineLearning: "機械学習",
      dataVisualization: "データ可視化",
      systemUnderstanding: "システム理解",
      cloudPlatforms: "クラウドプラットフォーム",
      infrastructureAsCode: "Infrastructure as Code",
      monitoring: "監視",
      technicalSkills: "技術スキル",
      communication: "コミュニケーション",
      teamLeadership: "チームリーダーシップ",
      architectureDesign: "アーキテクチャ設計",
      mentoring: "メンタリング",
      marketingStrategy: "マーケティング戦略",
      analytics: "アナリティクス",
      productKnowledge: "プロダクト知識",
      goToMarketStrategy: "Go-to-Market戦略",
      customerInsights: "顧客インサイト",
      abTesting: "A/Bテスト",
      automation: "自動化",
      brandStrategy: "ブランド戦略",
      creativeDirection: "クリエイティブディレクション",
      dataAnalysis: "データ分析",
      javascript: "JavaScript",
      python: "Python",
      react: "React",
      nodejs: "Node.js",
      sql: "SQL",
      aws: "AWS",
      docker: "Docker",
      git: "Git",
      design: "デザイン",
      copywriting: "コピーライティング",
      photography: "写真",
      videoEditing: "動画編集",
      uiUx: "UI/UX",
      branding: "ブランディング",
      illustration: "イラストレーション",
      animation: "アニメーション",
      excel: "Excel",
      tableau: "Tableau",
      r: "R",
      publicSpeaking: "プレゼンテーション",
      writing: "ライティング",
      presentation: "プレゼンテーション",
      negotiation: "交渉",
      leadership: "リーダーシップ",
      teamManagement: "チーム管理",
      clientRelations: "クライアント関係",
      training: "トレーニング",
      projectManagement: "プロジェクト管理",
      marketing: "マーケティング",
      sales: "営業",
      finance: "財務",
      strategy: "戦略",
      operations: "運用",
      hr: "人事",
      legal: "法務",
      english: "英語",
      spanish: "スペイン語",
      french: "フランス語",
      german: "ドイツ語",
      chinese: "中国語",
      japanese: "日本語",
      arabic: "アラビア語",
      portuguese: "ポルトガル語",
      creativity: "創造性",
      deepLearning: "深層学習",
      modelDeployment: "モデルデプロイメント",
      businessAcumen: "ビジネス洞察力",
      dataStrategy: "データ戦略",
      productMetrics: "プロダクトメトリクス"
    },
    priority: {
      high: "高",
      medium: "中",
      low: "低"
    },
    pages: {
      roadmap: {
        levelUpYourCareer: "キャリアレベルアップ",
        advanceToNextLevel: "次のキャリアレベルに進む",
        leverageCurrentSkills: "現在のスキルを新しい分野で活用する"
      }
    }
  }
};

async function updateAllLanguages() {
  console.log('🌍 Updating all languages with comprehensive translations...');

  try {
    for (const [languageCode, translations] of Object.entries(comprehensiveTranslations)) {
      console.log(`\n📝 Updating ${languageCode} translations...`);
      
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
      const mergedTranslations = {
        ...existingTranslations,
        ...translations
      };

      // First try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('translations')
        .update({
          translation_data: mergedTranslations,
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
            translation_data: mergedTranslations,
            version: Date.now().toString(),
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error(`❌ Error inserting ${languageCode}:`, insertError);
        } else {
          console.log(`✅ Successfully inserted ${languageCode} with ${Object.keys(translations).length} new sections`);
        }
      } else {
        console.log(`✅ Successfully updated ${languageCode} with ${Object.keys(translations).length} new sections`);
      }
    }

    console.log('\n✅ All language updates completed!');

  } catch (error) {
    console.error('❌ Error during language updates:', error);
  }
}

// Run the update
updateAllLanguages();
