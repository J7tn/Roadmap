const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample career trend translations for all 11 languages
const careerTrendTranslations = {
  'software-engineer': {
    ja: {
      trend_description: "ソフトウェアエンジニアの市場動向と将来性について",
      market_insights: "ソフトウェアエンジニアの需要は急速に成長しており、特にAI、クラウドコンピューティング、モバイル開発の分野で高い需要があります。",
      salary_trend: "給与は年々上昇しており、経験豊富なエンジニアは特に高い報酬を得ています。",
      industry_impact: "テクノロジー業界の成長により、ソフトウェアエンジニアの役割はますます重要になっています。",
      future_outlook: "AI、IoT、ブロックチェーンなどの新技術により、将来性は非常に高いです。",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["東京", "大阪", "名古屋", "福岡", "札幌"]
    },
    ko: {
      trend_description: "소프트웨어 엔지니어의 시장 동향과 미래 전망",
      market_insights: "소프트웨어 엔지니어에 대한 수요가 급격히 증가하고 있으며, 특히 AI, 클라우드 컴퓨팅, 모바일 개발 분야에서 높은 수요를 보이고 있습니다.",
      salary_trend: "급여는 해마다 상승하고 있으며, 경험이 풍부한 엔지니어는 특히 높은 보상을 받고 있습니다.",
      industry_impact: "기술 산업의 성장으로 인해 소프트웨어 엔지니어의 역할이 점점 더 중요해지고 있습니다.",
      future_outlook: "AI, IoT, 블록체인 등의 신기술로 인해 미래 전망이 매우 밝습니다.",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["서울", "부산", "대구", "인천", "대전"]
    },
    zh: {
      trend_description: "软件工程师的市场趋势和未来前景",
      market_insights: "软件工程师的需求正在快速增长，特别是在AI、云计算、移动开发领域需求很高。",
      salary_trend: "薪资逐年上升，经验丰富的工程师尤其能获得高报酬。",
      industry_impact: "由于技术行业的增长，软件工程师的角色变得越来越重要。",
      future_outlook: "由于AI、IoT、区块链等新技术，未来前景非常光明。",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["北京", "上海", "深圳", "杭州", "广州"]
    },
    es: {
      trend_description: "Tendencias del mercado y perspectivas futuras para ingenieros de software",
      market_insights: "La demanda de ingenieros de software está creciendo rápidamente, especialmente en áreas como IA, computación en la nube y desarrollo móvil.",
      salary_trend: "Los salarios están aumentando año tras año, y los ingenieros experimentados reciben especialmente altas compensaciones.",
      industry_impact: "Debido al crecimiento de la industria tecnológica, el papel de los ingenieros de software se está volviendo cada vez más importante.",
      future_outlook: "Con nuevas tecnologías como IA, IoT y blockchain, las perspectivas futuras son muy brillantes.",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"]
    },
    fr: {
      trend_description: "Tendances du marché et perspectives d'avenir pour les ingénieurs logiciels",
      market_insights: "La demande d'ingénieurs logiciels croît rapidement, en particulier dans les domaines de l'IA, du cloud computing et du développement mobile.",
      salary_trend: "Les salaires augmentent d'année en année, et les ingénieurs expérimentés reçoivent des compensations particulièrement élevées.",
      industry_impact: "En raison de la croissance de l'industrie technologique, le rôle des ingénieurs logiciels devient de plus en plus important.",
      future_outlook: "Avec de nouvelles technologies comme l'IA, l'IoT et la blockchain, les perspectives futures sont très prometteuses.",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"]
    },
    de: {
      trend_description: "Markttrends und Zukunftsperspektiven für Software-Ingenieure",
      market_insights: "Die Nachfrage nach Software-Ingenieuren wächst schnell, insbesondere in Bereichen wie KI, Cloud-Computing und mobiler Entwicklung.",
      salary_trend: "Die Gehälter steigen von Jahr zu Jahr, und erfahrene Ingenieure erhalten besonders hohe Vergütungen.",
      industry_impact: "Aufgrund des Wachstums der Technologiebranche wird die Rolle von Software-Ingenieuren immer wichtiger.",
      future_outlook: "Mit neuen Technologien wie KI, IoT und Blockchain sind die Zukunftsperspektiven sehr vielversprechend.",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["Berlin", "München", "Hamburg", "Frankfurt", "Stuttgart"]
    },
    it: {
      trend_description: "Tendenze del mercato e prospettive future per gli ingegneri del software",
      market_insights: "La domanda di ingegneri del software sta crescendo rapidamente, specialmente in aree come IA, cloud computing e sviluppo mobile.",
      salary_trend: "Gli stipendi stanno aumentando di anno in anno, e gli ingegneri esperti ricevono compensazioni particolarmente elevate.",
      industry_impact: "A causa della crescita dell'industria tecnologica, il ruolo degli ingegneri del software sta diventando sempre più importante.",
      future_outlook: "Con nuove tecnologie come IA, IoT e blockchain, le prospettive future sono molto promettenti.",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["Roma", "Milano", "Napoli", "Torino", "Firenze"]
    },
    pt: {
      trend_description: "Tendências do mercado e perspectivas futuras para engenheiros de software",
      market_insights: "A demanda por engenheiros de software está crescendo rapidamente, especialmente em áreas como IA, computação em nuvem e desenvolvimento móvel.",
      salary_trend: "Os salários estão aumentando ano após ano, e engenheiros experientes recebem compensações particularmente altas.",
      industry_impact: "Devido ao crescimento da indústria de tecnologia, o papel dos engenheiros de software está se tornando cada vez mais importante.",
      future_outlook: "Com novas tecnologias como IA, IoT e blockchain, as perspectivas futuras são muito promissoras.",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza"]
    },
    ru: {
      trend_description: "Рыночные тенденции и перспективы будущего для инженеров-программистов",
      market_insights: "Спрос на инженеров-программистов быстро растет, особенно в областях ИИ, облачных вычислений и мобильной разработки.",
      salary_trend: "Зарплаты растут из года в год, а опытные инженеры получают особенно высокие компенсации.",
      industry_impact: "Из-за роста технологической индустрии роль инженеров-программистов становится все более важной.",
      future_outlook: "С новыми технологиями, такими как ИИ, IoT и блокчейн, перспективы будущего очень многообещающие.",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань"]
    },
    ar: {
      trend_description: "اتجاهات السوق والآفاق المستقبلية لمهندسي البرمجيات",
      market_insights: "الطلب على مهندسي البرمجيات ينمو بسرعة، خاصة في مجالات الذكاء الاصطناعي والحوسبة السحابية وتطوير الهواتف المحمولة.",
      salary_trend: "الرواتب ترتفع سنة بعد سنة، والمهندسون ذوو الخبرة يحصلون على تعويضات عالية بشكل خاص.",
      industry_impact: "بسبب نمو صناعة التكنولوجيا، دور مهندسي البرمجيات يصبح أكثر أهمية.",
      future_outlook: "مع التقنيات الجديدة مثل الذكاء الاصطناعي وإنترنت الأشياء والبلوك تشين، الآفاق المستقبلية واعدة جداً.",
      key_skills_trending: ["Python", "JavaScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"],
      top_locations: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام"]
    }
  }
};

// Supported languages
const supportedLanguages = ['en', 'ja', 'ko', 'zh', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar'];

// Helper functions to get translated content
function getTranslatedTrendDescription(careerId, language) {
  const translations = careerTrendTranslations[careerId];
  if (translations && translations[language]) {
    return translations[language].trend_description;
  }
  return `Market trends and future prospects for ${careerId}`;
}

function getTranslatedMarketInsights(careerId, language) {
  const translations = careerTrendTranslations[careerId];
  if (translations && translations[language]) {
    return translations[language].market_insights;
  }
  return `Market insights for ${careerId} in ${language}`;
}

function getTranslatedSalaryTrend(careerId, language) {
  const translations = careerTrendTranslations[careerId];
  if (translations && translations[language]) {
    return translations[language].salary_trend;
  }
  return `Salary trends for ${careerId} in ${language}`;
}

function getTranslatedIndustryImpact(careerId, language) {
  const translations = careerTrendTranslations[careerId];
  if (translations && translations[language]) {
    return translations[language].industry_impact;
  }
  return `Industry impact for ${careerId} in ${language}`;
}

function getTranslatedFutureOutlook(careerId, language) {
  const translations = careerTrendTranslations[careerId];
  if (translations && translations[language]) {
    return translations[language].future_outlook;
  }
  return `Future outlook for ${careerId} in ${language}`;
}

function getTranslatedKeySkills(careerId, language) {
  const translations = careerTrendTranslations[careerId];
  if (translations && translations[language]) {
    return translations[language].key_skills_trending;
  }
  return ["Python", "JavaScript", "React", "Node.js"];
}

function getTranslatedTopLocations(careerId, language) {
  const translations = careerTrendTranslations[careerId];
  if (translations && translations[language]) {
    return translations[language].top_locations;
  }
  return ["New York", "San Francisco", "London", "Tokyo"];
}

async function populateCareerTrendTranslations() {
  console.log('🚀 Populating career trend translations...\n');

  try {
    // First, let's get all existing career trend IDs from the career_trends table
    const { data: existingTrends, error: trendsError } = await supabase
      .from('career_trends')
      .select('id, career_id');

    if (trendsError) {
      console.error('❌ Error fetching existing trends:', trendsError);
      return;
    }

    if (!existingTrends || existingTrends.length === 0) {
      console.log('⚠️ No career trends found in the database');
      return;
    }

    console.log(`📊 Found ${existingTrends.length} career trends to translate\n`);

    let totalInserted = 0;
    let totalSkipped = 0;

    // Process each career trend
    for (const trend of existingTrends) {
      console.log(`🔄 Processing: ${trend.career_id} (ID: ${trend.id})`);

      // Process each language
      for (const language of supportedLanguages) {
        try {
          // Check if translation already exists
          const { data: existingTranslation, error: checkError } = await supabase
            .from('career_trend_translations')
            .select('id')
            .eq('career_trend_id', trend.id)
            .eq('language_code', language)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            console.error(`❌ Error checking existing translation for ${trend.career_id} (${language}):`, checkError);
            continue;
          }

          if (existingTranslation) {
            console.log(`  ⏭️ Translation already exists for ${language}`);
            totalSkipped++;
            continue;
          }

          // Create translation data
          const translationData = {
            career_trend_id: trend.id, // Use the UUID id from career_trends
            language_code: language,
            trend_description: getTranslatedTrendDescription(trend.career_id, language),
            market_insights: getTranslatedMarketInsights(trend.career_id, language),
            salary_trend: getTranslatedSalaryTrend(trend.career_id, language),
            industry_impact: getTranslatedIndustryImpact(trend.career_id, language),
            future_outlook: getTranslatedFutureOutlook(trend.career_id, language),
            key_skills_trending: getTranslatedKeySkills(trend.career_id, language),
            top_locations: getTranslatedTopLocations(trend.career_id, language)
          };

          // Insert translation
          const { error: insertError } = await supabase
            .from('career_trend_translations')
            .insert(translationData);

          if (insertError) {
            console.error(`❌ Error inserting translation for ${trend.career_id} (${language}):`, insertError);
            continue;
          }

          console.log(`  ✅ Inserted translation for ${language}`);
          totalInserted++;

        } catch (error) {
          console.error(`❌ Unexpected error for ${trend.career_id} (${language}):`, error);
        }
      }
    }

    console.log(`\n🎉 Population completed!`);
    console.log(`📊 Total inserted: ${totalInserted}`);
    console.log(`⏭️ Total skipped: ${totalSkipped}`);

  } catch (error) {
    console.error('❌ Unexpected error during population:', error);
  }
}

// Run the population
populateCareerTrendTranslations();
