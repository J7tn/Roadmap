import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Language mappings
const languageMappings = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'pt': 'Portuguese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ru': 'Russian',
  'ar': 'Arabic',
  'it': 'Italian'
};

async function uploadTranslations() {
  console.log('Starting translation upload to Supabase...');
  
  const localesDir = path.join(__dirname, 'src', 'locales');
  
  if (!fs.existsSync(localesDir)) {
    console.error('Locales directory not found:', localesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(localesDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.error('No JSON translation files found in locales directory');
    process.exit(1);
  }

  console.log(`Found ${jsonFiles.length} translation files:`, jsonFiles);

  for (const file of jsonFiles) {
    const languageCode = file.replace('.json', '');
    const filePath = path.join(localesDir, file);
    
    try {
      // Read translation file
      const translationData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      console.log(`Uploading translations for ${languageCode} (${languageMappings[languageCode] || languageCode})...`);
      
      // Upload to Supabase
      const { data, error } = await supabase
        .from('translations')
        .upsert({
          language_code: languageCode,
          translation_data: translationData,
          version: '1.0.0',
          is_active: true
        }, {
          onConflict: 'language_code,version'
        });

      if (error) {
        console.error(`Error uploading ${languageCode}:`, error);
        continue;
      }

      console.log(`✅ Successfully uploaded ${languageCode} translations`);
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  console.log('Translation upload completed!');
  
  // Verify uploads
  console.log('\nVerifying uploads...');
  const { data: uploadedTranslations, error: verifyError } = await supabase
    .from('active_translations')
    .select('language_code, version, updated_at')
    .order('language_code');

  if (verifyError) {
    console.error('Error verifying uploads:', verifyError);
  } else {
    console.log('Uploaded translations:');
    uploadedTranslations.forEach(translation => {
      console.log(`  - ${translation.language_code} (${languageMappings[translation.language_code] || translation.language_code}) - v${translation.version} - ${new Date(translation.updated_at).toLocaleString()}`);
    });
  }
}

// Run the upload
uploadTranslations().catch(console.error);
