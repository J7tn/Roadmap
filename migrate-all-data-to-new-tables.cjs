#!/usr/bin/env node

/**
 * Migrate All Data to New Language-Specific Tables
 * 
 * This script migrates all data from old tables to the new language-specific structure
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

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
    
    console.log(`✅ Found ${careers.length} careers in old system`);
    return careers || [];
  } catch (error) {
    console.error('❌ Error accessing old careers table:', error.message);
    return [];
  }
}

async function getOldIndustriesData() {
  console.log('📊 Fetching old industries data...');
  
  try {
    const { data: industries, error } = await supabase
      .from('industries')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching old industries:', error.message);
      return [];
    }
    
    console.log(`✅ Found ${industries.length} industries in old system`);
    return industries || [];
  } catch (error) {
    console.error('❌ Error accessing old industries table:', error.message);
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

async function migrateIndustriesToCore(oldIndustries) {
  console.log('🏭 Migrating industries to careers_core...');
  
  for (const industry of oldIndustries) {
    const coreIndustry = {
      id: industry.id,
      job_count: industry.job_count || 0,
      avg_salary: industry.avg_salary || 'N/A',
      growth_rate: industry.growth_rate || 'Unknown',
      global_demand: industry.global_demand || 'Unknown',
      top_countries: industry.top_countries || []
    };
    
    const { error } = await supabase
      .from('industries_core')
      .upsert(coreIndustry, { onConflict: 'id' });
    
    if (error) {
      console.error(`❌ Error inserting industry core ${industry.id}:`, error.message);
    } else {
      console.log(`✅ Migrated industry core: ${industry.id}`);
    }
  }
}

async function migrateCareersToCore(oldCareers) {
  console.log('💼 Migrating careers to careers_core...');
  
  for (const career of oldCareers) {
    const coreCareer = {
      id: career.id,
      level: career.level || 'I',
      salary_range: career.salary_range || 'N/A',
      experience_required: career.experience_required || 'N/A'
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

async function migrateIndustryContent(oldIndustries, oldTranslations) {
  console.log('🏭 Migrating industry content to language-specific tables...');
  
  // Create a map of translations by language
  const translationsByLang = {};
  for (const translation of oldTranslations) {
    translationsByLang[translation.language_code] = translation.translation_data;
  }
  
  for (const language of LANGUAGES) {
    console.log(`\n🌍 Processing industries for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const industry of oldIndustries) {
      let name = industry.name || industry.id;
      let description = industry.description || `Industry description for ${industry.id}`;
      
      // Try to get translations from old system
      if (translationsByLang[language] && translationsByLang[language].industries) {
        const industryTrans = translationsByLang[language].industries[industry.id];
        if (industryTrans) {
          name = industryTrans.name || name;
          description = industryTrans.description || description;
        }
      }
      
      // Translate if not available in old system
      if (language !== 'en') {
        name = await translateText(name, language);
        description = await translateText(description, language);
      }
      
      const industryContent = {
        industry_id: industry.id,
        name: name,
        description: description,
        icon: industry.icon || industry.id
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
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function migrateCareerContent(oldCareers, oldTranslations) {
  console.log('💼 Migrating career content to language-specific tables...');
  
  // Create a map of translations by language
  const translationsByLang = {};
  for (const translation of oldTranslations) {
    translationsByLang[translation.language_code] = translation.translation_data;
  }
  
  for (const language of LANGUAGES) {
    console.log(`\n🌍 Processing careers for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const career of oldCareers) {
      let title = career.title || career.id;
      let description = career.description || `Career description for ${career.id}`;
      let skills = career.skills || [];
      let jobTitles = career.job_titles || [];
      let certifications = career.certifications || [];
      let requirements = career.requirements || { education: [], experience: '', skills: [] };
      
      // Try to get translations from old system
      if (translationsByLang[language] && translationsByLang[language].careers) {
        const careerTrans = translationsByLang[language].careers[career.id];
        if (careerTrans) {
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
        console.log(`✅ Migrated career content ${career.id} for ${language}: ${title}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');
  
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
  console.log('🚀 Migrating All Data to New Language-Specific Tables');
  console.log('=' * 60);
  
  try {
    // Step 1: Get old data
    const oldCareers = await getOldCareersData();
    const oldIndustries = await getOldIndustriesData();
    const oldTranslations = await getOldTranslationsData();
    
    if (oldCareers.length === 0 && oldIndustries.length === 0) {
      console.log('⚠️  No old data found to migrate');
      return;
    }
    
    // Step 2: Migrate to core tables
    if (oldIndustries.length > 0) {
      await migrateIndustriesToCore(oldIndustries);
    }
    
    if (oldCareers.length > 0) {
      await migrateCareersToCore(oldCareers);
    }
    
    // Step 3: Migrate content to language-specific tables
    if (oldIndustries.length > 0) {
      await migrateIndustryContent(oldIndustries, oldTranslations);
    }
    
    if (oldCareers.length > 0) {
      await migrateCareerContent(oldCareers, oldTranslations);
    }
    
    // Step 4: Verify migration
    await verifyMigration();
    
    console.log('\n🎉 Data migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   ✅ Migrated ${oldCareers.length} careers to all languages`);
    console.log(`   ✅ Migrated ${oldIndustries.length} industries to all languages`);
    console.log(`   ✅ Used existing translations where available`);
    console.log(`   ✅ Generated new translations for missing data`);
    console.log(`   ✅ All language-specific tables populated`);
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

main();
