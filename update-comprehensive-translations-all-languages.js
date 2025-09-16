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

// Comprehensive translations for all languages with the new keys
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
        "placeholder": "Buscar carreras...",
        "searchPlaceholder": "Buscar carreras...",
        "filters": "Filtros",
        "clearFilters": "Limpiar Filtros",
        "results": "Resultados",
        "noResults": "No se encontraron resultados",
        "tryAdjustingSearch": "Intenta ajustar tu búsqueda o filtros",
        "clearSearch": "Limpiar Búsqueda",
        "tryDifferentSearch": "Prueba un término de búsqueda diferente o ajusta tus filtros",
        "loadingCareers": "Cargando carreras...",
        "industry": "Industria",
        "experience": "Nivel de Experiencia",
        "allIndustries": "Todas las Industrias",
        "allLevels": "Todos los Niveles",
        "entryLevel": "Nivel de Entrada",
        "intermediate": "Intermedio",
        "advanced": "Avanzado",
        "expert": "Experto",
        "careersFound": "carreras encontradas",
        "careerFound": "carrera encontrada"
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
        "failedToLoadData": "Error al cargar los datos de carrera",
        "currentPosition": "Posición Actual",
        "nextStep": "Siguiente Paso",
        "target": "Objetivo",
        "setCareer": "Establecer Carrera",
        "careerDetails": "Detalles de la Carrera",
        "various": "Varios",
        "options": "opciones",
        "skillBasedTransitionsDescription": "Aprovecha tus habilidades actuales en nuevas áreas",
        "yourRoadmapProgressDescription": "Rastrea tu progresión profesional y planifica tus próximos movimientos"
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
        "technicalLeadership": "Liderazgo Técnico",
        "management": "Gestión",
        "entrepreneurship": "Emprendimiento",
        "specialist": "Especialista",
        "creative": "Creativo",
        "analyst": "Analista"
      },
      "careerGoalDescriptions": {
        "technicalLeadership": "Liderar equipos técnicos y proyectos",
        "management": "Gestionar equipos y operaciones comerciales",
        "entrepreneurship": "Iniciar y hacer crecer tu propio negocio",
        "specialist": "Convertirte en un experto en un campo específico",
        "creative": "Trabajar en roles creativos y de diseño",
        "analyst": "Analizar datos y procesos comerciales"
      },
      "additionalGoals": "Objetivos e Intereses Adicionales",
      "addCustomSkills": "Agregar Habilidades Personalizadas",
      "customSkillsPlaceholder": "Ingresa cualquier habilidad adicional que tengas (separadas por comas)",
      "selectAtLeastOneSkill": "Por favor selecciona al menos una habilidad para continuar",
      "currentRole": "Rol Actual (si tienes uno)",
      "currentRolePlaceholder": "ej., Desarrollador de Software, Gerente de Marketing, Estudiante",
      "yearsOfExperience": "Años de Experiencia Profesional",
      "additionalExperienceDetails": "Detalles de Experiencia Adicional",
      "additionalExperiencePlaceholder": "Describe tu experiencia laboral, proyectos, logros o cualquier antecedente relevante...",
      "whatAreYourCareerGoals": "¿Cuáles son tus objetivos profesionales?",
      "whatIsYourExperienceLevel": "¿Cuál es tu nivel de experiencia?",
      "experienceLevelDescription": "Cuéntanos sobre tu experiencia profesional y antecedentes",
      "assessmentComplete": "¡Evaluación Completada!",
      "assessmentCompleteDescription": "Aquí tienes tus recomendaciones personalizadas.",
      "recommendedCareerPaths": "Rutas Profesionales Recomendadas",
      "skillDevelopmentPlan": "Plan de Desarrollo de Habilidades",
      "careerRoadmap": "Hoja de Ruta Profesional",
      "shortTerm": "Corto Plazo (3-6 meses)",
      "mediumTerm": "Mediano Plazo (6-12 meses)",
      "longTerm": "Largo Plazo (1+ años)",
      "shortTermGoals": [
        "Identificar intereses y objetivos profesionales específicos",
        "Desarrollar habilidades avanzadas en tu campo",
        "Construir una red profesional sólida"
      ],
      "mediumTermGoals": [
        "Ganar experiencia en liderazgo",
        "Considerar certificaciones avanzadas o educación",
        "Construir experiencia en áreas especializadas"
      ],
      "longTermGoals": [
        "Lograr experiencia de nivel senior",
        "Considerar oportunidades de liderazgo",
        "Planificar el crecimiento profesional a largo plazo"
      ],
      "saveAssessment": "Guardar Evaluación"
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
  },
  ja: {
    "app": {
      "name": "Careering",
      "tagline": "あなたのキャリアの旅がここから始まります",
      "logoAlt": "Careeringロゴ"
    },
    "navigation": {
      "home": "ホーム",
      "search": "検索",
      "roadmap": "ロードマップ",
      "assessment": "スキル",
      "bookmarks": "ブックマーク",
      "careerPaths": "マイパス",
      "notifications": "通知",
      "settings": "設定"
    },
    "home": {
      "welcome": "Careeringへようこそ",
      "subtitle": "あなたにぴったりのキャリアパスを見つけましょう",
      "getStarted": "始める",
      "exploreCareers": "キャリアを探索",
      "takeAssessment": "評価を受ける",
      "viewBookmarks": "ブックマークを見る"
    },
    "settings": {
      "title": "設定",
      "language": "言語",
      "theme": "テーマ",
      "notifications": "通知",
      "notificationsDescription": "通知設定を管理",
      "pushNotifications": "プッシュ通知",
      "receiveUpdates": "新しいキャリア機会と市場トレンドについての更新を受け取る",
      "notificationsEnabled": "有効",
      "notificationsDisabled": "無効",
      "regionLocation": "地域と場所",
      "setRegionDescription": "地域を設定して、パーソナライズされたキャリアトレンドと市場データを表示",
      "currentRegion": "現在の地域",
      "regionalPersonalizationActive": "地域パーソナライゼーション有効",
      "regionalPersonalizationDescription": "あなたの地域に特化したキャリアデータとトレンドを表示しています",
      "chooseLanguageDescription": "アプリのインターフェースに使用する言語を選択",
      "selectLanguage": "希望する言語を選択",
      "selectLanguagePlaceholder": "言語を選択",
      "appearance": "外観",
      "appearanceDescription": "アプリの外観をカスタマイズ",
      "themeDescription": "ライトテーマとダークテーマを切り替え",
      "dark": "ダーク",
      "light": "ライト",
      "appVersion": "アプリバージョン",
      "dataSource": "データソース",
      "dataSourceValue": "Supabase"
    },
    "marketTrends": {
      "title": "市場トレンド",
      "subtitle": "最新のキャリアトレンドを把握",
      "salaryTrend": "給与トレンド",
      "futureOutlook": "将来の見通し",
      "industryImpact": "業界への影響",
      "growthRate": "成長率",
      "demandLevel": "需要レベル",
      "high": "高",
      "medium": "中",
      "low": "低",
      "rising": "上昇中",
      "stable": "安定",
      "declining": "下降中"
    },
    "search": {
      "placeholder": "キャリアを検索...",
      "noResults": "キャリアが見つかりません",
      "filterBy": "フィルター",
      "industry": "業界",
      "experience": "経験レベル",
      "allIndustries": "すべての業界",
      "allLevels": "すべてのレベル",
      "entryLevel": "エントリーレベル",
      "midLevel": "ミドルレベル",
      "seniorLevel": "シニアレベル",
      "expertLevel": "エキスパートレベル",
      "salary": "給与範囲",
      "suggestions": "提案"
    },
    "careers": {
      "title": "キャリア",
      "subtitle": "キャリア機会を探索",
      "searchPlaceholder": "キャリアを検索...",
      "filterByIndustry": "業界でフィルター",
      "filterByLevel": "経験レベルでフィルター",
      "allIndustries": "すべての業界",
      "allLevels": "すべてのレベル",
      "entryLevel": "エントリーレベル",
      "midLevel": "ミドルレベル",
      "seniorLevel": "シニアレベル",
      "expertLevel": "エキスパートレベル",
      "salaryRange": "給与範囲",
      "experienceLevel": "経験レベル",
      "skills": "スキル",
      "certifications": "認定",
      "jobTitles": "職種",
      "requirements": "要件",
      "education": "教育",
      "experience": "経験",
      "skillsList": "スキルリスト"
    },
    "pages": {
      "search": {
        "title": "キャリア検索",
        "subtitle": "あなたにぴったりのキャリアマッチを見つけましょう",
        "placeholder": "キャリアを検索...",
        "searchPlaceholder": "キャリアを検索...",
        "filters": "フィルター",
        "clearFilters": "フィルターをクリア",
        "results": "結果",
        "noResults": "結果が見つかりません",
        "tryAdjustingSearch": "検索やフィルターを調整してみてください",
        "clearSearch": "検索をクリア",
        "tryDifferentSearch": "異なる検索語を試すか、フィルターを調整してください",
        "loadingCareers": "キャリアを読み込み中...",
        "industry": "業界",
        "experience": "経験レベル",
        "allIndustries": "すべての業界",
        "allLevels": "すべてのレベル",
        "entryLevel": "エントリーレベル",
        "intermediate": "中級者",
        "advanced": "上級者",
        "expert": "エキスパート",
        "careersFound": "キャリアが見つかりました",
        "careerFound": "キャリアが見つかりました"
      },
      "careerPaths": {
        "title": "マイキャリアパス",
        "back": "戻る",
        "searchPlaceholder": "パスを検索...",
        "tabs": {
          "myCareer": "マイキャリア",
          "bookmarks": "ブックマーク",
          "assessments": "評価"
        },
        "myCareer": {
          "noCareerSelected": "キャリアが選択されていません",
          "noCareerSelectedDescription": "キャリアを選択してキャリアパスの計画を開始してください",
          "selectCareer": "キャリアを選択",
          "currentPosition": "現在のポジション",
          "progress": "進捗",
          "nextStep": "次のステップ",
          "nextStepDescription": "あなたの次のキャリア目標"
        },
        "bookmarks": {
          "noBookmarks": "ブックマークがありません",
          "noBookmarksDescription": "興味のあるキャリアをブックマークしてここで表示",
          "exploreCareers": "キャリアを探索"
        },
        "assessments": {
          "noAssessments": "評価がありません",
          "noAssessmentsDescription": "スキル評価を受けてパーソナライズされた推奨事項を取得",
          "takeAssessment": "評価を受ける"
        }
      },
      "roadmap": {
        "title": "キャリアロードマップ",
        "subtitle": "キャリアの旅を計画",
        "unableToLoadRoadmap": "ロードマップを読み込めません",
        "yourCurrentCareer": "現在のキャリア",
        "planYourNextStep": "次のステップを計画",
        "yourCareerTransitionOptions": "キャリア移行オプション",
        "basedOnCurrentRole": "現在の{role}としての役割に基づいて、探索できる潜在的なキャリアパスを以下に示します",
        "lateralCareerMove": "横断的キャリア移動",
        "numberOfOptions": "複数のオプション",
        "exploreSimilarRoles": "現在のレベルで類似の役割を探索する",
        "skillBasedTransitions": "スキルベースの移行",
        "yourRoadmapProgress": "ロードマップの進捗",
        "noResultsFound": "結果が見つかりません",
        "searchCareers": "キャリアを検索",
        "filters": "フィルター",
        "salaryRange": "給与範囲",
        "experienceLevel": "経験レベル",
        "startYourCareerRoadmap": "キャリアロードマップを開始",
        "loadingRoadmap": "キャリアロードマップを読み込み中...",
        "tryAgain": "再試行",
        "exploreCareers": "キャリアを探索",
        "selectCurrentCareer": "現在のキャリアを選択してプロフェッショナルな旅路の計画を始めましょう",
        "failedToLoadData": "キャリアデータの読み込みに失敗しました",
        "currentPosition": "現在のポジション",
        "nextStep": "次のステップ",
        "target": "目標",
        "setCareer": "キャリアを設定",
        "careerDetails": "キャリア詳細",
        "various": "様々",
        "options": "オプション",
        "skillBasedTransitionsDescription": "現在のスキルを新しい分野で活用する",
        "yourRoadmapProgressDescription": "キャリアの進歩を追跡し、次の動きを計画する"
      },
      "jobDetail": {
        "title": "仕事の詳細",
        "careerNotFound": "キャリアが見つかりません"
      }
    },
    "assessment": {
      "title": "スキル評価",
      "subtitle": "キャリアの可能性を発見",
      "step": "ステップ",
      "assessmentUnavailable": "評価が利用できません",
      "clickToViewDetails": "詳細なキャリア情報を表示するにはクリック",
      "selectSkills": "あなたが得意なスキルを選択してください。カスタムスキルも追加できます。",
      "selectRelevantSkills": "このカテゴリから関連するスキルを選択してください",
      "selectCareerDirection": "最も興味のあるキャリアの方向性を選択してください。",
      "failedToGenerateRecommendations": "推奨事項の生成に失敗しました",
      "tryAgain": "再試行",
      "skillCategories": {
        "technical": "技術スキル",
        "creative": "クリエイティブスキル",
        "analytical": "分析スキル",
        "communication": "コミュニケーションスキル",
        "business": "ビジネススキル",
        "languages": "言語"
      },
      "experienceLevels": {
        "beginner": "初心者",
        "intermediate": "中級者",
        "advanced": "上級者",
        "expert": "エキスパート"
      },
      "experienceDescriptions": {
        "beginner": "基本的な知識があるか、始めたばかりです",
        "intermediate": "実践的な経験があり、独立して作業できます",
        "advanced": "豊富な経験があり、プロジェクトをリードできます",
        "expert": "あなたの分野で認められたエキスパートです"
      },
      "careerGoals": {
        "technicalLeadership": "技術リーダーシップ",
        "management": "マネジメント",
        "entrepreneurship": "起業",
        "specialist": "スペシャリスト",
        "creative": "クリエイティブ",
        "analyst": "アナリスト"
      },
      "careerGoalDescriptions": {
        "technicalLeadership": "技術チームとプロジェクトをリードする",
        "management": "チームとビジネス運営を管理する",
        "entrepreneurship": "自分のビジネスを立ち上げて成長させる",
        "specialist": "特定の分野のエキスパートになる",
        "creative": "クリエイティブやデザインの役割で働く",
        "analyst": "データとビジネスプロセスを分析する"
      },
      "additionalGoals": "追加の目標と興味",
      "addCustomSkills": "カスタムスキルを追加",
      "customSkillsPlaceholder": "持っている追加のスキルを入力してください（カンマ区切り）",
      "selectAtLeastOneSkill": "続行するには少なくとも1つのスキルを選択してください",
      "currentRole": "現在の役割（ある場合）",
      "currentRolePlaceholder": "例：ソフトウェア開発者、マーケティングマネージャー、学生",
      "yearsOfExperience": "プロフェッショナル経験年数",
      "additionalExperienceDetails": "追加の経験詳細",
      "additionalExperiencePlaceholder": "あなたの職歴、プロジェクト、成果、または関連する背景について説明してください...",
      "whatAreYourCareerGoals": "あなたのキャリア目標は何ですか？",
      "whatIsYourExperienceLevel": "あなたの経験レベルは何ですか？",
      "experienceLevelDescription": "あなたのプロフェッショナル経験と背景について教えてください",
      "assessmentComplete": "評価完了！",
      "assessmentCompleteDescription": "あなたにパーソナライズされた推奨事項を以下に示します。",
      "recommendedCareerPaths": "推奨キャリアパス",
      "skillDevelopmentPlan": "スキル開発計画",
      "careerRoadmap": "キャリアロードマップ",
      "shortTerm": "短期（3-6ヶ月）",
      "mediumTerm": "中期（6-12ヶ月）",
      "longTerm": "長期（1年以上）",
      "shortTermGoals": [
        "具体的なキャリアの興味と目標を特定する",
        "あなたの分野で高度なスキルを開発する",
        "強固なプロフェッショナルネットワークを構築する"
      ],
      "mediumTermGoals": [
        "リーダーシップ経験を積む",
        "高度な認定や教育を検討する",
        "専門分野での専門知識を構築する"
      ],
      "longTermGoals": [
        "シニアレベルの専門知識を達成する",
        "リーダーシップの機会を検討する",
        "長期的なキャリア成長を計画する"
      ],
      "saveAssessment": "評価を保存"
    },
    "notifications": {
      "title": "通知",
      "markAllRead": "すべて既読にする",
      "exit": "終了",
      "noNotifications": "通知がありません",
      "personalizedDescription": "あなたの興味に基づいて関連するキャリア機会について通知します",
      "allCaughtUp": "すべて最新です！新しい通知がここに表示されます。",
      "trendAlert": "トレンドアラート",
      "skillDevelopment": "スキル開発",
      "jobOpportunity": "求人機会",
      "milestone": "マイルストーン",
      "filter": "フィルター",
      "allNotifications": "すべての通知",
      "personalizedNotifications": "パーソナライズ",
      "generalNotifications": "一般",
      "industryInsight": "業界インサイト"
    },
    "common": {
      "loading": "読み込み中...",
      "error": "エラー",
      "success": "成功",
      "cancel": "キャンセル",
      "save": "保存",
      "delete": "削除",
      "edit": "編集",
      "add": "追加",
      "remove": "削除",
      "yes": "はい",
      "no": "いいえ",
      "ok": "OK",
      "search": "検索",
      "searching": "検索中...",
      "retry": "再試行",
      "filter": "フィルター",
      "clear": "クリア",
      "select": "選択",
      "all": "すべて"
    }
  }
};

async function updateComprehensiveTranslationsAllLanguages() {
  console.log('🔧 Updating all languages with comprehensive translations...');

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
        console.log(`   - Search keys: ${Object.keys(translations.pages?.search || {}).length}`);
        console.log(`   - Roadmap keys: ${Object.keys(translations.pages?.roadmap || {}).length}`);
      }
    }

    console.log('\n✅ All languages comprehensive translations update completed successfully!');
    console.log('🎯 All pages should now be fully translated when you change languages.');

  } catch (error) {
    console.error('❌ Error during comprehensive translations update:', error);
  }
}

// Run the update
updateComprehensiveTranslationsAllLanguages();
