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

// Comprehensive translation data for all careers, industries, and skills
const comprehensiveTranslations = {
  industries: {
    en: {
      "agriculture": "Agriculture",
      "emerging-tech": "Emerging Technology", 
      "transportation": "Transportation",
      "marine-science": "Marine Science",
      "creative": "Creative",
      "education": "Education",
      "legal": "Legal",
      "music": "Music",
      "drones-aviation": "Drones & Aviation",
      "science": "Science",
      "engineering": "Engineering",
      "digital-creator": "Digital Creator",
      "marketing": "Marketing",
      "media": "Media",
      "government": "Government",
      "business": "Business",
      "trades": "Trades",
      "gaming-casino": "Gaming & Casino",
      "healthcare": "Healthcare",
      "specialized-trades": "Specialized Trades",
      "tech": "Technology",
      "investment-finance": "Investment & Finance",
      "middle-management": "Middle Management",
      "public-service": "Public Service",
      "military": "Military",
      "retail": "Retail",
      "emergency-services": "Emergency Services",
      "sanitation": "Sanitation",
      "nonprofit": "Nonprofit",
      "finance": "Finance",
      "hospitality": "Hospitality",
      "manufacturing": "Manufacturing",
      "real-estate": "Real Estate"
    },
    es: {
      "agriculture": "Agricultura",
      "emerging-tech": "Tecnología Emergente",
      "transportation": "Transporte",
      "marine-science": "Ciencias Marinas",
      "creative": "Creativo",
      "education": "Educación",
      "legal": "Legal",
      "music": "Música",
      "drones-aviation": "Drones y Aviación",
      "science": "Ciencia",
      "engineering": "Ingeniería",
      "digital-creator": "Creador Digital",
      "marketing": "Marketing",
      "media": "Medios",
      "government": "Gobierno",
      "business": "Negocios",
      "trades": "Oficios",
      "gaming-casino": "Juegos y Casino",
      "healthcare": "Salud",
      "specialized-trades": "Oficios Especializados",
      "tech": "Tecnología",
      "investment-finance": "Inversión y Finanzas",
      "middle-management": "Gerencia Media",
      "public-service": "Servicio Público",
      "military": "Militar",
      "retail": "Venta al por Menor",
      "emergency-services": "Servicios de Emergencia",
      "sanitation": "Saneamiento",
      "nonprofit": "Sin Fines de Lucro",
      "finance": "Finanzas",
      "hospitality": "Hospitalidad",
      "manufacturing": "Manufactura",
      "real-estate": "Bienes Raíces"
    },
    ja: {
      "agriculture": "農業",
      "emerging-tech": "新興技術",
      "transportation": "運輸",
      "marine-science": "海洋科学",
      "creative": "クリエイティブ",
      "education": "教育",
      "legal": "法務",
      "music": "音楽",
      "drones-aviation": "ドローン・航空",
      "science": "科学",
      "engineering": "エンジニアリング",
      "digital-creator": "デジタルクリエイター",
      "marketing": "マーケティング",
      "media": "メディア",
      "government": "政府",
      "business": "ビジネス",
      "trades": "職人",
      "gaming-casino": "ゲーム・カジノ",
      "healthcare": "ヘルスケア",
      "specialized-trades": "専門職人",
      "tech": "テクノロジー",
      "investment-finance": "投資・金融",
      "middle-management": "中間管理",
      "public-service": "公共サービス",
      "military": "軍事",
      "retail": "小売",
      "emergency-services": "緊急サービス",
      "sanitation": "衛生",
      "nonprofit": "非営利",
      "finance": "金融",
      "hospitality": "ホスピタリティ",
      "manufacturing": "製造業",
      "real-estate": "不動産"
    }
  },
  skills: {
    en: {
      // Technical Skills
      "JavaScript": "JavaScript",
      "Python": "Python", 
      "Java": "Java",
      "React": "React",
      "Node.js": "Node.js",
      "SQL": "SQL",
      "Git": "Git",
      "AWS": "AWS",
      "Docker": "Docker",
      "Machine Learning": "Machine Learning",
      "Data Analysis": "Data Analysis",
      "Project Management": "Project Management",
      "Agile Development": "Agile Development",
      "UI/UX Design": "UI/UX Design",
      "Communication": "Communication",
      "Leadership": "Leadership",
      "Problem Solving": "Problem Solving",
      "Teamwork": "Teamwork",
      "Analytical Thinking": "Analytical Thinking",
      "Creativity": "Creativity",
      "Adaptability": "Adaptability"
    },
    es: {
      // Technical Skills
      "JavaScript": "JavaScript",
      "Python": "Python",
      "Java": "Java", 
      "React": "React",
      "Node.js": "Node.js",
      "SQL": "SQL",
      "Git": "Git",
      "AWS": "AWS",
      "Docker": "Docker",
      "Machine Learning": "Aprendizaje Automático",
      "Data Analysis": "Análisis de Datos",
      "Project Management": "Gestión de Proyectos",
      "Agile Development": "Desarrollo Ágil",
      "UI/UX Design": "Diseño UI/UX",
      "Communication": "Comunicación",
      "Leadership": "Liderazgo",
      "Problem Solving": "Resolución de Problemas",
      "Teamwork": "Trabajo en Equipo",
      "Analytical Thinking": "Pensamiento Analítico",
      "Creativity": "Creatividad",
      "Adaptability": "Adaptabilidad"
    },
    ja: {
      // Technical Skills
      "JavaScript": "JavaScript",
      "Python": "Python",
      "Java": "Java",
      "React": "React", 
      "Node.js": "Node.js",
      "SQL": "SQL",
      "Git": "Git",
      "AWS": "AWS",
      "Docker": "Docker",
      "Machine Learning": "機械学習",
      "Data Analysis": "データ分析",
      "Project Management": "プロジェクト管理",
      "Agile Development": "アジャイル開発",
      "UI/UX Design": "UI/UXデザイン",
      "Communication": "コミュニケーション",
      "Leadership": "リーダーシップ",
      "Problem Solving": "問題解決",
      "Teamwork": "チームワーク",
      "Analytical Thinking": "分析的思考",
      "Creativity": "創造性",
      "Adaptability": "適応性"
    }
  }
};

async function populateComprehensiveTranslations() {
  console.log('🚀 Starting comprehensive career translations population...');

  try {
    // Get all careers from database
    const { data: careers, error: careersError } = await supabase
      .from('careers')
      .select('id, title, description, skills, job_titles, certifications, industry');

    if (careersError) {
      console.error('❌ Error fetching careers:', careersError);
      return;
    }

    console.log(`📊 Found ${careers.length} careers to translate`);

    // Populate industry translations
    console.log('🏭 Populating comprehensive industry translations...');
    for (const [languageCode, industries] of Object.entries(comprehensiveTranslations.industries)) {
      for (const [industryKey, industryName] of Object.entries(industries)) {
        const { error } = await supabase
          .from('industry_translations')
          .upsert({
            industry_key: industryKey,
            language_code: languageCode,
            industry_name: industryName,
            industry_description: `${industryName} industry`
          }, {
            onConflict: 'industry_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting industry translation ${industryKey} (${languageCode}):`, error);
        } else {
          console.log(`✅ Translated industry: ${industryName} (${languageCode})`);
        }
      }
    }

    // Populate skill translations
    console.log('🛠️ Populating comprehensive skill translations...');
    for (const [languageCode, skills] of Object.entries(comprehensiveTranslations.skills)) {
      for (const [skillKey, skillName] of Object.entries(skills)) {
        const { error } = await supabase
          .from('skill_translations')
          .upsert({
            skill_key: skillKey.toLowerCase().replace(/\s+/g, '_'),
            language_code: languageCode,
            skill_name: skillName,
            skill_category: getSkillCategory(skillKey)
          }, {
            onConflict: 'skill_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting skill translation ${skillKey} (${languageCode}):`, error);
        } else {
          console.log(`✅ Translated skill: ${skillName} (${languageCode})`);
        }
      }
    }

    // Create English fallback translations for all careers
    console.log('🔄 Creating English fallback translations for all careers...');
    for (const career of careers) {
      const { error } = await supabase
        .from('career_translations')
        .upsert({
          career_id: career.id,
          language_code: 'en',
          title: career.title,
          description: career.description,
          skills: career.skills || [],
          job_titles: career.job_titles || [],
          certifications: career.certifications || []
        }, {
          onConflict: 'career_id,language_code'
        });

      if (error) {
        console.error(`❌ Error creating English fallback for career ${career.id}:`, error);
      } else {
        console.log(`✅ English fallback: ${career.title}`);
      }
    }

    // Create trend translations for existing trends
    console.log('📈 Creating trend translations...');
    const { data: trends, error: trendsError } = await supabase
      .from('career_trends')
      .select('id, market_insights');

    if (!trendsError && trends) {
      for (const trend of trends) {
        // Create English fallback for trend
        const { error } = await supabase
          .from('career_trend_translations')
          .upsert({
            career_trend_id: trend.id,
            language_code: 'en',
            market_insights: trend.market_insights
          }, {
            onConflict: 'career_trend_id,language_code'
          });

        if (error) {
          console.error(`❌ Error creating trend translation for ${trend.id}:`, error);
        } else {
          console.log(`✅ Trend translation: ${trend.id}`);
        }
      }
    }

    console.log('✅ Comprehensive career translations population completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${careers.length} careers with English translations`);
    console.log(`   - ${Object.keys(comprehensiveTranslations.industries.en).length} industries translated`);
    console.log(`   - ${Object.keys(comprehensiveTranslations.skills.en).length} skills translated`);
    console.log(`   - ${trends?.length || 0} trends with translations`);

  } catch (error) {
    console.error('❌ Error during comprehensive career translations population:', error);
  }
}

function getSkillCategory(skillKey) {
  const categories = {
    'JavaScript': 'Programming',
    'Python': 'Programming',
    'Java': 'Programming',
    'React': 'Frontend',
    'Node.js': 'Backend',
    'SQL': 'Database',
    'AWS': 'Cloud',
    'Docker': 'DevOps',
    'Git': 'Version Control',
    'Machine Learning': 'AI/ML',
    'Data Analysis': 'Analytics',
    'Project Management': 'Management',
    'Agile Development': 'Methodology',
    'UI/UX Design': 'Design',
    'Communication': 'Soft Skills',
    'Leadership': 'Soft Skills',
    'Problem Solving': 'Soft Skills',
    'Teamwork': 'Soft Skills',
    'Analytical Thinking': 'Soft Skills',
    'Creativity': 'Soft Skills',
    'Adaptability': 'Soft Skills'
  };
  return categories[skillKey] || 'General';
}

// Run the comprehensive population
populateComprehensiveTranslations();
