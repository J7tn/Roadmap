# 🚀 Free Cloud Deployment Guide

Deploy your chat2api backend to the cloud for free! This guide covers Railway (recommended) and Render.

## 🎯 Option 1: Railway (Recommended)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub repository

### Step 2: Deploy Your Project
1. **Click "New Project"**
2. **Select "Deploy from GitHub repo"**
3. **Choose your Roadmap repository**
4. **Select the `backend/chat2api` folder** as the root directory

### Step 3: Set Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```bash
# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI API Key (for AI-powered updates AND translations)
OPENAI_API_KEY=your-openai-api-key

# Chat2API Configuration
CHAT2API_URL=https://your-railway-app.railway.app
CHAT2API_API_KEY=your-chat2api-key

# Redis Configuration (Railway will provide this)
REDIS_URL=redis://redis:6379

# Port (Railway will set this automatically)
PORT=8000
```

### Step 4: Deploy!
1. **Click "Deploy"**
2. Railway will automatically:
   - Build your Python app
   - Install dependencies
   - Start the server
   - Run the monthly scheduler

### Step 5: Get Your URL
Railway will give you a URL like: `https://your-app-name.railway.app`

## 🎯 Option 2: Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub repository

### Step 2: Create Web Service
1. **Click "New +"**
2. **Select "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `roadmap-chat2api`
   - **Root Directory**: `backend/chat2api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Set Environment Variables
In Render dashboard, go to **Environment** tab and add the same variables as Railway.

### Step 4: Deploy!
Click **"Create Web Service"** and Render will deploy your app.

## 🔧 Configuration Details

### Railway Configuration
- **Free Tier**: 500 hours/month (enough for 24/7)
- **Auto-deploy**: Yes, from GitHub pushes
- **Custom domain**: Available
- **Logs**: Available in dashboard

### Render Configuration
- **Free Tier**: 750 hours/month
- **Auto-deploy**: Yes, from GitHub pushes
- **Custom domain**: Available
- **Logs**: Available in dashboard

## 📊 Monitoring Your Deployment

### Health Check
Visit: `https://your-app-url.railway.app/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "scheduler_running": true,
  "redis_connected": false
}
```

### Logs
- **Railway**: Dashboard → Your Project → Deployments → View Logs
- **Render**: Dashboard → Your Service → Logs

### Monthly Updates
The scheduler will automatically:
- ✅ Check every 24 hours for updates
- ✅ Run monthly career data updates
- ✅ Generate AI-powered content
- ✅ Translate into all 11 languages
- ✅ Update Supabase database

## 🚨 Important Notes

### Free Tier Limitations
- **Railway**: 500 hours/month (enough for 24/7)
- **Render**: 750 hours/month (enough for 24/7)
- **Sleep**: Free tiers may sleep after inactivity (but wake up on requests)

### Environment Variables
Make sure to set ALL required environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `CHAT2API_URL` (your deployed URL)
- `CHAT2API_API_KEY`

### Database Access
Your Supabase database will be accessible from the cloud deployment, so your app will work exactly the same as locally.

## 🎉 Result

Once deployed, your system will:
- ✅ **Run 24/7** in the cloud
- ✅ **Automatically update** career data monthly
- ✅ **Translate everything** into all 11 languages
- ✅ **Update Supabase** with fresh data
- ✅ **Require zero maintenance** from you

Your monthly updates will happen automatically without your computer being on!

## 🔄 Updating Your Deployment

To update your deployment:
1. **Push changes** to GitHub
2. **Railway/Render** will automatically redeploy
3. **No manual intervention** needed

## 📞 Support

If you need help:
- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Render**: [render.com/docs](https://render.com/docs)
- **This project**: Check the logs in your deployment dashboard
