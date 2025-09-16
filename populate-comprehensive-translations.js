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

// Comprehensive career translations for all supported languages
const careerTranslations = {
  'software-engineer': {
    en: {
      title: 'Software Engineer',
      description: 'Design, develop, and maintain software applications and systems',
      skills: ['Programming', 'Software Design', 'System Architecture', 'Problem Solving', 'Team Collaboration'],
      job_titles: ['Software Developer', 'Application Engineer', 'Systems Developer', 'Full Stack Developer'],
      certifications: ['AWS Certified Developer', 'Microsoft Certified: Azure Developer', 'Google Cloud Professional Developer']
    },
    es: {
      title: 'Ingeniero de Software',
      description: 'Diseñar, desarrollar y mantener aplicaciones y sistemas de software',
      skills: ['Programación', 'Diseño de Software', 'Arquitectura de Sistemas', 'Resolución de Problemas', 'Colaboración en Equipo'],
      job_titles: ['Desarrollador de Software', 'Ingeniero de Aplicaciones', 'Desarrollador de Sistemas', 'Desarrollador Full Stack'],
      certifications: ['AWS Certified Developer', 'Microsoft Certified: Azure Developer', 'Google Cloud Professional Developer']
    },
    ja: {
      title: 'ソフトウェアエンジニア',
      description: 'ソフトウェアアプリケーションとシステムの設計、開発、保守',
      skills: ['プログラミング', 'ソフトウェア設計', 'システムアーキテクチャ', '問題解決', 'チーム協力'],
      job_titles: ['ソフトウェア開発者', 'アプリケーションエンジニア', 'システム開発者', 'フルスタック開発者'],
      certifications: ['AWS Certified Developer', 'Microsoft Certified: Azure Developer', 'Google Cloud Professional Developer']
    }
  },
  'ai-engineer': {
    en: {
      title: 'AI Engineer',
      description: 'Develop and implement artificial intelligence and machine learning solutions',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Data Science'],
      job_titles: ['Artificial Intelligence Engineer', 'Machine Learning Engineer', 'AI Developer', 'ML Engineer'],
      certifications: ['TensorFlow Developer Certificate', 'AWS Machine Learning Specialty', 'Google Cloud ML Engineer']
    },
    es: {
      title: 'Ingeniero de IA',
      description: 'Desarrollar e implementar soluciones de inteligencia artificial y aprendizaje automático',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Aprendizaje Automático', 'Aprendizaje Profundo', 'Ciencia de Datos'],
      job_titles: ['Ingeniero de Inteligencia Artificial', 'Ingeniero de Aprendizaje Automático', 'Desarrollador de IA', 'Ingeniero ML'],
      certifications: ['TensorFlow Developer Certificate', 'AWS Machine Learning Specialty', 'Google Cloud ML Engineer']
    },
    ja: {
      title: 'AIエンジニア',
      description: '人工知能と機械学習ソリューションの開発と実装',
      skills: ['Python', 'TensorFlow', 'PyTorch', '機械学習', '深層学習', 'データサイエンス'],
      job_titles: ['人工知能エンジニア', '機械学習エンジニア', 'AI開発者', 'MLエンジニア'],
      certifications: ['TensorFlow Developer Certificate', 'AWS Machine Learning Specialty', 'Google Cloud ML Engineer']
    }
  },
  'data-scientist': {
    en: {
      title: 'Data Scientist',
      description: 'Analyze complex data to extract insights and drive business decisions',
      skills: ['Machine Learning', 'Python', 'R', 'Statistics', 'Data Analysis', 'SQL'],
      job_titles: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'Research Scientist'],
      certifications: ['AWS Certified Machine Learning', 'Google Data Analytics Certificate', 'Microsoft Certified: Data Scientist']
    },
    es: {
      title: 'Científico de Datos',
      description: 'Analizar datos complejos para extraer información y impulsar decisiones empresariales',
      skills: ['Aprendizaje Automático', 'Python', 'R', 'Estadística', 'Análisis de Datos', 'SQL'],
      job_titles: ['Científico de Datos', 'Ingeniero ML', 'Analista de Datos', 'Científico Investigador'],
      certifications: ['AWS Certified Machine Learning', 'Google Data Analytics Certificate', 'Microsoft Certified: Data Scientist']
    },
    ja: {
      title: 'データサイエンティスト',
      description: '複雑なデータを分析して洞察を抽出し、ビジネス決定を推進',
      skills: ['機械学習', 'Python', 'R', '統計学', 'データ分析', 'SQL'],
      job_titles: ['データサイエンティスト', 'MLエンジニア', 'データアナリスト', '研究科学者'],
      certifications: ['AWS Certified Machine Learning', 'Google Data Analytics Certificate', 'Microsoft Certified: Data Scientist']
    }
  },
  'cybersecurity-analyst': {
    en: {
      title: 'Cybersecurity Analyst',
      description: 'Protect organizations from cyber threats and ensure information security',
      skills: ['Network Security', 'Incident Response', 'Risk Assessment', 'Security Monitoring', 'Vulnerability Management'],
      job_titles: ['Cybersecurity Analyst', 'Security Analyst', 'Information Security Analyst', 'SOC Analyst'],
      certifications: ['CISSP', 'CISM', 'CEH', 'CompTIA Security+']
    },
    es: {
      title: 'Analista de Ciberseguridad',
      description: 'Proteger organizaciones de amenazas cibernéticas y garantizar la seguridad de la información',
      skills: ['Seguridad de Red', 'Respuesta a Incidentes', 'Evaluación de Riesgos', 'Monitoreo de Seguridad', 'Gestión de Vulnerabilidades'],
      job_titles: ['Analista de Ciberseguridad', 'Analista de Seguridad', 'Analista de Seguridad de la Información', 'Analista SOC'],
      certifications: ['CISSP', 'CISM', 'CEH', 'CompTIA Security+']
    },
    ja: {
      title: 'サイバーセキュリティアナリスト',
      description: '組織をサイバー脅威から保護し、情報セキュリティを確保',
      skills: ['ネットワークセキュリティ', 'インシデント対応', 'リスク評価', 'セキュリティ監視', '脆弱性管理'],
      job_titles: ['サイバーセキュリティアナリスト', 'セキュリティアナリスト', '情報セキュリティアナリスト', 'SOCアナリスト'],
      certifications: ['CISSP', 'CISM', 'CEH', 'CompTIA Security+']
    }
  },
  'cloud-engineer': {
    en: {
      title: 'Cloud Engineer',
      description: 'Design, implement, and manage cloud infrastructure and services',
      skills: ['AWS', 'Azure', 'Google Cloud', 'DevOps', 'Infrastructure as Code', 'Containerization'],
      job_titles: ['Cloud Engineer', 'DevOps Engineer', 'Cloud Architect', 'Infrastructure Engineer'],
      certifications: ['AWS Solutions Architect', 'Microsoft Azure Administrator', 'Google Cloud Professional Cloud Architect']
    },
    es: {
      title: 'Ingeniero de Nube',
      description: 'Diseñar, implementar y gestionar infraestructura y servicios en la nube',
      skills: ['AWS', 'Azure', 'Google Cloud', 'DevOps', 'Infraestructura como Código', 'Containerización'],
      job_titles: ['Ingeniero de Nube', 'Ingeniero DevOps', 'Arquitecto de Nube', 'Ingeniero de Infraestructura'],
      certifications: ['AWS Solutions Architect', 'Microsoft Azure Administrator', 'Google Cloud Professional Cloud Architect']
    },
    ja: {
      title: 'クラウドエンジニア',
      description: 'クラウドインフラストラクチャとサービスの設計、実装、管理',
      skills: ['AWS', 'Azure', 'Google Cloud', 'DevOps', 'Infrastructure as Code', 'コンテナ化'],
      job_titles: ['クラウドエンジニア', 'DevOpsエンジニア', 'クラウドアーキテクト', 'インフラエンジニア'],
      certifications: ['AWS Solutions Architect', 'Microsoft Azure Administrator', 'Google Cloud Professional Cloud Architect']
    }
  }
};

// Industry translations
const industryTranslations = {
  'technology': {
    en: { name: 'Technology', description: 'Software development, IT services, and digital innovation' },
    es: { name: 'Tecnología', description: 'Desarrollo de software, servicios de TI e innovación digital' },
    ja: { name: 'テクノロジー', description: 'ソフトウェア開発、ITサービス、デジタルイノベーション' }
  },
  'healthcare': {
    en: { name: 'Healthcare', description: 'Medical services, pharmaceuticals, and health technology' },
    es: { name: 'Salud', description: 'Servicios médicos, farmacéuticos y tecnología de la salud' },
    ja: { name: 'ヘルスケア', description: '医療サービス、製薬、ヘルステクノロジー' }
  },
  'finance': {
    en: { name: 'Finance', description: 'Banking, investment, insurance, and financial services' },
    es: { name: 'Finanzas', description: 'Banca, inversión, seguros y servicios financieros' },
    ja: { name: '金融', description: '銀行、投資、保険、金融サービス' }
  }
};

// Skill translations
const skillTranslations = {
  'javascript': {
    en: { name: 'JavaScript', category: 'Programming' },
    es: { name: 'JavaScript', category: 'Programación' },
    ja: { name: 'JavaScript', category: 'プログラミング' }
  },
  'python': {
    en: { name: 'Python', category: 'Programming' },
    es: { name: 'Python', category: 'Programación' },
    ja: { name: 'Python', category: 'プログラミング' }
  },
  'react': {
    en: { name: 'React', category: 'Frontend' },
    es: { name: 'React', category: 'Frontend' },
    ja: { name: 'React', category: 'フロントエンド' }
  },
  'machine_learning': {
    en: { name: 'Machine Learning', category: 'AI/ML' },
    es: { name: 'Aprendizaje Automático', category: 'IA/ML' },
    ja: { name: '機械学習', category: 'AI/ML' }
  },
  'aws': {
    en: { name: 'AWS', category: 'Cloud' },
    es: { name: 'AWS', category: 'Nube' },
    ja: { name: 'AWS', category: 'クラウド' }
  }
};

async function populateTranslations() {
  console.log('🌍 Populating comprehensive career translations...');

  try {
    // First, let's create the translation tables if they don't exist
    console.log('🔧 Creating translation tables...');
    
    // Create career_translations table
    const { error: careerTableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS career_translations (
          id SERIAL PRIMARY KEY,
          career_id TEXT NOT NULL,
          language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          skills TEXT[] NOT NULL,
          job_titles TEXT[] NOT NULL,
          certifications TEXT[] NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(career_id, language_code)
        );
      `
    });

    if (careerTableError) {
      console.log('ℹ️ Career translations table might already exist:', careerTableError.message);
    }

    // Populate career translations
    console.log('\n📝 Populating career translations...');
    for (const [careerId, translations] of Object.entries(careerTranslations)) {
      for (const [languageCode, translation] of Object.entries(translations)) {
        const { error } = await supabase
          .from('career_translations')
          .upsert({
            career_id: careerId,
            language_code: languageCode,
            title: translation.title,
            description: translation.description,
            skills: translation.skills,
            job_titles: translation.job_titles,
            certifications: translation.certifications,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'career_id,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting ${careerId} (${languageCode}):`, error);
        } else {
          console.log(`✅ Inserted ${careerId} (${languageCode}): ${translation.title}`);
        }
      }
    }

    // Create and populate industry translations
    console.log('\n🏭 Populating industry translations...');
    const { error: industryTableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS industry_translations (
          id SERIAL PRIMARY KEY,
          industry_key TEXT NOT NULL,
          language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
          industry_name TEXT NOT NULL,
          industry_description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(industry_key, language_code)
        );
      `
    });

    for (const [industryKey, translations] of Object.entries(industryTranslations)) {
      for (const [languageCode, translation] of Object.entries(translations)) {
        const { error } = await supabase
          .from('industry_translations')
          .upsert({
            industry_key: industryKey,
            language_code: languageCode,
            industry_name: translation.name,
            industry_description: translation.description,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'industry_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting industry ${industryKey} (${languageCode}):`, error);
        } else {
          console.log(`✅ Inserted industry ${industryKey} (${languageCode}): ${translation.name}`);
        }
      }
    }

    // Create and populate skill translations
    console.log('\n🛠️ Populating skill translations...');
    const { error: skillTableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS skill_translations (
          id SERIAL PRIMARY KEY,
          skill_key TEXT NOT NULL,
          language_code TEXT NOT NULL CHECK (language_code IN ('en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it')),
          skill_name TEXT NOT NULL,
          skill_category TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(skill_key, language_code)
        );
      `
    });

    for (const [skillKey, translations] of Object.entries(skillTranslations)) {
      for (const [languageCode, translation] of Object.entries(translations)) {
        const { error } = await supabase
          .from('skill_translations')
          .upsert({
            skill_key: skillKey,
            language_code: languageCode,
            skill_name: translation.name,
            skill_category: translation.category,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'skill_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting skill ${skillKey} (${languageCode}):`, error);
        } else {
          console.log(`✅ Inserted skill ${skillKey} (${languageCode}): ${translation.name}`);
        }
      }
    }

    console.log('\n✅ Comprehensive translation population completed!');

  } catch (error) {
    console.error('❌ Error during translation population:', error);
  }
}

// Run the population
populateTranslations();
