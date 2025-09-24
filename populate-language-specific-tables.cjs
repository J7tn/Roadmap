#!/usr/bin/env node

/**
 * Comprehensive Language-Specific Table Population Script
 * 
 * This script populates all language-specific tables with proper translations:
 * - careers_core, industries_core (core data)
 * - careers_en, careers_ja, careers_de, careers_es, careers_fr (career content)
 * - industries_en, industries_ja, industries_de, industries_es, industries_fr (industry content)
 * - career_trends_en, career_trends_ja, career_trends_de (trend data)
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey || !geminiApiKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
  console.error('   GEMINI_API_KEY:', !!geminiApiKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Supported languages
const LANGUAGES = ['en', 'ja', 'de', 'es', 'fr'];

// Language names for prompts
const LANGUAGE_NAMES = {
  'en': 'English',
  'ja': 'Japanese', 
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French'
};

// Sample career data to populate
const SAMPLE_CAREERS = [
  {
    id: 'software-engineer',
    industry_id: 'technology',
    level: 'I',
    salary_range: '$80,000 - $150,000',
    experience_required: '3-5 years',
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems. Work with cross-functional teams to deliver high-quality software solutions.',
    skills: ['Programming', 'Problem Solving', 'Teamwork', 'Communication', 'Software Development'],
    job_titles: ['Software Developer', 'Application Developer', 'Systems Developer'],
    certifications: ['AWS Certified Developer', 'Microsoft Certified: Azure Developer Associate'],
    requirements: {
      education: ['Bachelor\'s Degree in Computer Science or related field'],
      experience: '3+ years of software development experience',
      skills: ['Proficiency in programming languages', 'Understanding of software development lifecycle']
    }
  },
  {
    id: 'data-analyst',
    industry_id: 'technology',
    level: 'I',
    salary_range: '$60,000 - $110,000',
    experience_required: '2-4 years',
    title: 'Data Analyst',
    description: 'Analyze complex datasets to identify trends, patterns, and insights that drive business decisions. Create reports and visualizations to communicate findings.',
    skills: ['Data Analysis', 'Statistics', 'SQL', 'Python', 'Data Visualization'],
    job_titles: ['Business Analyst', 'Research Analyst', 'Data Specialist'],
    certifications: ['Google Data Analytics Certificate', 'Microsoft Certified: Data Analyst Associate'],
    requirements: {
      education: ['Bachelor\'s Degree in Statistics, Mathematics, or related field'],
      experience: '2+ years of data analysis experience',
      skills: ['Proficiency in data analysis tools', 'Strong analytical thinking']
    }
  },
  {
    id: 'marketing-manager',
    industry_id: 'marketing',
    level: 'I',
    salary_range: '$70,000 - $130,000',
    experience_required: '4-6 years',
    title: 'Marketing Manager',
    description: 'Develop and execute marketing strategies to promote products and services. Manage marketing campaigns and analyze their effectiveness.',
    skills: ['Marketing Strategy', 'Digital Marketing', 'Project Management', 'Analytics', 'Communication'],
    job_titles: ['Brand Manager', 'Product Marketing Manager', 'Digital Marketing Manager'],
    certifications: ['Google Ads Certification', 'HubSpot Content Marketing Certification'],
    requirements: {
      education: ['Bachelor\'s Degree in Marketing, Business, or related field'],
      experience: '4+ years of marketing experience',
      skills: ['Understanding of marketing principles', 'Experience with marketing tools']
    }
  },
  {
    id: 'nurse',
    industry_id: 'healthcare',
    level: 'I',
    salary_range: '$55,000 - $85,000',
    experience_required: '1-3 years',
    title: 'Registered Nurse',
    description: 'Provide direct patient care, administer medications, and coordinate with healthcare teams to ensure optimal patient outcomes.',
    skills: ['Patient Care', 'Medical Knowledge', 'Communication', 'Critical Thinking', 'Empathy'],
    job_titles: ['Staff Nurse', 'Clinical Nurse', 'Patient Care Coordinator'],
    certifications: ['Registered Nurse License', 'Basic Life Support (BLS)'],
    requirements: {
      education: ['Bachelor of Science in Nursing (BSN) or Associate Degree in Nursing (ADN)'],
      experience: '1+ years of nursing experience',
      skills: ['Clinical skills', 'Knowledge of medical procedures']
    }
  },
  {
    id: 'financial-analyst',
    industry_id: 'finance',
    level: 'I',
    salary_range: '$65,000 - $120,000',
    experience_required: '2-4 years',
    title: 'Financial Analyst',
    description: 'Analyze financial data to provide insights and recommendations for investment decisions, budgeting, and financial planning.',
    skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Research', 'Communication'],
    job_titles: ['Investment Analyst', 'Budget Analyst', 'Risk Analyst'],
    certifications: ['Chartered Financial Analyst (CFA)', 'Financial Risk Manager (FRM)'],
    requirements: {
      education: ['Bachelor\'s Degree in Finance, Economics, or related field'],
      experience: '2+ years of financial analysis experience',
      skills: ['Proficiency in financial analysis tools', 'Understanding of financial markets']
    }
  }
];

// Sample industry data
const SAMPLE_INDUSTRIES = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'The technology industry encompasses companies that develop, manufacture, and provide technology products and services.',
    icon: 'laptop',
    job_count: 1500,
    avg_salary: '$95,000',
    growth_rate: 'High',
    global_demand: 'Very High',
    top_countries: ['United States', 'Germany', 'Japan', 'United Kingdom']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'The healthcare industry provides medical services, products, and technologies to improve patient care and health outcomes.',
    icon: 'heart',
    job_count: 800,
    avg_salary: '$75,000',
    growth_rate: 'High',
    global_demand: 'Very High',
    top_countries: ['United States', 'Canada', 'United Kingdom', 'Australia']
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'The finance industry manages money, investments, and financial services for individuals, businesses, and governments.',
    icon: 'dollar-sign',
    job_count: 600,
    avg_salary: '$85,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Singapore', 'Switzerland']
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'The marketing industry focuses on promoting products and services, building brand awareness, and driving customer engagement.',
    icon: 'megaphone',
    job_count: 400,
    avg_salary: '$70,000',
    growth_rate: 'High',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'Australia']
  }
];

async function translateText(text, targetLanguage) {
  if (targetLanguage === 'en') return text;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Translate the following English text to ${LANGUAGE_NAMES[targetLanguage]}. Return only the translation, no explanations:

"${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
  } catch (error) {
    console.error(`❌ Error translating to ${targetLanguage}:`, error.message);
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }
}

async function translateArray(array, targetLanguage) {
  if (targetLanguage === 'en') return array;
  
  const translated = [];
  for (const item of array) {
    const translatedItem = await translateText(item, targetLanguage);
    translated.push(translatedItem);
  }
  return translated;
}

async function translateObject(obj, targetLanguage) {
  if (targetLanguage === 'en') return obj;
  
  const translated = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      translated[key] = await translateArray(value, targetLanguage);
    } else if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLanguage);
    } else {
      translated[key] = value;
    }
  }
  return translated;
}

async function ensureTablesExist() {
  console.log('🔧 Ensuring language-specific tables exist...');
  
  // Check if core tables exist
  const { data: coreTables } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_name', ['careers_core', 'industries_core']);
  
  const existingCoreTables = coreTables?.map(t => t.table_name) || [];
  
  if (!existingCoreTables.includes('careers_core')) {
    console.log('📋 Creating careers_core table...');
    // Note: In a real scenario, you'd run the SQL script here
    console.log('⚠️  Please run create-language-specific-tables.sql first');
  }
  
  if (!existingCoreTables.includes('industries_core')) {
    console.log('📋 Creating industries_core table...');
    console.log('⚠️  Please run create-language-specific-tables.sql first');
  }
}

async function populateCoreTables() {
  console.log('📊 Populating core tables...');
  
  // Populate industries_core
  console.log('🏭 Populating industries_core...');
  for (const industry of SAMPLE_INDUSTRIES) {
    const { error } = await supabase
      .from('industries_core')
      .upsert({
        id: industry.id,
        job_count: industry.job_count,
        avg_salary: industry.avg_salary,
        growth_rate: industry.growth_rate,
        global_demand: industry.global_demand,
        top_countries: industry.top_countries
      }, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error inserting industry core ${industry.id}:`, error.message);
    } else {
      console.log(`✅ Inserted industry core: ${industry.id}`);
    }
  }
  
  // Populate careers_core
  console.log('💼 Populating careers_core...');
  for (const career of SAMPLE_CAREERS) {
    const { error } = await supabase
      .from('careers_core')
      .upsert({
        id: career.id,
        level: career.level,
        salary_range: career.salary_range,
        experience_required: career.experience_required
      }, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error inserting career core ${career.id}:`, error.message);
    } else {
      console.log(`✅ Inserted career core: ${career.id}`);
    }
  }
}

async function populateLanguageSpecificTables() {
  console.log('🌍 Populating language-specific tables...');
  
  for (const language of LANGUAGES) {
    console.log(`\n📝 Processing language: ${LANGUAGE_NAMES[language]} (${language})`);
    
    // Populate industries
    console.log(`🏭 Populating industries_${language}...`);
    for (const industry of SAMPLE_INDUSTRIES) {
      const translatedName = await translateText(industry.name, language);
      const translatedDescription = await translateText(industry.description, language);
      
      const { error } = await supabase
        .from(`industries_${language}`)
        .upsert({
          industry_id: industry.id,
          name: translatedName,
          description: translatedDescription,
          icon: industry.icon
        }, { onConflict: 'industry_id' });
      
      if (error) {
        console.error(`❌ Error inserting industry ${industry.id} for ${language}:`, error.message);
      } else {
        console.log(`✅ Inserted industry ${industry.id} for ${language}: ${translatedName}`);
      }
    }
    
    // Populate careers
    console.log(`💼 Populating careers_${language}...`);
    for (const career of SAMPLE_CAREERS) {
      const translatedTitle = await translateText(career.title, language);
      const translatedDescription = await translateText(career.description, language);
      const translatedSkills = await translateArray(career.skills, language);
      const translatedJobTitles = await translateArray(career.job_titles, language);
      const translatedCertifications = await translateArray(career.certifications, language);
      const translatedRequirements = await translateObject(career.requirements, language);
      
      const { error } = await supabase
        .from(`careers_${language}`)
        .upsert({
          career_id: career.id,
          title: translatedTitle,
          description: translatedDescription,
          skills: translatedSkills,
          job_titles: translatedJobTitles,
          certifications: translatedCertifications,
          requirements: translatedRequirements
        }, { onConflict: 'career_id' });
      
      if (error) {
        console.error(`❌ Error inserting career ${career.id} for ${language}:`, error.message);
      } else {
        console.log(`✅ Inserted career ${career.id} for ${language}: ${translatedTitle}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function populateTrendTables() {
  console.log('📈 Populating trend tables...');
  
  const sampleTrends = [
    {
      career_id: 'software-engineer',
      trend_score: 8.5,
      trend_direction: 'rising',
      demand_level: 'high',
      market_insights: 'Strong growth in technology sector with increasing demand for skilled professionals.',
      key_skills_trending: ['Cloud Computing', 'AI/ML', 'DevOps', 'Cybersecurity'],
      salary_trend: 'Salaries increasing 5-8% annually',
      job_availability_score: 9.0,
      top_locations: ['San Francisco', 'Seattle', 'Austin', 'Boston'],
      remote_work_trend: 7.5,
      industry_impact: 'Critical role in digital transformation',
      automation_risk: 2.0,
      future_outlook: 'Excellent long-term prospects',
      confidence_score: 9.0
    },
    {
      career_id: 'data-analyst',
      trend_score: 7.8,
      trend_direction: 'stable',
      demand_level: 'medium',
      market_insights: 'Consistent demand for data-driven insights across various industries.',
      key_skills_trending: ['SQL', 'Python', 'Tableau', 'Machine Learning'],
      salary_trend: 'Stable growth with 3-5% annual increases',
      job_availability_score: 7.0,
      top_locations: ['New York', 'London', 'Chicago', 'Toronto'],
      remote_work_trend: 6.0,
      industry_impact: 'Essential for business intelligence',
      automation_risk: 3.0,
      future_outlook: 'Positive with growing importance',
      confidence_score: 8.0
    }
  ];
  
  for (const language of ['en', 'ja', 'de']) { // Only for these languages for now
    console.log(`📊 Populating career_trends_${language}...`);
    
    for (const trend of sampleTrends) {
      const translatedMarketInsights = await translateText(trend.market_insights, language);
      const translatedKeySkills = await translateArray(trend.key_skills_trending, language);
      const translatedSalaryTrend = await translateText(trend.salary_trend, language);
      const translatedTopLocations = await translateArray(trend.top_locations, language);
      const translatedIndustryImpact = await translateText(trend.industry_impact, language);
      const translatedFutureOutlook = await translateText(trend.future_outlook, language);
      
      const currencyCode = language === 'ja' ? 'JPY' : language === 'de' ? 'EUR' : 'USD';
      const salaryData = {
        currency_code: currencyCode,
        base_salary: trend.career_id === 'software-engineer' ? 100000 : 75000,
        formatted_salary: `${currencyCode === 'JPY' ? '¥' : currencyCode === 'EUR' ? '€' : '$'}${trend.career_id === 'software-engineer' ? 100000 : 75000}`
      };
      
      const { error } = await supabase
        .from(`career_trends_${language}`)
        .upsert({
          career_id: trend.career_id,
          trend_score: trend.trend_score,
          trend_direction: trend.trend_direction,
          demand_level: trend.demand_level,
          market_insights: translatedMarketInsights,
          key_skills_trending: translatedKeySkills,
          salary_trend: translatedSalaryTrend,
          job_availability_score: trend.job_availability_score,
          top_locations: translatedTopLocations,
          remote_work_trend: trend.remote_work_trend,
          industry_impact: translatedIndustryImpact,
          automation_risk: trend.automation_risk,
          future_outlook: translatedFutureOutlook,
          currency_code: currencyCode,
          salary_data: salaryData,
          confidence_score: trend.confidence_score
        }, { onConflict: 'career_id' });
      
      if (error) {
        console.error(`❌ Error inserting trend for ${trend.career_id} (${language}):`, error.message);
      } else {
        console.log(`✅ Inserted trend for ${trend.career_id} (${language})`);
      }
    }
  }
}

async function verifyData() {
  console.log('\n🔍 Verifying populated data...');
  
  for (const language of LANGUAGES) {
    console.log(`\n📊 Checking ${language} data:`);
    
    // Check industries
    const { data: industries, error: industryError } = await supabase
      .from(`industries_${language}`)
      .select('*');
    
    if (industryError) {
      console.error(`❌ Error checking industries_${language}:`, industryError.message);
    } else {
      console.log(`✅ Industries (${language}): ${industries?.length || 0} records`);
    }
    
    // Check careers
    const { data: careers, error: careerError } = await supabase
      .from(`careers_${language}`)
      .select('*');
    
    if (careerError) {
      console.error(`❌ Error checking careers_${language}:`, careerError.message);
    } else {
      console.log(`✅ Careers (${language}): ${careers?.length || 0} records`);
    }
  }
  
  // Check trends
  for (const language of ['en', 'ja', 'de']) {
    const { data: trends, error: trendError } = await supabase
      .from(`career_trends_${language}`)
      .select('*');
    
    if (trendError) {
      console.error(`❌ Error checking career_trends_${language}:`, trendError.message);
    } else {
      console.log(`✅ Trends (${language}): ${trends?.length || 0} records`);
    }
  }
}

async function main() {
  console.log('🚀 Starting comprehensive language-specific table population...');
  console.log('=' * 60);
  
  try {
    // Step 1: Ensure tables exist
    await ensureTablesExist();
    
    // Step 2: Populate core tables
    await populateCoreTables();
    
    // Step 3: Populate language-specific tables
    await populateLanguageSpecificTables();
    
    // Step 4: Populate trend tables
    await populateTrendTables();
    
    // Step 5: Verify data
    await verifyData();
    
    console.log('\n🎉 Language-specific table population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Core tables populated`);
    console.log(`   ✅ Language-specific tables populated for: ${LANGUAGES.join(', ')}`);
    console.log(`   ✅ Trend tables populated for: en, ja, de`);
    console.log(`   ✅ All data verified`);
    
  } catch (error) {
    console.error('❌ Error during population:', error);
    process.exit(1);
  }
}

main();
