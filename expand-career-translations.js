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

// Key career translations for Spanish and Japanese
const keyCareerTranslations = {
  es: {
    // Tech careers
    "ai-engineer": { title: "Ingeniero de IA", description: "Desarrolla sistemas de inteligencia artificial y aprendizaje automático." },
    "data-scientist": { title: "Científico de Datos", description: "Analiza datos complejos para extraer insights y crear modelos predictivos." },
    "software-engineer": { title: "Ingeniero de Software", description: "Diseña, desarrolla y mantiene aplicaciones y sistemas de software." },
    "devops-engineer": { title: "Ingeniero DevOps", description: "Automatiza procesos de desarrollo y despliegue de software." },
    "cloud-engineer": { title: "Ingeniero de Nube", description: "Diseña e implementa soluciones de computación en la nube." },
    "cybersecurity-analyst": { title: "Analista de Ciberseguridad", description: "Protege sistemas informáticos contra amenazas y vulnerabilidades." },
    "blockchain-developer": { title: "Desarrollador Blockchain", description: "Crea aplicaciones descentralizadas usando tecnología blockchain." },
    "ui-ux-designer": { title: "Diseñador UI/UX", description: "Diseña interfaces de usuario intuitivas y experiencias digitales." },
    "product-manager": { title: "Gerente de Producto", description: "Dirige el desarrollo y estrategia de productos digitales." },
    "business-analyst": { title: "Analista de Negocios", description: "Analiza procesos empresariales y recomienda mejoras." },
    "project-manager": { title: "Gerente de Proyectos", description: "Planifica y ejecuta proyectos para alcanzar objetivos empresariales." },
    
    // Healthcare careers
    "doctor": { title: "Médico", description: "Diagnostica y trata enfermedades y lesiones en pacientes." },
    "nurse": { title: "Enfermero/a", description: "Proporciona atención médica y apoyo a pacientes." },
    "pharmacist": { title: "Farmacéutico", description: "Dispensa medicamentos y asesora sobre su uso." },
    "dentist": { title: "Dentista", description: "Diagnostica y trata problemas dentales y bucales." },
    
    // Education careers
    "teacher": { title: "Maestro/a", description: "Educa y forma a estudiantes en diversas materias." },
    "professor": { title: "Profesor/a", description: "Enseña a nivel universitario y realiza investigación." },
    "principal": { title: "Director/a", description: "Administra y lidera una institución educativa." },
    
    // Business careers
    "ceo": { title: "Director Ejecutivo", description: "Lidera la estrategia y operaciones de una empresa." },
    "manager": { title: "Gerente", description: "Supervisa equipos y operaciones empresariales." },
    "accountant": { title: "Contador/a", description: "Maneja registros financieros y prepara informes." },
    "marketing-manager": { title: "Gerente de Marketing", description: "Desarrolla estrategias de marketing y promoción." },
    
    // Creative careers
    "graphic-designer": { title: "Diseñador Gráfico", description: "Crea elementos visuales para comunicación y marketing." },
    "video-editor": { title: "Editor de Video", description: "Edita y produce contenido de video profesional." },
    "photographer": { title: "Fotógrafo/a", description: "Captura imágenes para diversos propósitos." },
    "writer": { title: "Escritor/a", description: "Crea contenido escrito para diversos medios." },
    
    // Engineering careers
    "civil-engineer": { title: "Ingeniero Civil", description: "Diseña y supervisa proyectos de infraestructura." },
    "mechanical-engineer": { title: "Ingeniero Mecánico", description: "Diseña sistemas y máquinas mecánicas." },
    "electrical-engineer": { title: "Ingeniero Eléctrico", description: "Diseña sistemas eléctricos y electrónicos." },
    
    // Service careers
    "chef": { title: "Chef", description: "Prepara y crea platos culinarios profesionales." },
    "waiter": { title: "Mesero/a", description: "Atiende a clientes en restaurantes y establecimientos." },
    "driver": { title: "Conductor/a", description: "Opera vehículos para transporte de personas o mercancías." },
    "police-officer": { title: "Oficial de Policía", description: "Mantiene el orden público y la seguridad ciudadana." }
  },
  ja: {
    // Tech careers
    "ai-engineer": { title: "AIエンジニア", description: "人工知能システムと機械学習を開発する。" },
    "data-scientist": { title: "データサイエンティスト", description: "複雑なデータを分析し、洞察を抽出し、予測モデルを作成する。" },
    "software-engineer": { title: "ソフトウェアエンジニア", description: "ソフトウェアアプリケーションとシステムを設計、開発、保守する。" },
    "devops-engineer": { title: "DevOpsエンジニア", description: "ソフトウェアの開発とデプロイメントプロセスを自動化する。" },
    "cloud-engineer": { title: "クラウドエンジニア", description: "クラウドコンピューティングソリューションを設計・実装する。" },
    "cybersecurity-analyst": { title: "サイバーセキュリティアナリスト", description: "コンピュータシステムを脅威や脆弱性から保護する。" },
    "blockchain-developer": { title: "ブロックチェーン開発者", description: "ブロックチェーン技術を使用して分散アプリケーションを作成する。" },
    "ui-ux-designer": { title: "UI/UXデザイナー", description: "直感的なユーザーインターフェースとデジタル体験を設計する。" },
    "product-manager": { title: "プロダクトマネージャー", description: "デジタル製品の開発と戦略を指揮する。" },
    "business-analyst": { title: "ビジネスアナリスト", description: "ビジネスプロセスを分析し、改善を推奨する。" },
    "project-manager": { title: "プロジェクトマネージャー", description: "企業目標を達成するためのプロジェクトを計画・実行する。" },
    
    // Healthcare careers
    "doctor": { title: "医師", description: "患者の病気や怪我を診断・治療する。" },
    "nurse": { title: "看護師", description: "患者に医療ケアとサポートを提供する。" },
    "pharmacist": { title: "薬剤師", description: "薬を調剤し、使用についてアドバイスする。" },
    "dentist": { title: "歯科医", description: "歯や口腔の問題を診断・治療する。" },
    
    // Education careers
    "teacher": { title: "教師", description: "様々な科目で学生を教育・指導する。" },
    "professor": { title: "教授", description: "大学レベルで教え、研究を行う。" },
    "principal": { title: "校長", description: "教育機関を管理・指導する。" },
    
    // Business careers
    "ceo": { title: "最高経営責任者", description: "企業の戦略と運営をリードする。" },
    "manager": { title: "マネージャー", description: "チームとビジネス運営を監督する。" },
    "accountant": { title: "会計士", description: "財務記録を管理し、レポートを作成する。" },
    "marketing-manager": { title: "マーケティングマネージャー", description: "マーケティング戦略とプロモーションを開発する。" },
    
    // Creative careers
    "graphic-designer": { title: "グラフィックデザイナー", description: "コミュニケーションとマーケティングのための視覚要素を作成する。" },
    "video-editor": { title: "ビデオエディター", description: "プロフェッショナルなビデオコンテンツを編集・制作する。" },
    "photographer": { title: "写真家", description: "様々な目的で画像を撮影する。" },
    "writer": { title: "ライター", description: "様々なメディア向けに書面コンテンツを作成する。" },
    
    // Engineering careers
    "civil-engineer": { title: "土木エンジニア", description: "インフラプロジェクトを設計・監督する。" },
    "mechanical-engineer": { title: "機械エンジニア", description: "機械システムとマシンを設計する。" },
    "electrical-engineer": { title: "電気エンジニア", description: "電気・電子システムを設計する。" },
    
    // Service careers
    "chef": { title: "シェフ", description: "プロフェッショナルな料理を準備・創作する。" },
    "waiter": { title: "ウェイター", description: "レストランや施設で顧客にサービスを提供する。" },
    "driver": { title: "運転手", description: "人や商品の輸送のために車両を運転する。" },
    "police-officer": { title: "警察官", description: "公共の秩序と市民の安全を維持する。" }
  }
};

async function expandCareerTranslations() {
  console.log('🚀 Expanding career translations with key careers...');

  try {
    // Get all careers from database
    const { data: careers, error: careersError } = await supabase
      .from('careers')
      .select('id, title, description, skills, job_titles, certifications');

    if (careersError) {
      console.error('❌ Error fetching careers:', careersError);
      return;
    }

    console.log(`📊 Found ${careers.length} careers to process`);

    // Add Spanish translations for key careers
    console.log('🇪🇸 Adding Spanish translations for key careers...');
    for (const [careerId, translation] of Object.entries(keyCareerTranslations.es)) {
      const { error } = await supabase
        .from('career_translations')
        .upsert({
          career_id: careerId,
          language_code: 'es',
          title: translation.title,
          description: translation.description,
          skills: [], // Will be populated separately
          job_titles: [],
          certifications: []
        }, {
          onConflict: 'career_id,language_code'
        });

      if (error) {
        console.error(`❌ Error inserting Spanish translation for ${careerId}:`, error);
      } else {
        console.log(`✅ Spanish: ${translation.title}`);
      }
    }

    // Add Japanese translations for key careers
    console.log('🇯🇵 Adding Japanese translations for key careers...');
    for (const [careerId, translation] of Object.entries(keyCareerTranslations.ja)) {
      const { error } = await supabase
        .from('career_translations')
        .upsert({
          career_id: careerId,
          language_code: 'ja',
          title: translation.title,
          description: translation.description,
          skills: [], // Will be populated separately
          job_titles: [],
          certifications: []
        }, {
          onConflict: 'career_id,language_code'
        });

      if (error) {
        console.error(`❌ Error inserting Japanese translation for ${careerId}:`, error);
      } else {
        console.log(`✅ Japanese: ${translation.title}`);
      }
    }

    // Create comprehensive skill translations
    console.log('🛠️ Creating comprehensive skill translations...');
    const commonSkills = [
      'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Analytical Thinking',
      'Creativity', 'Adaptability', 'Time Management', 'Project Management', 'Critical Thinking',
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker',
      'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Agile Development', 'DevOps'
    ];

    const skillTranslations = {
      es: {
        'Communication': 'Comunicación',
        'Leadership': 'Liderazgo',
        'Problem Solving': 'Resolución de Problemas',
        'Teamwork': 'Trabajo en Equipo',
        'Analytical Thinking': 'Pensamiento Analítico',
        'Creativity': 'Creatividad',
        'Adaptability': 'Adaptabilidad',
        'Time Management': 'Gestión del Tiempo',
        'Project Management': 'Gestión de Proyectos',
        'Critical Thinking': 'Pensamiento Crítico',
        'JavaScript': 'JavaScript',
        'Python': 'Python',
        'Java': 'Java',
        'React': 'React',
        'Node.js': 'Node.js',
        'SQL': 'SQL',
        'Git': 'Git',
        'AWS': 'AWS',
        'Docker': 'Docker',
        'Machine Learning': 'Aprendizaje Automático',
        'Data Analysis': 'Análisis de Datos',
        'UI/UX Design': 'Diseño UI/UX',
        'Agile Development': 'Desarrollo Ágil',
        'DevOps': 'DevOps'
      },
      ja: {
        'Communication': 'コミュニケーション',
        'Leadership': 'リーダーシップ',
        'Problem Solving': '問題解決',
        'Teamwork': 'チームワーク',
        'Analytical Thinking': '分析的思考',
        'Creativity': '創造性',
        'Adaptability': '適応性',
        'Time Management': '時間管理',
        'Project Management': 'プロジェクト管理',
        'Critical Thinking': '批判的思考',
        'JavaScript': 'JavaScript',
        'Python': 'Python',
        'Java': 'Java',
        'React': 'React',
        'Node.js': 'Node.js',
        'SQL': 'SQL',
        'Git': 'Git',
        'AWS': 'AWS',
        'Docker': 'Docker',
        'Machine Learning': '機械学習',
        'Data Analysis': 'データ分析',
        'UI/UX Design': 'UI/UXデザイン',
        'Agile Development': 'アジャイル開発',
        'DevOps': 'DevOps'
      }
    };

    // Insert skill translations
    for (const [languageCode, skills] of Object.entries(skillTranslations)) {
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
          console.log(`✅ Skill: ${skillName} (${languageCode})`);
        }
      }
    }

    console.log('✅ Career translations expansion completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${Object.keys(keyCareerTranslations.es).length} careers with Spanish translations`);
    console.log(`   - ${Object.keys(keyCareerTranslations.ja).length} careers with Japanese translations`);
    console.log(`   - ${Object.keys(skillTranslations.es).length} skills with Spanish translations`);
    console.log(`   - ${Object.keys(skillTranslations.ja).length} skills with Japanese translations`);

  } catch (error) {
    console.error('❌ Error during career translations expansion:', error);
  }
}

function getSkillCategory(skillKey) {
  const categories = {
    'Communication': 'Soft Skills',
    'Leadership': 'Soft Skills',
    'Problem Solving': 'Soft Skills',
    'Teamwork': 'Soft Skills',
    'Analytical Thinking': 'Soft Skills',
    'Creativity': 'Soft Skills',
    'Adaptability': 'Soft Skills',
    'Time Management': 'Soft Skills',
    'Project Management': 'Management',
    'Critical Thinking': 'Soft Skills',
    'JavaScript': 'Programming',
    'Python': 'Programming',
    'Java': 'Programming',
    'React': 'Frontend',
    'Node.js': 'Backend',
    'SQL': 'Database',
    'Git': 'Version Control',
    'AWS': 'Cloud',
    'Docker': 'DevOps',
    'Machine Learning': 'AI/ML',
    'Data Analysis': 'Analytics',
    'UI/UX Design': 'Design',
    'Agile Development': 'Methodology',
    'DevOps': 'DevOps'
  };
  return categories[skillKey] || 'General';
}

// Run the expansion
expandCareerTranslations();
