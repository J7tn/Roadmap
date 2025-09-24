const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSpecificCareerTranslations() {
  console.log('🔍 Checking specific career translations...');

  try {
    // Check specific careers mentioned by user
    const careersToCheck = ['security-analyst', 'junior-dev', 'senior-dev', 'mid-dev', 'software-engineer'];
    
    for (const careerId of careersToCheck) {
      console.log(`\n🔍 Checking ${careerId}...`);
      
      // Get all translations for this career
      const { data: translations, error: translationError } = await supabase
        .from('career_translations')
        .select('language_code, title, description, skills, certifications, job_titles')
        .eq('career_id', careerId);

      if (translationError) {
        console.log(`  ❌ Error fetching translations: ${translationError.message}`);
        continue;
      }

      console.log(`  📊 Found ${translations.length} translations`);
      
      // Check each language
      const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ko', 'zh', 'ar', 'ja'];
      const missingLanguages = [];
      
      for (const language of languages) {
        const translation = translations.find(t => t.language_code === language);
        if (!translation) {
          missingLanguages.push(language);
        } else {
          // Check if translation has actual content (not just placeholder)
          const hasRealContent = translation.title && 
                                !translation.title.startsWith('[ES]') && 
                                !translation.title.startsWith('[FR]') && 
                                !translation.title.startsWith('[DE]') &&
                                !translation.title.startsWith('[IT]') &&
                                !translation.title.startsWith('[PT]') &&
                                !translation.title.startsWith('[RU]') &&
                                !translation.title.startsWith('[KO]') &&
                                !translation.title.startsWith('[ZH]') &&
                                !translation.title.startsWith('[AR]') &&
                                !translation.title.startsWith('[JA]');
          
          if (!hasRealContent) {
            console.log(`  ⚠️ ${language.toUpperCase()}: Has placeholder content (${translation.title})`);
          } else {
            console.log(`  ✅ ${language.toUpperCase()}: ${translation.title}`);
          }
        }
      }
      
      if (missingLanguages.length > 0) {
        console.log(`  ❌ Missing languages: ${missingLanguages.join(', ')}`);
      }
    }

    // Also check a few random careers to see the pattern
    console.log('\n🔍 Checking random careers for pattern...');
    
    const { data: randomCareers, error: randomError } = await supabase
      .from('careers')
      .select('id, title')
      .limit(5);

    if (randomError) {
      console.log('❌ Error fetching random careers:', randomError.message);
    } else {
      for (const career of randomCareers) {
        console.log(`\n🔍 Checking ${career.id} (${career.title})...`);
        
        const { data: careerTranslations, error: careerError } = await supabase
          .from('career_translations')
          .select('language_code, title')
          .eq('career_id', career.id);

        if (careerError) {
          console.log(`  ❌ Error: ${careerError.message}`);
          continue;
        }

        console.log(`  📊 Found ${careerTranslations.length} translations`);
        
        // Check if translations are real or placeholder
        const placeholderCount = careerTranslations.filter(t => 
          t.title && (
            t.title.startsWith('[ES]') || 
            t.title.startsWith('[FR]') || 
            t.title.startsWith('[DE]') ||
            t.title.startsWith('[IT]') ||
            t.title.startsWith('[PT]') ||
            t.title.startsWith('[RU]') ||
            t.title.startsWith('[KO]') ||
            t.title.startsWith('[ZH]') ||
            t.title.startsWith('[AR]') ||
            t.title.startsWith('[JA]')
          )
        ).length;
        
        const realCount = careerTranslations.length - placeholderCount;
        
        console.log(`  📈 Real translations: ${realCount}`);
        console.log(`  📈 Placeholder translations: ${placeholderCount}`);
        
        if (placeholderCount > 0) {
          console.log(`  ⚠️ This career has placeholder translations that need real content!`);
        }
      }
    }

    // Check overall statistics
    console.log('\n📊 Overall Translation Quality Analysis...');
    
    const { data: allTranslations, error: allError } = await supabase
      .from('career_translations')
      .select('title, language_code');

    if (allError) {
      console.log('❌ Error fetching all translations:', allError.message);
    } else {
      const totalTranslations = allTranslations.length;
      const placeholderTranslations = allTranslations.filter(t => 
        t.title && (
          t.title.startsWith('[ES]') || 
          t.title.startsWith('[FR]') || 
          t.title.startsWith('[DE]') ||
          t.title.startsWith('[IT]') ||
          t.title.startsWith('[PT]') ||
          t.title.startsWith('[RU]') ||
          t.title.startsWith('[KO]') ||
          t.title.startsWith('[ZH]') ||
          t.title.startsWith('[AR]') ||
          t.title.startsWith('[JA]')
        )
      ).length;
      
      const realTranslations = totalTranslations - placeholderTranslations;
      
      console.log(`📊 Total translations: ${totalTranslations}`);
      console.log(`📊 Real translations: ${realTranslations} (${Math.round((realTranslations/totalTranslations)*100)}%)`);
      console.log(`📊 Placeholder translations: ${placeholderTranslations} (${Math.round((placeholderTranslations/totalTranslations)*100)}%)`);
      
      if (placeholderTranslations > 0) {
        console.log('\n⚠️ ISSUE IDENTIFIED: Many translations are placeholders, not real translations!');
        console.log('💡 The translations exist in the database but contain placeholder content like "[ES] Career Title"');
        console.log('💡 These need to be replaced with actual translated content.');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the check
checkSpecificCareerTranslations().catch(console.error);
