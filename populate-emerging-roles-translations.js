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

// Emerging roles translations for all languages
const emergingRolesTranslations = {
  'AI Engineer': {
    titles: {
      en: 'AI Engineer',
      es: 'Ingeniero de IA',
      ja: 'AIエンジニア',
      fr: 'Ingénieur IA',
      de: 'KI-Ingenieur',
      pt: 'Engenheiro de IA',
      it: 'Ingegnere IA',
      ko: 'AI 엔지니어',
      zh: 'AI工程师',
      ru: 'Инженер ИИ',
      ar: 'مهندس الذكاء الاصطناعي'
    },
    descriptions: {
      en: 'Develop and implement AI solutions',
      es: 'Desarrollar e implementar soluciones de IA',
      ja: 'AIソリューションの開発と実装',
      fr: 'Développer et implémenter des solutions IA',
      de: 'KI-Lösungen entwickeln und implementieren',
      pt: 'Desenvolver e implementar soluções de IA',
      it: 'Sviluppare e implementare soluzioni IA',
      ko: 'AI 솔루션 개발 및 구현',
      zh: '开发和实施AI解决方案',
      ru: 'Разработка и внедрение решений ИИ',
      ar: 'تطوير وتنفيذ حلول الذكاء الاصطناعي'
    }
  },
  'DevOps Engineer': {
    titles: {
      en: 'DevOps Engineer',
      es: 'Ingeniero DevOps',
      ja: 'DevOpsエンジニア',
      fr: 'Ingénieur DevOps',
      de: 'DevOps-Ingenieur',
      pt: 'Engenheiro DevOps',
      it: 'Ingegnere DevOps',
      ko: 'DevOps 엔지니어',
      zh: 'DevOps工程师',
      ru: 'Инженер DevOps',
      ar: 'مهندس DevOps'
    },
    descriptions: {
      en: 'Bridge development and operations',
      es: 'Conectar desarrollo y operaciones',
      ja: '開発と運用を橋渡し',
      fr: 'Relier développement et opérations',
      de: 'Entwicklung und Betrieb verbinden',
      pt: 'Conectar desenvolvimento e operações',
      it: 'Collegare sviluppo e operazioni',
      ko: '개발과 운영을 연결',
      zh: '连接开发和运营',
      ru: 'Связывать разработку и эксплуатацию',
      ar: 'ربط التطوير والعمليات'
    }
  },
  'Data Engineer': {
    titles: {
      en: 'Data Engineer',
      es: 'Ingeniero de Datos',
      ja: 'データエンジニア',
      fr: 'Ingénieur de Données',
      de: 'Dateningenieur',
      pt: 'Engenheiro de Dados',
      it: 'Ingegnere dei Dati',
      ko: '데이터 엔지니어',
      zh: '数据工程师',
      ru: 'Инженер данных',
      ar: 'مهندس البيانات'
    },
    descriptions: {
      en: 'Build data pipelines and infrastructure',
      es: 'Construir pipelines de datos e infraestructura',
      ja: 'データパイプラインとインフラを構築',
      fr: 'Construire des pipelines de données et infrastructure',
      de: 'Datenpipelines und Infrastruktur aufbauen',
      pt: 'Construir pipelines de dados e infraestrutura',
      it: 'Costruire pipeline di dati e infrastruttura',
      ko: '데이터 파이프라인과 인프라 구축',
      zh: '构建数据管道和基础设施',
      ru: 'Создание пайплайнов данных и инфраструктуры',
      ar: 'بناء خطوط أنابيب البيانات والبنية التحتية'
    }
  },
  'Security Engineer': {
    titles: {
      en: 'Security Engineer',
      es: 'Ingeniero de Seguridad',
      ja: 'セキュリティエンジニア',
      fr: 'Ingénieur Sécurité',
      de: 'Sicherheitsingenieur',
      pt: 'Engenheiro de Segurança',
      it: 'Ingegnere della Sicurezza',
      ko: '보안 엔지니어',
      zh: '安全工程师',
      ru: 'Инженер безопасности',
      ar: 'مهندس الأمان'
    },
    descriptions: {
      en: 'Protect systems and data',
      es: 'Proteger sistemas y datos',
      ja: 'システムとデータを保護',
      fr: 'Protéger les systèmes et données',
      de: 'Systeme und Daten schützen',
      pt: 'Proteger sistemas e dados',
      it: 'Proteggere sistemi e dati',
      ko: '시스템과 데이터 보호',
      zh: '保护系统和数据',
      ru: 'Защита систем и данных',
      ar: 'حماية الأنظمة والبيانات'
    }
  },
  'Cloud Architect': {
    titles: {
      en: 'Cloud Architect',
      es: 'Arquitecto de Nube',
      ja: 'クラウドアーキテクト',
      fr: 'Architecte Cloud',
      de: 'Cloud-Architekt',
      pt: 'Arquiteto de Nuvem',
      it: 'Architetto Cloud',
      ko: '클라우드 아키텍트',
      zh: '云架构师',
      ru: 'Облачный архитектор',
      ar: 'مهندس معماري سحابي'
    },
    descriptions: {
      en: 'Design cloud infrastructure',
      es: 'Diseñar infraestructura en la nube',
      ja: 'クラウドインフラを設計',
      fr: 'Concevoir une infrastructure cloud',
      de: 'Cloud-Infrastruktur entwerfen',
      pt: 'Projetar infraestrutura em nuvem',
      it: 'Progettare infrastruttura cloud',
      ko: '클라우드 인프라 설계',
      zh: '设计云基础设施',
      ru: 'Проектирование облачной инфраструктуры',
      ar: 'تصميم البنية التحتية السحابية'
    }
  },
  'MLOps Engineer': {
    titles: {
      en: 'MLOps Engineer',
      es: 'Ingeniero MLOps',
      ja: 'MLOpsエンジニア',
      fr: 'Ingénieur MLOps',
      de: 'MLOps-Ingenieur',
      pt: 'Engenheiro MLOps',
      it: 'Ingegnere MLOps',
      ko: 'MLOps 엔지니어',
      zh: 'MLOps工程师',
      ru: 'Инженер MLOps',
      ar: 'مهندس MLOps'
    },
    descriptions: {
      en: 'Deploy and maintain ML systems',
      es: 'Desplegar y mantener sistemas ML',
      ja: 'MLシステムのデプロイと保守',
      fr: 'Déployer et maintenir des systèmes ML',
      de: 'ML-Systeme bereitstellen und warten',
      pt: 'Implantar e manter sistemas ML',
      it: 'Distribuire e mantenere sistemi ML',
      ko: 'ML 시스템 배포 및 유지보수',
      zh: '部署和维护ML系统',
      ru: 'Развертывание и обслуживание ML-систем',
      ar: 'نشر وصيانة أنظمة التعلم الآلي'
    }
  },
  'Quantum Software Engineer': {
    titles: {
      en: 'Quantum Software Engineer',
      es: 'Ingeniero de Software Cuántico',
      ja: '量子ソフトウェアエンジニア',
      fr: 'Ingénieur Logiciel Quantique',
      de: 'Quanten-Softwareingenieur',
      pt: 'Engenheiro de Software Quântico',
      it: 'Ingegnere Software Quantistico',
      ko: '양자 소프트웨어 엔지니어',
      zh: '量子软件工程师',
      ru: 'Инженер квантового ПО',
      ar: 'مهندس برمجيات الكم'
    },
    descriptions: {
      en: 'Develop quantum computing applications',
      es: 'Desarrollar aplicaciones de computación cuántica',
      ja: '量子コンピューティングアプリケーションを開発',
      fr: 'Développer des applications de calcul quantique',
      de: 'Quantencomputing-Anwendungen entwickeln',
      pt: 'Desenvolver aplicações de computação quântica',
      it: 'Sviluppare applicazioni di calcolo quantistico',
      ko: '양자 컴퓨팅 애플리케이션 개발',
      zh: '开发量子计算应用',
      ru: 'Разработка приложений квантовых вычислений',
      ar: 'تطوير تطبيقات الحوسبة الكمية'
    }
  },
  'Sustainability Analyst': {
    titles: {
      en: 'Sustainability Analyst',
      es: 'Analista de Sostenibilidad',
      ja: 'サステナビリティアナリスト',
      fr: 'Analyste Durabilité',
      de: 'Nachhaltigkeitsanalyst',
      pt: 'Analista de Sustentabilidade',
      it: 'Analista di Sostenibilità',
      ko: '지속가능성 분석가',
      zh: '可持续发展分析师',
      ru: 'Аналитик устойчивого развития',
      ar: 'محلل الاستدامة'
    },
    descriptions: {
      en: 'Analyze environmental impact',
      es: 'Analizar el impacto ambiental',
      ja: '環境への影響を分析',
      fr: 'Analyser l\'impact environnemental',
      de: 'Umweltauswirkungen analysieren',
      pt: 'Analisar impacto ambiental',
      it: 'Analizzare l\'impatto ambientale',
      ko: '환경 영향 분석',
      zh: '分析环境影响',
      ru: 'Анализ воздействия на окружающую среду',
      ar: 'تحليل التأثير البيئي'
    }
  }
};

async function populateEmergingRolesTranslations() {
  console.log('🚀 Populating emerging roles translations...');

  try {
    for (const [roleKey, translations] of Object.entries(emergingRolesTranslations)) {
      for (const [languageCode, title] of Object.entries(translations.titles)) {
        const description = translations.descriptions[languageCode];
        
        const { error } = await supabase
          .from('career_trend_translations')
          .upsert({
            trend_key: roleKey,
            language_code: languageCode,
            trend_title: title,
            trend_description: description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'trend_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting role translation for ${roleKey} (${languageCode}):`, error);
        } else {
          console.log(`✅ Added role translation: ${roleKey} -> ${title} (${languageCode})`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error during emerging roles translation population:', error);
  }
}

async function main() {
  console.log('🌍 Starting emerging roles translation population...');
  
  await populateEmergingRolesTranslations();
  
  console.log('\n✅ Emerging roles translation population completed!');
}

// Run the population
main();
