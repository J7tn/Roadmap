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

// Complete translation data with all missing keys
const completeTranslations = {
  en: {
    "app": {
      "name": "Careering",
      "tagline": "Your Career Journey Starts Here"
    },
    "navigation": {
      "home": "Home",
      "search": "Search",
      "roadmap": "Roadmap",
      "bookmarks": "Bookmarks",
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
    "settings": {
      "title": "Settings",
      "language": "Language",
      "theme": "Theme",
      "notifications": "Notifications",
      "notificationsDescription": "Manage your notification preferences",
      "pushNotifications": "Push Notifications",
      "receiveUpdates": "Receive updates about new career opportunities and market trends",
      "notificationsEnabled": "Enabled",
      "notificationsDisabled": "Disabled",
      "regionLocation": "Region and Location",
      "setRegionDescription": "Set your region to see personalized career trends and market data",
      "currentRegion": "Current Region",
      "regionalPersonalizationActive": "Regional Personalization Active",
      "regionalPersonalizationDescription": "You're seeing career data and trends specific to your region",
      "chooseLanguageDescription": "Choose your preferred language for the app interface",
      "selectLanguage": "Select your preferred Language",
      "selectLanguagePlaceholder": "Select a language",
      "appearance": "Appearance",
      "appearanceDescription": "Customize the look and feel of the app",
      "themeDescription": "Switch between light and dark themes",
      "dark": "Dark",
      "light": "Light",
      "appVersion": "App version",
      "dataSource": "Data source",
      "lastUpdated": "Last updated"
    },
    "common": {
      "loading": "Loading...",
      "error": "Error",
      "retry": "Retry",
      "save": "Save",
      "cancel": "Cancel",
      "back": "Back",
      "next": "Next",
      "done": "Done",
      "search": "Search",
      "filter": "Filter",
      "clear": "Clear",
      "select": "Select",
      "all": "All"
    }
  },
  ja: {
    "app": {
      "name": "キャリアリング",
      "tagline": "あなたのキャリアの旅がここから始まります"
    },
    "navigation": {
      "home": "ホーム",
      "search": "検索",
      "roadmap": "ロードマップ",
      "bookmarks": "ブックマーク",
      "settings": "設定"
    },
    "home": {
      "welcome": "キャリアリングへようこそ",
      "subtitle": "あなたにぴったりのキャリアパスを見つけましょう",
      "getStarted": "始める",
      "exploreCareers": "キャリアを探す",
      "takeAssessment": "アセスメントを受ける",
      "viewBookmarks": "ブックマークを見る"
    },
    "settings": {
      "title": "設定",
      "language": "言語",
      "theme": "テーマ",
      "notifications": "通知",
      "notificationsDescription": "通知の設定を管理します",
      "pushNotifications": "プッシュ通知",
      "receiveUpdates": "新しいキャリア機会と市場トレンドの更新を受け取る",
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
      "appearanceDescription": "アプリの見た目と感じをカスタマイズ",
      "themeDescription": "ライトテーマとダークテーマを切り替え",
      "dark": "ダーク",
      "light": "ライト",
      "appVersion": "アプリバージョン",
      "dataSource": "データソース",
      "lastUpdated": "最終更新"
    },
    "common": {
      "loading": "読み込み中...",
      "error": "エラー",
      "retry": "再試行",
      "save": "保存",
      "cancel": "キャンセル",
      "back": "戻る",
      "next": "次へ",
      "done": "完了",
      "search": "検索",
      "filter": "フィルター",
      "clear": "クリア",
      "select": "選択",
      "all": "すべて"
    }
  },
  es: {
    "app": {
      "name": "Careering",
      "tagline": "Tu Viaje Profesional Comienza Aquí"
    },
    "navigation": {
      "home": "Inicio",
      "search": "Buscar",
      "roadmap": "Ruta",
      "bookmarks": "Marcadores",
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
      "regionalPersonalizationDescription": "Estás viendo datos de carrera y tendencias específicas de tu región",
      "chooseLanguageDescription": "Elige tu idioma preferido para la interfaz de la aplicación",
      "selectLanguage": "Selecciona tu idioma preferido",
      "selectLanguagePlaceholder": "Selecciona un idioma",
      "appearance": "Apariencia",
      "appearanceDescription": "Personaliza la apariencia y sensación de la aplicación",
      "themeDescription": "Cambia entre temas claro y oscuro",
      "dark": "Oscuro",
      "light": "Claro",
      "appVersion": "Versión de la aplicación",
      "dataSource": "Fuente de datos",
      "lastUpdated": "Última actualización"
    },
    "common": {
      "loading": "Cargando...",
      "error": "Error",
      "retry": "Reintentar",
      "save": "Guardar",
      "cancel": "Cancelar",
      "back": "Atrás",
      "next": "Siguiente",
      "done": "Hecho",
      "search": "Buscar",
      "filter": "Filtrar",
      "clear": "Limpiar",
      "select": "Seleccionar",
      "all": "Todos"
    }
  }
};

async function updateTranslations() {
  console.log('Updating missing translations in Supabase...');
  
  for (const [languageCode, translationData] of Object.entries(completeTranslations)) {
    console.log(`Updating ${languageCode} translations...`);
    
    try {
      const { data, error } = await supabase
        .from('translations')
        .upsert({
          language_code: languageCode,
          translation_data: translationData,
          version: '1.1.0',
          is_active: true
        }, {
          onConflict: 'language_code,version'
        });

      if (error) {
        console.error(`Error updating ${languageCode}:`, error);
        continue;
      }

      console.log(`✅ Successfully updated ${languageCode} translations`);
      
    } catch (error) {
      console.error(`Error processing ${languageCode}:`, error);
    }
  }

  console.log('Translation update completed!');
  
  // Verify updates
  console.log('\nVerifying updates...');
  const { data: updatedTranslations, error: verifyError } = await supabase
    .from('translations')
    .select('language_code, version, updated_at, is_active')
    .order('language_code');

  if (verifyError) {
    console.error('Error verifying updates:', verifyError);
  } else {
    console.log('Updated translations:');
    updatedTranslations.forEach(translation => {
      const status = translation.is_active ? '✅ Active' : '❌ Inactive';
      console.log(`  - ${translation.language_code} - v${translation.version} - ${status} - ${new Date(translation.updated_at).toLocaleString()}`);
    });
  }
}

// Run the update
updateTranslations().catch(console.error);
