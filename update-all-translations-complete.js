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

// Complete translation data for all languages
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
  },
  fr: {
    "app": {
      "name": "Careering",
      "tagline": "Votre Parcours Professionnel Commence Ici"
    },
    "navigation": {
      "home": "Accueil",
      "search": "Rechercher",
      "roadmap": "Feuille de Route",
      "bookmarks": "Signets",
      "settings": "Paramètres"
    },
    "home": {
      "welcome": "Bienvenue sur Careering",
      "subtitle": "Découvrez votre parcours professionnel parfait",
      "getStarted": "Commencer",
      "exploreCareers": "Explorer les Carrières",
      "takeAssessment": "Passer l'Évaluation",
      "viewBookmarks": "Voir les Signets"
    },
    "settings": {
      "title": "Paramètres",
      "language": "Langue",
      "theme": "Thème",
      "notifications": "Notifications",
      "notificationsDescription": "Gérez vos préférences de notification",
      "pushNotifications": "Notifications Push",
      "receiveUpdates": "Recevez des mises à jour sur les nouvelles opportunités de carrière et les tendances du marché",
      "notificationsEnabled": "Activé",
      "notificationsDisabled": "Désactivé",
      "regionLocation": "Région et Localisation",
      "setRegionDescription": "Définissez votre région pour voir des tendances de carrière et des données de marché personnalisées",
      "currentRegion": "Région Actuelle",
      "regionalPersonalizationActive": "Personnalisation Régionale Active",
      "regionalPersonalizationDescription": "Vous voyez des données de carrière et des tendances spécifiques à votre région",
      "chooseLanguageDescription": "Choisissez votre langue préférée pour l'interface de l'application",
      "selectLanguage": "Sélectionnez votre langue préférée",
      "selectLanguagePlaceholder": "Sélectionnez une langue",
      "appearance": "Apparence",
      "appearanceDescription": "Personnalisez l'apparence et la sensation de l'application",
      "themeDescription": "Basculer entre les thèmes clair et sombre",
      "dark": "Sombre",
      "light": "Clair",
      "appVersion": "Version de l'application",
      "dataSource": "Source de données",
      "lastUpdated": "Dernière mise à jour"
    },
    "common": {
      "loading": "Chargement...",
      "error": "Erreur",
      "retry": "Réessayer",
      "save": "Enregistrer",
      "cancel": "Annuler",
      "back": "Retour",
      "next": "Suivant",
      "done": "Terminé",
      "search": "Rechercher",
      "filter": "Filtrer",
      "clear": "Effacer",
      "select": "Sélectionner",
      "all": "Tous"
    }
  },
  de: {
    "app": {
      "name": "Careering",
      "tagline": "Ihre Karriere-Reise Beginnt Hier"
    },
    "navigation": {
      "home": "Startseite",
      "search": "Suchen",
      "roadmap": "Roadmap",
      "bookmarks": "Lesezeichen",
      "settings": "Einstellungen"
    },
    "home": {
      "welcome": "Willkommen bei Careering",
      "subtitle": "Entdecken Sie Ihren perfekten Karriereweg",
      "getStarted": "Loslegen",
      "exploreCareers": "Karrieren Erkunden",
      "takeAssessment": "Bewertung Durchführen",
      "viewBookmarks": "Lesezeichen Anzeigen"
    },
    "settings": {
      "title": "Einstellungen",
      "language": "Sprache",
      "theme": "Design",
      "notifications": "Benachrichtigungen",
      "notificationsDescription": "Verwalten Sie Ihre Benachrichtigungseinstellungen",
      "pushNotifications": "Push-Benachrichtigungen",
      "receiveUpdates": "Erhalten Sie Updates über neue Karrieremöglichkeiten und Markttrends",
      "notificationsEnabled": "Aktiviert",
      "notificationsDisabled": "Deaktiviert",
      "regionLocation": "Region und Standort",
      "setRegionDescription": "Legen Sie Ihre Region fest, um personalisierte Karrieretrends und Marktdaten zu sehen",
      "currentRegion": "Aktuelle Region",
      "regionalPersonalizationActive": "Regionale Personalisierung Aktiv",
      "regionalPersonalizationDescription": "Sie sehen Karrieredaten und Trends, die spezifisch für Ihre Region sind",
      "chooseLanguageDescription": "Wählen Sie Ihre bevorzugte Sprache für die App-Oberfläche",
      "selectLanguage": "Wählen Sie Ihre bevorzugte Sprache",
      "selectLanguagePlaceholder": "Sprache auswählen",
      "appearance": "Erscheinungsbild",
      "appearanceDescription": "Passen Sie das Aussehen und Gefühl der App an",
      "themeDescription": "Zwischen hellen und dunklen Designs wechseln",
      "dark": "Dunkel",
      "light": "Hell",
      "appVersion": "App-Version",
      "dataSource": "Datenquelle",
      "lastUpdated": "Zuletzt aktualisiert"
    },
    "common": {
      "loading": "Laden...",
      "error": "Fehler",
      "retry": "Wiederholen",
      "save": "Speichern",
      "cancel": "Abbrechen",
      "back": "Zurück",
      "next": "Weiter",
      "done": "Fertig",
      "search": "Suchen",
      "filter": "Filtern",
      "clear": "Löschen",
      "select": "Auswählen",
      "all": "Alle"
    }
  },
  pt: {
    "app": {
      "name": "Careering",
      "tagline": "Sua Jornada Profissional Começa Aqui"
    },
    "navigation": {
      "home": "Início",
      "search": "Pesquisar",
      "roadmap": "Roteiro",
      "bookmarks": "Favoritos",
      "settings": "Configurações"
    },
    "home": {
      "welcome": "Bem-vindo ao Careering",
      "subtitle": "Descubra seu caminho profissional perfeito",
      "getStarted": "Começar",
      "exploreCareers": "Explorar Carreiras",
      "takeAssessment": "Fazer Avaliação",
      "viewBookmarks": "Ver Favoritos"
    },
    "settings": {
      "title": "Configurações",
      "language": "Idioma",
      "theme": "Tema",
      "notifications": "Notificações",
      "notificationsDescription": "Gerencie suas preferências de notificação",
      "pushNotifications": "Notificações Push",
      "receiveUpdates": "Receba atualizações sobre novas oportunidades de carreira e tendências do mercado",
      "notificationsEnabled": "Habilitado",
      "notificationsDisabled": "Desabilitado",
      "regionLocation": "Região e Localização",
      "setRegionDescription": "Defina sua região para ver tendências de carreira e dados de mercado personalizados",
      "currentRegion": "Região Atual",
      "regionalPersonalizationActive": "Personalização Regional Ativa",
      "regionalPersonalizationDescription": "Você está vendo dados de carreira e tendências específicos da sua região",
      "chooseLanguageDescription": "Escolha seu idioma preferido para a interface do aplicativo",
      "selectLanguage": "Selecione seu idioma preferido",
      "selectLanguagePlaceholder": "Selecione um idioma",
      "appearance": "Aparência",
      "appearanceDescription": "Personalize a aparência e sensação do aplicativo",
      "themeDescription": "Alternar entre temas claro e escuro",
      "dark": "Escuro",
      "light": "Claro",
      "appVersion": "Versão do aplicativo",
      "dataSource": "Fonte de dados",
      "lastUpdated": "Última atualização"
    },
    "common": {
      "loading": "Carregando...",
      "error": "Erro",
      "retry": "Tentar novamente",
      "save": "Salvar",
      "cancel": "Cancelar",
      "back": "Voltar",
      "next": "Próximo",
      "done": "Concluído",
      "search": "Pesquisar",
      "filter": "Filtrar",
      "clear": "Limpar",
      "select": "Selecionar",
      "all": "Todos"
    }
  },
  it: {
    "app": {
      "name": "Careering",
      "tagline": "Il Tuo Percorso Professionale Inizia Qui"
    },
    "navigation": {
      "home": "Home",
      "search": "Cerca",
      "roadmap": "Roadmap",
      "bookmarks": "Segnalibri",
      "settings": "Impostazioni"
    },
    "home": {
      "welcome": "Benvenuto in Careering",
      "subtitle": "Scopri il tuo percorso professionale perfetto",
      "getStarted": "Inizia",
      "exploreCareers": "Esplora Carriere",
      "takeAssessment": "Fai la Valutazione",
      "viewBookmarks": "Visualizza Segnalibri"
    },
    "settings": {
      "title": "Impostazioni",
      "language": "Lingua",
      "theme": "Tema",
      "notifications": "Notifiche",
      "notificationsDescription": "Gestisci le tue preferenze di notifica",
      "pushNotifications": "Notifiche Push",
      "receiveUpdates": "Ricevi aggiornamenti su nuove opportunità di carriera e tendenze del mercato",
      "notificationsEnabled": "Abilitato",
      "notificationsDisabled": "Disabilitato",
      "regionLocation": "Regione e Posizione",
      "setRegionDescription": "Imposta la tua regione per vedere tendenze di carriera e dati di mercato personalizzati",
      "currentRegion": "Regione Attuale",
      "regionalPersonalizationActive": "Personalizzazione Regionale Attiva",
      "regionalPersonalizationDescription": "Stai vedendo dati di carriera e tendenze specifici della tua regione",
      "chooseLanguageDescription": "Scegli la tua lingua preferita per l'interfaccia dell'app",
      "selectLanguage": "Seleziona la tua lingua preferita",
      "selectLanguagePlaceholder": "Seleziona una lingua",
      "appearance": "Aspetto",
      "appearanceDescription": "Personalizza l'aspetto e la sensazione dell'app",
      "themeDescription": "Passa tra temi chiari e scuri",
      "dark": "Scuro",
      "light": "Chiaro",
      "appVersion": "Versione dell'app",
      "dataSource": "Fonte dati",
      "lastUpdated": "Ultimo aggiornamento"
    },
    "common": {
      "loading": "Caricamento...",
      "error": "Errore",
      "retry": "Riprova",
      "save": "Salva",
      "cancel": "Annulla",
      "back": "Indietro",
      "next": "Avanti",
      "done": "Fatto",
      "search": "Cerca",
      "filter": "Filtra",
      "clear": "Cancella",
      "select": "Seleziona",
      "all": "Tutti"
    }
  },
  ko: {
    "app": {
      "name": "케어링",
      "tagline": "당신의 커리어 여정이 여기서 시작됩니다"
    },
    "navigation": {
      "home": "홈",
      "search": "검색",
      "roadmap": "로드맵",
      "bookmarks": "북마크",
      "settings": "설정"
    },
    "home": {
      "welcome": "케어링에 오신 것을 환영합니다",
      "subtitle": "완벽한 커리어 경로를 발견하세요",
      "getStarted": "시작하기",
      "exploreCareers": "커리어 탐색",
      "takeAssessment": "평가 받기",
      "viewBookmarks": "북마크 보기"
    },
    "settings": {
      "title": "설정",
      "language": "언어",
      "theme": "테마",
      "notifications": "알림",
      "notificationsDescription": "알림 설정을 관리합니다",
      "pushNotifications": "푸시 알림",
      "receiveUpdates": "새로운 커리어 기회와 시장 동향에 대한 업데이트를 받으세요",
      "notificationsEnabled": "활성화",
      "notificationsDisabled": "비활성화",
      "regionLocation": "지역 및 위치",
      "setRegionDescription": "지역을 설정하여 개인화된 커리어 동향과 시장 데이터를 확인하세요",
      "currentRegion": "현재 지역",
      "regionalPersonalizationActive": "지역 개인화 활성",
      "regionalPersonalizationDescription": "귀하의 지역에 특화된 커리어 데이터와 동향을 보고 있습니다",
      "chooseLanguageDescription": "앱 인터페이스에 사용할 선호 언어를 선택하세요",
      "selectLanguage": "선호하는 언어를 선택하세요",
      "selectLanguagePlaceholder": "언어 선택",
      "appearance": "외관",
      "appearanceDescription": "앱의 모양과 느낌을 사용자 정의하세요",
      "themeDescription": "밝은 테마와 어두운 테마 간 전환",
      "dark": "어두운",
      "light": "밝은",
      "appVersion": "앱 버전",
      "dataSource": "데이터 소스",
      "lastUpdated": "마지막 업데이트"
    },
    "common": {
      "loading": "로딩 중...",
      "error": "오류",
      "retry": "다시 시도",
      "save": "저장",
      "cancel": "취소",
      "back": "뒤로",
      "next": "다음",
      "done": "완료",
      "search": "검색",
      "filter": "필터",
      "clear": "지우기",
      "select": "선택",
      "all": "모두"
    }
  },
  zh: {
    "app": {
      "name": "职业规划",
      "tagline": "您的职业之旅从这里开始"
    },
    "navigation": {
      "home": "首页",
      "search": "搜索",
      "roadmap": "路线图",
      "bookmarks": "书签",
      "settings": "设置"
    },
    "home": {
      "welcome": "欢迎来到职业规划",
      "subtitle": "发现您完美的职业道路",
      "getStarted": "开始",
      "exploreCareers": "探索职业",
      "takeAssessment": "进行评估",
      "viewBookmarks": "查看书签"
    },
    "settings": {
      "title": "设置",
      "language": "语言",
      "theme": "主题",
      "notifications": "通知",
      "notificationsDescription": "管理您的通知偏好",
      "pushNotifications": "推送通知",
      "receiveUpdates": "接收关于新职业机会和市场趋势的更新",
      "notificationsEnabled": "已启用",
      "notificationsDisabled": "已禁用",
      "regionLocation": "地区和位置",
      "setRegionDescription": "设置您的地区以查看个性化的职业趋势和市场数据",
      "currentRegion": "当前地区",
      "regionalPersonalizationActive": "地区个性化已激活",
      "regionalPersonalizationDescription": "您正在查看特定于您地区的职业数据和趋势",
      "chooseLanguageDescription": "选择您喜欢的应用程序界面语言",
      "selectLanguage": "选择您喜欢的语言",
      "selectLanguagePlaceholder": "选择语言",
      "appearance": "外观",
      "appearanceDescription": "自定义应用程序的外观和感觉",
      "themeDescription": "在浅色和深色主题之间切换",
      "dark": "深色",
      "light": "浅色",
      "appVersion": "应用程序版本",
      "dataSource": "数据源",
      "lastUpdated": "最后更新"
    },
    "common": {
      "loading": "加载中...",
      "error": "错误",
      "retry": "重试",
      "save": "保存",
      "cancel": "取消",
      "back": "返回",
      "next": "下一步",
      "done": "完成",
      "search": "搜索",
      "filter": "筛选",
      "clear": "清除",
      "select": "选择",
      "all": "全部"
    }
  },
  ru: {
    "app": {
      "name": "Карьера",
      "tagline": "Ваше Карьерное Путешествие Начинается Здесь"
    },
    "navigation": {
      "home": "Главная",
      "search": "Поиск",
      "roadmap": "Дорожная карта",
      "bookmarks": "Закладки",
      "settings": "Настройки"
    },
    "home": {
      "welcome": "Добро пожаловать в Карьера",
      "subtitle": "Откройте для себя свой идеальный карьерный путь",
      "getStarted": "Начать",
      "exploreCareers": "Исследовать Карьеры",
      "takeAssessment": "Пройти Оценку",
      "viewBookmarks": "Просмотреть Закладки"
    },
    "settings": {
      "title": "Настройки",
      "language": "Язык",
      "theme": "Тема",
      "notifications": "Уведомления",
      "notificationsDescription": "Управляйте настройками уведомлений",
      "pushNotifications": "Push-уведомления",
      "receiveUpdates": "Получайте обновления о новых карьерных возможностях и рыночных тенденциях",
      "notificationsEnabled": "Включено",
      "notificationsDisabled": "Отключено",
      "regionLocation": "Регион и Местоположение",
      "setRegionDescription": "Установите ваш регион для просмотра персонализированных карьерных тенденций и рыночных данных",
      "currentRegion": "Текущий Регион",
      "regionalPersonalizationActive": "Региональная Персонализация Активна",
      "regionalPersonalizationDescription": "Вы видите карьерные данные и тенденции, специфичные для вашего региона",
      "chooseLanguageDescription": "Выберите предпочитаемый язык для интерфейса приложения",
      "selectLanguage": "Выберите предпочитаемый язык",
      "selectLanguagePlaceholder": "Выберите язык",
      "appearance": "Внешний вид",
      "appearanceDescription": "Настройте внешний вид и ощущение приложения",
      "themeDescription": "Переключение между светлой и темной темами",
      "dark": "Темная",
      "light": "Светлая",
      "appVersion": "Версия приложения",
      "dataSource": "Источник данных",
      "lastUpdated": "Последнее обновление"
    },
    "common": {
      "loading": "Загрузка...",
      "error": "Ошибка",
      "retry": "Повторить",
      "save": "Сохранить",
      "cancel": "Отмена",
      "back": "Назад",
      "next": "Далее",
      "done": "Готово",
      "search": "Поиск",
      "filter": "Фильтр",
      "clear": "Очистить",
      "select": "Выбрать",
      "all": "Все"
    }
  },
  ar: {
    "app": {
      "name": "كارييرينج",
      "tagline": "رحلتك المهنية تبدأ من هنا"
    },
    "navigation": {
      "home": "الرئيسية",
      "search": "بحث",
      "roadmap": "خريطة الطريق",
      "bookmarks": "المفضلة",
      "settings": "الإعدادات"
    },
    "home": {
      "welcome": "مرحباً بك في كارييرينج",
      "subtitle": "اكتشف مسارك المهني المثالي",
      "getStarted": "ابدأ",
      "exploreCareers": "استكشف المهن",
      "takeAssessment": "قم بالتقييم",
      "viewBookmarks": "عرض المفضلة"
    },
    "settings": {
      "title": "الإعدادات",
      "language": "اللغة",
      "theme": "المظهر",
      "notifications": "الإشعارات",
      "notificationsDescription": "إدارة تفضيلات الإشعارات",
      "pushNotifications": "الإشعارات الفورية",
      "receiveUpdates": "تلقي تحديثات حول فرص مهنية جديدة واتجاهات السوق",
      "notificationsEnabled": "مفعل",
      "notificationsDisabled": "معطل",
      "regionLocation": "المنطقة والموقع",
      "setRegionDescription": "حدد منطقتك لرؤية اتجاهات مهنية وبيانات سوق مخصصة",
      "currentRegion": "المنطقة الحالية",
      "regionalPersonalizationActive": "التخصيص الإقليمي نشط",
      "regionalPersonalizationDescription": "أنت تشاهد بيانات مهنية واتجاهات خاصة بمنطقتك",
      "chooseLanguageDescription": "اختر لغتك المفضلة لواجهة التطبيق",
      "selectLanguage": "اختر لغتك المفضلة",
      "selectLanguagePlaceholder": "اختر لغة",
      "appearance": "المظهر",
      "appearanceDescription": "تخصيص مظهر وشعور التطبيق",
      "themeDescription": "التبديل بين المظاهر الفاتح والداكن",
      "dark": "داكن",
      "light": "فاتح",
      "appVersion": "إصدار التطبيق",
      "dataSource": "مصدر البيانات",
      "lastUpdated": "آخر تحديث"
    },
    "common": {
      "loading": "جاري التحميل...",
      "error": "خطأ",
      "retry": "إعادة المحاولة",
      "save": "حفظ",
      "cancel": "إلغاء",
      "back": "رجوع",
      "next": "التالي",
      "done": "تم",
      "search": "بحث",
      "filter": "تصفية",
      "clear": "مسح",
      "select": "اختيار",
      "all": "الكل"
    }
  }
};

async function updateAllTranslations() {
  console.log('Updating all translations with complete data...');
  
  for (const [languageCode, translationData] of Object.entries(completeTranslations)) {
    console.log(`Updating ${languageCode} translations...`);
    
    try {
      const { data, error } = await supabase
        .from('translations')
        .upsert({
          language_code: languageCode,
          translation_data: translationData,
          version: '1.2.0',
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

  console.log('All translations updated!');
  
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
updateAllTranslations().catch(console.error);
