const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addMissingTranslations() {
  console.log('🔧 Adding missing career translations...');

  try {
    // Get all careers from new table
    const { data: allCareers, error: careersError } = await supabase
      .from('careers_new')
      .select('id');

    if (careersError) {
      console.error('   ❌ Error fetching careers:', careersError.message);
      return;
    }

    console.log(`   📊 Found ${allCareers.length} careers`);

    // Get existing career content
    const { data: existingContent, error: contentError } = await supabase
      .from('career_content')
      .select('career_id, language_code');

    if (contentError) {
      console.error('   ❌ Error fetching existing content:', contentError.message);
      return;
    }

    // Group existing content by career_id
    const existingByCareer = {};
    existingContent.forEach(content => {
      if (!existingByCareer[content.career_id]) {
        existingByCareer[content.career_id] = new Set();
      }
      existingByCareer[content.career_id].add(content.language_code);
    });

    // Get English content as template
    const { data: englishContent, error: englishError } = await supabase
      .from('career_content')
      .select('*')
      .eq('language_code', 'en');

    if (englishError) {
      console.error('   ❌ Error fetching English content:', englishError.message);
      return;
    }

    console.log(`   📊 Found ${englishContent.length} English content entries`);

    // Create English content map
    const englishByCareer = {};
    englishContent.forEach(content => {
      englishByCareer[content.career_id] = content;
    });

    // Define target languages
    const targetLanguages = ['es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'ja'];

    // Find missing translations
    const missingTranslations = [];
    
    for (const career of allCareers) {
      const careerId = career.id;
      const existingLanguages = existingByCareer[careerId] || new Set();
      const englishTemplate = englishByCareer[careerId];

      if (!englishTemplate) {
        console.log(`   ⚠️ No English template for career ${careerId}`);
        continue;
      }

      for (const lang of targetLanguages) {
        if (!existingLanguages.has(lang)) {
          // Create placeholder translation based on English template
          missingTranslations.push({
            career_id: careerId,
            language_code: lang,
            title: `[${lang.toUpperCase()}] ${englishTemplate.title}`,
            description: `[${lang.toUpperCase()}] ${englishTemplate.description}`,
            skills: englishTemplate.skills.map(skill => `[${lang.toUpperCase()}] ${skill}`),
            job_titles: englishTemplate.job_titles.map(title => `[${lang.toUpperCase()}] ${title}`),
            certifications: englishTemplate.certifications.map(cert => `[${lang.toUpperCase()}] ${cert}`),
            requirements: englishTemplate.requirements
          });
        }
      }
    }

    console.log(`   📊 Found ${missingTranslations.length} missing translations to add`);

    if (missingTranslations.length === 0) {
      console.log('   ✅ No missing translations to add');
      return;
    }

    // Insert missing translations in batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < missingTranslations.length; i += batchSize) {
      const batch = missingTranslations.slice(i, i + batchSize);
      
      try {
        const { error } = await supabase
          .from('career_content')
          .insert(batch);
        
        if (error) {
          console.error(`   ❌ Error inserting translations batch ${Math.floor(i/batchSize) + 1}:`, error.message);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
          console.log(`   ✅ Inserted translations batch ${Math.floor(i/batchSize) + 1}: ${batch.length} entries`);
        }
      } catch (err) {
        console.error(`   ❌ Exception inserting translations batch ${Math.floor(i/batchSize) + 1}:`, err.message);
        errorCount += batch.length;
      }
    }

    console.log(`   📊 Results: ${successCount} successful, ${errorCount} errors`);

    // Show summary by language
    console.log('\n   📊 Missing translations summary by language:');
    const missingByLanguage = {};
    missingTranslations.forEach(trans => {
      missingByLanguage[trans.language_code] = (missingByLanguage[trans.language_code] || 0) + 1;
    });

    Object.entries(missingByLanguage).forEach(([lang, count]) => {
      console.log(`     ${lang}: ${count} missing translations`);
    });

  } catch (error) {
    console.error('❌ Failed to add missing translations:', error);
  }
}

addMissingTranslations().catch(console.error);
