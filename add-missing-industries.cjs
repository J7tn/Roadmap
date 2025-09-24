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
      { id: 'agriculture', name: 'Agriculture', description: 'Farming, agricultural technology, and food production', icon: 'seedling', jobCount: 8, avgSalary: '$55,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'CA', 'AU', 'BR', 'DE', 'FR', 'NL'] },
      { id: 'emerging-tech', name: 'Emerging Technology', description: 'AI, blockchain, quantum computing, and cutting-edge tech', icon: 'cpu', jobCount: 12, avgSalary: '$120,000', growthRate: 'Very High', globalDemand: 'high', topCountries: ['US', 'CA', 'UK', 'DE', 'SG', 'JP', 'KR'] },
      { id: 'digital-creator', name: 'Digital Content Creation', description: 'Social media, content creation, and digital entrepreneurship', icon: 'camera', jobCount: 10, avgSalary: '$65,000', growthRate: 'High', globalDemand: 'high', topCountries: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP'] },
      { id: 'drones-aviation', name: 'Drones & Aviation', description: 'Drone technology, aviation, and aerospace engineering', icon: 'plane', jobCount: 7, avgSalary: '$85,000', growthRate: 'High', globalDemand: 'medium', topCountries: ['US', 'CA', 'AU', 'DE', 'FR', 'UK', 'JP'] },
      { id: 'emergency-services', name: 'Emergency Services', description: 'Firefighting, police, paramedics, and emergency response', icon: 'shield', jobCount: 6, avgSalary: '$60,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'] },
      { id: 'gaming-casino', name: 'Gaming & Casino', description: 'Casino operations, gaming development, and entertainment', icon: 'dice', jobCount: 8, avgSalary: '$70,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'CA', 'SG', 'AU', 'DE', 'FR', 'JP'] },
      { id: 'investment-finance', name: 'Investment & Finance', description: 'Investment banking, portfolio management, and financial services', icon: 'trending-up', jobCount: 7, avgSalary: '$150,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'UK', 'CH', 'SG', 'HK', 'DE', 'FR'] },
      { id: 'manufacturing', name: 'Manufacturing', description: 'Production, quality control, and manufacturing engineering', icon: 'factory', jobCount: 7, avgSalary: '$65,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'DE', 'JP', 'CN', 'KR', 'CA', 'UK'] },
      { id: 'marine-science', name: 'Marine Science', description: 'Marine biology, oceanography, and aquatic research', icon: 'waves', jobCount: 7, avgSalary: '$75,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'CA', 'AU', 'UK', 'DE', 'FR', 'JP'] },
      { id: 'middle-management', name: 'Middle Management', description: 'Department management, operations, and team leadership', icon: 'users', jobCount: 7, avgSalary: '$90,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'UK', 'DE', 'CA', 'AU', 'FR', 'SG'] },
      { id: 'military', name: 'Military', description: 'Armed forces, defense, and military operations', icon: 'shield-check', jobCount: 7, avgSalary: '$70,000', growthRate: 'Low', globalDemand: 'medium', topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'] },
      { id: 'music', name: 'Music & Entertainment', description: 'Music production, performance, and entertainment industry', icon: 'music', jobCount: 8, avgSalary: '$60,000', growthRate: 'Low', globalDemand: 'medium', topCountries: ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP'] },
      { id: 'public-service', name: 'Public Service', description: 'Government administration, policy, and public sector', icon: 'landmark', jobCount: 7, avgSalary: '$75,000', growthRate: 'Low', globalDemand: 'medium', topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'] },
      { id: 'real-estate', name: 'Real Estate', description: 'Property sales, development, and real estate investment', icon: 'home', jobCount: 7, avgSalary: '$80,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'SG'] },
      { id: 'retail', name: 'Retail', description: 'Sales, merchandising, and retail management', icon: 'shopping-bag', jobCount: 7, avgSalary: '$50,000', growthRate: 'Low', globalDemand: 'medium', topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'JP'] },
      { id: 'sanitation', name: 'Sanitation & Waste Management', description: 'Waste collection, environmental services, and facility management', icon: 'trash', jobCount: 7, avgSalary: '$45,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL'] },
      { id: 'specialized-trades', name: 'Specialized Trades', description: 'Advanced welding, rope access, and specialized construction trades', icon: 'wrench', jobCount: 7, avgSalary: '$70,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'CA', 'AU', 'DE', 'UK', 'FR', 'NL'] },
      { id: 'transportation', name: 'Transportation & Logistics', description: 'Shipping, logistics, and transportation management', icon: 'truck', jobCount: 6, avgSalary: '$60,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'CA', 'UK', 'DE', 'FR', 'NL', 'SG'] }
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
        industry_name: industry.name,
        industry_description: industry.description
      });

      // Other languages (using English as fallback for now)
      for (const lang of languages.filter(l => l !== 'en')) {
        industryTranslations.push({
          industry_key: industry.id,
          language_code: lang,
          industry_name: industry.name, // TODO: Add proper translations
          industry_description: industry.description // TODO: Add proper translations
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
