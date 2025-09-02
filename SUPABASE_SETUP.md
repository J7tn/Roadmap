# Supabase Setup Guide for Career Atlas

## 🚀 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Fill in project details:**
   - **Name**: `career-atlas-db`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
5. **Click "Create new project"**
6. **Wait for setup to complete** (usually 2-3 minutes)

## 🔑 Step 2: Get Your Credentials

1. **Go to Settings → API** in your project
2. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
3. **Save them for later**

## 🗄️ Step 3: Set Up Database Tables

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the contents** of `database-setup.sql`
3. **Paste and run** the SQL script
4. **Verify tables are created** in the Table Editor

## ⚙️ Step 4: Configure Environment Variables

1. **Create a `.env` file** in your project root
2. **Add your Supabase credentials:**

```bash
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
```

3. **Restart your development server**

## ✅ Step 5: Test the Connection

1. **Build your app**: `npm run build`
2. **Check the console** for any Supabase connection errors
3. **If successful**, you'll see the sample data from the database

## 🔍 What We Just Created:

- **5 database tables** for career data
- **Automatic timestamps** for data freshness
- **Performance indexes** for fast queries
- **Sample data** to test with
- **Type-safe interfaces** for your app

## 🎯 Next Steps:

Once this is working, we'll move to:
- **Step 2**: Chat2API integration
- **Step 3**: Update your app to use real data

## 🆘 Troubleshooting:

- **"Missing Supabase environment variables"**: Check your `.env` file
- **Connection errors**: Verify your URL and key are correct
- **Table not found**: Run the SQL script again
- **Build errors**: Make sure you restarted the dev server

---

**Ready to move to Step 2?** Let me know when you've completed this setup and we can test the connection! 🚀
