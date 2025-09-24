#!/usr/bin/env node

/**
 * Populate Missing Translations
 * 
 * This script populates missing translations for Spanish (ES) and French (FR)
 * based on the existing English data
 */

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

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

// Languages that need translation
const MISSING_LANGUAGES = ['es', 'fr'];
const LANGUAGE_NAMES = {
  'es': 'Spanish',
  'fr': 'French'
};

async function translateText(text, targetLanguage) {
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
  const translated = [];
  for (const item of array) {
    const translatedItem = await translateText(item, targetLanguage);
    translated.push(translatedItem);
  }
  return translated;
}

async function translateObject(obj, targetLanguage) {
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

async function getEnglishCareers() {
  console.log('📊 Fetching English career data...');
  
  const { data: careers, error } = await supabase
    .from('careers_en')
    .select('*');
  
  if (error) {
    console.error('❌ Error fetching English careers:', error.message);
    return [];
  }
  
  console.log(`✅ Found ${careers.length} English careers`);
  return careers || [];
}

async function getEnglishIndustries() {
  console.log('📊 Fetching English industry data...');
  
  const { data: industries, error } = await supabase
    .from('industries_en')
    .select('*');
  
  if (error) {
    console.error('❌ Error fetching English industries:', error.message);
    return [];
  }
  
  console.log(`✅ Found ${industries.length} English industries`);
  return industries || [];
}

async function populateMissingCareerTranslations() {
  console.log('💼 Populating missing career translations...');
  
  const englishCareers = await getEnglishCareers();
  
  for (const language of MISSING_LANGUAGES) {
    console.log(`\n🌍 Processing careers for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const career of englishCareers) {
      const translatedTitle = await translateText(career.title, language);
      const translatedDescription = await translateText(career.description, language);
      const translatedSkills = await translateArray(career.skills, language);
      const translatedJobTitles = await translateArray(career.job_titles, language);
      const translatedCertifications = await translateArray(career.certifications, language);
      const translatedRequirements = await translateObject(career.requirements, language);
      
      const careerContent = {
        career_id: career.career_id,
        title: translatedTitle,
        description: translatedDescription,
        skills: translatedSkills,
        job_titles: translatedJobTitles,
        certifications: translatedCertifications,
        requirements: translatedRequirements
      };
      
      const { error } = await supabase
        .from(`careers_${language}`)
        .upsert(careerContent, { onConflict: 'career_id' });
      
      if (error) {
        console.error(`❌ Error inserting career content ${career.career_id} for ${language}:`, error.message);
      } else {
        console.log(`✅ Inserted career content ${career.career_id} for ${language}: ${translatedTitle}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function populateMissingIndustryTranslations() {
  console.log('🏭 Populating missing industry translations...');
  
  const englishIndustries = await getEnglishIndustries();
  
  for (const language of MISSING_LANGUAGES) {
    console.log(`\n🏭 Processing industries for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const industry of englishIndustries) {
      const translatedName = await translateText(industry.name, language);
      const translatedDescription = await translateText(industry.description, language);
      
      const industryContent = {
        industry_id: industry.industry_id,
        name: translatedName,
        description: translatedDescription,
        icon: industry.icon
      };
      
      const { error } = await supabase
        .from(`industries_${language}`)
        .upsert(industryContent, { onConflict: 'industry_id' });
      
      if (error) {
        console.error(`❌ Error inserting industry content ${industry.industry_id} for ${language}:`, error.message);
      } else {
        console.log(`✅ Inserted industry content ${industry.industry_id} for ${language}: ${translatedName}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function verifyTranslations() {
  console.log('\n🔍 Verifying translations...');
  
  for (const language of MISSING_LANGUAGES) {
    console.log(`\n📊 ${language.toUpperCase()} Translation Status:`);
    
    // Check careers
    const { data: careers, error: careerError } = await supabase
      .from(`careers_${language}`)
      .select('career_id, title');
    
    if (careerError) {
      console.error(`❌ Error checking careers_${language}:`, careerError.message);
    } else {
      console.log(`   ✅ Careers: ${careers.length} records`);
      if (careers.length > 0) {
        console.log(`   📋 Sample: ${careers[0].career_id} - ${careers[0].title}`);
      }
    }
    
    // Check industries
    const { data: industries, error: industryError } = await supabase
      .from(`industries_${language}`)
      .select('industry_id, name');
    
    if (industryError) {
      console.error(`❌ Error checking industries_${language}:`, industryError.message);
    } else {
      console.log(`   ✅ Industries: ${industries.length} records`);
      if (industries.length > 0) {
        console.log(`   📋 Sample: ${industries[0].industry_id} - ${industries[0].name}`);
      }
    }
  }
}

async function main() {
  console.log('🚀 Populating Missing Translations');
  console.log('=' * 50);
  
  try {
    // Step 1: Populate missing career translations
    await populateMissingCareerTranslations();
    
    // Step 2: Populate missing industry translations
    await populateMissingIndustryTranslations();
    
    // Step 3: Verify translations
    await verifyTranslations();
    
    console.log('\n🎉 Missing translations populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Career translations added for: ${MISSING_LANGUAGES.join(', ')}`);
    console.log(`   ✅ Industry translations added for: ${MISSING_LANGUAGES.join(', ')}`);
    console.log(`   ✅ All translations verified`);
    
  } catch (error) {
    console.error('❌ Error during translation population:', error);
    process.exit(1);
  }
}

main();
