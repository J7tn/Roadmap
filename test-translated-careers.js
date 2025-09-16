import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testTranslatedCareers() {
  console.log('🧪 Testing translated career data...');

  try {
    // Test 1: Get careers with English translations
    console.log('\n📝 Testing English translations:');
    const { data: enCareers, error: enError } = await supabase
      .from('careers')
      .select(`
        id,
        title,
        description,
        skills,
        job_titles,
        certifications,
        career_translations!inner(
          title,
          description,
          skills,
          job_titles,
          certifications
        )
      `)
      .eq('career_translations.language_code', 'en')
      .limit(3);

    if (enError) {
      console.error('❌ Error fetching English careers:', enError);
    } else {
      console.log(`✅ Found ${enCareers?.length || 0} English careers:`);
      enCareers?.forEach(career => {
        const translation = career.career_translations[0];
        console.log(`  - ${career.id}: ${translation.title}`);
        console.log(`    Description: ${translation.description.substring(0, 50)}...`);
        console.log(`    Skills: ${translation.skills.slice(0, 3).join(', ')}...`);
      });
    }

    // Test 2: Get careers with Spanish translations
    console.log('\n📝 Testing Spanish translations:');
    const { data: esCareers, error: esError } = await supabase
      .from('careers')
      .select(`
        id,
        title,
        description,
        skills,
        job_titles,
        certifications,
        career_translations!inner(
          title,
          description,
          skills,
          job_titles,
          certifications
        )
      `)
      .eq('career_translations.language_code', 'es')
      .limit(3);

    if (esError) {
      console.error('❌ Error fetching Spanish careers:', esError);
    } else {
      console.log(`✅ Found ${esCareers?.length || 0} Spanish careers:`);
      esCareers?.forEach(career => {
        const translation = career.career_translations[0];
        console.log(`  - ${career.id}: ${translation.title}`);
        console.log(`    Description: ${translation.description.substring(0, 50)}...`);
        console.log(`    Skills: ${translation.skills.slice(0, 3).join(', ')}...`);
      });
    }

    // Test 3: Get careers with Japanese translations
    console.log('\n📝 Testing Japanese translations:');
    const { data: jaCareers, error: jaError } = await supabase
      .from('careers')
      .select(`
        id,
        title,
        description,
        skills,
        job_titles,
        certifications,
        career_translations!inner(
          title,
          description,
          skills,
          job_titles,
          certifications
        )
      `)
      .eq('career_translations.language_code', 'ja')
      .limit(3);

    if (jaError) {
      console.error('❌ Error fetching Japanese careers:', jaError);
    } else {
      console.log(`✅ Found ${jaCareers?.length || 0} Japanese careers:`);
      jaCareers?.forEach(career => {
        const translation = career.career_translations[0];
        console.log(`  - ${career.id}: ${translation.title}`);
        console.log(`    Description: ${translation.description.substring(0, 50)}...`);
        console.log(`    Skills: ${translation.skills.slice(0, 3).join(', ')}...`);
      });
    }

    // Test 4: Check industry translations
    console.log('\n🏭 Testing industry translations:');
    const { data: industries, error: industryError } = await supabase
      .from('industry_translations')
      .select('industry_key, language_code, industry_name')
      .in('language_code', ['en', 'es', 'ja']);

    if (industryError) {
      console.error('❌ Error fetching industry translations:', industryError);
    } else {
      console.log(`✅ Found ${industries?.length || 0} industry translations:`);
      industries?.forEach(industry => {
        console.log(`  - ${industry.industry_key} (${industry.language_code}): ${industry.industry_name}`);
      });
    }

    // Test 5: Check skill translations
    console.log('\n🛠️ Testing skill translations:');
    const { data: skills, error: skillError } = await supabase
      .from('skill_translations')
      .select('skill_key, language_code, skill_name')
      .in('language_code', ['en', 'es', 'ja'])
      .limit(10);

    if (skillError) {
      console.error('❌ Error fetching skill translations:', skillError);
    } else {
      console.log(`✅ Found ${skills?.length || 0} skill translations:`);
      skills?.forEach(skill => {
        console.log(`  - ${skill.skill_key} (${skill.language_code}): ${skill.skill_name}`);
      });
    }

    console.log('\n✅ Translation testing completed!');

  } catch (error) {
    console.error('❌ Error during translation testing:', error);
  }
}

// Run the test
testTranslatedCareers();
