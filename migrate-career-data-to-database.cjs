const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Language mapping
const languageMap = {
  'en': 'English',
  'ja': 'Japanese', 
  'ko': 'Korean',
  'zh': 'Chinese',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ar': 'Arabic'
};

// Translation data for all languages
const translations = {
  'en': {
    'software-development': { name: 'Software Development', description: 'Career path for software development roles' },
    'healthcare-nursing': { name: 'Nursing Career Path', description: 'Career path for nursing and healthcare roles' },
    'business-management': { name: 'Business Management', description: 'Career path for business management roles' },
    'finance-analyst': { name: 'Finance Analyst', description: 'Career path for finance and analysis roles' },
    'marketing-careers': { name: 'Marketing Careers', description: 'Career path for marketing and advertising roles' },
    'education-careers': { name: 'Education Careers', description: 'Career path for education and teaching roles' },
    'creative-careers': { name: 'Creative Careers', description: 'Career path for creative and design roles' },
    'engineering-careers': { name: 'Engineering Careers', description: 'Career path for engineering roles' },
    'science-careers': { name: 'Science Careers', description: 'Career path for scientific research roles' },
    'legal-careers': { name: 'Legal Careers', description: 'Career path for legal and law roles' },
    'government-careers': { name: 'Government Careers', description: 'Career path for government and public service roles' },
    'nonprofit-careers': { name: 'Nonprofit Careers', description: 'Career path for nonprofit and social work roles' },
    'trades-careers': { name: 'Skilled Trades', description: 'Career path for skilled trades and crafts' },
    'hospitality-careers': { name: 'Hospitality Careers', description: 'Career path for hospitality and service roles' },
    'media-careers': { name: 'Media & Entertainment', description: 'Career path for media and entertainment roles' },
    'digital-creator-careers': { name: 'Digital Creator', description: 'Career path for digital content creation' },
    'drones-aviation-careers': { name: 'Drones & Aviation', description: 'Career path for drones and aviation technology' },
    'gaming-casino-careers': { name: 'Gaming & Casino', description: 'Career path for gaming and casino operations' },
    'investment-finance-careers': { name: 'Investment & Finance', description: 'Career path for investment and financial services' },
    'marine-science-careers': { name: 'Marine Science', description: 'Career path for marine and ocean sciences' },
    'middle-management-careers': { name: 'Middle Management', description: 'Career path for middle management roles' },
    'military-careers': { name: 'Military & Defense', description: 'Career path for military and defense roles' },
    'music-careers': { name: 'Music & Audio', description: 'Career path for music and audio production' },
    'public-service-careers': { name: 'Public Service', description: 'Career path for public service and administration' },
    'real-estate-careers': { name: 'Real Estate', description: 'Career path for real estate and property management' },
    'sanitation-careers': { name: 'Sanitation & Maintenance', description: 'Career path for sanitation and maintenance services' },
    'specialized-trades-careers': { name: 'Specialized Trades', description: 'Career path for specialized technical trades' },
    'agriculture-careers': { name: 'Agriculture & Food', description: 'Career path for agriculture and food production' },
    'manufacturing-careers': { name: 'Manufacturing', description: 'Career path for manufacturing and production' },
    'retail-careers': { name: 'Retail & Sales', description: 'Career path for retail and sales roles' },
    'transportation-careers': { name: 'Transportation & Logistics', description: 'Career path for transportation and logistics' },
    'emergency-services-careers': { name: 'Emergency Services', description: 'Career path for emergency and safety services' },
    'emerging-tech-careers': { name: 'Emerging Technology', description: 'Career path for emerging and cutting-edge technology' },
    'tech-cybersecurity': { name: 'Cybersecurity', description: 'Career path for cybersecurity and information security' },
    'tech-data-science': { name: 'Data Science', description: 'Career path for data science and analytics' },
    'global-tech': { name: 'Global Technology', description: 'Career path for global technology roles' }
  },
  'ja': {
    'software-development': { name: 'ソフトウェア開発', description: 'ソフトウェア開発職のキャリアパス' },
    'healthcare-nursing': { name: '看護キャリアパス', description: '看護・医療職のキャリアパス' },
    'business-management': { name: 'ビジネス管理', description: 'ビジネス管理職のキャリアパス' },
    'finance-analyst': { name: '金融アナリスト', description: '金融・分析職のキャリアパス' },
    'marketing-careers': { name: 'マーケティングキャリア', description: 'マーケティング・広告職のキャリアパス' },
    'education-careers': { name: '教育キャリア', description: '教育・指導職のキャリアパス' },
    'creative-careers': { name: 'クリエイティブキャリア', description: 'クリエイティブ・デザイン職のキャリアパス' },
    'engineering-careers': { name: 'エンジニアリングキャリア', description: 'エンジニアリング職のキャリアパス' },
    'science-careers': { name: '科学キャリア', description: '科学研究職のキャリアパス' },
    'legal-careers': { name: '法務キャリア', description: '法務・法律職のキャリアパス' },
    'government-careers': { name: '政府キャリア', description: '政府・公務員職のキャリアパス' },
    'nonprofit-careers': { name: '非営利キャリア', description: '非営利・社会福祉職のキャリアパス' },
    'trades-careers': { name: '熟練技能', description: '熟練技能・職人職のキャリアパス' },
    'hospitality-careers': { name: 'ホスピタリティキャリア', description: 'ホスピタリティ・サービス職のキャリアパス' },
    'media-careers': { name: 'メディア・エンターテイメント', description: 'メディア・エンターテイメント職のキャリアパス' },
    'digital-creator-careers': { name: 'デジタルクリエイター', description: 'デジタルコンテンツ制作のキャリアパス' },
    'drones-aviation-careers': { name: 'ドローン・航空', description: 'ドローン・航空技術のキャリアパス' },
    'gaming-casino-careers': { name: 'ゲーミング・カジノ', description: 'ゲーミング・カジノ運営のキャリアパス' },
    'investment-finance-careers': { name: '投資・金融', description: '投資・金融サービスのキャリアパス' },
    'marine-science-careers': { name: '海洋科学', description: '海洋・海洋科学のキャリアパス' },
    'middle-management-careers': { name: '中間管理', description: '中間管理職のキャリアパス' },
    'military-careers': { name: '軍事・防衛', description: '軍事・防衛職のキャリアパス' },
    'music-careers': { name: '音楽・オーディオ', description: '音楽・オーディオ制作のキャリアパス' },
    'public-service-careers': { name: '公共サービス', description: '公共サービス・行政のキャリアパス' },
    'real-estate-careers': { name: '不動産', description: '不動産・資産管理のキャリアパス' },
    'sanitation-careers': { name: '衛生・メンテナンス', description: '衛生・メンテナンスサービスのキャリアパス' },
    'specialized-trades-careers': { name: '専門技能', description: '専門技術職のキャリアパス' },
    'agriculture-careers': { name: '農業・食品', description: '農業・食品生産のキャリアパス' },
    'manufacturing-careers': { name: '製造業', description: '製造・生産のキャリアパス' },
    'retail-careers': { name: '小売・販売', description: '小売・販売職のキャリアパス' },
    'transportation-careers': { name: '運輸・物流', description: '運輸・物流のキャリアパス' },
    'emergency-services-careers': { name: '緊急サービス', description: '緊急・安全サービスのキャリアパス' },
    'emerging-tech-careers': { name: '新興技術', description: '新興・最先端技術のキャリアパス' },
    'tech-cybersecurity': { name: 'サイバーセキュリティ', description: 'サイバーセキュリティ・情報セキュリティのキャリアパス' },
    'tech-data-science': { name: 'データサイエンス', description: 'データサイエンス・分析のキャリアパス' },
    'global-tech': { name: 'グローバルテクノロジー', description: 'グローバルテクノロジー職のキャリアパス' }
  }
  // Add more languages as needed...
};

// Career node translations (sample for key roles)
const careerNodeTranslations = {
  'en': {
    'junior-dev': {
      title: 'Junior Developer',
      description: 'Entry-level position focused on building and maintaining websites under supervision.',
      skills: ['JavaScript', 'HTML/CSS', 'Git', 'Basic Algorithms', 'SQL'],
      certifications: ['AWS Certified Cloud Practitioner', 'Scrum Foundation'],
      job_titles: ['Junior Software Engineer', 'Associate Developer', 'Code Apprentice']
    },
    'mid-dev': {
      title: 'Mid-Level Developer',
      description: 'Builds complex web applications and mentors junior developers.',
      skills: ['React/Vue/Angular', 'Node.js', 'API Integration', 'Testing', 'Database Design'],
      certifications: ['AWS Certified Developer', 'Microsoft Certified: JavaScript Developer'],
      job_titles: ['Software Engineer', 'Full Stack Developer', 'Web Developer']
    },
    'senior-dev': {
      title: 'Senior Developer',
      description: 'Leads development teams and makes high-level architectural decisions.',
      skills: ['System Architecture', 'Performance Optimization', 'Team Leadership', 'DevOps', 'Code Review'],
      certifications: ['Google Professional Cloud Developer', 'AWS Solutions Architect'],
      job_titles: ['Senior Software Engineer', 'Lead Developer', 'Technical Lead']
    }
  },
  'ja': {
    'junior-dev': {
      title: 'ジュニア開発者',
      description: '監督下でウェブサイトの構築と保守に焦点を当てたエントリーレベルのポジション。',
      skills: ['JavaScript', 'HTML/CSS', 'Git', '基本アルゴリズム', 'SQL'],
      certifications: ['AWS認定クラウドプラクティショナー', 'スクラムファンデーション'],
      job_titles: ['ジュニアソフトウェアエンジニア', 'アソシエイト開発者', 'コード見習い']
    },
    'mid-dev': {
      title: 'ミドルレベル開発者',
      description: '複雑なウェブアプリケーションを構築し、ジュニア開発者を指導します。',
      skills: ['React/Vue/Angular', 'Node.js', 'API統合', 'テスト', 'データベース設計'],
      certifications: ['AWS認定開発者', 'Microsoft認定：JavaScript開発者'],
      job_titles: ['ソフトウェアエンジニア', 'フルスタック開発者', 'ウェブ開発者']
    },
    'senior-dev': {
      title: 'シニア開発者',
      description: '開発チームを率い、高レベルのアーキテクチャ決定を行います。',
      skills: ['システムアーキテクチャ', 'パフォーマンス最適化', 'チームリーダーシップ', 'DevOps', 'コードレビュー'],
      certifications: ['Google Professional Cloud Developer', 'AWSソリューションアーキテクト'],
      job_titles: ['シニアソフトウェアエンジニア', 'リード開発者', 'テクニカルリード']
    }
  }
  // Add more languages as needed...
};

async function migrateCareerData() {
  console.log('🚀 Starting career data migration to Supabase...\n');

  try {
    // Read all JSON files from the careerPaths directory
    const careerPathsDir = path.join(__dirname, 'src', 'data', 'careerPaths');
    const files = fs.readdirSync(careerPathsDir).filter(file => file.endsWith('.json'));

    console.log(`📁 Found ${files.length} career path files to migrate`);

    for (const file of files) {
      const filePath = path.join(careerPathsDir, file);
      const careerData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      console.log(`\n📄 Processing ${file}...`);

      // Extract career path ID from filename
      const careerPathId = path.basename(file, '.json');
      
      // Insert career path
      const { error: pathError } = await supabase
        .from('career_paths')
        .upsert({
          id: careerPathId,
          name: careerData.n || careerData.name || 'Unknown',
          category: careerData.cat || 'unknown',
          industry: careerData.cat || 'unknown',
          description: careerData.description || null
        });

      if (pathError) {
        console.error(`❌ Error inserting career path ${careerPathId}:`, pathError);
        continue;
      }

      // Insert career path translations
      for (const [langCode, langName] of Object.entries(languageMap)) {
        const translation = translations[langCode]?.[careerPathId];
        if (translation) {
          const { error: transError } = await supabase
            .from('career_path_translations')
            .upsert({
              career_path_id: careerPathId,
              language_code: langCode,
              name: translation.name,
              description: translation.description
            });

          if (transError) {
            console.error(`❌ Error inserting path translation for ${careerPathId} (${langCode}):`, transError);
          }
        }
      }

      // Process career nodes
      if (careerData.nodes && Array.isArray(careerData.nodes)) {
        for (const node of careerData.nodes) {
          console.log(`  📋 Processing node: ${node.id}`);

          // Insert career node
          const { error: nodeError } = await supabase
            .from('career_nodes')
            .upsert({
              id: node.id,
              career_path_id: careerPathId,
              level: node.l || 'E',
              salary_range: node.sr || null,
              time_to_achieve: node.te || null,
              requirements: node.r || null
            });

          if (nodeError) {
            console.error(`❌ Error inserting career node ${node.id}:`, nodeError);
            continue;
          }

          // Insert career node translations
          for (const [langCode, langName] of Object.entries(languageMap)) {
            const translation = careerNodeTranslations[langCode]?.[node.id];
            
            // Use translation if available, otherwise use English data
            const nodeTranslation = translation || {
              title: node.t || 'Unknown Title',
              description: node.d || 'No description available',
              skills: node.s || [],
              certifications: node.c || [],
              job_titles: node.jt || []
            };

            const { error: nodeTransError } = await supabase
              .from('career_node_translations')
              .upsert({
                career_node_id: node.id,
                language_code: langCode,
                title: nodeTranslation.title,
                description: nodeTranslation.description,
                skills: nodeTranslation.skills,
                certifications: nodeTranslation.certifications,
                job_titles: nodeTranslation.job_titles
              });

            if (nodeTransError) {
              console.error(`❌ Error inserting node translation for ${node.id} (${langCode}):`, nodeTransError);
            }
          }
        }
      }

      console.log(`✅ Successfully migrated ${file}`);
    }

    console.log('\n🎉 Career data migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${files.length} career paths migrated`);
    console.log(`   • ${Object.keys(languageMap).length} languages supported`);
    console.log('   • All data now available in Supabase database');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateCareerData();
