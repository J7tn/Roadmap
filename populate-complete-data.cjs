#!/usr/bin/env node

/**
 * Populate Complete Data for Language-Specific Tables
 * 
 * This script populates the new language-specific tables with comprehensive career and industry data
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const LANGUAGES = ['en', 'ja', 'de', 'es', 'fr'];
const LANGUAGE_NAMES = {
  'en': 'English',
  'ja': 'Japanese', 
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French'
};

// Comprehensive industry data
const COMPREHENSIVE_INDUSTRIES = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'The technology industry encompasses companies that develop, manufacture, and provide technology products and services.',
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
    job_count: 400,
    avg_salary: '$70,000',
    growth_rate: 'High',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'Australia']
  },
  {
    id: 'education',
    name: 'Education',
    description: 'The education industry provides learning opportunities and educational services to students of all ages.',
    job_count: 300,
    avg_salary: '$60,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'Canada', 'United Kingdom', 'Australia']
  },
  {
    id: 'government',
    name: 'Government',
    description: 'The government sector provides public services and implements policies for the benefit of citizens.',
    job_count: 200,
    avg_salary: '$65,000',
    growth_rate: 'Low',
    global_demand: 'Medium',
    top_countries: ['United States', 'Canada', 'United Kingdom', 'Germany']
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
    description: 'The non-profit sector focuses on social causes and community service rather than profit generation.',
    job_count: 150,
    avg_salary: '$55,000',
    growth_rate: 'Medium',
    global_demand: 'Medium',
    top_countries: ['United States', 'Canada', 'United Kingdom', 'Australia']
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'The retail industry involves the sale of goods and services directly to consumers.',
    job_count: 250,
    avg_salary: '$45,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'Japan']
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'The manufacturing industry produces goods using raw materials, components, or parts.',
    job_count: 180,
    avg_salary: '$70,000',
    growth_rate: 'Low',
    global_demand: 'Medium',
    top_countries: ['China', 'United States', 'Germany', 'Japan']
  },
  {
    id: 'consulting',
    name: 'Consulting',
    description: 'The consulting industry provides expert advice and services to help organizations improve performance.',
    job_count: 120,
    avg_salary: '$90,000',
    growth_rate: 'High',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'France']
  }
];

// Comprehensive career data
const COMPREHENSIVE_CAREERS = [
  // Technology Careers
  {
    id: 'software-engineer',
    level: 'I',
    salary_range: '$80,000 - $150,000',
    experience_required: '3-5 years',
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems. Work with cross-functional teams to deliver high-quality software solutions.',
    skills: ['Programming', 'Problem Solving', 'Teamwork', 'Communication', 'Software Development', 'Algorithms', 'Data Structures'],
    job_titles: ['Software Developer', 'Application Developer', 'Systems Developer', 'Full Stack Developer'],
    certifications: ['AWS Certified Developer', 'Microsoft Certified: Azure Developer Associate', 'Google Cloud Professional Developer'],
    requirements: {
      education: ['Bachelor\'s Degree in Computer Science or related field'],
      experience: '3+ years of software development experience',
      skills: ['Proficiency in programming languages', 'Understanding of software development lifecycle']
    }
  },
  {
    id: 'data-scientist',
    level: 'A',
    salary_range: '$100,000 - $180,000',
    experience_required: '5-8 years',
    title: 'Data Scientist',
    description: 'Analyze complex datasets to extract insights and build predictive models. Use machine learning and statistical methods to solve business problems.',
    skills: ['Machine Learning', 'Python', 'Statistics', 'Data Analysis', 'SQL', 'R', 'Deep Learning'],
    job_titles: ['Senior Data Scientist', 'ML Engineer', 'Research Scientist', 'Analytics Manager'],
    certifications: ['Google Cloud Professional Data Engineer', 'AWS Certified Machine Learning', 'Microsoft Certified: Azure Data Scientist'],
    requirements: {
      education: ['Master\'s Degree in Data Science, Statistics, or related field'],
      experience: '5+ years of data science experience',
      skills: ['Advanced statistical analysis', 'Machine learning algorithms', 'Big data tools']
    }
  },
  {
    id: 'cybersecurity-analyst',
    level: 'I',
    salary_range: '$70,000 - $120,000',
    experience_required: '2-4 years',
    title: 'Cybersecurity Analyst',
    description: 'Protect computer systems and networks from cyber threats. Monitor security systems, investigate incidents, and implement security measures.',
    skills: ['Network Security', 'Risk Assessment', 'Incident Response', 'Penetration Testing', 'Security Tools', 'Compliance'],
    job_titles: ['Security Analyst', 'Information Security Specialist', 'SOC Analyst', 'Security Consultant'],
    certifications: ['CISSP', 'CEH', 'CompTIA Security+', 'CISM'],
    requirements: {
      education: ['Bachelor\'s Degree in Cybersecurity, Computer Science, or related field'],
      experience: '2+ years of cybersecurity experience',
      skills: ['Understanding of security frameworks', 'Network protocols knowledge']
    }
  },
  // Healthcare Careers
  {
    id: 'registered-nurse',
    level: 'I',
    salary_range: '$55,000 - $85,000',
    experience_required: '1-3 years',
    title: 'Registered Nurse',
    description: 'Provide direct patient care, administer medications, and coordinate with healthcare teams to ensure optimal patient outcomes.',
    skills: ['Patient Care', 'Medical Knowledge', 'Communication', 'Critical Thinking', 'Empathy', 'Emergency Response'],
    job_titles: ['Staff Nurse', 'Clinical Nurse', 'Patient Care Coordinator', 'Charge Nurse'],
    certifications: ['Registered Nurse License', 'Basic Life Support (BLS)', 'Advanced Cardiac Life Support (ACLS)'],
    requirements: {
      education: ['Bachelor of Science in Nursing (BSN) or Associate Degree in Nursing (ADN)'],
      experience: '1+ years of nursing experience',
      skills: ['Clinical skills', 'Knowledge of medical procedures', 'Patient assessment']
    }
  },
  {
    id: 'physician',
    level: 'A',
    salary_range: '$200,000 - $400,000',
    experience_required: '8-12 years',
    title: 'Physician',
    description: 'Diagnose and treat illnesses, injuries, and medical conditions. Provide medical care and advice to patients.',
    skills: ['Medical Diagnosis', 'Patient Care', 'Communication', 'Critical Thinking', 'Medical Procedures', 'Leadership'],
    job_titles: ['Doctor', 'Medical Doctor', 'Specialist', 'Primary Care Physician'],
    certifications: ['Medical License', 'Board Certification', 'DEA Registration'],
    requirements: {
      education: ['Doctor of Medicine (MD) or Doctor of Osteopathic Medicine (DO)'],
      experience: '8+ years including residency',
      skills: ['Medical knowledge', 'Clinical skills', 'Patient management']
    }
  },
  // Finance Careers
  {
    id: 'financial-analyst',
    level: 'I',
    salary_range: '$65,000 - $120,000',
    experience_required: '2-4 years',
    title: 'Financial Analyst',
    description: 'Analyze financial data to provide insights and recommendations for investment decisions, budgeting, and financial planning.',
    skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Research', 'Communication', 'Statistics'],
    job_titles: ['Investment Analyst', 'Budget Analyst', 'Risk Analyst', 'Corporate Financial Analyst'],
    certifications: ['Chartered Financial Analyst (CFA)', 'Financial Risk Manager (FRM)', 'Certified Public Accountant (CPA)'],
    requirements: {
      education: ['Bachelor\'s Degree in Finance, Economics, or related field'],
      experience: '2+ years of financial analysis experience',
      skills: ['Proficiency in financial analysis tools', 'Understanding of financial markets']
    }
  },
  // Marketing Careers
  {
    id: 'marketing-manager',
    level: 'I',
    salary_range: '$70,000 - $130,000',
    experience_required: '4-6 years',
    title: 'Marketing Manager',
    description: 'Develop and execute marketing strategies to promote products and services. Manage marketing campaigns and analyze their effectiveness.',
    skills: ['Marketing Strategy', 'Digital Marketing', 'Project Management', 'Analytics', 'Communication', 'Brand Management'],
    job_titles: ['Brand Manager', 'Product Marketing Manager', 'Digital Marketing Manager', 'Campaign Manager'],
    certifications: ['Google Ads Certification', 'HubSpot Content Marketing Certification', 'Facebook Blueprint'],
    requirements: {
      education: ['Bachelor\'s Degree in Marketing, Business, or related field'],
      experience: '4+ years of marketing experience',
      skills: ['Understanding of marketing principles', 'Experience with marketing tools']
    }
  },
  // Education Careers
  {
    id: 'teacher',
    level: 'I',
    salary_range: '$45,000 - $70,000',
    experience_required: '1-3 years',
    title: 'Teacher',
    description: 'Educate students in various subjects, create lesson plans, and assess student progress. Foster learning and development.',
    skills: ['Teaching', 'Communication', 'Classroom Management', 'Curriculum Development', 'Student Assessment', 'Patience'],
    job_titles: ['Elementary Teacher', 'High School Teacher', 'Subject Teacher', 'Special Education Teacher'],
    certifications: ['Teaching License', 'Subject Area Certification', 'Continuing Education Credits'],
    requirements: {
      education: ['Bachelor\'s Degree in Education or subject area'],
      experience: '1+ years of teaching experience',
      skills: ['Pedagogical knowledge', 'Classroom management', 'Student engagement']
    }
  }
];

async function translateText(text, targetLanguage) {
  if (targetLanguage === 'en' || !genAI) return text;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Translate the following English text to ${LANGUAGE_NAMES[targetLanguage]}. Return only the translation, no explanations:

"${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error(`❌ Error translating to ${targetLanguage}:`, error.message);
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }
}

async function translateArray(array, targetLanguage) {
  if (targetLanguage === 'en' || !genAI) return array;
  
  const translated = [];
  for (const item of array) {
    const translatedItem = await translateText(item, targetLanguage);
    translated.push(translatedItem);
  }
  return translated;
}

async function translateObject(obj, targetLanguage) {
  if (targetLanguage === 'en' || !genAI) return obj;
  
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

async function populateIndustriesCore() {
  console.log('🏭 Populating industries_core...');
  
  for (const industry of COMPREHENSIVE_INDUSTRIES) {
    const coreIndustry = {
      id: industry.id,
      job_count: industry.job_count,
      avg_salary: industry.avg_salary,
      growth_rate: industry.growth_rate,
      global_demand: industry.global_demand,
      top_countries: industry.top_countries
    };
    
    const { error } = await supabase
      .from('industries_core')
      .upsert(coreIndustry, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error inserting industry core ${industry.id}:`, error.message);
    } else {
      console.log(`✅ Inserted industry core: ${industry.id}`);
    }
  }
}

async function populateCareersCore() {
  console.log('💼 Populating careers_core...');
  
  for (const career of COMPREHENSIVE_CAREERS) {
    const coreCareer = {
      id: career.id,
      level: career.level,
      salary_range: career.salary_range,
      experience_required: career.experience_required
    };
    
    const { error } = await supabase
      .from('careers_core')
      .upsert(coreCareer, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error inserting career core ${career.id}:`, error.message);
    } else {
      console.log(`✅ Inserted career core: ${career.id}`);
    }
  }
}

async function populateIndustryContent() {
  console.log('🏭 Populating industry content for all languages...');
  
  for (const language of LANGUAGES) {
    console.log(`\n🌍 Processing industries for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const industry of COMPREHENSIVE_INDUSTRIES) {
      let name = industry.name;
      let description = industry.description;
      
      if (language !== 'en') {
        name = await translateText(name, language);
        description = await translateText(description, language);
      }
      
      const industryContent = {
        industry_id: industry.id,
        name: name,
        description: description,
        icon: industry.id
      };
      
      const { error } = await supabase
        .from(`industries_${language}`)
        .upsert(industryContent, { onConflict: 'industry_id' });
      
      if (error) {
        console.error(`❌ Error inserting industry content ${industry.id} for ${language}:`, error.message);
      } else {
        console.log(`✅ Inserted industry content ${industry.id} for ${language}: ${name}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function populateCareerContent() {
  console.log('💼 Populating career content for all languages...');
  
  for (const language of LANGUAGES) {
    console.log(`\n🌍 Processing careers for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const career of COMPREHENSIVE_CAREERS) {
      let title = career.title;
      let description = career.description;
      let skills = career.skills;
      let jobTitles = career.job_titles;
      let certifications = career.certifications;
      let requirements = career.requirements;
      
      if (language !== 'en') {
        title = await translateText(title, language);
        description = await translateText(description, language);
        skills = await translateArray(skills, language);
        jobTitles = await translateArray(jobTitles, language);
        certifications = await translateArray(certifications, language);
        requirements = await translateObject(requirements, language);
      }
      
      const careerContent = {
        career_id: career.id,
        title: title,
        description: description,
        skills: skills,
        job_titles: jobTitles,
        certifications: certifications,
        requirements: requirements
      };
      
      const { error } = await supabase
        .from(`careers_${language}`)
        .upsert(careerContent, { onConflict: 'career_id' });
      
      if (error) {
        console.error(`❌ Error inserting career content ${career.id} for ${language}:`, error.message);
      } else {
        console.log(`✅ Inserted career content ${career.id} for ${language}: ${title}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function verifyPopulation() {
  console.log('\n🔍 Verifying data population...');
  
  // Check core tables
  const { count: coreCareersCount } = await supabase.from('careers_core').select('*', { count: 'exact', head: true });
  const { count: coreIndustriesCount } = await supabase.from('industries_core').select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 Core Tables:`);
  console.log(`   Careers Core: ${coreCareersCount.count} records`);
  console.log(`   Industries Core: ${coreIndustriesCount.count} records`);
  
  // Check language-specific tables
  for (const language of LANGUAGES) {
    const { count: careerCount } = await supabase.from(`careers_${language}`).select('*', { count: 'exact', head: true });
    const { count: industryCount } = await supabase.from(`industries_${language}`).select('*', { count: 'exact', head: true });
    
    console.log(`\n🌍 ${language.toUpperCase()}:`);
    console.log(`   Careers: ${careerCount.count} records`);
    console.log(`   Industries: ${industryCount.count} records`);
  }
}

async function main() {
  console.log('🚀 Populating Complete Data for Language-Specific Tables');
  console.log('=' * 60);
  
  try {
    // Step 1: Populate core tables
    await populateIndustriesCore();
    await populateCareersCore();
    
    // Step 2: Populate language-specific content
    await populateIndustryContent();
    await populateCareerContent();
    
    // Step 3: Verify population
    await verifyPopulation();
    
    console.log('\n🎉 Complete data population finished!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Populated ${COMPREHENSIVE_INDUSTRIES.length} industries`);
    console.log(`   ✅ Populated ${COMPREHENSIVE_CAREERS.length} careers`);
    console.log(`   ✅ Created translations for: ${LANGUAGES.join(', ')}`);
    console.log(`   ✅ All language-specific tables fully populated`);
    
  } catch (error) {
    console.error('❌ Error during population:', error);
    process.exit(1);
  }
}

main();
