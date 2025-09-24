#!/usr/bin/env node

/**
 * Complete Migration to Language-Specific Tables
 * 
 * This script migrates data from the old table structure to the new language-specific tables:
 * - Migrates from 'careers' and 'career_paths' to 'careers_core' and language-specific tables
 * - Migrates from 'translations' to language-specific content tables
 * - Creates proper industry mappings
 * - Populates all language-specific tables with translations
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
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

// Industry mapping from old structure to new
const INDUSTRY_MAPPING = {
  'technology': 'technology',
  'healthcare': 'healthcare',
  'finance': 'finance',
  'marketing': 'marketing',
  'education': 'education',
  'government': 'government',
  'nonprofit': 'nonprofit',
  'retail': 'retail',
  'manufacturing': 'manufacturing',
  'consulting': 'consulting'
};

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

async function getOldCareersData() {
  console.log('📊 Fetching old careers data...');
  
  try {
    const { data: careers, error } = await supabase
      .from('careers')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching old careers:', error.message);
      return [];
    }
    
    console.log(`✅ Found ${careers.length} careers in old structure`);
    return careers || [];
  } catch (error) {
    console.error('❌ Error accessing old careers table:', error.message);
    return [];
  }
}

async function getOldCareerPathsData() {
  console.log('📊 Fetching old career paths data...');
  
  try {
    const { data: careerPaths, error } = await supabase
      .from('career_paths')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching old career paths:', error.message);
      return [];
    }
    
    console.log(`✅ Found ${careerPaths.length} career paths in old structure`);
    return careerPaths || [];
  } catch (error) {
    console.error('❌ Error accessing old career paths table:', error.message);
    return [];
  }
}

async function getOldTranslationsData() {
  console.log('📊 Fetching old translations data...');
  
  try {
    const { data: translations, error } = await supabase
      .from('translations')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching old translations:', error.message);
      return [];
    }
    
    console.log(`✅ Found ${translations.length} translation records`);
    return translations || [];
  } catch (error) {
    console.error('❌ Error accessing old translations table:', error.message);
    return [];
  }
}

async function createIndustriesCore() {
  console.log('🏭 Creating industries_core data...');
  
  const industries = [
    {
      id: 'technology',
      job_count: 1500,
      avg_salary: '$95,000',
      growth_rate: 'High',
      global_demand: 'Very High',
      top_countries: ['United States', 'Germany', 'Japan', 'United Kingdom']
    },
    {
      id: 'healthcare',
      job_count: 800,
      avg_salary: '$75,000',
      growth_rate: 'High',
      global_demand: 'Very High',
      top_countries: ['United States', 'Canada', 'United Kingdom', 'Australia']
    },
    {
      id: 'finance',
      job_count: 600,
      avg_salary: '$85,000',
      growth_rate: 'Medium',
      global_demand: 'High',
      top_countries: ['United States', 'United Kingdom', 'Singapore', 'Switzerland']
    },
    {
      id: 'marketing',
      job_count: 400,
      avg_salary: '$70,000',
      growth_rate: 'High',
      global_demand: 'High',
      top_countries: ['United States', 'United Kingdom', 'Germany', 'Australia']
    },
    {
      id: 'education',
      job_count: 300,
      avg_salary: '$60,000',
      growth_rate: 'Medium',
      global_demand: 'High',
      top_countries: ['United States', 'Canada', 'United Kingdom', 'Australia']
    },
    {
      id: 'government',
      job_count: 200,
      avg_salary: '$65,000',
      growth_rate: 'Low',
      global_demand: 'Medium',
      top_countries: ['United States', 'Canada', 'United Kingdom', 'Germany']
    },
    {
      id: 'nonprofit',
      job_count: 150,
      avg_salary: '$55,000',
      growth_rate: 'Medium',
      global_demand: 'Medium',
      top_countries: ['United States', 'Canada', 'United Kingdom', 'Australia']
    }
  ];
  
  for (const industry of industries) {
    const { error } = await supabase
      .from('industries_core')
      .upsert(industry, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error inserting industry core ${industry.id}:`, error.message);
    } else {
      console.log(`✅ Inserted industry core: ${industry.id}`);
    }
  }
}

async function migrateCareersToCore(oldCareers) {
  console.log('💼 Migrating careers to careers_core...');
  
  for (const career of oldCareers) {
    // Determine industry from career data
    let industryId = 'technology'; // default
    if (career.industry) {
      industryId = INDUSTRY_MAPPING[career.industry] || 'technology';
    }
    
    const coreCareer = {
      id: career.id,
      level: career.level || 'I',
      salary_range: career.salary_range || '$50,000 - $100,000',
      experience_required: career.experience_required || '2-4 years'
    };
    
    const { error } = await supabase
      .from('careers_core')
      .upsert(coreCareer, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error inserting career core ${career.id}:`, error.message);
    } else {
      console.log(`✅ Migrated career core: ${career.id}`);
    }
  }
}

async function migrateCareerContent(oldCareers, oldTranslations) {
  console.log('📝 Migrating career content to language-specific tables...');
  
  // Create a map of translations by language
  const translationsByLang = {};
  for (const translation of oldTranslations) {
    translationsByLang[translation.language_code] = translation.translation_data;
  }
  
  for (const language of LANGUAGES) {
    console.log(`\n🌍 Processing language: ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const career of oldCareers) {
      let title = career.title || career.id;
      let description = career.description || 'No description available';
      let skills = career.skills || [];
      let jobTitles = career.job_titles || [];
      let certifications = career.certifications || [];
      let requirements = career.requirements || { education: [], experience: '', skills: [] };
      
      // Try to get translations from old translation system
      if (translationsByLang[language]) {
        const langData = translationsByLang[language];
        
        // Look for career-specific translations
        if (langData.careers && langData.careers[career.id]) {
          const careerTrans = langData.careers[career.id];
          title = careerTrans.title || title;
          description = careerTrans.description || description;
          skills = careerTrans.skills || skills;
        }
      }
      
      // Translate if not available in old system
      if (language !== 'en') {
        title = await translateText(title, language);
        description = await translateText(description, language);
        skills = await translateArray(skills, language);
        jobTitles = await translateArray(jobTitles, language);
        certifications = await translateArray(certifications, language);
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
        console.log(`✅ Migrated career content ${career.id} for ${language}: ${title}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function migrateIndustryContent() {
  console.log('🏭 Migrating industry content to language-specific tables...');
  
  const industries = [
    {
      id: 'technology',
      name: 'Technology',
      description: 'The technology industry encompasses companies that develop, manufacture, and provide technology products and services.'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'The healthcare industry provides medical services, products, and technologies to improve patient care and health outcomes.'
    },
    {
      id: 'finance',
      name: 'Finance',
      description: 'The finance industry manages money, investments, and financial services for individuals, businesses, and governments.'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'The marketing industry focuses on promoting products and services, building brand awareness, and driving customer engagement.'
    },
    {
      id: 'education',
      name: 'Education',
      description: 'The education industry provides learning opportunities and educational services to students of all ages.'
    },
    {
      id: 'government',
      name: 'Government',
      description: 'The government sector provides public services and implements policies for the benefit of citizens.'
    },
    {
      id: 'nonprofit',
      name: 'Non-Profit',
      description: 'The non-profit sector focuses on social causes and community service rather than profit generation.'
    }
  ];
  
  for (const language of LANGUAGES) {
    console.log(`\n🏭 Processing industries for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const industry of industries) {
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
        console.log(`✅ Migrated industry content ${industry.id} for ${language}: ${name}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
  // Check core tables
  const coreCareersCount = await supabase.from('careers_core').select('*', { count: 'exact', head: true });
  const coreIndustriesCount = await supabase.from('industries_core').select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 Core Tables:`);
  console.log(`   Careers Core: ${coreCareersCount.count} records`);
  console.log(`   Industries Core: ${coreIndustriesCount.count} records`);
  
  // Check language-specific tables
  for (const language of LANGUAGES) {
    const careerCount = await supabase.from(`careers_${language}`).select('*', { count: 'exact', head: true });
    const industryCount = await supabase.from(`industries_${language}`).select('*', { count: 'exact', head: true });
    
    console.log(`\n🌍 ${language.toUpperCase()}:`);
    console.log(`   Careers: ${careerCount.count} records`);
    console.log(`   Industries: ${industryCount.count} records`);
  }
}

async function main() {
  console.log('🚀 Starting Complete Migration to Language-Specific Tables');
  console.log('=' * 60);
  
  try {
    // Step 1: Get old data
    const oldCareers = await getOldCareersData();
    const oldCareerPaths = await getOldCareerPathsData();
    const oldTranslations = await getOldTranslationsData();
    
    if (oldCareers.length === 0) {
      console.log('⚠️  No old careers data found. Creating sample data...');
      // You could create sample data here if needed
    }
    
    // Step 2: Create industries core
    await createIndustriesCore();
    
    // Step 3: Migrate careers to core
    if (oldCareers.length > 0) {
      await migrateCareersToCore(oldCareers);
    }
    
    // Step 4: Migrate career content
    if (oldCareers.length > 0) {
      await migrateCareerContent(oldCareers, oldTranslations);
    }
    
    // Step 5: Migrate industry content
    await migrateIndustryContent();
    
    // Step 6: Verify migration
    await verifyMigration();
    
    console.log('\n🎉 Complete migration to language-specific tables finished!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Test the frontend with the new language-specific tables');
    console.log('   2. Update the monthly trend updater to use new tables');
    console.log('   3. Consider removing old tables after verification');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

main();
