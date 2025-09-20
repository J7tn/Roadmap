# 📤 Upload English Translations to Supabase

This guide will help you upload your local English translations to the Supabase translations table so your app can load them from the database.

## 🎯 What This Does

- ✅ **Reads your local `src/locales/en.json` file**
- ✅ **Uploads it to Supabase translations table**
- ✅ **Makes translations available to your app**
- ✅ **Fixes the translation key display issue**

## 📋 Prerequisites

1. **Node.js installed** (for running the upload script)
2. **Supabase project set up** with translations table
3. **Environment variables configured** in your `.env` file

## 🚀 Step 1: Create the Translations Table

First, you need to create the translations table in your Supabase database:

### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `create-translations-table.sql`
4. Click **Run** to execute the SQL

### Option B: Using Supabase CLI
```bash
supabase db reset
# Then run the SQL file
```

## 🔧 Step 2: Set Up Environment Variables

Make sure your `.env` file contains:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📤 Step 3: Upload Translations

### Option A: Using PowerShell (Recommended for Windows)
```powershell
.\upload-translations.ps1
```

### Option B: Using Batch File
```cmd
upload-translations.bat
```

### Option C: Direct Node.js Command
```bash
node upload-english-translations.cjs
```

## 📊 What Happens During Upload

1. **Reads** your local `src/locales/en.json` file
2. **Checks** if translations table exists
3. **Verifies** if English translations already exist
4. **Uploads** the translation data to Supabase
5. **Verifies** the upload was successful

## 🎯 Expected Output

You should see something like:
```
🚀 Starting English translations upload...
📖 Loaded English translations from local file
📊 Translation keys loaded: 15 main categories
✅ Translations table is accessible
📤 Uploading English translations to Supabase...
📊 Version: 1
📊 Translation keys: 15 main categories
✅ Successfully uploaded English translations to Supabase!
🎉 English translations are now available in Supabase!
```

## 🔍 Verify the Upload

After uploading, you can verify in your Supabase dashboard:

1. **Go to Table Editor**
2. **Select the `translations` table**
3. **You should see a row with:**
   - `language_code`: "en"
   - `is_active`: true
   - `translation_data`: (large JSON object)

## 🎉 Result

After successful upload:
- ✅ **Your app will load translations from Supabase**
- ✅ **Translation keys will show proper English text**
- ✅ **Search page filters will display correctly**
- ✅ **All UI text will be properly translated**

## 🚨 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check your `.env` file has the correct variables
- Make sure variable names start with `VITE_`

### Error: "Translations table not found"
- Run the `create-translations-table.sql` script first
- Check your Supabase project is accessible

### Error: "Node.js not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Error: "Permission denied"
- Make sure your Supabase anon key has read/write access
- Check your RLS policies are set up correctly

## 🔄 Updating Translations

To update translations later:
1. **Modify** your local `src/locales/en.json` file
2. **Run the upload script again**
3. **The script will increment the version number**

## 📱 Testing

After upload:
1. **Refresh your app**
2. **Go to the search page**
3. **Check that filters show proper English text** instead of translation keys
4. **All UI elements should display correctly**

## 🎯 Next Steps

Once English translations are working:
- ✅ **Your app will work properly with English text**
- ✅ **You can add other language translations later**
- ✅ **The monthly update system will handle translations automatically**
- ✅ **Your cloud deployment will work with proper translations**

Your translation system is now fully functional! 🚀
