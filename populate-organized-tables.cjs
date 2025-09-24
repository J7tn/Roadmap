const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function populateOrganizedTables() {
  console.log('🚀 Populating new organized tables with data...');

  try {
    // Step 1: Populate industries
    console.log('\n📋 Step 1: Populating industries...');
    await populateIndustries();

    // Step 2: Populate careers
    console.log('\n📋 Step 2: Populating careers...');
    await populateCareers();

    // Step 3: Populate career content
    console.log('\n📋 Step 3: Populating career content...');
    await populateCareerContent();

    // Step 4: Populate career trends
    console.log('\n📋 Step 4: Populating career trends...');
    await populateCareerTrends();

    console.log('\n🎉 Data population completed successfully!');

  } catch (error) {
    console.error('❌ Data population failed:', error);
  }
}

async function populateIndustries() {
  const industryData = [
    { id: 'tech', name: 'Technology', description: 'Software development, IT, cybersecurity, and emerging tech', icon: 'computer', jobCount: 85, avgSalary: '$95,000', growthRate: 'High', globalDemand: 'high', topCountries: ['US', 'CA', 'UK', 'DE', 'NL', 'SG', 'AU'] },
    { id: 'healthcare', name: 'Healthcare', description: 'Medical, nursing, allied health, and healthcare administration', icon: 'heart', jobCount: 75, avgSalary: '$75,000', growthRate: 'High', globalDemand: 'high', topCountries: ['US', 'CA', 'UK', 'DE', 'AU', 'NZ', 'CH'] },
    { id: 'business', name: 'Business', description: 'Management, operations, consulting, and business development', icon: 'briefcase', jobCount: 65, avgSalary: '$80,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'UK', 'DE', 'FR', 'SG', 'AE', 'CH'] },
    { id: 'finance', name: 'Finance', description: 'Banking, investment, accounting, and financial services', icon: 'dollar-sign', jobCount: 45, avgSalary: '$85,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'UK', 'CH', 'SG', 'AE', 'DE', 'FR'] },
    { id: 'marketing', name: 'Marketing', description: 'Digital marketing, advertising, PR, and brand management', icon: 'megaphone', jobCount: 40, avgSalary: '$70,000', growthRate: 'High', globalDemand: 'high', topCountries: ['US', 'UK', 'DE', 'NL', 'AU', 'SG', 'CA'] },
    { id: 'education', name: 'Education', description: 'Teaching, administration, training, and educational technology', icon: 'book-open', jobCount: 35, avgSalary: '$60,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'CA', 'UK', 'AU', 'NZ', 'DE', 'NL'] },
    { id: 'creative', name: 'Creative Arts', description: 'Design, writing, photography, and creative production', icon: 'palette', jobCount: 30, avgSalary: '$65,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'UK', 'DE', 'NL', 'AU', 'CA', 'SE'] },
    { id: 'engineering', name: 'Engineering', description: 'Mechanical, electrical, civil, and industrial engineering', icon: 'settings', jobCount: 35, avgSalary: '$90,000', growthRate: 'Medium', globalDemand: 'high', topCountries: ['US', 'DE', 'CH', 'SE', 'AU', 'CA', 'UK'] },
    { id: 'science', name: 'Science', description: 'Research, laboratory work, and scientific analysis', icon: 'flask', jobCount: 25, avgSalary: '$75,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'DE', 'CH', 'SE', 'AU', 'CA', 'UK'] },
    { id: 'legal', name: 'Legal', description: 'Law, paralegal, compliance, and legal services', icon: 'scale', jobCount: 20, avgSalary: '$85,000', growthRate: 'Low', globalDemand: 'medium', topCountries: ['US', 'UK', 'CH', 'DE', 'AU', 'CA', 'SG'] },
    { id: 'government', name: 'Government', description: 'Public service, policy, and government administration', icon: 'building', jobCount: 15, avgSalary: '$70,000', growthRate: 'Low', globalDemand: 'low', topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE'] },
    { id: 'nonprofit', name: 'Non-Profit', description: 'Social work, advocacy, and non-profit management', icon: 'heart-handshake', jobCount: 15, avgSalary: '$55,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'CA', 'UK', 'DE', 'NL', 'AU', 'SE'] },
    { id: 'trades', name: 'Skilled Trades', description: 'Construction, manufacturing, and technical trades', icon: 'wrench', jobCount: 20, avgSalary: '$65,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'CA', 'AU', 'DE', 'CH', 'UK', 'NL'] },
    { id: 'hospitality', name: 'Hospitality', description: 'Food service, tourism, and hospitality management', icon: 'utensils', jobCount: 15, avgSalary: '$50,000', growthRate: 'Medium', globalDemand: 'medium', topCountries: ['US', 'CA', 'AU', 'UK', 'DE', 'FR', 'SG'] },
    { id: 'media', name: 'Media & Entertainment', description: 'Journalism, broadcasting, and entertainment production', icon: 'video', jobCount: 20, avgSalary: '$60,000', growthRate: 'Low', globalDemand: 'medium', topCountries: ['US', 'UK', 'CA', 'AU', 'DE', 'NL', 'SE'] }
  ];

  // Insert industries
  const industriesToInsert = industryData.map(industry => ({
    id: industry.id,
    name_en: industry.name,
    description_en: industry.description,
    icon: industry.icon,
    job_count: industry.jobCount,
    avg_salary: industry.avgSalary,
    growth_rate: industry.growthRate,
    global_demand: industry.globalDemand,
    top_countries: industry.topCountries
  }));

  console.log(`   📊 Inserting ${industriesToInsert.length} industries...`);
  const { error: industriesError } = await supabase
    .from('industries_new')
    .upsert(industriesToInsert, { onConflict: 'id' });

  if (industriesError) {
    console.error('   ❌ Error inserting industries:', industriesError.message);
  } else {
    console.log('   ✅ Industries populated successfully');
  }

  // Insert industry translations
  console.log('   📊 Inserting industry translations...');
  const industryTranslations = [];
  const languages = ['ES', 'FR', 'DE', 'IT', 'PT', 'RU', 'KO', 'ZH', 'AR', 'JA'];

  for (const industry of industriesToInsert) {
    // English
    industryTranslations.push({
      industry_id: industry.id,
      language_code: 'EN',
      name: industry.name_en,
      description: industry.description_en
    });

    // Other languages (using English as fallback for now)
    for (const lang of languages) {
      industryTranslations.push({
        industry_id: industry.id,
        language_code: lang,
        name: industry.name_en, // TODO: Add proper translations
        description: industry.description_en // TODO: Add proper translations
      });
    }
  }

  const { error: translationsError } = await supabase
    .from('industry_translations')
    .upsert(industryTranslations, { onConflict: 'industry_id,language_code' });

  if (translationsError) {
    console.error('   ❌ Error inserting industry translations:', translationsError.message);
  } else {
    console.log('   ✅ Industry translations populated successfully');
  }
}

async function populateCareers() {
  console.log('   📊 Fetching existing careers...');
  
  const { data: careers, error: careersError } = await supabase
    .from('careers')
    .select('*');

  if (careersError) {
    console.error('   ❌ Error fetching careers:', careersError.message);
    return;
  }

  console.log(`   📊 Found ${careers.length} careers to migrate`);

  const careersToInsert = careers.map(career => ({
    id: career.id,
    industry_id: career.industry,
    level: career.level,
    salary_range: career.salary,
    experience_required: career.experience
  }));

  console.log(`   📊 Inserting ${careersToInsert.length} careers...`);
  const { error: careersInsertError } = await supabase
    .from('careers_new')
    .upsert(careersToInsert, { onConflict: 'id' });

  if (careersInsertError) {
    console.error('   ❌ Error inserting careers:', careersInsertError.message);
  } else {
    console.log('   ✅ Careers populated successfully');
  }
}

async function populateCareerContent() {
  console.log('   📊 Fetching existing career translations...');
  
  const { data: careerTranslations, error: translationsError } = await supabase
    .from('career_translations')
    .select('*');

  if (translationsError) {
    console.error('   ❌ Error fetching career translations:', translationsError.message);
    return;
  }

  console.log(`   📊 Found ${careerTranslations.length} career translations to migrate`);

  const contentToInsert = careerTranslations.map(translation => ({
    career_id: translation.career_id,
    language_code: translation.language_code,
    title: translation.title,
    description: translation.description,
    skills: translation.skills || [],
    job_titles: translation.job_titles || [],
    certifications: translation.certifications || [],
    requirements: translation.requirements || {}
  }));

  console.log(`   📊 Inserting ${contentToInsert.length} career content entries...`);
  const { error: contentInsertError } = await supabase
    .from('career_content')
    .upsert(contentToInsert, { onConflict: 'career_id,language_code' });

  if (contentInsertError) {
    console.error('   ❌ Error inserting career content:', contentInsertError.message);
  } else {
    console.log('   ✅ Career content populated successfully');
  }
}

async function populateCareerTrends() {
  console.log('   📊 Fetching existing career trends...');
  
  const { data: trends, error: trendsError } = await supabase
    .from('career_trends')
    .select('*');

  if (trendsError) {
    console.error('   ❌ Error fetching career trends:', trendsError.message);
    return;
  }

  console.log(`   📊 Found ${trends.length} career trends to migrate`);

  const trendsToInsert = trends.map(trend => ({
    career_id: trend.career_id,
    trend_score: trend.trend_score,
    trend_direction: trend.trend_direction,
    demand_level: trend.demand_level,
    growth_rate: trend.growth_rate,
    market_insights: trend.market_insights,
    key_skills_trending: trend.key_skills_trending,
    salary_trend: trend.salary_trend,
    job_availability_score: trend.job_availability_score,
    top_locations: trend.top_locations,
    remote_work_trend: trend.remote_work_trend,
    industry_impact: trend.industry_impact,
    automation_risk: trend.automation_risk,
    future_outlook: trend.future_outlook,
    currency_code: trend.currency_code || 'USD',
    salary_data: trend.salary_data,
    data_source: trend.data_source || 'chat2api',
    confidence_score: trend.confidence_score,
    last_updated: trend.last_updated,
    next_update_due: trend.next_update_due
  }));

  console.log(`   📊 Inserting ${trendsToInsert.length} career trends...`);
  const { error: trendsInsertError } = await supabase
    .from('career_trends_new')
    .upsert(trendsToInsert, { onConflict: 'career_id' });

  if (trendsInsertError) {
    console.error('   ❌ Error inserting career trends:', trendsInsertError.message);
  } else {
    console.log('   ✅ Career trends populated successfully');
  }
}

// Run the population script
populateOrganizedTables().catch(console.error);
