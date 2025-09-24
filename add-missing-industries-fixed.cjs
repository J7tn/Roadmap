const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addMissingIndustries() {
  console.log('🔧 Adding missing industries...');

  try {
    // Get unique industries from missing careers
    const missingIndustries = [
      { id: 'agriculture', name_en: 'Agriculture', description_en: 'Farming, agricultural technology, and food production', icon: 'seedling', job_count: 8, avg_salary: '$55,000', growth_rate: 'Medium', global_demand: 'medium', top_countries: ['US', 'CA', 'AU', 'BR', 'DE', 'FR', 'NL'] },
      { id: 'emerging-tech', name_en: 'Emerging Technology', description_en: 'AI, blockchain, quantum computing, and cutting-edge tech', icon: 'cpu', job_count: 12, avg_salary: '$120,000', growth_rate: 'Very High', global_demand: 'high', top_countries: ['US', 'CA', 'UK', 'DE', 'SG', 'JP', 'KR'] },
      { id: 'digital-creator', name_en: 'Digital Content Creation', description_en: 'Social media, content creation, and digital entrepreneurship', icon: 'camera', job_count: 10, avg_salary: '$65,000', growth_rate: 'High', global_demand: 'high', top_countries: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP'] },
      { id: 'drones-aviation', name_en: 'Drones & Aviation', description_en: 'Drone technology, aviation, and aerospace engineering', icon: 'plane', job_count: 7, avg_salary: '$85,000', growth_rate: 'High', global_demand: 'medium', top_countries: ['US', 'CA', 'AU', 'DE', 'FR', 'UK', 'JP'] },
      { id: 'emergency-services', name_en: 'Emergency Services', description_en: 'Firefighting, police, paramedics, and emergency response', icon: 'shield', job_count: 6, avg_salary: '$60,000', growth_rate: 'Medium', global_demand: 'high', top_countries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'] },
      { id: 'gaming-casino', name_en: 'Gaming & Casino', description_en: 'Casino operations, gaming development, and entertainment', icon: 'dice', job_count: 8, avg_salary: '$70,000', growth_rate: 'Medium', global_demand: 'medium', top_countries: ['US', 'CA', 'SG', 'AU', 'DE', 'FR', 'JP'] },
      { id: 'investment-finance', name_en: 'Investment & Finance', description_en: 'Investment banking, portfolio management, and financial services', icon: 'trending-up', job_count: 7, avg_salary: '$150,000', growth_rate: 'Medium', global_demand: 'high', top_countries: ['US', 'UK', 'CH', 'SG', 'HK', 'DE', 'FR'] },
      { id: 'manufacturing', name_en: 'Manufacturing', description_en: 'Production, quality control, and manufacturing engineering', icon: 'factory', job_count: 7, avg_salary: '$65,000', growth_rate: 'Medium', global_demand: 'medium', top_countries: ['US', 'DE', 'JP', 'CN', 'KR', 'CA', 'UK'] },
      { id: 'marine-science', name_en: 'Marine Science', description_en: 'Marine biology, oceanography, and aquatic research', icon: 'waves', job_count: 7, avg_salary: '$75,000', growth_rate: 'Medium', global_demand: 'medium', top_countries: ['US', 'CA', 'AU', 'UK', 'DE', 'FR', 'JP'] },
      { id: 'middle-management', name_en: 'Middle Management', description_en: 'Department management, operations, and team leadership', icon: 'users', job_count: 7, avg_salary: '$90,000', growth_rate: 'Medium', global_demand: 'high', top_countries: ['US', 'UK', 'DE', 'CA', 'AU', 'FR', 'SG'] },
      { id: 'military', name_en: 'Military', description_en: 'Armed forces, defense, and military operations', icon: 'shield-check', job_count: 7, avg_salary: '$70,000', growth_rate: 'Low', global_demand: 'medium', top_countries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'] },
      { id: 'music', name_en: 'Music & Entertainment', description_en: 'Music production, performance, and entertainment industry', icon: 'music', job_count: 8, avg_salary: '$60,000', growth_rate: 'Low', global_demand: 'medium', top_countries: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP'] },
      { id: 'public-service', name_en: 'Public Service', description_en: 'Government administration, policy, and public sector', icon: 'landmark', job_count: 7, avg_salary: '$75,000', growth_rate: 'Low', global_demand: 'medium', top_countries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'] },
      { id: 'real-estate', name_en: 'Real Estate', description_en: 'Property sales, development, and real estate investment', icon: 'home', job_count: 7, avg_salary: '$80,000', growth_rate: 'Medium', global_demand: 'high', top_countries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'SG'] },
      { id: 'retail', name_en: 'Retail', description_en: 'Sales, merchandising, and retail management', icon: 'shopping-bag', job_count: 7, avg_salary: '$50,000', growth_rate: 'Low', global_demand: 'medium', top_countries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'JP'] },
      { id: 'sanitation', name_en: 'Sanitation & Waste Management', description_en: 'Waste collection, environmental services, and facility management', icon: 'trash', job_count: 7, avg_salary: '$45,000', growth_rate: 'Medium', global_demand: 'high', top_countries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'] },
      { id: 'specialized-trades', name_en: 'Specialized Trades', description_en: 'Advanced welding, rope access, and specialized construction trades', icon: 'wrench', job_count: 7, avg_salary: '$70,000', growth_rate: 'Medium', global_demand: 'medium', top_countries: ['US', 'CA', 'AU', 'DE', 'UK', 'FR', 'NL'] },
      { id: 'transportation', name_en: 'Transportation & Logistics', description_en: 'Shipping, logistics, and transportation management', icon: 'truck', job_count: 6, avg_salary: '$60,000', growth_rate: 'Medium', global_demand: 'high', top_countries: ['US', 'CA', 'UK', 'DE', 'FR', 'NL', 'SG'] }
    ];

    console.log(`   📊 Adding ${missingIndustries.length} missing industries...`);

    // Insert industries
    const { error: industriesError } = await supabase
      .from('industries_new')
      .upsert(missingIndustries, { onConflict: 'id' });

    if (industriesError) {
      console.error('   ❌ Error inserting industries:', industriesError.message);
      return;
    }

    console.log('   ✅ Industries added successfully');

    // Add industry translations
    console.log('   📊 Adding industry translations...');
    const industryTranslations = [];
    const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'ja'];

    for (const industry of missingIndustries) {
      // English
      industryTranslations.push({
        industry_key: industry.id,
        language_code: 'en',
        industry_name: industry.name_en,
        industry_description: industry.description_en
      });

      // Other languages (using English as fallback for now)
      for (const lang of languages.filter(l => l !== 'en')) {
        industryTranslations.push({
          industry_key: industry.id,
          language_code: lang,
          industry_name: industry.name_en, // TODO: Add proper translations
          industry_description: industry.description_en // TODO: Add proper translations
        });
      }
    }

    const { error: translationsError } = await supabase
      .from('industry_translations')
      .upsert(industryTranslations, { onConflict: 'industry_key,language_code' });

    if (translationsError) {
      console.error('   ❌ Error inserting industry translations:', translationsError.message);
    } else {
      console.log('   ✅ Industry translations added successfully');
    }

    console.log(`   📊 Total industries now: ${missingIndustries.length + 15} (added ${missingIndustries.length})`);

  } catch (error) {
    console.error('❌ Failed to add missing industries:', error);
  }
}

addMissingIndustries().catch(console.error);
