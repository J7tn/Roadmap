# Translation Update Guide

This guide provides comprehensive instructions for updating translations in the Careering app to avoid the issues we encountered with settings panel translations.

## Table of Contents
1. [Overview](#overview)
2. [Translation System Architecture](#translation-system-architecture)
3. [Common Issues and Solutions](#common-issues-and-solutions)
4. [Step-by-Step Update Process](#step-by-step-update-process)
5. [Testing Procedures](#testing-procedures)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Overview

The Careering app uses a dynamic translation system that loads translations from Supabase. The system includes:
- **Caching**: 24-hour cache to improve performance
- **Version Control**: Each translation update gets a new version number
- **Force Refresh**: Ability to bypass cache when needed
- **Fallback**: English translations as fallback

## Translation System Architecture

### Database Structure
- **Table**: `translations`
- **Key Fields**:
  - `language_code`: Language identifier (e.g., 'en', 'es', 'fr')
  - `translation_data`: JSON object containing all translations
  - `version`: Timestamp-based version number
  - `is_active`: Boolean flag for active translations
  - `updated_at`: Last update timestamp

### Translation Data Structure
```json
{
  "app": { ... },
  "pages": {
    "home": { ... },
    "search": { ... },
    "settings": { ... },
    "assessment": { ... }
  },
  "common": { ... },
  "errors": { ... },
  "skills": { ... },
  "buttons": { ... },
  "navigation": { ... }
}
```

### Supported Languages
- `en` - English (fallback)
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese
- `ru` - Russian
- `ar` - Arabic

## Common Issues and Solutions

### Issue 1: Settings Panel Not Translating
**Symptoms**: Settings panel remains in English when switching languages
**Root Cause**: Missing `settings` section in translation data or old version being cached
**Solution**: Update translation data with new version number

### Issue 2: Old Translations Being Loaded
**Symptoms**: App loads old translations despite database updates
**Root Cause**: Version-based loading system loads latest version, but old versions don't have new content
**Solution**: Update existing records with new version numbers

### Issue 3: Cache Issues
**Symptoms**: Changes not reflected immediately
**Root Cause**: 24-hour cache prevents fresh data loading
**Solution**: Use force refresh mechanism or clear cache

## Step-by-Step Update Process

### 1. Identify What Needs Translation
- Check which sections are missing translations
- Verify translation keys in the code
- Compare with English fallback file (`src/locales/en.json`)

### 2. Prepare Translation Data
Create a script with the new translations:

```javascript
const newTranslations = {
  "sectionName": {
    "key1": "translated_value_1",
    "key2": "translated_value_2"
  }
};
```

### 3. Update Database

#### Option A: Using Service Role Key (Recommended for Admin Updates)
**⚠️ IMPORTANT**: For administrative translation updates, you must use the Supabase service role key to bypass RLS policies.

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use service role key to bypass RLS policies
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Service role key, not anon key
);
```

#### Option B: Using Anon Key (Limited Updates)
```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);
```

async function updateTranslations(languageCode, newTranslations) {
  // Get current data
  const { data: currentData } = await supabase
    .from('translations')
    .select('translation_data, version')
    .eq('language_code', languageCode)
    .eq('is_active', true)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  // Merge new translations
  const updatedData = {
    ...currentData.translation_data,
    ...newTranslations
  };

  // Update with new version
  const newVersion = `${Date.now()}`;
  await supabase
    .from('translations')
    .update({
      translation_data: updatedData,
      version: newVersion,
      updated_at: new Date().toISOString()
    })
    .eq('language_code', languageCode)
    .eq('is_active', true);
}
```

### 4. Build and Sync
```bash
npm run build
npx cap sync
```

### 5. Test
- Change language in settings
- Verify translations appear correctly
- Check console logs for any warnings

## Testing Procedures

### 1. Console Log Verification
Look for these log messages:
```
✅ Settings translations available: 30 keys
```
Instead of:
```
⚠️ Settings translations not found for [language]
```

### 2. Visual Testing
- Navigate to Settings page
- Change language
- Verify all text appears in selected language
- Check all sections: Language, Notifications, Appearance, About

### 3. Force Refresh Testing
- Clear app cache
- Change language
- Verify fresh translations load

## Troubleshooting

### Problem: Translations Not Loading
**Check**:
1. Supabase connection
2. Environment variables
3. Database permissions
4. Version numbers

### Problem: Cache Issues
**Solutions**:
1. Use force refresh in language switching
2. Clear browser cache
3. Restart app

### Problem: Missing Translation Keys
**Check**:
1. Compare with English fallback
2. Verify key names match exactly
3. Check for typos in translation data

### Problem: RLS Policy Errors
**Symptoms**: 
- Error: `new row violates row-level security policy for table "translations"`
- Error: `there is no unique or exclusion constraint matching the ON CONFLICT specification`
- Updates appear successful but don't persist in database

**Root Cause**: Supabase Row Level Security (RLS) policies prevent updates to the translations table

**Solutions**:
1. **Use Service Role Key** (Recommended): Bypass RLS policies for administrative updates
2. Update existing records instead of inserting new ones
3. Check Supabase RLS policies and permissions

## Environment Variables Required

### For Translation Updates
You need these environment variables in your `.env` file:

```bash
# Required for all operations
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Required for administrative translation updates (bypasses RLS)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ Security Note**: The service role key has full database access and bypasses RLS policies. Only use it for administrative operations and never commit it to version control.

## Best Practices

### 1. Version Management
- Always use timestamp-based version numbers
- Update version when making changes
- Keep old versions for rollback if needed

### 2. Security and Access Control
- **Always use service role key for administrative translation updates**
- Never commit service role key to version control
- Use anon key only for read operations or limited updates
- Test updates in development before production

### 3. Translation Keys
- Use consistent naming conventions
- Keep keys descriptive but concise
- Group related keys logically

### 4. Testing
- Test all languages after updates
- Verify console logs
- Check both light and dark themes

### 5. Documentation
- Document new translation keys
- Update this guide when adding new sections
- Keep translation templates up to date

### 6. Error Handling
- Always include fallback to English
- Log translation loading errors
- Provide user feedback for failed loads

## Quick Reference Commands

### Check Current Translations
```bash
# Using anon key (read-only)
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
supabase.from('translations').select('language_code, version, updated_at').eq('is_active', true).then(console.log);
"

# Using service role key (full access)
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('translations').select('language_code, version, updated_at').eq('is_active', true).then(console.log);
"
```

### Build and Deploy
```bash
npm run build && npx cap sync
```

### Clear Cache (if needed)
```bash
# Clear browser cache or restart app
```

## Emergency Procedures

### If All Translations Break
1. Check Supabase connection
2. Verify environment variables
3. Check if English fallback is working
4. Restore from backup if needed

### If Specific Language Fails
1. Check that language's translation data
2. Verify version number
3. Test with force refresh
4. Fall back to English temporarily

---

**Last Updated**: 2025-01-22
**Version**: 1.0
**Maintainer**: Development Team
