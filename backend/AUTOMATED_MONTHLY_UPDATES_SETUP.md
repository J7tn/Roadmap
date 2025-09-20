# Automated Monthly Updates Setup Guide

## 🎯 Overview

Your chat2api backend is already configured for **fully automated monthly updates** of Supabase career and trend data. This means you don't need to do anything manually - the system will automatically update your data every month.

## 🔧 Current Automation Setup

### 1. **Monthly Scheduler** (`scheduler.py`)
- ✅ **Automatically runs every 24 hours** checking for update needs
- ✅ **Updates career data** when 30+ days old
- ✅ **Updates trending data** when 30+ days old
- ✅ **Built into FastAPI app** - starts automatically when chat2api runs

### 2. **Trend Scheduler** (`trend_scheduler.py`)
- ✅ **Cron-like scheduling** using Python `schedule` library
- ✅ **Runs on 1st and 15th of each month**
- ✅ **Uses AI to analyze career trends** via chat2api
- ✅ **Updates Supabase database** with fresh market data

### 3. **Monthly Trend Updater** (`monthly_trend_updater.py`)
- ✅ **AI-powered trend analysis** for each career
- ✅ **Comprehensive market data** (growth rates, salary trends, demand levels)
- ✅ **Industry-level trend summaries**
- ✅ **Historical trend tracking**

## 🚀 How to Enable Full Automation

### Step 1: Set Up Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI API Key (for AI-powered updates AND translations)
OPENAI_API_KEY=your-openai-api-key

# Chat2API Configuration
CHAT2API_URL=http://localhost:8000
CHAT2API_API_KEY=your-chat2api-key

# Redis Configuration
REDIS_URL=redis://redis:6379
```

**Important**: The `OPENAI_API_KEY` is now required for both AI-powered trend analysis AND automatic translation of career data into all 11 supported languages.

### Step 2: Start the Automated Services

#### Option A: Using Docker (Recommended)
```bash
cd backend
docker-compose up -d
```

This will start:
- ✅ **chat2api service** with monthly scheduler
- ✅ **Redis cache** for performance
- ✅ **Automatic restarts** if services fail

#### Option B: Manual Python Setup
```bash
cd backend/chat2api
pip install -r requirements.txt
python main.py
```

### Step 3: Verify Automation is Working

Check the logs to confirm automation is running:

```bash
# Docker logs
docker-compose logs -f chat2api

# Or check log files
tail -f backend/chat2api/monthly_trend_updater.log
tail -f backend/chat2api/trend_scheduler.log
```

## 📊 What Gets Updated Automatically

### Career Data Updates (Every 30 Days)
- ✅ **Salary ranges** with current market data
- ✅ **Required skills** and technologies
- ✅ **Job titles** and descriptions
- ✅ **Certifications** and requirements
- ✅ **Growth potential** and market outlook
- ✅ **Translations for all 11 languages** (English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese, Russian, Arabic)

### Trend Data Updates (Monthly)
- ✅ **Trend scores** (0-10 scale)
- ✅ **Demand levels** (high/medium/low)
- ✅ **Growth rates** and projections
- ✅ **Market insights** and analysis
- ✅ **Key trending skills**
- ✅ **Salary trends** and forecasts
- ✅ **Job availability scores**
- ✅ **Remote work trends**
- ✅ **Automation risk assessments**
- ✅ **Future outlook** predictions
- ✅ **Translations for all 11 languages** (market insights, salary trends, industry impact, future outlook)

### Industry-Level Updates
- ✅ **Industry growth rates**
- ✅ **Top trending careers** per industry
- ✅ **Emerging skills** by industry
- ✅ **Market summaries** and insights

## 🔍 Monitoring & Logs

### Log Files
- `monthly_trend_updater.log` - Detailed update process
- `trend_scheduler.log` - Scheduler activity
- `monthly_career_updater.log` - Career data updates

### Database Tracking
- `trend_update_log` table - Tracks update history
- `career_trend_history` table - Historical trend data
- `industry_trends` table - Industry-level summaries

### Health Check Endpoints
```bash
# Check if chat2api is running
curl http://localhost:8000/health

# Check update status
curl http://localhost:8000/api/careers/update-status
curl http://localhost:8000/api/trending/update-status

# Force immediate update (if needed)
curl -X POST http://localhost:8000/api/careers/update
curl -X POST http://localhost:8000/api/trending/update
```

## 🎛️ Configuration Options

### Update Frequency
The system is configured for **monthly updates** (30 days). To change this:

1. **Edit `scheduler.py`** line 63: Change `24 * 60 * 60` to desired interval
2. **Edit `supabase_career_service.py`** line 168: Change `>= 30` to desired days
3. **Edit `supabase_trending_service.py`** line 247: Change `>= 30` to desired days

### AI Model Configuration
To use different AI models:

1. **Edit `chat2api.env`**:
   ```bash
   CHAT2API_MODEL=gpt-4  # or gpt-3.5-turbo
   CHAT2API_MAX_TOKENS=4000
   CHAT2API_TEMPERATURE=0.3
   ```

2. **Edit `monthly_trend_updater.py`** line 132: Change model name

## 🚨 Troubleshooting

### Common Issues

1. **Updates not running**
   - Check if chat2api service is running
   - Verify environment variables are set
   - Check logs for errors

2. **AI analysis failing**
   - Verify OpenAI API key is valid
   - Check API rate limits
   - Review error logs

3. **Database connection issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Review database logs

### Manual Override
If you need to force an immediate update:

```bash
# Force career data update
curl -X POST http://localhost:8000/api/careers/update

# Force trending data update
curl -X POST http://localhost:8000/api/trending/update
```

## ✅ Verification Checklist

- [ ] Environment variables configured
- [ ] Chat2API service running
- [ ] Redis cache working
- [ ] Supabase connection established
- [ ] Monthly scheduler active
- [ ] Log files being created
- [ ] Health check endpoints responding
- [ ] First automated update completed

## 🎉 Result

Once set up, your system will:
- ✅ **Automatically update career data** every month
- ✅ **Generate fresh market insights** using AI
- ✅ **Update trend scores** and demand levels
- ✅ **Track historical changes** over time
- ✅ **Provide industry-level summaries**
- ✅ **Automatically translate everything** into all 11 supported languages
- ✅ **Require zero manual intervention**

Your app will always have **fresh, up-to-date career and market data in all 11 languages** without you having to do anything!

## 🌍 Translation Features

The system now automatically:
- ✅ **Translates career titles and descriptions** for all 11 languages
- ✅ **Translates skills and job titles** with professional terminology
- ✅ **Translates market insights and trends** with business context
- ✅ **Uses AI-powered translation** for accuracy and consistency
- ✅ **Maintains professional terminology** across all languages
- ✅ **Updates translations** every month with new data
