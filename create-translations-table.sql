-- Create translations table for storing language files
CREATE TABLE IF NOT EXISTS translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    language_code VARCHAR(5) NOT NULL,
    translation_data JSONB NOT NULL,
    version VARCHAR(20) DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(language_code, version)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_language_code ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_active ON translations(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_translations_updated_at
    BEFORE UPDATE ON translations
    FOR EACH ROW
    EXECUTE FUNCTION update_translations_updated_at();

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to active translations
CREATE POLICY "Allow read access to active translations" ON translations
    FOR SELECT
    USING (is_active = true);

-- Insert initial translation data for English
INSERT INTO translations (language_code, translation_data, version) VALUES 
('en', '{
  "app": {
    "name": "Careering",
    "tagline": "Your Career Journey Starts Here",
    "logoAlt": "Careering Logo"
  },
  "navigation": {
    "home": "Home",
    "search": "Search",
    "roadmap": "Roadmap",
    "assessment": "Assessment",
    "bookmarks": "Bookmarks",
    "careerPaths": "My Career Paths",
    "notifications": "Notifications",
    "settings": "Settings"
  },
  "home": {
    "welcome": "Welcome to Careering",
    "subtitle": "Discover your perfect career path",
    "getStarted": "Get Started",
    "exploreCareers": "Explore Careers",
    "takeAssessment": "Take Assessment",
    "viewBookmarks": "View Bookmarks"
  },
  "marketTrends": {
    "title": "Career Market Trends",
    "subtitle": "Stay updated with the latest career opportunities and market insights",
    "lastUpdated": "Last updated:",
    "trendingSkills": "Trending Skills",
    "decliningSkills": "Declining Skills",
    "industryGrowth": "Industry Growth",
    "decliningIndustries": "Declining Industries",
    "emergingRoles": "Emerging Roles",
    "skillsInHighDemand": "Skills in High Demand",
    "industryGrowthAnalysis": "Industry Growth Analysis",
    "noMarketData": "No Market Data Available",
    "noMarketDataDescription": "Market trend data is currently unavailable. This may be due to a network issue or the data is being updated.",
    "tryAgain": "Try Again",
    "jobs": "jobs",
    "loading": "Loading...",
    "dataUpToDate": "Data up to date"
  },
  "search": {
    "placeholder": "Search careers...",
    "noResults": "No careers found",
    "filterBy": "Filter by",
    "industry": "Industry",
    "experience": "Experience Level",
    "salary": "Salary Range",
    "suggestions": "Suggestions"
  },
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "done": "Done",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "search": "Search",
    "searching": "Searching...",
    "retry": "Try Again"
  },
  "errors": {
    "networkError": "Network error. Please check your connection.",
    "serverError": "Server error. Please try again later.",
    "notFound": "Not found",
    "unauthorized": "Unauthorized access",
    "forbidden": "Access forbidden",
    "validationError": "Validation error",
    "genericError": "Something went wrong",
    "errorLoadingData": "Error Loading Data",
    "noRecommendationsAvailable": "No recommendations available. Please try again.",
    "generateRecommendations": "Generate Recommendations",
    "saveAssessment": "Save Assessment",
    "stepNotImplemented": "This step is not yet implemented."
  },
  "emptyState": {
    "defaultTitle": "No data available",
    "defaultDescription": "There''s nothing to show here yet."
  },
  "assessment": {
    "step": "Step",
    "skills": "Skills",
    "experienceLevels": {
      "beginner": "Just starting to learn",
      "intermediate": "Some practical experience",
      "advanced": "Significant experience",
      "expert": "Deep expertise and leadership"
    },
    "careerGoals": {
      "technical": "Technical Leadership",
      "management": "People Management",
      "entrepreneur": "Entrepreneurship",
      "specialist": "Specialist/Consultant",
      "creative": "Creative Director",
      "analyst": "Data/Analytics"
    },
    "careerGoalDescriptions": {
      "technical": "Lead technical teams and projects",
      "management": "Manage teams and organizations",
      "entrepreneur": "Start your own business",
      "specialist": "Deep expertise in specific areas",
      "creative": "Lead creative projects and teams",
      "analyst": "Focus on data and insights"
    },
    "priority": {
      "high": "High",
      "medium": "Medium",
      "low": "Low"
    },
    "stepProgress": {
      "experienceLevel": "Experience level:",
      "careerGoal": "Career goal:",
      "selected": "✓ Selected",
      "notSelected": "Not selected"
    },
    "buttons": {
      "completeAssessment": "Complete Assessment",
      "next": "Next"
    },
    "placeholders": {
      "addNewSkill": "Add new skill",
      "addNextStep": "Add next step",
      "addShortTermGoal": "Add short-term goal",
      "addMediumTermGoal": "Add medium-term goal",
      "addLongTermGoal": "Add long-term goal"
    }
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "theme": "Theme",
    "notifications": "Notifications",
    "notificationsDescription": "Manage your notification preferences",
    "pushNotifications": "Push Notifications",
    "receiveUpdates": "Receive updates about career opportunities and trends",
    "notificationsEnabled": "Enabled",
    "notificationsDisabled": "Disabled",
    "regionLocation": "Region & Location",
    "setRegionDescription": "Set your region to see personalized career trends and market data",
    "currentRegion": "Current Region",
    "regionalPersonalizationActive": "Regional Personalization Active",
    "regionalPersonalizationDescription": "All career trends, market data, and insights are now customized for your region. This affects job availability, salary trends, and growth opportunities throughout the app.",
    "chooseLanguageDescription": "Choose your preferred language for the app interface",
    "selectLanguage": "Select your preferred language",
    "selectLanguagePlaceholder": "Select a language"
  },
  "notifications": {
    "title": "Notifications",
    "markAllRead": "Mark All Read",
    "exit": "Exit",
    "noNotifications": "No notifications",
    "personalizedDescription": "We''ll notify you about relevant career opportunities based on your interests",
    "allCaughtUp": "You''re all caught up! New notifications will appear here.",
    "trendAlert": "Trend Alert",
    "skillDevelopment": "Skill Development",
    "jobOpportunity": "Job Opportunity",
    "milestone": "Milestone",
    "industryInsight": "Industry Insight"
  },
  "pages": {
    "search": {
      "title": "Search Careers",
      "placeholder": "Search careers...",
      "noResults": "No careers found",
      "filterBy": "Filter by",
      "industry": "Industry",
      "experience": "Experience Level",
      "salary": "Salary Range",
      "allIndustries": "All Industries",
      "allLevels": "All Levels",
      "entryLevel": "Entry Level",
      "intermediate": "Intermediate",
      "advanced": "Advanced",
      "expert": "Expert",
      "tryAdjustingSearch": "Try adjusting your search terms or filters",
      "clearSearch": "Clear Search",
      "careersFound": "careers found",
      "careerFound": "career found"
    },
    "roadmap": {
      "title": "Career Roadmap",
      "subtitle": "Plan your career journey",
      "currentLevel": "Current Level",
      "targetLevel": "Target Level",
      "progress": "Progress",
      "milestones": "Milestones",
      "skillsToLearn": "Skills to Learn",
      "nextSteps": "Next Steps"
    },
    "bookmarks": {
      "title": "My Bookmarks",
      "subtitle": "Your saved careers",
      "noBookmarks": "No bookmarks yet",
      "noBookmarksDescription": "Start exploring careers and bookmark your favorites",
      "exploreCareers": "Explore Careers"
    },
    "careerPaths": {
      "title": "My Career Paths",
      "subtitle": "Track your career progress",
      "noPaths": "No career paths yet",
      "noPathsDescription": "Take an assessment to get personalized career recommendations",
      "searchPlaceholder": "Search careers...",
      "back": "Back",
      "tabs": {
        "myCareer": "My Career",
        "bookmarks": "Bookmarks",
        "assessments": "Assessments"
      },
      "myCareer": {
        "noProgress": "No roadmap progress yet",
        "noProgressDescription": "Start exploring career paths to track your progress.",
        "exploreCareers": "Explore Careers",
        "currentPosition": "Current Position",
        "progress": "Progress",
        "nextStep": "Next Step",
        "nextStepDescription": "Next step in path"
      },
      "bookmarks": {
        "noBookmarks": "No bookmarked careers yet",
        "noBookmarksDescription": "Bookmark careers you''re interested in to track them here.",
        "exploreCareers": "Explore Careers"
      },
      "assessments": {
        "noAssessments": "No saved assessments yet",
        "noAssessmentsDescription": "Take a skills assessment to get personalized career recommendations.",
        "takeAssessment": "Take Assessment"
      }
    },
    "branching": {
      "title": "Career Branching",
      "subtitle": "Explore career transitions",
      "noTransitions": "No transitions available",
      "noTransitionsDescription": "Career transition suggestions will appear here",
      "transitionData": {
        "productManager": {
          "title": "Product Manager",
          "description": "Lead product strategy and development",
          "difficulty": "Medium",
          "timeline": "1-2 years",
          "salaryIncrease": "+25%"
        },
        "dataScientist": {
          "title": "Data Scientist",
          "description": "Advance to machine learning and AI",
          "difficulty": "Hard",
          "timeline": "2-3 years",
          "salaryIncrease": "+50%"
        },
        "devopsEngineer": {
          "title": "DevOps Engineer",
          "description": "Focus on infrastructure, deployment, and operational excellence",
          "difficulty": "Easy",
          "timeline": "3-6 months",
          "salaryIncrease": "+20%"
        },
        "technicalLead": {
          "title": "Technical Lead",
          "description": "Advance to leadership while maintaining technical expertise",
          "difficulty": "Hard",
          "timeline": "2-3 years",
          "salaryIncrease": "+40%"
        },
        "productMarketingManager": {
          "title": "Product Marketing Manager",
          "description": "Specialize in product-focused marketing strategies",
          "difficulty": "Easy",
          "timeline": "6-12 months",
          "salaryIncrease": "+15%"
        },
        "growthHacker": {
          "title": "Growth Hacker",
          "description": "Focus on rapid experimentation and data-driven growth",
          "difficulty": "Medium",
          "timeline": "1 year",
          "salaryIncrease": "+35%"
        },
        "brandManager": {
          "title": "Brand Manager",
          "description": "Lead brand strategy and creative direction",
          "difficulty": "Medium",
          "timeline": "1-2 years",
          "salaryIncrease": "+20%"
        },
        "dataScientistAdvanced": {
          "title": "Data Scientist",
          "description": "Advance to machine learning and predictive analytics",
          "difficulty": "Medium",
          "timeline": "1-2 years",
          "salaryIncrease": "+40%"
        },
        "biManager": {
          "title": "BI Manager",
          "description": "Lead data strategy and business intelligence initiatives",
          "difficulty": "Medium",
          "timeline": "1-2 years",
          "salaryIncrease": "+30%"
        },
        "productAnalyst": {
          "title": "Product Analyst",
          "description": "Focus on product metrics and user behavior analysis",
          "difficulty": "Easy",
          "timeline": "6-12 months",
          "salaryIncrease": "+25%"
        }
      }
    },
    "allJobs": {
      "title": "All Jobs",
      "subtitle": "Browse all available positions",
      "noJobs": "No jobs available",
      "noJobsDescription": "Check back later for new job postings"
    }
  },
  "components": {
    "errorState": {
      "defaultTitle": "Something went wrong",
      "defaultRetryLabel": "Try Again"
    },
    "emptyState": {
      "defaultTitle": "No data available",
      "defaultDescription": "There''s nothing to show here yet."
    },
    "trendDisplay": {
      "noTrendData": "No trend data available for this career",
      "trendDataDescription": "Trend data is updated monthly from Supabase. Some careers may not have trend data yet.",
      "careerId": "Career ID",
      "lookForId": "Look for this ID in the",
      "table": "table",
      "checkDatabase": "Check Database"
    }
  },
  "careers": {
    "levels": {
      "entry": "Entry Level",
      "intermediate": "Mid Level",
      "advanced": "Senior Level",
      "expert": "Expert Level"
    },
    "commonSkills": {
      "javascript": "JavaScript",
      "react": "React",
      "nodejs": "Node.js",
      "python": "Python",
      "java": "Java",
      "sql": "SQL",
      "git": "Git",
      "aws": "AWS",
      "html": "HTML",
      "css": "CSS",
      "typescript": "TypeScript",
      "docker": "Docker",
      "kubernetes": "Kubernetes",
      "machineLearning": "Machine Learning",
      "dataAnalysis": "Data Analysis",
      "projectManagement": "Project Management",
      "leadership": "Leadership",
      "communication": "Communication",
      "problemSolving": "Problem Solving",
      "teamwork": "Teamwork"
    },
    "commonTitles": {
      "softwareEngineer": "Software Engineer",
      "developer": "Developer",
      "dataScientist": "Data Scientist",
      "productManager": "Product Manager",
      "designer": "Designer",
      "analyst": "Analyst",
      "consultant": "Consultant",
      "manager": "Manager",
      "director": "Director",
      "specialist": "Specialist",
      "coordinator": "Coordinator",
      "assistant": "Assistant",
      "intern": "Intern",
      "trainee": "Trainee"
    },
    "industries": {
      "tech": "Technology",
      "healthcare": "Healthcare",
      "business": "Business",
      "education": "Education",
      "creative": "Creative",
      "finance": "Finance",
      "marketing": "Marketing",
      "sales": "Sales",
      "engineering": "Engineering",
      "science": "Science"
    },
    "education": {
      "bachelors": "Bachelor''s Degree",
      "masters": "Master''s Degree",
      "phd": "PhD",
      "certificate": "Certificate",
      "diploma": "Diploma",
      "bootcamp": "Bootcamp",
      "selfTaught": "Self-Taught",
      "highSchool": "High School"
    },
    "experience": {
      "noExperience": "No Experience Required",
      "entryLevel": "Entry Level (0-2 years)",
      "midLevel": "Mid Level (2-5 years)",
      "seniorLevel": "Senior Level (5+ years)",
      "expertLevel": "Expert Level (10+ years)"
    }
  }
}', '1.0.0')
ON CONFLICT (language_code, version) DO NOTHING;

-- Insert initial translation data for Spanish
INSERT INTO translations (language_code, translation_data, version) VALUES 
('es', '{
  "app": {
    "name": "Careering",
    "tagline": "Tu Viaje Profesional Comienza Aquí",
    "logoAlt": "Logo de Careering"
  },
  "navigation": {
    "home": "Inicio",
    "search": "Buscar",
    "roadmap": "Mapa de Ruta",
    "assessment": "Evaluación",
    "bookmarks": "Marcadores",
    "careerPaths": "Mis Carreras",
    "notifications": "Notificaciones",
    "settings": "Configuración"
  },
  "home": {
    "welcome": "Bienvenido a Careering",
    "subtitle": "Descubre tu camino profesional perfecto",
    "getStarted": "Comenzar",
    "exploreCareers": "Explorar Carreras",
    "takeAssessment": "Hacer Evaluación",
    "viewBookmarks": "Ver Marcadores"
  },
  "marketTrends": {
    "title": "Tendencias del Mercado Laboral",
    "subtitle": "Mantente actualizado con las últimas oportunidades profesionales y perspectivas del mercado",
    "lastUpdated": "Última actualización:",
    "trendingSkills": "Habilidades en Tendencia",
    "decliningSkills": "Habilidades en Declive",
    "industryGrowth": "Crecimiento de la Industria",
    "decliningIndustries": "Industrias en Declive",
    "emergingRoles": "Roles Emergentes",
    "skillsInHighDemand": "Habilidades en Alta Demanda",
    "industryGrowthAnalysis": "Análisis de Crecimiento de la Industria",
    "noMarketData": "No hay Datos de Mercado Disponibles",
    "noMarketDataDescription": "Los datos de tendencias del mercado no están disponibles actualmente. Esto puede deberse a un problema de red o a que los datos se están actualizando.",
    "tryAgain": "Intentar de Nuevo",
    "jobs": "trabajos",
    "loading": "Cargando...",
    "dataUpToDate": "Datos actualizados"
  },
  "search": {
    "placeholder": "Buscar carreras...",
    "noResults": "No se encontraron carreras",
    "filterBy": "Filtrar por",
    "industry": "Industria",
    "experience": "Nivel de Experiencia",
    "salary": "Rango Salarial",
    "suggestions": "Sugerencias"
  },
  "common": {
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito",
    "cancel": "Cancelar",
    "save": "Guardar",
    "delete": "Eliminar",
    "edit": "Editar",
    "close": "Cerrar",
    "back": "Atrás",
    "next": "Siguiente",
    "previous": "Anterior",
    "done": "Hecho",
    "yes": "Sí",
    "no": "No",
    "ok": "OK",
    "search": "Buscar",
    "searching": "Buscando...",
    "retry": "Intentar de Nuevo"
  },
  "errors": {
    "networkError": "Error de red. Por favor verifica tu conexión.",
    "serverError": "Error del servidor. Por favor intenta más tarde.",
    "notFound": "No encontrado",
    "unauthorized": "Acceso no autorizado",
    "forbidden": "Acceso prohibido",
    "validationError": "Error de validación",
    "genericError": "Algo salió mal",
    "errorLoadingData": "Error al Cargar Datos",
    "noRecommendationsAvailable": "No hay recomendaciones disponibles. Por favor intenta de nuevo.",
    "generateRecommendations": "Generar Recomendaciones",
    "saveAssessment": "Guardar Evaluación",
    "stepNotImplemented": "Este paso aún no está implementado."
  },
  "emptyState": {
    "defaultTitle": "No hay datos disponibles",
    "defaultDescription": "No hay nada que mostrar aquí aún."
  },
  "assessment": {
    "step": "Paso",
    "skills": "Habilidades",
    "experienceLevels": {
      "beginner": "Recién comenzando a aprender",
      "intermediate": "Alguna experiencia práctica",
      "advanced": "Experiencia significativa",
      "expert": "Experiencia profunda y liderazgo"
    },
    "careerGoals": {
      "technical": "Liderazgo Técnico",
      "management": "Gestión de Personas",
      "entrepreneur": "Emprendimiento",
      "specialist": "Especialista/Consultor",
      "creative": "Director Creativo",
      "analyst": "Datos/Análisis"
    },
    "careerGoalDescriptions": {
      "technical": "Liderar equipos y proyectos técnicos",
      "management": "Gestionar equipos y organizaciones",
      "entrepreneur": "Comenzar tu propio negocio",
      "specialist": "Experiencia profunda en áreas específicas",
      "creative": "Liderar proyectos y equipos creativos",
      "analyst": "Enfocarse en datos e insights"
    },
    "priority": {
      "high": "Alta",
      "medium": "Media",
      "low": "Baja"
    },
    "stepProgress": {
      "experienceLevel": "Nivel de experiencia:",
      "careerGoal": "Objetivo profesional:",
      "selected": "✓ Seleccionado",
      "notSelected": "No seleccionado"
    },
    "buttons": {
      "completeAssessment": "Completar Evaluación",
      "next": "Siguiente"
    },
    "placeholders": {
      "addNewSkill": "Agregar nueva habilidad",
      "addNextStep": "Agregar siguiente paso",
      "addShortTermGoal": "Agregar objetivo a corto plazo",
      "addMediumTermGoal": "Agregar objetivo a mediano plazo",
      "addLongTermGoal": "Agregar objetivo a largo plazo"
    }
  },
  "settings": {
    "title": "Configuración",
    "language": "Idioma",
    "theme": "Tema",
    "notifications": "Notificaciones",
    "notificationsDescription": "Gestiona tus preferencias de notificaciones",
    "pushNotifications": "Notificaciones Push",
    "receiveUpdates": "Recibe actualizaciones sobre oportunidades profesionales y tendencias",
    "notificationsEnabled": "Habilitado",
    "notificationsDisabled": "Deshabilitado",
    "regionLocation": "Región y Ubicación",
    "setRegionDescription": "Establece tu región para ver tendencias profesionales y datos de mercado personalizados",
    "currentRegion": "Región Actual",
    "regionalPersonalizationActive": "Personalización Regional Activa",
    "regionalPersonalizationDescription": "Todas las tendencias profesionales, datos de mercado e insights están ahora personalizados para tu región. Esto afecta la disponibilidad de trabajos, tendencias salariales y oportunidades de crecimiento en toda la aplicación.",
    "chooseLanguageDescription": "Elige tu idioma preferido para la interfaz de la aplicación",
    "selectLanguage": "Selecciona tu idioma preferido",
    "selectLanguagePlaceholder": "Selecciona un idioma"
  },
  "notifications": {
    "title": "Notificaciones",
    "markAllRead": "Marcar Todo como Leído",
    "exit": "Salir",
    "noNotifications": "Sin notificaciones",
    "personalizedDescription": "Te notificaremos sobre oportunidades profesionales relevantes basadas en tus intereses",
    "allCaughtUp": "¡Estás al día! Las nuevas notificaciones aparecerán aquí.",
    "trendAlert": "Alerta de Tendencia",
    "skillDevelopment": "Desarrollo de Habilidades",
    "jobOpportunity": "Oportunidad Laboral",
    "milestone": "Hito",
    "industryInsight": "Perspectiva de la Industria"
  },
  "pages": {
    "search": {
      "title": "Buscar Carreras",
      "placeholder": "Buscar carreras...",
      "noResults": "No se encontraron carreras",
      "filterBy": "Filtrar por",
      "industry": "Industria",
      "experience": "Nivel de Experiencia",
      "salary": "Rango Salarial",
      "allIndustries": "Todas las Industrias",
      "allLevels": "Todos los Niveles",
      "entryLevel": "Nivel de Entrada",
      "intermediate": "Intermedio",
      "advanced": "Avanzado",
      "expert": "Experto",
      "tryAdjustingSearch": "Intenta ajustar tus términos de búsqueda o filtros",
      "clearSearch": "Limpiar Búsqueda",
      "careersFound": "carreras encontradas",
      "careerFound": "carrera encontrada"
    },
    "roadmap": {
      "title": "Mapa de Ruta Profesional",
      "subtitle": "Planifica tu viaje profesional",
      "currentLevel": "Nivel Actual",
      "targetLevel": "Nivel Objetivo",
      "progress": "Progreso",
      "milestones": "Hitos",
      "skillsToLearn": "Habilidades a Aprender",
      "nextSteps": "Próximos Pasos"
    },
    "bookmarks": {
      "title": "Mis Marcadores",
      "subtitle": "Tus carreras guardadas",
      "noBookmarks": "Aún no hay marcadores",
      "noBookmarksDescription": "Comienza a explorar carreras y marca tus favoritas",
      "exploreCareers": "Explorar Carreras"
    },
    "careerPaths": {
      "title": "Mis Carreras",
      "subtitle": "Rastrea tu progreso profesional",
      "noPaths": "Aún no hay carreras",
      "noPathsDescription": "Haz una evaluación para obtener recomendaciones profesionales personalizadas",
      "searchPlaceholder": "Buscar carreras...",
      "back": "Atrás",
      "tabs": {
        "myCareer": "Mi Carrera",
        "bookmarks": "Marcadores",
        "assessments": "Evaluaciones"
      },
      "myCareer": {
        "noProgress": "Aún no hay progreso en el mapa de ruta",
        "noProgressDescription": "Comienza a explorar carreras para rastrear tu progreso.",
        "exploreCareers": "Explorar Carreras",
        "currentPosition": "Posición Actual",
        "progress": "Progreso",
        "nextStep": "Siguiente Paso",
        "nextStepDescription": "Siguiente paso en el camino"
      },
      "bookmarks": {
        "noBookmarks": "Aún no hay carreras marcadas",
        "noBookmarksDescription": "Marca las carreras que te interesan para rastrearlas aquí.",
        "exploreCareers": "Explorar Carreras"
      },
      "assessments": {
        "noAssessments": "Aún no hay evaluaciones guardadas",
        "noAssessmentsDescription": "Haz una evaluación de habilidades para obtener recomendaciones profesionales personalizadas.",
        "takeAssessment": "Hacer Evaluación"
      }
    },
    "branching": {
      "title": "Ramas Profesionales",
      "subtitle": "Explora transiciones profesionales",
      "noTransitions": "No hay transiciones disponibles",
      "noTransitionsDescription": "Las sugerencias de transición profesional aparecerán aquí",
      "transitionData": {
        "productManager": {
          "title": "Gerente de Producto",
          "description": "Liderar estrategia y desarrollo de productos",
          "difficulty": "Medio",
          "timeline": "1-2 años",
          "salaryIncrease": "+25%"
        },
        "dataScientist": {
          "title": "Científico de Datos",
          "description": "Avanzar a aprendizaje automático e IA",
          "difficulty": "Difícil",
          "timeline": "2-3 años",
          "salaryIncrease": "+50%"
        },
        "devopsEngineer": {
          "title": "Ingeniero DevOps",
          "description": "Enfocarse en infraestructura, despliegue y excelencia operacional",
          "difficulty": "Fácil",
          "timeline": "3-6 meses",
          "salaryIncrease": "+20%"
        },
        "technicalLead": {
          "title": "Líder Técnico",
          "description": "Avanzar a liderazgo manteniendo experiencia técnica",
          "difficulty": "Difícil",
          "timeline": "2-3 años",
          "salaryIncrease": "+40%"
        },
        "productMarketingManager": {
          "title": "Gerente de Marketing de Producto",
          "description": "Especializarse en estrategias de marketing enfocadas en productos",
          "difficulty": "Fácil",
          "timeline": "6-12 meses",
          "salaryIncrease": "+15%"
        },
        "growthHacker": {
          "title": "Growth Hacker",
          "description": "Enfocarse en experimentación rápida y crecimiento basado en datos",
          "difficulty": "Medio",
          "timeline": "1 año",
          "salaryIncrease": "+35%"
        },
        "brandManager": {
          "title": "Gerente de Marca",
          "description": "Liderar estrategia de marca y dirección creativa",
          "difficulty": "Medio",
          "timeline": "1-2 años",
          "salaryIncrease": "+20%"
        },
        "dataScientistAdvanced": {
          "title": "Científico de Datos",
          "description": "Avanzar a aprendizaje automático y análisis predictivo",
          "difficulty": "Medio",
          "timeline": "1-2 años",
          "salaryIncrease": "+40%"
        },
        "biManager": {
          "title": "Gerente de BI",
          "description": "Liderar estrategia de datos e iniciativas de inteligencia empresarial",
          "difficulty": "Medio",
          "timeline": "1-2 años",
          "salaryIncrease": "+30%"
        },
        "productAnalyst": {
          "title": "Analista de Producto",
          "description": "Enfocarse en métricas de producto y análisis de comportamiento del usuario",
          "difficulty": "Fácil",
          "timeline": "6-12 meses",
          "salaryIncrease": "+25%"
        }
      }
    },
    "allJobs": {
      "title": "Todos los Trabajos",
      "subtitle": "Explora todas las posiciones disponibles",
      "noJobs": "No hay trabajos disponibles",
      "noJobsDescription": "Vuelve más tarde para nuevas ofertas de trabajo"
    }
  },
  "components": {
    "errorState": {
      "defaultTitle": "Algo salió mal",
      "defaultRetryLabel": "Intentar de Nuevo"
    },
    "emptyState": {
      "defaultTitle": "No hay datos disponibles",
      "defaultDescription": "No hay nada que mostrar aquí aún."
    },
    "trendDisplay": {
      "noTrendData": "No hay datos de tendencia disponibles para esta carrera",
      "trendDataDescription": "Los datos de tendencia se actualizan mensualmente desde Supabase. Algunas carreras pueden no tener datos de tendencia aún.",
      "careerId": "ID de Carrera",
      "lookForId": "Busca este ID en la",
      "table": "tabla",
      "checkDatabase": "Verificar Base de Datos"
    }
  },
  "careers": {
    "levels": {
      "entry": "Nivel de Entrada",
      "intermediate": "Nivel Medio",
      "advanced": "Nivel Senior",
      "expert": "Nivel Experto"
    },
    "commonSkills": {
      "javascript": "JavaScript",
      "react": "React",
      "nodejs": "Node.js",
      "python": "Python",
      "java": "Java",
      "sql": "SQL",
      "git": "Git",
      "aws": "AWS",
      "html": "HTML",
      "css": "CSS",
      "typescript": "TypeScript",
      "docker": "Docker",
      "kubernetes": "Kubernetes",
      "machineLearning": "Aprendizaje Automático",
      "dataAnalysis": "Análisis de Datos",
      "projectManagement": "Gestión de Proyectos",
      "leadership": "Liderazgo",
      "communication": "Comunicación",
      "problemSolving": "Resolución de Problemas",
      "teamwork": "Trabajo en Equipo"
    },
    "commonTitles": {
      "softwareEngineer": "Ingeniero de Software",
      "developer": "Desarrollador",
      "dataScientist": "Científico de Datos",
      "productManager": "Gerente de Producto",
      "designer": "Diseñador",
      "analyst": "Analista",
      "consultant": "Consultor",
      "manager": "Gerente",
      "director": "Director",
      "specialist": "Especialista",
      "coordinator": "Coordinador",
      "assistant": "Asistente",
      "intern": "Pasante",
      "trainee": "Aprendiz"
    },
    "industries": {
      "tech": "Tecnología",
      "healthcare": "Salud",
      "business": "Negocios",
      "education": "Educación",
      "creative": "Creativo",
      "finance": "Finanzas",
      "marketing": "Marketing",
      "sales": "Ventas",
      "engineering": "Ingeniería",
      "science": "Ciencia"
    },
    "education": {
      "bachelors": "Licenciatura",
      "masters": "Maestría",
      "phd": "Doctorado",
      "certificate": "Certificado",
      "diploma": "Diploma",
      "bootcamp": "Bootcamp",
      "selfTaught": "Autodidacta",
      "highSchool": "Preparatoria"
    },
    "experience": {
      "noExperience": "No se Requiere Experiencia",
      "entryLevel": "Nivel de Entrada (0-2 años)",
      "midLevel": "Nivel Medio (2-5 años)",
      "seniorLevel": "Nivel Senior (5+ años)",
      "expertLevel": "Nivel Experto (10+ años)"
    }
  }
}', '1.0.0')
ON CONFLICT (language_code, version) DO NOTHING;

-- Create a view for easy access to active translations
CREATE OR REPLACE VIEW active_translations AS
SELECT 
    language_code,
    translation_data,
    version,
    updated_at
FROM translations 
WHERE is_active = true
ORDER BY language_code, version DESC;

-- Grant access to the view
GRANT SELECT ON active_translations TO anon, authenticated;
