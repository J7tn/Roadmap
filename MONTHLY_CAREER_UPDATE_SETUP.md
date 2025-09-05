# Monthly Career Data Update System

This document explains the new architecture where `chat2api` updates career data monthly, stores it in Supabase, and all devices pull from there.

## Architecture Overview

```
┌─────────────────┐    Monthly    ┌─────────────────┐    Real-time    ┌─────────────────┐
│   chat2api      │ ────────────► │    Supabase     │ ◄────────────── │   Mobile Apps   │
│   (Backend)     │   AI Updates  │   (Database)    │   Data Fetch    │   (Frontend)    │
└─────────────────┘               └─────────────────┘                 └─────────────────┘
```

## Components

### 1. Chat2API Backend (`chat2api_app/`)
- **Monthly Scheduler** (`scheduler.py`): Automatically updates career data every 30 days
- **Supabase Service** (`supabase_career_service.py`): Manages data synchronization with Supabase
- **Career API Endpoints**: Provides career data and management endpoints

### 2. Supabase Database
- **careers table**: Stores all career information
- **career_update_log table**: Tracks update history
- **Full-text search**: Optimized search capabilities
- **Row Level Security**: Secure data access

### 3. Mobile App (`src/services/`)
- **Supabase Career Service** (`supabaseCareerService.ts`): Fetches data from Supabase
- **Caching**: 1-hour local cache for performance
- **Fallback**: Hardcoded data if Supabase is unavailable

## Setup Instructions

### 1. Supabase Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and service role key

2. **Run Database Schema**:
   ```sql
   -- Execute the contents of database-careers-schema.sql in your Supabase SQL editor
   ```

3. **Configure Row Level Security**:
   - The schema automatically sets up RLS policies
   - Public read access for careers
   - Service role access for updates

### 2. Chat2API Backend Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   ```bash
   cp chat2api.env.example chat2api.env
   # Edit chat2api.env with your actual values
   ```

3. **Required Environment Variables**:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Start the Service**:
   ```bash
   docker-compose up -d
   ```

### 3. Mobile App Setup

1. **Install Supabase Client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configure Environment Variables**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Build and Deploy**:
   ```bash
   npm run build
   npx cap sync
   ```

## How It Works

### Monthly Update Process

1. **Scheduler Check**: Every 24 hours, the scheduler checks if 30 days have passed since the last update
2. **AI Generation**: If update is needed, chat2api generates fresh career data using AI
3. **Database Update**: New data is stored in Supabase, replacing old data
4. **Logging**: Update is logged in the career_update_log table

### App Data Fetching

1. **Cache Check**: App checks local cache (1-hour TTL)
2. **Supabase Query**: If cache expired, fetch from Supabase
3. **Fallback**: If Supabase fails, use hardcoded data
4. **Search**: Use Supabase full-text search for optimal performance

## API Endpoints

### Chat2API Endpoints

- `GET /api/careers` - Get all careers (legacy, for direct access)
- `GET /api/careers/{id}` - Get specific career
- `GET /api/careers/search?q=query` - Search careers
- `POST /api/careers/update` - Force immediate update (admin)
- `GET /api/careers/stats` - Get career statistics
- `GET /api/careers/update-status` - Check if update is needed

### Supabase Endpoints (via Supabase Client)

- `careers` table - Direct database access
- `career_update_log` table - Update history
- Full-text search capabilities
- Real-time subscriptions (if needed)

## Benefits

### 1. **Scalability**
- Single source of truth in Supabase
- No individual API calls from each device
- Efficient caching and search

### 2. **Performance**
- Supabase full-text search
- Local caching in apps
- Optimized database queries

### 3. **Reliability**
- Fallback to hardcoded data
- Multiple data sources
- Error handling and logging

### 4. **Maintainability**
- Centralized data updates
- Monthly AI-generated content
- Version tracking and rollback capability

## Monitoring

### Career Update Log
```sql
SELECT * FROM career_update_log 
ORDER BY update_timestamp DESC 
LIMIT 10;
```

### Career Statistics
```sql
SELECT 
    industry,
    COUNT(*) as career_count,
    MAX(updated_at) as last_updated
FROM careers 
GROUP BY industry 
ORDER BY career_count DESC;
```

### Update Status Check
```bash
curl http://localhost:8000/api/careers/update-status
```

## Troubleshooting

### Common Issues

1. **Supabase Connection Failed**:
   - Check environment variables
   - Verify Supabase project is active
   - Check network connectivity

2. **Monthly Updates Not Running**:
   - Check scheduler logs
   - Verify OpenAI API key
   - Check Supabase permissions

3. **App Not Loading Careers**:
   - Check Supabase anon key
   - Verify RLS policies
   - Check browser console for errors

### Manual Update
```bash
# Force immediate update
curl -X POST http://localhost:8000/api/careers/update
```

## Future Enhancements

1. **Real-time Updates**: WebSocket notifications when data changes
2. **A/B Testing**: Multiple career data versions
3. **Analytics**: Track which careers are most searched
4. **Localization**: Multi-language career data
5. **AI Improvements**: More sophisticated career generation
