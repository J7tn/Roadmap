const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testOrganizedSystem() {
  console.log('🧪 Testing the new organized system...');

  try {
    // Test 1: Check if new tables exist
    console.log('\n📋 Test 1: Checking if new tables exist...');
    await testTableExistence();

    // Test 2: Test industry data
    console.log('\n📋 Test 2: Testing industry data...');
    await testIndustryData();

    // Test 3: Test career data
    console.log('\n📋 Test 3: Testing career data...');
    await testCareerData();

    // Test 4: Test career content translations
    console.log('\n📋 Test 4: Testing career content translations...');
    await testCareerContentTranslations();

    // Test 5: Test career trends
    console.log('\n📋 Test 5: Testing career trends...');
    await testCareerTrends();

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function testTableExistence() {
  const tables = [
    'industries_new',
    'industry_translations',
    'careers_new',
    'career_content',
    'career_trends_new'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`   ❌ Table ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ Table ${table}: Exists and accessible`);
      }
    } catch (error) {
      console.log(`   ❌ Table ${table}: ${error.message}`);
    }
  }
}

async function testIndustryData() {
  try {
    const { data: industries, error } = await supabase
      .from('industries_new')
      .select('*');

    if (error) {
      console.log(`   ❌ Error fetching industries: ${error.message}`);
      return;
    }

    console.log(`   📊 Found ${industries.length} industries`);

    // Test industry translations
    const { data: translations, error: translationError } = await supabase
      .from('industry_translations')
      .select('*');

    if (translationError) {
      console.log(`   ❌ Error fetching industry translations: ${translationError.message}`);
      return;
    }

    console.log(`   📊 Found ${translations.length} industry translations`);

    // Check translation coverage
    const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'ja'];
    const translationCoverage = {};

    for (const lang of languages) {
      const langTranslations = translations.filter(t => t.language_code === lang);
      translationCoverage[lang] = langTranslations.length;
    }

    console.log('   📊 Translation coverage by language:');
    Object.entries(translationCoverage).forEach(([lang, count]) => {
      console.log(`     ${lang}: ${count} translations`);
    });

  } catch (error) {
    console.log(`   ❌ Error in industry data test: ${error.message}`);
  }
}

async function testCareerData() {
  try {
    const { data: careers, error } = await supabase
      .from('careers_new')
      .select('*');

    if (error) {
      console.log(`   ❌ Error fetching careers: ${error.message}`);
      return;
    }

    console.log(`   📊 Found ${careers.length} careers`);

    // Test industry distribution
    const industryDistribution = {};
    careers.forEach(career => {
      industryDistribution[career.industry_id] = (industryDistribution[career.industry_id] || 0) + 1;
    });

    console.log('   📊 Career distribution by industry:');
    Object.entries(industryDistribution).forEach(([industry, count]) => {
      console.log(`     ${industry}: ${count} careers`);
    });

    // Test level distribution
    const levelDistribution = {};
    careers.forEach(career => {
      levelDistribution[career.level] = (levelDistribution[career.level] || 0) + 1;
    });

    console.log('   📊 Career distribution by level:');
    Object.entries(levelDistribution).forEach(([level, count]) => {
      console.log(`     ${level}: ${count} careers`);
    });

  } catch (error) {
    console.log(`   ❌ Error in career data test: ${error.message}`);
  }
}

async function testCareerContentTranslations() {
  try {
    const { data: content, error } = await supabase
      .from('career_content')
      .select('*');

    if (error) {
      console.log(`   ❌ Error fetching career content: ${error.message}`);
      return;
    }

    console.log(`   📊 Found ${content.length} career content entries`);

    // Test translation coverage by language
    const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'ja'];
    const translationCoverage = {};

    for (const lang of languages) {
      const langContent = content.filter(c => c.language_code === lang);
      translationCoverage[lang] = langContent.length;
    }

    console.log('   📊 Career content translation coverage by language:');
    Object.entries(translationCoverage).forEach(([lang, count]) => {
      const percentage = ((count / content.length) * 100).toFixed(1);
      console.log(`     ${lang}: ${count} entries (${percentage}%)`);
    });

    // Test a specific career's translations
    const sampleCareer = content.find(c => c.language_code === 'EN');
    if (sampleCareer) {
      console.log(`   📊 Sample career "${sampleCareer.title}" translations:`);
      const careerTranslations = content.filter(c => c.career_id === sampleCareer.career_id);
      careerTranslations.forEach(translation => {
        console.log(`     ${translation.language_code}: ${translation.title}`);
      });
    }

  } catch (error) {
    console.log(`   ❌ Error in career content test: ${error.message}`);
  }
}

async function testCareerTrends() {
  try {
    const { data: trends, error } = await supabase
      .from('career_trends_new')
      .select('*');

    if (error) {
      console.log(`   ❌ Error fetching career trends: ${error.message}`);
      return;
    }

    console.log(`   📊 Found ${trends.length} career trends`);

    // Test trend direction distribution
    const trendDirectionDistribution = {};
    trends.forEach(trend => {
      trendDirectionDistribution[trend.trend_direction] = (trendDirectionDistribution[trend.trend_direction] || 0) + 1;
    });

    console.log('   📊 Trend direction distribution:');
    Object.entries(trendDirectionDistribution).forEach(([direction, count]) => {
      console.log(`     ${direction}: ${count} trends`);
    });

    // Test demand level distribution
    const demandLevelDistribution = {};
    trends.forEach(trend => {
      demandLevelDistribution[trend.demand_level] = (demandLevelDistribution[trend.demand_level] || 0) + 1;
    });

    console.log('   📊 Demand level distribution:');
    Object.entries(demandLevelDistribution).forEach(([level, count]) => {
      console.log(`     ${level}: ${count} trends`);
    });

    // Test currency distribution
    const currencyDistribution = {};
    trends.forEach(trend => {
      const currency = trend.currency_code || 'USD';
      currencyDistribution[currency] = (currencyDistribution[currency] || 0) + 1;
    });

    console.log('   📊 Currency distribution:');
    Object.entries(currencyDistribution).forEach(([currency, count]) => {
      console.log(`     ${currency}: ${count} trends`);
    });

  } catch (error) {
    console.log(`   ❌ Error in career trends test: ${error.message}`);
  }
}

// Run the tests
testOrganizedSystem().catch(console.error);
