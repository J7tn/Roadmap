import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load career translations data
const translationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'career-translations-data.json'), 'utf8'));

async function populateCareerTranslations() {
  console.log('🚀 Starting career translations population...');

  try {
    // First, get all existing careers from the database
    const { data: careers, error: careersError } = await supabase
      .from('careers')
      .select('id, title, description, skills, job_titles, certifications, industry');

    if (careersError) {
      console.error('❌ Error fetching careers:', careersError);
      return;
    }

    console.log(`📊 Found ${careers.length} careers to translate`);

    // Populate industry translations
    console.log('🏭 Populating industry translations...');
    for (const [languageCode, industries] of Object.entries(translationsData.industries)) {
      for (const [industryKey, industryName] of Object.entries(industries)) {
        const { error } = await supabase
          .from('industry_translations')
          .upsert({
            industry_key: industryKey,
            language_code: languageCode,
            industry_name: industryName,
            industry_description: `${industryName} industry`
          }, {
            onConflict: 'industry_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting industry translation ${industryKey} (${languageCode}):`, error);
        }
      }
    }

    // Populate skill translations
    console.log('🛠️ Populating skill translations...');
    for (const [languageCode, skills] of Object.entries(translationsData.skills)) {
      for (const [skillKey, skillName] of Object.entries(skills)) {
        const { error } = await supabase
          .from('skill_translations')
          .upsert({
            skill_key: skillKey,
            language_code: languageCode,
            skill_name: skillName,
            skill_category: getSkillCategory(skillKey)
          }, {
            onConflict: 'skill_key,language_code'
          });

        if (error) {
          console.error(`❌ Error inserting skill translation ${skillKey} (${languageCode}):`, error);
        }
      }
    }

    // Populate career translations
    console.log('💼 Populating career translations...');
    for (const [languageCode, careersTranslations] of Object.entries(translationsData.careers)) {
      for (const [careerKey, careerData] of Object.entries(careersTranslations)) {
        // Find matching career in database
        const matchingCareer = careers.find(career => 
          career.title.toLowerCase().replace(/\s+/g, '-') === careerKey ||
          career.id === careerKey
        );

        if (matchingCareer) {
          const { error } = await supabase
            .from('career_translations')
            .upsert({
              career_id: matchingCareer.id,
              language_code: languageCode,
              title: careerData.title,
              description: careerData.description,
              skills: careerData.skills,
              job_titles: careerData.job_titles,
              certifications: careerData.certifications
            }, {
              onConflict: 'career_id,language_code'
            });

          if (error) {
            console.error(`❌ Error inserting career translation ${careerKey} (${languageCode}):`, error);
          } else {
            console.log(`✅ Translated career: ${careerData.title} (${languageCode})`);
          }
        } else {
          console.warn(`⚠️ No matching career found for key: ${careerKey}`);
        }
      }
    }

    // For careers not in the translation data, create English translations as fallback
    console.log('🔄 Creating English fallback translations for untranslated careers...');
    for (const career of careers) {
      const { error } = await supabase
        .from('career_translations')
        .upsert({
          career_id: career.id,
          language_code: 'en',
          title: career.title,
          description: career.description,
          skills: career.skills,
          job_titles: career.job_titles,
          certifications: career.certifications
        }, {
          onConflict: 'career_id,language_code'
        });

      if (error) {
        console.error(`❌ Error creating English fallback for career ${career.id}:`, error);
      }
    }

    console.log('✅ Career translations population completed successfully!');

  } catch (error) {
    console.error('❌ Error during career translations population:', error);
  }
}

function getSkillCategory(skillKey) {
  const categories = {
    'javascript': 'Programming',
    'python': 'Programming',
    'react': 'Frontend',
    'nodejs': 'Backend',
    'sql': 'Database',
    'aws': 'Cloud',
    'docker': 'DevOps',
    'git': 'Version Control',
    'machine_learning': 'AI/ML',
    'data_analysis': 'Analytics',
    'project_management': 'Management',
    'agile': 'Methodology',
    'ui_ux': 'Design',
    'communication': 'Soft Skills',
    'leadership': 'Soft Skills',
    'problem_solving': 'Soft Skills',
    'teamwork': 'Soft Skills',
    'analytical_thinking': 'Soft Skills',
    'creativity': 'Soft Skills',
    'adaptability': 'Soft Skills'
  };
  return categories[skillKey] || 'General';
}

// Run the population script
populateCareerTranslations();
