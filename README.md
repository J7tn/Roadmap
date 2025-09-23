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

## ⚙️ Environment Configuration

Create a `.env` file in the project root with the following variables:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (Required for translation updates)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**⚠️ Important Notes**:
- All client-side environment variables must be prefixed with `VITE_`
- The service role key is required for administrative translation updates
- Never commit the service role key to version control
- The service role key bypasses Row Level Security (RLS) policies

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
- **Dynamic Loading**: Translations loaded from Supabase with caching
- **Force Refresh**: Ability to bypass cache for fresh translations

### Translation System
- **Database Storage**: Translations stored in Supabase `translations` table
- **Version Control**: Each translation update gets a new version number
- **Caching**: 24-hour cache for improved performance
- **Local Fallback**: English translations in `src/locales/en.json` as fallback

### Adding New Translations
**⚠️ IMPORTANT**: Always check `TRANSLATION_UPDATE_GUIDE.md` before making translation changes.

**Prerequisites**:
- `SUPABASE_SERVICE_ROLE_KEY` must be configured in `.env` file
- Service role key is required to bypass RLS policies for database updates

**Process**:
1. Read the translation update guide
2. Ensure service role key is configured
3. Follow documented procedures for database updates
4. Test all affected languages
5. Verify console logs for successful loading

## 📖 Documentation

- [Development Roadmap & Rules](roadmap.mdc) - **Essential reading for all developers**
- [Translation Update Guide](TRANSLATION_UPDATE_GUIDE.md) - **Required before any translation changes**
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
