# Careering - Career Development Mobile App

A comprehensive career development mobile application built with React, TypeScript, and Capacitor for Android deployment.

## 📁 Project Structure

```
📁 careering/
├── 📁 src/                    # Frontend source code
│   ├── 📁 components/         # React components
│   ├── 📁 pages/             # Page components
│   ├── 📁 services/          # Business logic services
│   ├── 📁 hooks/             # Custom React hooks
│   ├── 📁 contexts/          # React contexts
│   ├── 📁 types/             # TypeScript type definitions
│   ├── 📁 utils/             # Utility functions
│   ├── 📁 data/              # Static data files
│   └── 📁 lib/               # External library configurations
├── 📁 backend/               # Backend services and data
│   ├── 📁 chat2api/          # Python API service
│   ├── 📁 database/          # Database schemas and scripts
│   ├── 📁 chat2api_data/     # API data storage
│   ├── 📁 chat2api_logs/     # API logs
│   ├── 📁 redis_data/        # Redis data storage
│   ├── 📄 docker-compose.yml # Docker configuration
│   ├── 📄 Dockerfile.chat2api # Docker file for API
│   ├── 📄 requirements.txt   # Python dependencies
│   └── 📄 chat2api.env       # API environment variables
├── 📁 assets/                # App assets (logos, icons, splash screens)
├── 📁 docs/                  # Documentation
│   ├── 📄 DESIGN.md          # App design documentation
│   └── 📄 LOGO_INTEGRATION_GUIDE.md # Logo integration guide
├── 📁 android/               # Android build files
├── 📁 dist/                  # Build output
├── 📁 public/                # Public static files
└── 📄 Configuration files    # package.json, tsconfig.json, etc.
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Android Studio (for mobile development)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Android Development
```bash
npx cap sync
npx cap open android
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Mobile**: Capacitor
- **Backend**: Python Flask (chat2api)
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context
- **Build Tool**: Vite

## 📱 Features

- Career path exploration and planning
- Skills assessment and recommendations
- Market trends and insights
- Personalized notifications
- Bookmark and progress tracking
- Dark/light mode support
- Mobile-optimized interface
- **🌍 Multilingual Support**: Full translation support for 11 languages with automatic device language detection

## 🔧 Backend Services

The backend services are located in the `backend/` folder:
- **chat2api**: Python Flask API for career data and trends
- **Database**: SQL schemas and setup scripts
- **Redis**: Caching and session storage

## 🌍 Internationalization (i18n)

The app supports **11 languages** with comprehensive translation coverage:

### Supported Languages
- **English** (en) - Default
- **Spanish** (es) - Español
- **French** (fr) - Français
- **German** (de) - Deutsch
- **Italian** (it) - Italiano
- **Portuguese** (pt) - Português
- **Japanese** (ja) - 日本語
- **Korean** (ko) - 한국어
- **Chinese** (zh) - 中文
- **Russian** (ru) - Русский
- **Arabic** (ar) - العربية (RTL support)

### Translation Features
- **Automatic Language Detection**: Detects user's device language on first launch
- **Language Persistence**: Remembers user's language choice
- **Real-time Switching**: Change language in settings with immediate updates
- **RTL Support**: Proper right-to-left layout for Arabic
- **Fallback System**: Falls back to English if translation is missing
- **Complete UI Coverage**: All pages, components, and user messages translated

### Translation Files
Translation files are located in `src/locales/` with the following structure:
```
src/locales/
├── en.json    # English (base)
├── es.json    # Spanish
├── fr.json    # French
├── de.json    # German
├── it.json    # Italian
├── pt.json    # Portuguese
├── ja.json    # Japanese
├── ko.json    # Korean
├── zh.json    # Chinese
├── ru.json    # Russian
└── ar.json    # Arabic
```

### Adding New Translations
1. Add new keys to `src/locales/en.json`
2. Add corresponding translations to all other language files
3. Use the `useTranslation` hook in components: `const { t } = useTranslation()`
4. Replace hardcoded strings with `t('key.path')`

## 📖 Documentation

- [Design Document](docs/DESIGN.md)
- [Logo Integration Guide](docs/LOGO_INTEGRATION_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
