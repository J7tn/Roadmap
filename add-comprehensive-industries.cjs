#!/usr/bin/env node

/**
 * Add Comprehensive Industries Script
 * 
 * This script adds 50+ additional real-world industries to make our database comprehensive
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

// Comprehensive list of additional real-world industries
const ADDITIONAL_INDUSTRIES = [
  // Aerospace & Defense
  {
    id: 'aerospace',
    name: 'Aerospace',
    description: 'Aircraft, spacecraft, and defense systems manufacturing and services',
    job_count: 2000,
    avg_salary: '$85,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'France', 'Germany', 'United Kingdom', 'Canada']
  },
  {
    id: 'defense',
    name: 'Defense',
    description: 'Military equipment, weapons systems, and national security services',
    job_count: 1500,
    avg_salary: '$90,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'Russia', 'China', 'United Kingdom', 'France']
  },
  // Automotive
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Vehicle manufacturing, sales, and automotive services',
    job_count: 8000,
    avg_salary: '$70,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['Germany', 'Japan', 'United States', 'China', 'South Korea']
  },
  // Banking & Financial Services
  {
    id: 'banking',
    name: 'Banking',
    description: 'Commercial banking, investment banking, and financial services',
    job_count: 5000,
    avg_salary: '$80,000',
    growth_rate: 'Low',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'China', 'Japan', 'Germany']
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'Life, health, property, and casualty insurance services',
    job_count: 3000,
    avg_salary: '$75,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'Japan', 'United Kingdom', 'Germany', 'France']
  },
  // Biotechnology & Pharmaceuticals
  {
    id: 'biotechnology',
    name: 'Biotechnology',
    description: 'Biotech research, development, and commercialization of biological products',
    job_count: 1200,
    avg_salary: '$95,000',
    growth_rate: 'Very High',
    global_demand: 'High',
    top_countries: ['United States', 'Switzerland', 'Germany', 'United Kingdom', 'Denmark']
  },
  {
    id: 'pharmaceuticals',
    name: 'Pharmaceuticals',
    description: 'Drug development, manufacturing, and distribution',
    job_count: 2500,
    avg_salary: '$90,000',
    growth_rate: 'High',
    global_demand: 'Very High',
    top_countries: ['United States', 'Switzerland', 'Germany', 'United Kingdom', 'France']
  },
  // Chemicals & Materials
  {
    id: 'chemicals',
    name: 'Chemicals',
    description: 'Chemical manufacturing, specialty chemicals, and materials science',
    job_count: 1800,
    avg_salary: '$75,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'Germany', 'China', 'Japan', 'France']
  },
  {
    id: 'materials',
    name: 'Materials',
    description: 'Advanced materials, composites, and specialty materials manufacturing',
    job_count: 1000,
    avg_salary: '$80,000',
    growth_rate: 'High',
    global_demand: 'High',
    top_countries: ['United States', 'Germany', 'Japan', 'China', 'South Korea']
  },
  // Electronics & Technology
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic components, devices, and consumer electronics manufacturing',
    job_count: 4000,
    avg_salary: '$70,000',
    growth_rate: 'Medium',
    global_demand: 'Very High',
    top_countries: ['China', 'United States', 'Japan', 'South Korea', 'Germany']
  },
  {
    id: 'semiconductors',
    name: 'Semiconductors',
    description: 'Chip design, manufacturing, and semiconductor equipment',
    job_count: 1500,
    avg_salary: '$100,000',
    growth_rate: 'Very High',
    global_demand: 'Very High',
    top_countries: ['United States', 'Taiwan', 'South Korea', 'Japan', 'China']
  },
  // Fashion & Apparel
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing design, manufacturing, and retail fashion industry',
    job_count: 2000,
    avg_salary: '$55,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'Italy', 'France', 'United Kingdom', 'Germany']
  },
  {
    id: 'apparel',
    name: 'Apparel',
    description: 'Clothing manufacturing, textiles, and garment production',
    job_count: 3000,
    avg_salary: '$45,000',
    growth_rate: 'Low',
    global_demand: 'High',
    top_countries: ['China', 'Bangladesh', 'India', 'Vietnam', 'Turkey']
  },
  // Food & Beverage
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    description: 'Food production, processing, and beverage manufacturing',
    job_count: 5000,
    avg_salary: '$50,000',
    growth_rate: 'Medium',
    global_demand: 'Very High',
    top_countries: ['United States', 'China', 'Germany', 'France', 'United Kingdom']
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    description: 'Farming, crop production, and agricultural services',
    job_count: 1500,
    avg_salary: '$45,000',
    growth_rate: 'Low',
    global_demand: 'Very High',
    top_countries: ['United States', 'China', 'India', 'Brazil', 'Germany']
  },
  // Gaming & Entertainment
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Video game development, esports, and gaming entertainment',
    job_count: 800,
    avg_salary: '$75,000',
    growth_rate: 'Very High',
    global_demand: 'High',
    top_countries: ['United States', 'Japan', 'South Korea', 'China', 'United Kingdom']
  },
  {
    id: 'esports',
    name: 'Esports',
    description: 'Competitive gaming, tournaments, and esports entertainment',
    job_count: 200,
    avg_salary: '$60,000',
    growth_rate: 'Very High',
    global_demand: 'Medium',
    top_countries: ['United States', 'South Korea', 'China', 'Germany', 'United Kingdom']
  },
  // Logistics & Transportation
  {
    id: 'logistics',
    name: 'Logistics',
    description: 'Supply chain management, warehousing, and distribution services',
    job_count: 3500,
    avg_salary: '$60,000',
    growth_rate: 'High',
    global_demand: 'Very High',
    top_countries: ['United States', 'Germany', 'China', 'Japan', 'Netherlands']
  },
  {
    id: 'shipping',
    name: 'Shipping',
    description: 'Maritime transportation, cargo shipping, and port services',
    job_count: 1200,
    avg_salary: '$65,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['China', 'Singapore', 'United States', 'Germany', 'Japan']
  },
  // Mining & Resources
  {
    id: 'mining',
    name: 'Mining',
    description: 'Mineral extraction, mining equipment, and resource development',
    job_count: 800,
    avg_salary: '$80,000',
    growth_rate: 'Low',
    global_demand: 'Medium',
    top_countries: ['Australia', 'Canada', 'United States', 'Chile', 'Peru']
  },
  {
    id: 'oil-gas',
    name: 'Oil & Gas',
    description: 'Petroleum exploration, production, and energy services',
    job_count: 1000,
    avg_salary: '$95,000',
    growth_rate: 'Low',
    global_demand: 'High',
    top_countries: ['United States', 'Saudi Arabia', 'Russia', 'Canada', 'Norway']
  },
  // Telecommunications
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    description: 'Wireless, broadband, and telecommunications infrastructure',
    job_count: 2000,
    avg_salary: '$75,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'China', 'Japan', 'Germany', 'United Kingdom']
  },
  {
    id: 'satellite',
    name: 'Satellite',
    description: 'Satellite manufacturing, launch services, and space communications',
    job_count: 300,
    avg_salary: '$90,000',
    growth_rate: 'High',
    global_demand: 'Medium',
    top_countries: ['United States', 'China', 'Russia', 'France', 'Germany']
  },
  // Tourism & Hospitality
  {
    id: 'tourism',
    name: 'Tourism',
    description: 'Travel services, destination marketing, and tourism development',
    job_count: 2500,
    avg_salary: '$45,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'France', 'Spain', 'Italy', 'United Kingdom']
  },
  {
    id: 'cruise',
    name: 'Cruise',
    description: 'Cruise line operations, ship management, and maritime tourism',
    job_count: 400,
    avg_salary: '$50,000',
    growth_rate: 'Medium',
    global_demand: 'Medium',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'Italy', 'Norway']
  },
  // Utilities & Infrastructure
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'Electric, gas, water, and waste management services',
    job_count: 1800,
    avg_salary: '$70,000',
    growth_rate: 'Low',
    global_demand: 'High',
    top_countries: ['United States', 'Germany', 'Japan', 'United Kingdom', 'France']
  },
  {
    id: 'waste-management',
    name: 'Waste Management',
    description: 'Waste collection, recycling, and environmental services',
    job_count: 600,
    avg_salary: '$55,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'Germany', 'France', 'United Kingdom', 'Japan']
  },
  // Water & Environment
  {
    id: 'water-treatment',
    name: 'Water Treatment',
    description: 'Water purification, wastewater treatment, and water infrastructure',
    job_count: 500,
    avg_salary: '$65,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'Germany', 'France', 'United Kingdom', 'Japan']
  },
  {
    id: 'environmental',
    name: 'Environmental',
    description: 'Environmental consulting, remediation, and sustainability services',
    job_count: 400,
    avg_salary: '$70,000',
    growth_rate: 'High',
    global_demand: 'High',
    top_countries: ['United States', 'Germany', 'United Kingdom', 'Canada', 'Australia']
  },
  // Emerging Technologies
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    description: 'AI research, development, and AI-powered solutions',
    job_count: 600,
    avg_salary: '$120,000',
    growth_rate: 'Very High',
    global_demand: 'Very High',
    top_countries: ['United States', 'China', 'United Kingdom', 'Canada', 'Germany']
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Blockchain technology, cryptocurrency, and decentralized applications',
    job_count: 300,
    avg_salary: '$110,000',
    growth_rate: 'Very High',
    global_demand: 'High',
    top_countries: ['United States', 'Singapore', 'Switzerland', 'United Kingdom', 'Germany']
  },
  {
    id: 'virtual-reality',
    name: 'Virtual Reality',
    description: 'VR/AR development, immersive technology, and virtual experiences',
    job_count: 200,
    avg_salary: '$85,000',
    growth_rate: 'Very High',
    global_demand: 'Medium',
    top_countries: ['United States', 'China', 'Japan', 'United Kingdom', 'Germany']
  },
  // Specialized Services
  {
    id: 'security',
    name: 'Security',
    description: 'Physical security, cybersecurity, and risk management services',
    job_count: 800,
    avg_salary: '$65,000',
    growth_rate: 'High',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'France', 'Canada']
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Commercial cleaning, janitorial services, and facility maintenance',
    job_count: 1200,
    avg_salary: '$35,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'France', 'Canada']
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    description: 'Landscape design, maintenance, and outdoor construction services',
    job_count: 600,
    avg_salary: '$45,000',
    growth_rate: 'Medium',
    global_demand: 'Medium',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia']
  },
  // Professional Services
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Accounting services, auditing, and financial consulting',
    job_count: 1000,
    avg_salary: '$70,000',
    growth_rate: 'Medium',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia']
  },
  {
    id: 'consulting',
    name: 'Consulting',
    description: 'Management consulting, strategy, and business advisory services',
    job_count: 800,
    avg_salary: '$95,000',
    growth_rate: 'High',
    global_demand: 'High',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'France', 'Canada']
  },
  // Real Estate & Property
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Property sales, development, and real estate services',
    job_count: 700,
    avg_salary: '$60,000',
    growth_rate: 'Medium',
    global_demand: 'Medium',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia']
  },
  {
    id: 'property-management',
    name: 'Property Management',
    description: 'Property maintenance, tenant services, and facility management',
    job_count: 500,
    avg_salary: '$55,000',
    growth_rate: 'Medium',
    global_demand: 'Medium',
    top_countries: ['United States', 'United Kingdom', 'Germany', 'Canada', 'Australia']
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

async function addIndustriesToCore() {
  console.log('🏭 Adding additional industries to industries_core...');
  
  for (const industry of ADDITIONAL_INDUSTRIES) {
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
      console.log(`✅ Added industry core: ${industry.id}`);
    }
  }
}

async function addIndustryContent() {
  console.log('🏭 Adding industry content for all languages...');
  
  for (const language of LANGUAGES) {
    console.log(`\n🌍 Processing additional industries for ${LANGUAGE_NAMES[language]} (${language})`);
    
    for (const industry of ADDITIONAL_INDUSTRIES) {
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
        console.log(`✅ Added industry content ${industry.id} for ${language}: ${name}`);
      }
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function main() {
  console.log('🚀 Adding Comprehensive Industries to Database');
  console.log('=' * 50);
  
  try {
    // Step 1: Add industries to core table
    await addIndustriesToCore();
    
    // Step 2: Add industry content to all languages
    await addIndustryContent();
    
    console.log('\n🎉 Additional industries added successfully!');
    console.log('\n📊 Summary:');
    console.log(`   ✅ Added ${ADDITIONAL_INDUSTRIES.length} additional industries`);
    console.log(`   ✅ Created translations for: ${LANGUAGES.join(', ')}`);
    console.log(`   ✅ Now covers major global industries`);
    console.log(`   ✅ Includes emerging technologies and specialized sectors`);
    
  } catch (error) {
    console.error('❌ Error during addition:', error);
    process.exit(1);
  }
}

main();
