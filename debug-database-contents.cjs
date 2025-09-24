const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugDatabaseContents() {
  console.log('🔍 Debugging database contents...');

  try {
    // Check industry translations
    console.log('\n📋 Industry Translations:');
    const { data: industryTranslations, error: itError } = await supabase
      .from('industry_translations')
      .select('*')
      .limit(10);

    if (itError) {
      console.error('   ❌ Error:', itError.message);
    } else {
      console.log(`   📊 Found ${industryTranslations.length} entries`);
      industryTranslations.forEach(translation => {
        console.log(`     ${translation.industry_id} (${translation.language_code}): ${translation.name}`);
      });
    }

    // Check career content
    console.log('\n📋 Career Content:');
    const { data: careerContent, error: ccError } = await supabase
      .from('career_content')
      .select('*')
      .limit(10);

    if (ccError) {
      console.error('   ❌ Error:', ccError.message);
    } else {
      console.log(`   📊 Found ${careerContent.length} entries`);
      careerContent.forEach(content => {
        console.log(`     ${content.career_id} (${content.language_code}): ${content.title}`);
      });
    }

    // Check what languages we actually have
    console.log('\n📋 Language Distribution:');
    
    const { data: allIndustryTranslations } = await supabase
      .from('industry_translations')
      .select('language_code');

    const { data: allCareerContent } = await supabase
      .from('career_content')
      .select('language_code');

    const industryLanguages = [...new Set(allIndustryTranslations?.map(t => t.language_code) || [])];
    const careerLanguages = [...new Set(allCareerContent?.map(c => c.language_code) || [])];

    console.log('   📊 Industry translation languages:', industryLanguages);
    console.log('   📊 Career content languages:', careerLanguages);

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugDatabaseContents().catch(console.error);
