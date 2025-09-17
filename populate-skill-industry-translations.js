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

// Skill translations for all languages
const skillTranslations = {
  // Technical Skills
  'JavaScript': {
    en: 'JavaScript',
    es: 'JavaScript',
    ja: 'JavaScript',
    fr: 'JavaScript',
    de: 'JavaScript',
    pt: 'JavaScript',
    it: 'JavaScript',
    ko: 'JavaScript',
    zh: 'JavaScript',
    ru: 'JavaScript',
    ar: 'JavaScript'
  },
  'Python': {
    en: 'Python',
    es: 'Python',
    ja: 'Python',
    fr: 'Python',
    de: 'Python',
    pt: 'Python',
    it: 'Python',
    ko: 'Python',
    zh: 'Python',
    ru: 'Python',
    ar: 'Python'
  },
  'React': {
    en: 'React',
    es: 'React',
    ja: 'React',
    fr: 'React',
    de: 'React',
    pt: 'React',
    it: 'React',
    ko: 'React',
    zh: 'React',
    ru: 'React',
    ar: 'React'
  },
  'AI/ML': {
    en: 'AI/ML',
    es: 'IA/ML',
    ja: 'AI/ML',
    fr: 'IA/ML',
    de: 'KI/ML',
    pt: 'IA/ML',
    it: 'IA/ML',
    ko: 'AI/ML',
    zh: 'AI/ML',
    ru: 'ИИ/МО',
    ar: 'الذكاء الاصطناعي/التعلم الآلي'
  },
  'Cybersecurity': {
    en: 'Cybersecurity',
    es: 'Ciberseguridad',
    ja: 'サイバーセキュリティ',
    fr: 'Cybersécurité',
    de: 'Cybersicherheit',
    pt: 'Cibersegurança',
    it: 'Cybersicurezza',
    ko: '사이버보안',
    zh: '网络安全',
    ru: 'Кибербезопасность',
    ar: 'الأمن السيبراني'
  },
  'Cloud Computing': {
    en: 'Cloud Computing',
    es: 'Computación en la Nube',
    ja: 'クラウドコンピューティング',
    fr: 'Informatique en Nuage',
    de: 'Cloud Computing',
    pt: 'Computação em Nuvem',
    it: 'Cloud Computing',
    ko: '클라우드 컴퓨팅',
    zh: '云计算',
    ru: 'Облачные вычисления',
    ar: 'الحوسبة السحابية'
  },
  'Data Science': {
    en: 'Data Science',
    es: 'Ciencia de Datos',
    ja: 'データサイエンス',
    fr: 'Science des Données',
    de: 'Datenwissenschaft',
    pt: 'Ciência de Dados',
    it: 'Scienza dei Dati',
    ko: '데이터 사이언스',
    zh: '数据科学',
    ru: 'Наука о данных',
    ar: 'علم البيانات'
  },
  'DevOps': {
    en: 'DevOps',
    es: 'DevOps',
    ja: 'DevOps',
    fr: 'DevOps',
    de: 'DevOps',
    pt: 'DevOps',
    it: 'DevOps',
    ko: 'DevOps',
    zh: 'DevOps',
    ru: 'DevOps',
    ar: 'DevOps'
  },
  'Blockchain': {
    en: 'Blockchain',
    es: 'Blockchain',
    ja: 'ブロックチェーン',
    fr: 'Blockchain',
    de: 'Blockchain',
    pt: 'Blockchain',
    it: 'Blockchain',
    ko: '블록체인',
    zh: '区块链',
    ru: 'Блокчейн',
    ar: 'البلوك تشين'
  },
  'Quantum Computing': {
    en: 'Quantum Computing',
    es: 'Computación Cuántica',
    ja: '量子コンピューティング',
    fr: 'Informatique Quantique',
    de: 'Quantencomputing',
    pt: 'Computação Quântica',
    it: 'Computazione Quantistica',
    ko: '양자 컴퓨팅',
    zh: '量子计算',
    ru: 'Квантовые вычисления',
    ar: 'الحوسبة الكمية'
  },
  'Edge Computing': {
    en: 'Edge Computing',
    es: 'Computación de Borde',
    ja: 'エッジコンピューティング',
    fr: 'Informatique de Bord',
    de: 'Edge Computing',
    pt: 'Computação de Borda',
    it: 'Edge Computing',
    ko: '엣지 컴퓨팅',
    zh: '边缘计算',
    ru: 'Периферийные вычисления',
    ar: 'الحوسبة الطرفية'
  },
  // Declining Skills
  'Flash Development': {
    en: 'Flash Development',
    es: 'Desarrollo Flash',
    ja: 'Flash開発',
    fr: 'Développement Flash',
    de: 'Flash-Entwicklung',
    pt: 'Desenvolvimento Flash',
    it: 'Sviluppo Flash',
    ko: 'Flash 개발',
    zh: 'Flash开发',
    ru: 'Разработка Flash',
    ar: 'تطوير Flash'
  },
  'Silverlight': {
    en: 'Silverlight',
    es: 'Silverlight',
    ja: 'Silverlight',
    fr: 'Silverlight',
    de: 'Silverlight',
    pt: 'Silverlight',
    it: 'Silverlight',
    ko: 'Silverlight',
    zh: 'Silverlight',
    ru: 'Silverlight',
    ar: 'Silverlight'
  },
  'ColdFusion': {
    en: 'ColdFusion',
    es: 'ColdFusion',
    ja: 'ColdFusion',
    fr: 'ColdFusion',
    de: 'ColdFusion',
    pt: 'ColdFusion',
    it: 'ColdFusion',
    ko: 'ColdFusion',
    zh: 'ColdFusion',
    ru: 'ColdFusion',
    ar: 'ColdFusion'
  },
  'Perl': {
    en: 'Perl',
    es: 'Perl',
    ja: 'Perl',
    fr: 'Perl',
    de: 'Perl',
    pt: 'Perl',
    it: 'Perl',
    ko: 'Perl',
    zh: 'Perl',
    ru: 'Perl',
    ar: 'Perl'
  },
  'VB.NET': {
    en: 'VB.NET',
    es: 'VB.NET',
    ja: 'VB.NET',
    fr: 'VB.NET',
    de: 'VB.NET',
    pt: 'VB.NET',
    it: 'VB.NET',
    ko: 'VB.NET',
    zh: 'VB.NET',
    ru: 'VB.NET',
    ar: 'VB.NET'
  },
  'jQuery': {
    en: 'jQuery',
    es: 'jQuery',
    ja: 'jQuery',
    fr: 'jQuery',
    de: 'jQuery',
    pt: 'jQuery',
    it: 'jQuery',
    ko: 'jQuery',
    zh: 'jQuery',
    ru: 'jQuery',
    ar: 'jQuery'
  }
};

// Industry translations for all languages
const industryTranslations = {
  'Technology': {
    en: 'Technology',
    es: 'Tecnología',
    ja: 'テクノロジー',
    fr: 'Technologie',
    de: 'Technologie',
    pt: 'Tecnologia',
    it: 'Tecnologia',
    ko: '기술',
    zh: '技术',
    ru: 'Технологии',
    ar: 'التكنولوجيا'
  },
  'Healthcare': {
    en: 'Healthcare',
    es: 'Atención Médica',
    ja: 'ヘルスケア',
    fr: 'Santé',
    de: 'Gesundheitswesen',
    pt: 'Saúde',
    it: 'Sanità',
    ko: '헬스케어',
    zh: '医疗保健',
    ru: 'Здравоохранение',
    ar: 'الرعاية الصحية'
  },
  'Finance': {
    en: 'Finance',
    es: 'Finanzas',
    ja: '金融',
    fr: 'Finance',
    de: 'Finanzen',
    pt: 'Finanças',
    it: 'Finanza',
    ko: '금융',
    zh: '金融',
    ru: 'Финансы',
    ar: 'المالية'
  },
  'Manufacturing': {
    en: 'Manufacturing',
    es: 'Manufactura',
    ja: '製造業',
    fr: 'Fabrication',
    de: 'Fertigung',
    pt: 'Manufatura',
    it: 'Produzione',
    ko: '제조업',
    zh: '制造业',
    ru: 'Производство',
    ar: 'التصنيع'
  },
  'E-commerce': {
    en: 'E-commerce',
    es: 'Comercio Electrónico',
    ja: 'Eコマース',
    fr: 'E-commerce',
    de: 'E-Commerce',
    pt: 'E-commerce',
    it: 'E-commerce',
    ko: '전자상거래',
    zh: '电子商务',
    ru: 'Электронная коммерция',
    ar: 'التجارة الإلكترونية'
  },
  'Renewable Energy': {
    en: 'Renewable Energy',
    es: 'Energía Renovable',
    ja: '再生可能エネルギー',
    fr: 'Énergie Renouvelable',
    de: 'Erneuerbare Energien',
    pt: 'Energia Renovável',
    it: 'Energia Rinnovabile',
    ko: '재생 에너지',
    zh: '可再生能源',
    ru: 'Возобновляемая энергия',
    ar: 'الطاقة المتجددة'
  },
  'Biotechnology': {
    en: 'Biotechnology',
    es: 'Biotecnología',
    ja: 'バイオテクノロジー',
    fr: 'Biotechnologie',
    de: 'Biotechnologie',
    pt: 'Biotecnologia',
    it: 'Biotecnologia',
    ko: '생명공학',
    zh: '生物技术',
    ru: 'Биотехнология',
    ar: 'التكنولوجيا الحيوية'
  },
  'Fintech': {
    en: 'Fintech',
    es: 'Fintech',
    ja: 'フィンテック',
    fr: 'Fintech',
    de: 'Fintech',
    pt: 'Fintech',
    it: 'Fintech',
    ko: '핀테크',
    zh: '金融科技',
    ru: 'Финтех',
    ar: 'التكنولوجيا المالية'
  },
  'Print Media': {
    en: 'Print Media',
    es: 'Medios Impresos',
    ja: '印刷メディア',
    fr: 'Médias Imprimés',
    de: 'Printmedien',
    pt: 'Mídia Impressa',
    it: 'Stampa',
    ko: '인쇄 미디어',
    zh: '印刷媒体',
    ru: 'Печатные СМИ',
    ar: 'الإعلام المطبوع'
  },
  'Traditional Retail': {
    en: 'Traditional Retail',
    es: 'Venta al Por Menor Tradicional',
    ja: '伝統的小売',
    fr: 'Commerce de Détail Traditionnel',
    de: 'Traditioneller Einzelhandel',
    pt: 'Varejo Tradicional',
    it: 'Vendita al Dettaglio Tradizionale',
    ko: '전통 소매업',
    zh: '传统零售',
    ru: 'Традиционная розница',
    ar: 'التجارة التقليدية'
  },
  'Coal Mining': {
    en: 'Coal Mining',
    es: 'Minería de Carbón',
    ja: '石炭採掘',
    fr: 'Extraction de Charbon',
    de: 'Kohlebergbau',
    pt: 'Mineração de Carvão',
    it: 'Estrazione del Carbone',
    ko: '석탄 채굴',
    zh: '煤炭开采',
    ru: 'Добыча угля',
    ar: 'تعدين الفحم'
  },
  'Telemarketing': {
    en: 'Telemarketing',
    es: 'Telemarketing',
    ja: 'テレマーケティング',
    fr: 'Télémarketing',
    de: 'Telemarketing',
    pt: 'Telemarketing',
    it: 'Telemarketing',
    ko: '텔레마케팅',
    zh: '电话营销',
    ru: 'Телемаркетинг',
    ar: 'التسويق عبر الهاتف'
  },
  'Video Rental': {
    en: 'Video Rental',
    es: 'Alquiler de Videos',
    ja: 'ビデオレンタル',
    fr: 'Location de Vidéos',
    de: 'Videoverleih',
    pt: 'Locação de Vídeos',
    it: 'Noleggio Video',
    ko: '비디오 대여',
    zh: '视频租赁',
    ru: 'Аренда видео',
    ar: 'تأجير الفيديو'
  },
  'Newspaper Publishing': {
    en: 'Newspaper Publishing',
    es: 'Publicación de Periódicos',
    ja: '新聞出版',
    fr: 'Édition de Journaux',
    de: 'Zeitungsverlag',
    pt: 'Publicação de Jornais',
    it: 'Editoria di Giornali',
    ko: '신문 출판',
    zh: '报纸出版',
    ru: 'Издание газет',
    ar: 'نشر الصحف'
  }
};

async function populateSkillTranslations() {
  console.log('🔧 Populating skill translations...');

  try {
    for (const [skillKey, translations] of Object.entries(skillTranslations)) {
      for (const [languageCode, translation] of Object.entries(translations)) {
        const { error } = await supabase
          .from('skill_translations')
          .upsert({
            skill_key: skillKey,
            language_code: languageCode,
            skill_name: translation,
            skill_category: 'technical',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'skill_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting skill translation for ${skillKey} (${languageCode}):`, error);
        } else {
          console.log(`✅ Added skill translation: ${skillKey} -> ${translation} (${languageCode})`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error during skill translation population:', error);
  }
}

async function populateIndustryTranslations() {
  console.log('🏭 Populating industry translations...');

  try {
    for (const [industryKey, translations] of Object.entries(industryTranslations)) {
      for (const [languageCode, translation] of Object.entries(translations)) {
        const { error } = await supabase
          .from('industry_translations')
          .upsert({
            industry_key: industryKey,
            language_code: languageCode,
            industry_name: translation,
            industry_description: `${translation} industry`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'industry_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting industry translation for ${industryKey} (${languageCode}):`, error);
        } else {
          console.log(`✅ Added industry translation: ${industryKey} -> ${translation} (${languageCode})`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error during industry translation population:', error);
  }
}

async function main() {
  console.log('🌍 Starting skill and industry translation population...');
  
  await populateSkillTranslations();
  await populateIndustryTranslations();
  
  console.log('\n✅ Skill and industry translation population completed!');
}

// Run the population
main();
