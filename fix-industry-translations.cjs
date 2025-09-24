const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixIndustryTranslations() {
  console.log('🔧 Fixing industry translations...');

  try {
    // First, let's clear the existing data and recreate it properly
    console.log('   📊 Clearing existing industry translations...');
    const { error: deleteError } = await supabase
      .from('industry_translations')
      .delete()
      .neq('industry_id', '');

    if (deleteError) {
      console.error('   ❌ Error clearing data:', deleteError.message);
      return;
    }

    // Get industries
    const { data: industries } = await supabase
      .from('industries_new')
      .select('*');

    if (!industries || industries.length === 0) {
      console.error('   ❌ No industries found');
      return;
    }

    console.log(`   📊 Found ${industries.length} industries`);

    // Create proper industry translations
    const industryTranslations = [];
    const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'ja'];

    for (const industry of industries) {
      // English
      industryTranslations.push({
        industry_id: industry.id,
        language_code: 'en',
        name: industry.name_en
      });

      // Other languages (using English as fallback for now)
      for (const lang of languages.filter(l => l !== 'en')) {
        industryTranslations.push({
          industry_id: industry.id,
          language_code: lang,
          name: industry.name_en // TODO: Add proper translations
        });
      }
    }

    console.log(`   📊 Inserting ${industryTranslations.length} industry translations...`);
    const { error: insertError } = await supabase
      .from('industry_translations')
      .insert(industryTranslations);

    if (insertError) {
      console.error('   ❌ Error inserting industry translations:', insertError.message);
    } else {
      console.log('   ✅ Industry translations fixed successfully');
    }

    // Verify the fix
    console.log('   📊 Verifying fix...');
    const { data: verifyData } = await supabase
      .from('industry_translations')
      .select('*')
      .limit(5);

    if (verifyData && verifyData.length > 0) {
      console.log('   ✅ Sample data:');
      verifyData.forEach(item => {
        console.log(`     ${item.industry_id} (${item.language_code}): ${item.name}`);
      });
    }

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixIndustryTranslations().catch(console.error);
