import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

// Read the comprehensive English translations
const enTranslationsPath = path.join(process.cwd(), 'src', 'locales', 'en.json');
const enTranslations = JSON.parse(fs.readFileSync(enTranslationsPath, 'utf8'));

// Comprehensive translations for all languages (simplified for now)
const comprehensiveTranslations = {
  en: enTranslations,
  es: {
    "app": {
      "name": "Careering",
      "tagline": "Tu Viaje Profesional Comienza Aquí",
      "logoAlt": "Logo de Careering"
    },
    "navigation": {
      "home": "Inicio",
      "search": "Buscar",
      "roadmap": "Hoja de Ruta",
      "assessment": "Habilidades",
      "bookmarks": "Marcadores",
      "careerPaths": "Mis Rutas",
      "notifications": "Notificaciones",
      "settings": "Configuración"
    },
    "home": {
      "welcome": "Bienvenido a Careering",
      "subtitle": "Descubre tu ruta profesional perfecta",
      "getStarted": "Comenzar",
      "exploreCareers": "Explorar Carreras",
      "takeAssessment": "Tomar Evaluación",
      "viewBookmarks": "Ver Marcadores"
    },
    "settings": {
      "title": "Configuración",
      "language": "Idioma",
      "theme": "Tema",
      "notifications": "Notificaciones",
      "notificationsDescription": "Gestiona tus preferencias de notificaciones",
      "pushNotifications": "Notificaciones Push",
      "receiveUpdates": "Recibe actualizaciones sobre nuevas oportunidades profesionales y tendencias del mercado",
      "notificationsEnabled": "Habilitado",
      "notificationsDisabled": "Deshabilitado",
      "regionLocation": "Región y Ubicación",
      "setRegionDescription": "Establece tu región para ver tendencias profesionales y datos de mercado personalizados",
      "currentRegion": "Región Actual",
      "regionalPersonalizationActive": "Personalización Regional Activa",
      "regionalPersonalizationDescription": "Estás viendo datos profesionales y tendencias específicas de tu región",
      "chooseLanguageDescription": "Elige tu idioma preferido para la interfaz de la aplicación",
      "selectLanguage": "Selecciona tu idioma preferido",
      "selectLanguagePlaceholder": "Selecciona un idioma",
      "appearance": "Apariencia",
      "appearanceDescription": "Personaliza la apariencia de la aplicación",
      "themeDescription": "Cambia entre temas claro y oscuro",
      "dark": "Oscuro",
      "light": "Claro",
      "appVersion": "Versión de la aplicación",
      "dataSource": "Fuente de datos",
      "dataSourceValue": "Supabase"
    },
    "marketTrends": {
      "title": "Tendencias del Mercado",
      "subtitle": "Mantente actualizado con las últimas tendencias profesionales",
      "salaryTrend": "Tendencia Salarial",
      "futureOutlook": "Perspectiva Futura",
      "industryImpact": "Impacto en la Industria",
      "growthRate": "Tasa de Crecimiento",
      "demandLevel": "Nivel de Demanda",
      "high": "Alto",
      "medium": "Medio",
      "low": "Bajo",
      "rising": "En Aumento",
      "stable": "Estable",
      "declining": "En Declive"
    },
    "search": {
      "placeholder": "Buscar carreras...",
      "noResults": "No se encontraron carreras",
      "filterBy": "Filtrar por",
      "industry": "Industria",
      "experience": "Nivel de Experiencia",
      "allIndustries": "Todas las Industrias",
      "allLevels": "Todos los Niveles",
      "entryLevel": "Nivel de Entrada",
      "midLevel": "Nivel Medio",
      "seniorLevel": "Nivel Senior",
      "expertLevel": "Nivel Experto",
      "salary": "Rango Salarial",
      "suggestions": "Sugerencias"
    },
    "careers": {
      "title": "Carreras",
      "subtitle": "Explora oportunidades profesionales",
      "searchPlaceholder": "Buscar carreras...",
      "filterByIndustry": "Filtrar por Industria",
      "filterByLevel": "Filtrar por Nivel de Experiencia",
      "allIndustries": "Todas las Industrias",
      "allLevels": "Todos los Niveles",
      "entryLevel": "Nivel de Entrada",
      "midLevel": "Nivel Medio",
      "seniorLevel": "Nivel Senior",
      "expertLevel": "Nivel Experto",
      "salaryRange": "Rango Salarial",
      "experienceLevel": "Nivel de Experiencia",
      "skills": "Habilidades",
      "certifications": "Certificaciones",
      "jobTitles": "Títulos de Trabajo",
      "requirements": "Requisitos",
      "education": "Educación",
      "experience": "Experiencia",
      "skillsList": "Lista de Habilidades"
    },
    "pages": {
      "search": {
        "title": "Buscar Carreras",
        "subtitle": "Encuentra tu coincidencia profesional perfecta",
        "searchPlaceholder": "Buscar carreras...",
        "filters": "Filtros",
        "clearFilters": "Limpiar Filtros",
        "results": "Resultados",
        "noResults": "No se encontraron resultados",
        "tryDifferentSearch": "Prueba un término de búsqueda diferente o ajusta tus filtros",
        "loadingCareers": "Cargando carreras..."
      },
      "careerPaths": {
        "title": "Mis Rutas Profesionales",
        "back": "Atrás",
        "searchPlaceholder": "Buscar tus rutas...",
        "tabs": {
          "myCareer": "Mi Carrera",
          "bookmarks": "Marcadores",
          "assessments": "Evaluaciones"
        },
        "myCareer": {
          "noCareerSelected": "No hay carrera seleccionada",
          "noCareerSelectedDescription": "Selecciona una carrera para comenzar a planificar tu ruta profesional",
          "selectCareer": "Seleccionar Carrera",
          "currentPosition": "Posición Actual",
          "progress": "Progreso",
          "nextStep": "Siguiente Paso",
          "nextStepDescription": "Tu próximo objetivo profesional"
        },
        "bookmarks": {
          "noBookmarks": "No hay marcadores",
          "noBookmarksDescription": "Marca carreras que te interesen para verlas aquí",
          "exploreCareers": "Explorar Carreras"
        },
        "assessments": {
          "noAssessments": "No hay evaluaciones",
          "noAssessmentsDescription": "Toma una evaluación de habilidades para obtener recomendaciones personalizadas",
          "takeAssessment": "Tomar Evaluación"
        }
      },
      "roadmap": {
        "title": "Hoja de Ruta Profesional",
        "subtitle": "Planifica tu viaje profesional",
        "unableToLoadRoadmap": "No se puede cargar la hoja de ruta",
        "yourCurrentCareer": "Tu Carrera Actual",
        "planYourNextStep": "Planifica tu siguiente paso",
        "yourCareerTransitionOptions": "Tus Opciones de Transición Profesional",
        "basedOnCurrentRole": "Basado en tu rol actual como {role}, aquí tienes rutas profesionales potenciales para explorar",
        "lateralCareerMove": "Movimiento Profesional Lateral",
        "numberOfOptions": "Varias opciones",
        "exploreSimilarRoles": "Explora roles similares en tu nivel actual",
        "skillBasedTransitions": "Transiciones Basadas en Habilidades",
        "yourRoadmapProgress": "Tu Progreso del Roadmap",
        "noResultsFound": "No se encontraron resultados",
        "searchCareers": "Buscar carreras",
        "filters": "Filtros",
        "salaryRange": "Rango Salarial",
        "experienceLevel": "Nivel de Experiencia",
        "startYourCareerRoadmap": "Inicia tu Hoja de Ruta Profesional",
        "loadingRoadmap": "Cargando tu hoja de ruta profesional...",
        "tryAgain": "Intentar de nuevo",
        "exploreCareers": "Explorar Carreras",
        "selectCurrentCareer": "Selecciona tu carrera actual para comenzar a planificar tu viaje profesional",
        "failedToLoadData": "Error al cargar los datos de carrera"
      },
      "jobDetail": {
        "title": "Detalles del Trabajo",
        "careerNotFound": "Carrera no encontrada"
      }
    },
    "assessment": {
      "title": "Evaluación de Habilidades",
      "subtitle": "Descubre tu potencial profesional",
      "step": "Paso",
      "assessmentUnavailable": "Evaluación no disponible",
      "clickToViewDetails": "Haz clic para ver información detallada de la carrera",
      "selectSkills": "Selecciona las habilidades en las que eres competente. También puedes agregar habilidades personalizadas.",
      "selectRelevantSkills": "Selecciona habilidades relevantes de esta categoría",
      "selectCareerDirection": "Selecciona la dirección profesional que más te interese.",
      "failedToGenerateRecommendations": "Error al generar recomendaciones",
      "tryAgain": "Intentar de nuevo",
      "skillCategories": {
        "technical": "Habilidades Técnicas",
        "creative": "Habilidades Creativas",
        "analytical": "Habilidades Analíticas",
        "communication": "Habilidades de Comunicación",
        "business": "Habilidades de Negocios",
        "languages": "Idiomas"
      },
      "experienceLevels": {
        "beginner": "Principiante",
        "intermediate": "Intermedio",
        "advanced": "Avanzado",
        "expert": "Experto"
      },
      "experienceDescriptions": {
        "beginner": "Tienes conocimientos básicos o estás empezando",
        "intermediate": "Tienes experiencia práctica y puedes trabajar de forma independiente",
        "advanced": "Tienes experiencia sólida y puedes liderar proyectos",
        "expert": "Eres un experto reconocido en tu campo"
      },
      "careerGoals": {
        "advancement": "Avance Profesional",
        "careerChange": "Cambio de Carrera",
        "skillDevelopment": "Desarrollo de Habilidades",
        "entrepreneurship": "Emprendimiento",
        "workLifeBalance": "Equilibrio Trabajo-Vida"
      },
      "stepProgress": {
        "skills": "Habilidades",
        "selected": "Seleccionado",
        "notSelected": "No Seleccionado",
        "experienceLevel": "Nivel de Experiencia",
        "careerGoal": "Objetivo Profesional"
      }
    },
    "notifications": {
      "title": "Notificaciones",
      "markAllRead": "Marcar Todo como Leído",
      "exit": "Salir",
      "noNotifications": "No hay notificaciones",
      "personalizedDescription": "Te notificaremos sobre oportunidades profesionales relevantes basadas en tus intereses",
      "allCaughtUp": "¡Estás al día! Las nuevas notificaciones aparecerán aquí.",
      "trendAlert": "Alerta de Tendencia",
      "skillDevelopment": "Desarrollo de Habilidades",
      "jobOpportunity": "Oportunidad de Trabajo",
      "milestone": "Hito",
      "filter": "Filtrar",
      "allNotifications": "Todas las Notificaciones",
      "personalizedNotifications": "Personalizadas",
      "generalNotifications": "Generales",
      "industryInsight": "Perspectiva de la Industria"
    },
    "common": {
      "loading": "Cargando...",
      "error": "Error",
      "success": "Éxito",
      "cancel": "Cancelar",
      "save": "Guardar",
      "delete": "Eliminar",
      "edit": "Editar",
      "add": "Agregar",
      "remove": "Quitar",
      "yes": "Sí",
      "no": "No",
      "ok": "OK",
      "search": "Buscar",
      "searching": "Buscando...",
      "retry": "Intentar de nuevo",
      "filter": "Filtrar",
      "clear": "Limpiar",
      "select": "Seleccionar",
      "all": "Todos"
    }
  }
};

async function mergeComprehensiveTranslations() {
  console.log('🔄 Merging comprehensive translations with navigation fixes...');

  try {
    for (const [languageCode, translations] of Object.entries(comprehensiveTranslations)) {
      console.log(`\n📝 Processing ${languageCode.toUpperCase()} comprehensive translations...`);
      
      // Update the translation record with comprehensive data
      const { error: updateError } = await supabase
        .from('translations')
        .update({
          translation_data: translations,
          updated_at: new Date().toISOString()
        })
        .eq('language_code', languageCode);

      if (updateError) {
        console.error(`❌ Error updating ${languageCode} translations:`, updateError);
      } else {
        console.log(`✅ Updated ${Object.keys(translations).length} top-level keys for ${languageCode}`);
        console.log(`   - Navigation keys: ${Object.keys(translations.navigation || {}).length}`);
        console.log(`   - Page keys: ${Object.keys(translations.pages || {}).length}`);
        console.log(`   - Assessment keys: ${Object.keys(translations.assessment || {}).length}`);
        console.log(`   - Notification keys: ${Object.keys(translations.notifications || {}).length}`);
      }
    }

    console.log('\n✅ Comprehensive translations merge completed successfully!');
    console.log('🎯 All pages should now be fully translated when you change languages.');

  } catch (error) {
    console.error('❌ Error during comprehensive translations merge:', error);
  }
}

// Run the merge
mergeComprehensiveTranslations();
