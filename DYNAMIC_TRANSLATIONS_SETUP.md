# Dynamic Translations Setup Guide

This guide explains how to set up and use the dynamic translation system that downloads language files from Supabase instead of bundling them with the app.

## 🚀 Benefits

- **Reduced app bundle size** - Only downloads needed language files
- **Dynamic updates** - Update translations without app updates
- **Scalable** - Add new languages without increasing bundle size
- **Better performance** - Faster initial app load
- **Offline support** - Cached translations work offline

## 📋 Setup Steps

### 1. Create Supabase Translations Table

Run the SQL script to create the translations table:

```bash
# Execute the SQL script in your Supabase SQL editor
cat create-translations-table.sql
```

This creates:
- `translations` table with language data
- `active_translations` view for easy access
- Proper RLS policies
- Initial English and Spanish translations

### 2. Upload Existing Translation Files

Upload your existing translation files to Supabase:

```bash
# Make sure you have the required environment variables
export VITE_SUPABASE_URL="your-supabase-url"
export VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Run the upload script
node upload-translations-to-supabase.js
```

### 3. Update Environment Variables

Ensure your `.env` file has the Supabase configuration:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🔧 How It Works

### Device Language Detection

The app automatically detects the user's device language:

```typescript
// Detects language from navigator.language
const deviceLanguage = translationService.getDeviceLanguage();
// Returns: 'en', 'es', 'fr', etc.
```

### Dynamic Loading Process

1. **App starts** with minimal fallback translations
2. **Device language detected** automatically
3. **Translations downloaded** from Supabase
4. **App updates** with full translations
5. **Cache stored** for offline use

### Caching Strategy

- **24-hour cache** - Translations cached for 24 hours
- **Offline support** - Cached translations work without internet
- **Automatic refresh** - Cache expires and refreshes automatically

## 📱 User Experience

### First Launch
1. App detects device language (e.g., Spanish)
2. Downloads Spanish translations from Supabase
3. App displays in Spanish
4. Translations cached for future use

### Language Switching
1. User selects new language in settings
2. App downloads new language translations
3. Interface updates immediately
4. New language cached

### Offline Usage
1. App uses cached translations
2. No network requests needed
3. Full functionality maintained

## 🛠️ API Reference

### TranslationService

```typescript
// Get device language
const language = translationService.getDeviceLanguage();

// Download translations
const translations = await translationService.getTranslation('es');

// Get available languages
const languages = await translationService.getAvailableLanguages();

// Clear cache
translationService.clearCache('es'); // specific language
translationService.clearCache(); // all languages
```

### DynamicI18n

```typescript
// Load language
await dynamicI18n.loadLanguage('fr');

// Change language
await dynamicI18n.changeLanguage('de');

// Preload multiple languages
await dynamicI18n.preloadLanguages(['es', 'fr', 'de']);

// Check if ready
const isReady = dynamicI18n.isReady();
```

### LanguageContext

```typescript
const { 
  currentLanguage, 
  setLanguage, 
  availableLanguages, 
  isLoading 
} = useLanguage();

// Change language (async)
await setLanguage('es');
```

## 🔄 Adding New Languages

### 1. Add to Supabase

```sql
INSERT INTO translations (language_code, translation_data, version) VALUES 
('fr', '{"app": {"name": "Careering", ...}}', '1.0.0');
```

### 2. Update Language List

```typescript
// In LanguageContext.tsx
const availableLanguages = [
  // ... existing languages
  { code: 'fr', name: 'French', nativeName: 'Français' },
];
```

### 3. Test

The new language will automatically be available in the app!

## 🐛 Troubleshooting

### Translations Not Loading

1. Check Supabase connection
2. Verify RLS policies
3. Check browser console for errors
4. Ensure translations table has data

### Cache Issues

```typescript
// Clear cache and reload
translationService.clearCache();
window.location.reload();
```

### Network Issues

- App falls back to cached translations
- Shows fallback English if no cache
- Retries automatically when network returns

## 📊 Monitoring

### Check Translation Status

```sql
-- View all active translations
SELECT language_code, version, updated_at 
FROM active_translations 
ORDER BY language_code;
```

### Monitor Downloads

Check browser console for download logs:
```
Downloading translations for language: es
Successfully downloaded translations for es (version: 1.0.0)
```

## 🔒 Security

- **RLS enabled** - Only active translations visible
- **Anonymous access** - No authentication required for reading
- **Version control** - Track translation versions
- **Cache validation** - Prevents stale data

## 🚀 Performance Tips

1. **Preload common languages** on app start
2. **Use cache effectively** - 24-hour duration
3. **Monitor bundle size** - Should be significantly smaller
4. **Test offline scenarios** - Ensure cached translations work

## 📈 Future Enhancements

- **Translation versioning** - Update specific translations
- **A/B testing** - Different translations for testing
- **Analytics** - Track language usage
- **Auto-updates** - Push translation updates
- **Compression** - Compress translation data

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify Supabase configuration
3. Test with a simple language switch
4. Clear cache and retry
5. Check network connectivity

The system is designed to be robust and fallback gracefully, so the app should always work even if translations fail to load.
