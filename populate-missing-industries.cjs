#!/usr/bin/env node

/**
 * Populate Missing Industries Script
 * 
 * This script populates the missing industries for all languages using the correct schema
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

// Missing industries that need to be added
const MISSING_INDUSTRIES = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Software development, IT services, and digital innovation'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical services, patient care, and health technology'
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Banking, investment, and financial services'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Brand promotion, advertising, and customer engagement'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Teaching, learning, and educational services'
  },
  {
    id: 'government',
    name: 'Government',
    description: 'Public services and policy implementation'
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
    description: 'Social causes and community service organizations'
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Consumer goods sales and customer service'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Production of goods and industrial services'
  },
  {
    id: 'consulting',
    name: 'Consulting',
    description: 'Professional advice and business services'
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

async function populateMissingIndustries() {
  console.log('🏭 Populating missing industries for all languages...');
  
  for (const language of LANGUAGES) {
    console.log(`\n🌍 Processing industries for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const industry of MISSING_INDUSTRIES) {
      let name = industry.name;
      let description = industry.description;
      
      if (language !== 'en') {
        name = await translateText(name, language);
        description = await translateText(description, language);
      }
      
      const industryContent = {
        industry_id: industry.id,
        name: name,
        description: description
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

async function verifyIndustryPopulation() {
  console.log('\n🔍 Verifying industry population...');
  
  for (const language of LANGUAGES) {
    const { count } = await supabase.from(`industries_${language}`).select('*', { count: 'exact', head: true });
    console.log(`🌍 ${language.toUpperCase()}: ${count.count} industries`);
  }
}

async function main() {
  console.log('🚀 Populating Missing Industries');
  console.log('=' * 40);
  
  try {
    await populateMissingIndustries();
    await verifyIndustryPopulation();
    
    console.log('\n🎉 Industry population completed!');
    
  } catch (error) {
    console.error('❌ Error during population:', error);
    process.exit(1);
  }
}

main();
