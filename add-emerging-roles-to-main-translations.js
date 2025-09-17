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
  en: {
    'AI Engineer': 'AI Engineer',
    'DevOps Engineer': 'DevOps Engineer',
    'Data Engineer': 'Data Engineer',
    'Security Engineer': 'Security Engineer',
    'Cloud Architect': 'Cloud Architect',
    'MLOps Engineer': 'MLOps Engineer',
    'Quantum Software Engineer': 'Quantum Software Engineer',
    'Sustainability Analyst': 'Sustainability Analyst',
    'Develop and implement AI solutions': 'Develop and implement AI solutions',
    'Bridge development and operations': 'Bridge development and operations',
    'Build data pipelines and infrastructure': 'Build data pipelines and infrastructure',
    'Protect systems and data': 'Protect systems and data',
    'Design cloud infrastructure': 'Design cloud infrastructure',
    'Deploy and maintain ML systems': 'Deploy and maintain ML systems',
    'Develop quantum computing applications': 'Develop quantum computing applications',
    'Analyze environmental impact': 'Analyze environmental impact'
  },
  es: {
    'AI Engineer': 'Ingeniero de IA',
    'DevOps Engineer': 'Ingeniero DevOps',
    'Data Engineer': 'Ingeniero de Datos',
    'Security Engineer': 'Ingeniero de Seguridad',
    'Cloud Architect': 'Arquitecto de Nube',
    'MLOps Engineer': 'Ingeniero MLOps',
    'Quantum Software Engineer': 'Ingeniero de Software Cuántico',
    'Sustainability Analyst': 'Analista de Sostenibilidad',
    'Develop and implement AI solutions': 'Desarrollar e implementar soluciones de IA',
    'Bridge development and operations': 'Conectar desarrollo y operaciones',
    'Build data pipelines and infrastructure': 'Construir pipelines de datos e infraestructura',
    'Protect systems and data': 'Proteger sistemas y datos',
    'Design cloud infrastructure': 'Diseñar infraestructura en la nube',
    'Deploy and maintain ML systems': 'Desplegar y mantener sistemas ML',
    'Develop quantum computing applications': 'Desarrollar aplicaciones de computación cuántica',
    'Analyze environmental impact': 'Analizar el impacto ambiental'
  },
  ja: {
    'AI Engineer': 'AIエンジニア',
    'DevOps Engineer': 'DevOpsエンジニア',
    'Data Engineer': 'データエンジニア',
    'Security Engineer': 'セキュリティエンジニア',
    'Cloud Architect': 'クラウドアーキテクト',
    'MLOps Engineer': 'MLOpsエンジニア',
    'Quantum Software Engineer': '量子ソフトウェアエンジニア',
    'Sustainability Analyst': 'サステナビリティアナリスト',
    'Develop and implement AI solutions': 'AIソリューションの開発と実装',
    'Bridge development and operations': '開発と運用を橋渡し',
    'Build data pipelines and infrastructure': 'データパイプラインとインフラを構築',
    'Protect systems and data': 'システムとデータを保護',
    'Design cloud infrastructure': 'クラウドインフラを設計',
    'Deploy and maintain ML systems': 'MLシステムのデプロイと保守',
    'Develop quantum computing applications': '量子コンピューティングアプリケーションを開発',
    'Analyze environmental impact': '環境への影響を分析'
  },
  fr: {
    'AI Engineer': 'Ingénieur IA',
    'DevOps Engineer': 'Ingénieur DevOps',
    'Data Engineer': 'Ingénieur de Données',
    'Security Engineer': 'Ingénieur Sécurité',
    'Cloud Architect': 'Architecte Cloud',
    'MLOps Engineer': 'Ingénieur MLOps',
    'Quantum Software Engineer': 'Ingénieur Logiciel Quantique',
    'Sustainability Analyst': 'Analyste Durabilité',
    'Develop and implement AI solutions': 'Développer et implémenter des solutions IA',
    'Bridge development and operations': 'Relier développement et opérations',
    'Build data pipelines and infrastructure': 'Construire des pipelines de données et infrastructure',
    'Protect systems and data': 'Protéger les systèmes et données',
    'Design cloud infrastructure': 'Concevoir une infrastructure cloud',
    'Deploy and maintain ML systems': 'Déployer et maintenir des systèmes ML',
    'Develop quantum computing applications': 'Développer des applications de calcul quantique',
    'Analyze environmental impact': 'Analyser l\'impact environnemental'
  },
  de: {
    'AI Engineer': 'KI-Ingenieur',
    'DevOps Engineer': 'DevOps-Ingenieur',
    'Data Engineer': 'Dateningenieur',
    'Security Engineer': 'Sicherheitsingenieur',
    'Cloud Architect': 'Cloud-Architekt',
    'MLOps Engineer': 'MLOps-Ingenieur',
    'Quantum Software Engineer': 'Quanten-Softwareingenieur',
    'Sustainability Analyst': 'Nachhaltigkeitsanalyst',
    'Develop and implement AI solutions': 'KI-Lösungen entwickeln und implementieren',
    'Bridge development and operations': 'Entwicklung und Betrieb verbinden',
    'Build data pipelines and infrastructure': 'Datenpipelines und Infrastruktur aufbauen',
    'Protect systems and data': 'Systeme und Daten schützen',
    'Design cloud infrastructure': 'Cloud-Infrastruktur entwerfen',
    'Deploy and maintain ML systems': 'ML-Systeme bereitstellen und warten',
    'Develop quantum computing applications': 'Quantencomputing-Anwendungen entwickeln',
    'Analyze environmental impact': 'Umweltauswirkungen analysieren'
  },
  pt: {
    'AI Engineer': 'Engenheiro de IA',
    'DevOps Engineer': 'Engenheiro DevOps',
    'Data Engineer': 'Engenheiro de Dados',
    'Security Engineer': 'Engenheiro de Segurança',
    'Cloud Architect': 'Arquiteto de Nuvem',
    'MLOps Engineer': 'Engenheiro MLOps',
    'Quantum Software Engineer': 'Engenheiro de Software Quântico',
    'Sustainability Analyst': 'Analista de Sustentabilidade',
    'Develop and implement AI solutions': 'Desenvolver e implementar soluções de IA',
    'Bridge development and operations': 'Conectar desenvolvimento e operações',
    'Build data pipelines and infrastructure': 'Construir pipelines de dados e infraestrutura',
    'Protect systems and data': 'Proteger sistemas e dados',
    'Design cloud infrastructure': 'Projetar infraestrutura em nuvem',
    'Deploy and maintain ML systems': 'Implantar e manter sistemas ML',
    'Develop quantum computing applications': 'Desenvolver aplicações de computação quântica',
    'Analyze environmental impact': 'Analisar impacto ambiental'
  },
  it: {
    'AI Engineer': 'Ingegnere IA',
    'DevOps Engineer': 'Ingegnere DevOps',
    'Data Engineer': 'Ingegnere dei Dati',
    'Security Engineer': 'Ingegnere della Sicurezza',
    'Cloud Architect': 'Architetto Cloud',
    'MLOps Engineer': 'Ingegnere MLOps',
    'Quantum Software Engineer': 'Ingegnere Software Quantistico',
    'Sustainability Analyst': 'Analista di Sostenibilità',
    'Develop and implement AI solutions': 'Sviluppare e implementare soluzioni IA',
    'Bridge development and operations': 'Collegare sviluppo e operazioni',
    'Build data pipelines and infrastructure': 'Costruire pipeline di dati e infrastruttura',
    'Protect systems and data': 'Proteggere sistemi e dati',
    'Design cloud infrastructure': 'Progettare infrastruttura cloud',
    'Deploy and maintain ML systems': 'Distribuire e mantenere sistemi ML',
    'Develop quantum computing applications': 'Sviluppare applicazioni di calcolo quantistico',
    'Analyze environmental impact': 'Analizzare l\'impatto ambientale'
  },
  ko: {
    'AI Engineer': 'AI 엔지니어',
    'DevOps Engineer': 'DevOps 엔지니어',
    'Data Engineer': '데이터 엔지니어',
    'Security Engineer': '보안 엔지니어',
    'Cloud Architect': '클라우드 아키텍트',
    'MLOps Engineer': 'MLOps 엔지니어',
    'Quantum Software Engineer': '양자 소프트웨어 엔지니어',
    'Sustainability Analyst': '지속가능성 분석가',
    'Develop and implement AI solutions': 'AI 솔루션 개발 및 구현',
    'Bridge development and operations': '개발과 운영을 연결',
    'Build data pipelines and infrastructure': '데이터 파이프라인과 인프라 구축',
    'Protect systems and data': '시스템과 데이터 보호',
    'Design cloud infrastructure': '클라우드 인프라 설계',
    'Deploy and maintain ML systems': 'ML 시스템 배포 및 유지보수',
    'Develop quantum computing applications': '양자 컴퓨팅 애플리케이션 개발',
    'Analyze environmental impact': '환경 영향 분석'
  },
  zh: {
    'AI Engineer': 'AI工程师',
    'DevOps Engineer': 'DevOps工程师',
    'Data Engineer': '数据工程师',
    'Security Engineer': '安全工程师',
    'Cloud Architect': '云架构师',
    'MLOps Engineer': 'MLOps工程师',
    'Quantum Software Engineer': '量子软件工程师',
    'Sustainability Analyst': '可持续发展分析师',
    'Develop and implement AI solutions': '开发和实施AI解决方案',
    'Bridge development and operations': '连接开发和运营',
    'Build data pipelines and infrastructure': '构建数据管道和基础设施',
    'Protect systems and data': '保护系统和数据',
    'Design cloud infrastructure': '设计云基础设施',
    'Deploy and maintain ML systems': '部署和维护ML系统',
    'Develop quantum computing applications': '开发量子计算应用',
    'Analyze environmental impact': '分析环境影响'
  },
  ru: {
    'AI Engineer': 'Инженер ИИ',
    'DevOps Engineer': 'Инженер DevOps',
    'Data Engineer': 'Инженер данных',
    'Security Engineer': 'Инженер безопасности',
    'Cloud Architect': 'Облачный архитектор',
    'MLOps Engineer': 'Инженер MLOps',
    'Quantum Software Engineer': 'Инженер квантового ПО',
    'Sustainability Analyst': 'Аналитик устойчивого развития',
    'Develop and implement AI solutions': 'Разработка и внедрение решений ИИ',
    'Bridge development and operations': 'Связывать разработку и эксплуатацию',
    'Build data pipelines and infrastructure': 'Создание пайплайнов данных и инфраструктуры',
    'Protect systems and data': 'Защита систем и данных',
    'Design cloud infrastructure': 'Проектирование облачной инфраструктуры',
    'Deploy and maintain ML systems': 'Развертывание и обслуживание ML-систем',
    'Develop quantum computing applications': 'Разработка приложений квантовых вычислений',
    'Analyze environmental impact': 'Анализ воздействия на окружающую среду'
  },
  ar: {
    'AI Engineer': 'مهندس الذكاء الاصطناعي',
    'DevOps Engineer': 'مهندس DevOps',
    'Data Engineer': 'مهندس البيانات',
    'Security Engineer': 'مهندس الأمان',
    'Cloud Architect': 'مهندس معماري سحابي',
    'MLOps Engineer': 'مهندس MLOps',
    'Quantum Software Engineer': 'مهندس برمجيات الكم',
    'Sustainability Analyst': 'محلل الاستدامة',
    'Develop and implement AI solutions': 'تطوير وتنفيذ حلول الذكاء الاصطناعي',
    'Bridge development and operations': 'ربط التطوير والعمليات',
    'Build data pipelines and infrastructure': 'بناء خطوط أنابيب البيانات والبنية التحتية',
    'Protect systems and data': 'حماية الأنظمة والبيانات',
    'Design cloud infrastructure': 'تصميم البنية التحتية السحابية',
    'Deploy and maintain ML systems': 'نشر وصيانة أنظمة التعلم الآلي',
    'Develop quantum computing applications': 'تطوير تطبيقات الحوسبة الكمية',
    'Analyze environmental impact': 'تحليل التأثير البيئي'
  }
};

async function addEmergingRolesTranslations() {
  console.log('🚀 Adding emerging roles translations to all languages...');

  try {
    for (const [languageCode, translations] of Object.entries(emergingRolesTranslations)) {
      console.log(`\n📝 Updating ${languageCode} with emerging roles translations...`);
      
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
      
      // Ensure emergingRoles section exists
      if (!existingTranslations.emergingRoles) {
        existingTranslations.emergingRoles = {};
      }
      
      // Add all emerging roles translations
      Object.entries(translations).forEach(([key, value]) => {
        existingTranslations.emergingRoles[key] = value;
        console.log(`  ✅ Added emergingRoles.${key}: "${value}"`);
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
          console.log(`✅ Successfully inserted ${languageCode} with emerging roles translations`);
        }
      } else {
        console.log(`✅ Successfully updated ${languageCode} with emerging roles translations`);
      }
    }

    console.log('\n✅ All emerging roles translations added!');

  } catch (error) {
    console.error('❌ Error during translation updates:', error);
  }
}

// Run the update
addEmergingRolesTranslations();
