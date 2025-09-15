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

## 🔧 Backend Services

The backend services are located in the `backend/` folder:
- **chat2api**: Python Flask API for career data and trends
- **Database**: SQL schemas and setup scripts
- **Redis**: Caching and session storage

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
