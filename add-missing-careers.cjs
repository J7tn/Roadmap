const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addMissingCareers() {
  console.log('🔧 Adding missing careers to new table...');

  try {
    // Get all careers from original table
    const { data: originalCareers, error: originalError } = await supabase
      .from('careers')
      .select('*');

    if (originalError) {
      console.error('   ❌ Error fetching original careers:', originalError.message);
      return;
    }

    // Get existing careers from new table
    const { data: existingCareers, error: existingError } = await supabase
      .from('careers_new')
      .select('id');

    if (existingError) {
      console.error('   ❌ Error fetching existing careers:', existingError.message);
      return;
    }

    const existingIds = new Set(existingCareers.map(c => c.id));
    const missingCareers = originalCareers.filter(c => !existingIds.has(c.id));

    console.log(`   📊 Found ${missingCareers.length} missing careers to add`);

    if (missingCareers.length === 0) {
      console.log('   ✅ No missing careers to add');
      return;
    }

    // Get valid industry IDs
    const { data: validIndustries } = await supabase
      .from('industries_new')
      .select('id');

    const validIndustryIds = new Set(validIndustries?.map(i => i.id) || []);

    // Filter careers that have valid industry IDs
    const careersToAdd = missingCareers
      .filter(career => validIndustryIds.has(career.industry))
      .map(career => ({
        id: career.id,
        industry_id: career.industry,
        level: career.level,
        salary_range: career.salary,
        experience_required: career.experience
      }));

    const careersWithInvalidIndustries = missingCareers.filter(career => !validIndustryIds.has(career.industry));

    console.log(`   📊 Adding ${careersToAdd.length} careers with valid industries`);
    console.log(`   📊 ${careersWithInvalidIndustries.length} careers have invalid industries (skipped)`);

    if (careersWithInvalidIndustries.length > 0) {
      console.log('   📊 Careers with invalid industries:');
      careersWithInvalidIndustries.slice(0, 10).forEach(career => {
        console.log(`     - ${career.id} (${career.title}) - Industry: ${career.industry}`);
      });
      if (careersWithInvalidIndustries.length > 10) {
        console.log(`     ... and ${careersWithInvalidIndustries.length - 10} more`);
      }
    }

    // Insert careers in batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < careersToAdd.length; i += batchSize) {
      const batch = careersToAdd.slice(i, i + batchSize);
      
      try {
        const { error } = await supabase
          .from('careers_new')
          .upsert(batch, { onConflict: 'id' });
        
        if (error) {
          console.error(`   ❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error.message);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
          console.log(`   ✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${batch.length} careers`);
        }
      } catch (err) {
        console.error(`   ❌ Exception inserting batch ${Math.floor(i/batchSize) + 1}:`, err.message);
        errorCount += batch.length;
      }
    }

    console.log(`   📊 Results: ${successCount} successful, ${errorCount} errors`);

    // Now add the career content (translations) for these careers
    console.log('\n   📊 Adding career content for missing careers...');
    await addMissingCareerContent(careersToAdd.map(c => c.id));

  } catch (error) {
    console.error('❌ Failed to add missing careers:', error);
  }
}

async function addMissingCareerContent(careerIds) {
  try {
    // Get career translations for these careers
    const { data: careerTranslations, error: transError } = await supabase
      .from('career_translations')
      .select('*')
      .in('career_id', careerIds);

    if (transError) {
      console.error('   ❌ Error fetching career translations:', transError.message);
      return;
    }

    console.log(`   📊 Found ${careerTranslations.length} career translations for missing careers`);

    if (careerTranslations.length === 0) {
      console.log('   ⚠️ No career translations found for missing careers');
      return;
    }

    // Convert to career_content format
    const contentToAdd = careerTranslations.map(translation => ({
      career_id: translation.career_id,
      language_code: translation.language_code,
      title: translation.title,
      description: translation.description,
      skills: translation.skills || [],
      job_titles: translation.job_titles || [],
      certifications: translation.certifications || [],
      requirements: translation.requirements || {}
    }));

    // Insert career content in batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < contentToAdd.length; i += batchSize) {
      const batch = contentToAdd.slice(i, i + batchSize);
      
      try {
        const { error } = await supabase
          .from('career_content')
          .upsert(batch, { onConflict: 'career_id,language_code' });
        
        if (error) {
          console.error(`   ❌ Error inserting content batch ${Math.floor(i/batchSize) + 1}:`, error.message);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
          console.log(`   ✅ Inserted content batch ${Math.floor(i/batchSize) + 1}: ${batch.length} entries`);
        }
      } catch (err) {
        console.error(`   ❌ Exception inserting content batch ${Math.floor(i/batchSize) + 1}:`, err.message);
        errorCount += batch.length;
      }
    }

    console.log(`   📊 Career content results: ${successCount} successful, ${errorCount} errors`);

  } catch (error) {
    console.error('   ❌ Failed to add missing career content:', error);
  }
}

addMissingCareers().catch(console.error);
