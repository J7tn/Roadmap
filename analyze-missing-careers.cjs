const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeMissingCareers() {
  console.log('🔍 Analyzing missing careers and translations...');

  try {
    // Get all careers from original table
    console.log('\n📋 Original careers table:');
    const { data: originalCareers, error: originalError } = await supabase
      .from('careers')
      .select('*');

    if (originalError) {
      console.error('   ❌ Error:', originalError.message);
      return;
    }

    console.log(`   📊 Found ${originalCareers.length} careers in original table`);

    // Get all careers from new table
    console.log('\n📋 New careers table:');
    const { data: newCareers, error: newError } = await supabase
      .from('careers_new')
      .select('*');

    if (newError) {
      console.error('   ❌ Error:', newError.message);
      return;
    }

    console.log(`   📊 Found ${newCareers.length} careers in new table`);

    // Find missing careers
    const originalIds = new Set(originalCareers.map(c => c.id));
    const newIds = new Set(newCareers.map(c => c.id));
    
    const missingCareers = originalCareers.filter(c => !newIds.has(c.id));
    const extraCareers = newCareers.filter(c => !originalIds.has(c.id));

    console.log(`\n📊 Missing careers: ${missingCareers.length}`);
    if (missingCareers.length > 0) {
      console.log('   Missing career IDs:');
      missingCareers.forEach(career => {
        console.log(`     - ${career.id} (${career.title}) - Industry: ${career.industry}`);
      });
    }

    console.log(`\n📊 Extra careers: ${extraCareers.length}`);
    if (extraCareers.length > 0) {
      console.log('   Extra career IDs:');
      extraCareers.forEach(career => {
        console.log(`     - ${career.id} - Industry: ${career.industry_id}`);
      });
    }

    // Analyze translation coverage
    console.log('\n📋 Career translation coverage:');
    const { data: allTranslations, error: transError } = await supabase
      .from('career_translations')
      .select('*');

    if (transError) {
      console.error('   ❌ Error:', transError.message);
      return;
    }

    console.log(`   📊 Found ${allTranslations.length} career translations`);

    // Group by career_id
    const translationsByCareer = {};
    allTranslations.forEach(trans => {
      if (!translationsByCareer[trans.career_id]) {
        translationsByCareer[trans.career_id] = [];
      }
      translationsByCareer[trans.career_id].push(trans);
    });

    // Check translation coverage
    const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'ja'];
    const coverageStats = {
      totalCareers: originalCareers.length,
      careersWithTranslations: Object.keys(translationsByCareer).length,
      careersWithCompleteTranslations: 0,
      careersWithPartialTranslations: 0,
      careersWithNoTranslations: 0
    };

    originalCareers.forEach(career => {
      const translations = translationsByCareer[career.id] || [];
      const translationLanguages = new Set(translations.map(t => t.language_code));
      
      if (translations.length === 0) {
        coverageStats.careersWithNoTranslations++;
      } else if (translationLanguages.size === languages.length) {
        coverageStats.careersWithCompleteTranslations++;
      } else {
        coverageStats.careersWithPartialTranslations++;
      }
    });

    console.log('\n📊 Translation Coverage Analysis:');
    console.log(`   Total careers: ${coverageStats.totalCareers}`);
    console.log(`   Careers with translations: ${coverageStats.careersWithTranslations}`);
    console.log(`   Careers with complete translations: ${coverageStats.careersWithCompleteTranslations}`);
    console.log(`   Careers with partial translations: ${coverageStats.careersWithPartialTranslations}`);
    console.log(`   Careers with no translations: ${coverageStats.careersWithNoTranslations}`);

    // Show careers with no translations
    const careersWithNoTranslations = originalCareers.filter(career => !translationsByCareer[career.id]);
    if (careersWithNoTranslations.length > 0) {
      console.log('\n📊 Careers with no translations:');
      careersWithNoTranslations.forEach(career => {
        console.log(`     - ${career.id} (${career.title}) - Industry: ${career.industry}`);
      });
    }

    // Show careers with partial translations
    const careersWithPartialTranslations = originalCareers.filter(career => {
      const translations = translationsByCareer[career.id] || [];
      const translationLanguages = new Set(translations.map(t => t.language_code));
      return translations.length > 0 && translationLanguages.size < languages.length;
    });

    if (careersWithPartialTranslations.length > 0) {
      console.log('\n📊 Careers with partial translations:');
      careersWithPartialTranslations.forEach(career => {
        const translations = translationsByCareer[career.id] || [];
        const translationLanguages = new Set(translations.map(t => t.language_code));
        const missingLanguages = languages.filter(lang => !translationLanguages.has(lang));
        console.log(`     - ${career.id} (${career.title}) - Missing: ${missingLanguages.join(', ')}`);
      });
    }

  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

analyzeMissingCareers().catch(console.error);
