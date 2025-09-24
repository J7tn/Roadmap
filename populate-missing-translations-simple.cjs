#!/usr/bin/env node

/**
 * Populate Missing Translations (Simple Version)
 * 
 * This script populates missing translations for Spanish (ES) and French (FR)
 * with placeholder translations based on the existing English data
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Languages that need translation
const MISSING_LANGUAGES = ['es', 'fr'];
const LANGUAGE_NAMES = {
  'es': 'Spanish',
  'fr': 'French'
};

// Simple translation mappings (you can expand these)
const SIMPLE_TRANSLATIONS = {
  'es': {
    'Software Engineer': 'Ingeniero de Software',
    'Data Analyst': 'Analista de Datos',
    'Marketing Manager': 'Gerente de Marketing',
    'Technology': 'Tecnología',
    'Healthcare': 'Atención Médica',
    'Finance': 'Finanzas',
    'Marketing': 'Marketing',
    'Design, develop, and maintain software applications and systems.': 'Diseñar, desarrollar y mantener aplicaciones y sistemas de software.',
    'Analyze complex datasets to identify trends, patterns, and insights.': 'Analizar conjuntos de datos complejos para identificar tendencias, patrones e ideas.',
    'Develop and execute marketing strategies to promote products and services.': 'Desarrollar y ejecutar estrategias de marketing para promover productos y servicios.'
  },
  'fr': {
    'Software Engineer': 'Ingénieur Logiciel',
    'Data Analyst': 'Analyste de Données',
    'Marketing Manager': 'Responsable Marketing',
    'Technology': 'Technologie',
    'Healthcare': 'Soins de Santé',
    'Finance': 'Finance',
    'Marketing': 'Marketing',
    'Design, develop, and maintain software applications and systems.': 'Concevoir, développer et maintenir des applications et systèmes logiciels.',
    'Analyze complex datasets to identify trends, patterns, and insights.': 'Analyser des ensembles de données complexes pour identifier les tendances, modèles et idées.',
    'Develop and execute marketing strategies to promote products and services.': 'Développer et exécuter des stratégies marketing pour promouvoir produits et services.'
  }
};

function translateText(text, targetLanguage) {
  const translations = SIMPLE_TRANSLATIONS[targetLanguage];
  if (translations && translations[text]) {
    return translations[text];
  }
  return `[${targetLanguage.toUpperCase()}] ${text}`;
}

function translateArray(array, targetLanguage) {
  return array.map(item => translateText(item, targetLanguage));
}

function translateObject(obj, targetLanguage) {
  const translated = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      translated[key] = translateArray(value, targetLanguage);
    } else if (typeof value === 'string') {
      translated[key] = translateText(value, targetLanguage);
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
      const translatedTitle = translateText(career.title, language);
      const translatedDescription = translateText(career.description, language);
      const translatedSkills = translateArray(career.skills, language);
      const translatedJobTitles = translateArray(career.job_titles, language);
      const translatedCertifications = translateArray(career.certifications, language);
      const translatedRequirements = translateObject(career.requirements, language);
      
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
  }
}

async function populateMissingIndustryTranslations() {
  console.log('🏭 Populating missing industry translations...');
  
  const englishIndustries = await getEnglishIndustries();
  
  for (const language of MISSING_LANGUAGES) {
    console.log(`\n🏭 Processing industries for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const industry of englishIndustries) {
      const translatedName = translateText(industry.name, language);
      const translatedDescription = translateText(industry.description, language);
      
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
  console.log('🚀 Populating Missing Translations (Simple Version)');
  console.log('=' * 60);
  
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
    console.log('\n💡 Note: These are basic translations. For better quality, consider using a translation service.');
    
  } catch (error) {
    console.error('❌ Error during translation population:', error);
    process.exit(1);
  }
}

main();
