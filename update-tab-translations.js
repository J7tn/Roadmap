import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Shorter tab translations to prevent layout issues
const tabTranslations = {
  en: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "My Career",
          "bookmarks": "Bookmarks", 
          "assessments": "Assessments"
        }
      }
    }
  },
  ja: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "マイキャリア",
          "bookmarks": "ブックマーク",
          "assessments": "アセスメント"
        }
      }
    }
  },
  es: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "Mi Carrera",
          "bookmarks": "Marcadores",
          "assessments": "Evaluaciones"
        }
      }
    }
  },
  fr: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "Ma Carrière",
          "bookmarks": "Signets",
          "assessments": "Évaluations"
        }
      }
    }
  },
  de: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "Meine Karriere",
          "bookmarks": "Lesezeichen",
          "assessments": "Bewertungen"
        }
      }
    }
  },
  pt: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "Minha Carreira",
          "bookmarks": "Favoritos",
          "assessments": "Avaliações"
        }
      }
    }
  },
  it: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "La Mia Carriera",
          "bookmarks": "Segnalibri",
          "assessments": "Valutazioni"
        }
      }
    }
  },
  ko: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "내 커리어",
          "bookmarks": "북마크",
          "assessments": "평가"
        }
      }
    }
  },
  zh: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "我的职业",
          "bookmarks": "书签",
          "assessments": "评估"
        }
      }
    }
  },
  ru: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "Моя Карьера",
          "bookmarks": "Закладки",
          "assessments": "Оценки"
        }
      }
    }
  },
  ar: {
    "pages": {
      "careerPaths": {
        "tabs": {
          "myCareer": "مهنتي",
          "bookmarks": "المفضلة",
          "assessments": "التقييمات"
        }
      }
    }
  }
};

async function updateTabTranslations() {
  console.log('Updating tab translations with shorter text...');
  
  for (const [languageCode, translationData] of Object.entries(tabTranslations)) {
    console.log(`Updating ${languageCode} tab translations...`);
    
    try {
      // Get existing translation data
      const { data: existingData, error: fetchError } = await supabase
        .from('translations')
        .select('translation_data')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error(`Error fetching existing data for ${languageCode}:`, fetchError);
        continue;
      }

      let updatedTranslationData = translationData;
      
      if (existingData && existingData.length > 0) {
        // Merge with existing data
        updatedTranslationData = {
          ...existingData[0].translation_data,
          ...translationData
        };
      }

      const { data, error } = await supabase
        .from('translations')
        .upsert({
          language_code: languageCode,
          translation_data: updatedTranslationData,
          version: '1.4.0',
          is_active: true
        }, {
          onConflict: 'language_code,version'
        });

      if (error) {
        console.error(`Error updating ${languageCode}:`, error);
        continue;
      }

      console.log(`✅ Successfully updated ${languageCode} tab translations`);
      
    } catch (error) {
      console.error(`Error processing ${languageCode}:`, error);
    }
  }

  console.log('Tab translation update completed!');
}

// Run the update
updateTabTranslations().catch(console.error);
