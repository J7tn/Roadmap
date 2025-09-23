import { supabase } from '@/lib/supabase';

export interface TranslationData {
  [key: string]: any;
}

export interface TranslationRecord {
  language_code: string;
  translation_data: TranslationData;
  version: string;
  updated_at: string;
}

class TranslationService {
  private static instance: TranslationService;
  private cache: Map<string, TranslationData> = new Map();
  private cacheTimestamp: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {}

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  /**
   * Get device language with fallback logic
   */
  public getDeviceLanguage(): string {
    // Get language from navigator
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    // Extract language code (e.g., 'en-US' -> 'en')
    const languageCode = browserLang.split('-')[0].toLowerCase();
    
    // List of supported languages
    const supportedLanguages = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar', 'it'];
    
    // Check if the detected language is supported
    if (supportedLanguages.includes(languageCode)) {
      return languageCode;
    }
    
    // Fallback to English if not supported
    return 'en';
  }

  /**
   * Check if translation is cached and still valid
   */
  private isCacheValid(languageCode: string): boolean {
    const timestamp = this.cacheTimestamp.get(languageCode);
    if (!timestamp) return false;
    
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Download translation data from Supabase
   */
  public async downloadTranslation(languageCode: string): Promise<TranslationData> {
    try {
      console.log(`Downloading translations for language: ${languageCode}`);
      
      const { data, error } = await supabase
        .from('translations')
        .select('translation_data, version, updated_at')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error downloading translations:', error);
        throw new Error(`Failed to download translations for ${languageCode}: ${error.message}`);
      }

      if (!data) {
        throw new Error(`No translations found for language: ${languageCode}`);
      }

      console.log(`Successfully downloaded translations for ${languageCode} (version: ${data.version})`);
      
      // Cache the translation data
      this.cache.set(languageCode, data.translation_data);
      this.cacheTimestamp.set(languageCode, Date.now());
      
      return data.translation_data;
    } catch (error) {
      console.error('Translation download failed:', error);
      
      // If download fails and we have cached data, return cached data
      if (this.cache.has(languageCode)) {
        console.warn(`Using cached translations for ${languageCode} due to download failure`);
        return this.cache.get(languageCode)!;
      }
      
      // If no cache and download fails, throw error
      throw error;
    }
  }

  /**
   * Get translation data with caching
   */
  public async getTranslation(languageCode: string, forceRefresh: boolean = false): Promise<TranslationData> {
    // Check cache first (unless force refresh is requested)
    if (!forceRefresh && this.cache.has(languageCode) && this.isCacheValid(languageCode)) {
      console.log(`Using cached translations for ${languageCode}`);
      return this.cache.get(languageCode)!;
    }

    // Download fresh data
    return await this.downloadTranslation(languageCode);
  }

  /**
   * Clear cache for a specific language or all languages
   */
  public clearCache(languageCode?: string): void {
    if (languageCode) {
      this.cache.delete(languageCode);
      this.cacheTimestamp.delete(languageCode);
      console.log(`Cleared cache for language: ${languageCode}`);
    } else {
      this.cache.clear();
      this.cacheTimestamp.clear();
      console.log('Cleared all translation cache');
    }
  }

  /**
   * Get all available languages from Supabase
   */
  public async getAvailableLanguages(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('language_code')
        .eq('is_active', true)
        .order('language_code');

      if (error) {
        console.error('Error fetching available languages:', error);
        return ['en']; // Fallback to English
      }

      return data.map(record => record.language_code);
    } catch (error) {
      console.error('Failed to fetch available languages:', error);
      return ['en']; // Fallback to English
    }
  }

  /**
   * Preload translations for multiple languages
   */
  public async preloadTranslations(languageCodes: string[]): Promise<void> {
    const promises = languageCodes.map(async (code) => {
      try {
        await this.getTranslation(code);
        console.log(`Preloaded translations for ${code}`);
      } catch (error) {
        console.warn(`Failed to preload translations for ${code}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Check if a language is supported
   */
  public async isLanguageSupported(languageCode: string): Promise<boolean> {
    const availableLanguages = await this.getAvailableLanguages();
    return availableLanguages.includes(languageCode);
  }

  /**
   * Get translation version info
   */
  public async getTranslationVersion(languageCode: string): Promise<{ version: string; updated_at: string } | null> {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('version, updated_at')
        .eq('language_code', languageCode)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        version: data.version,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching translation version:', error);
      return null;
    }
  }
}

export const translationService = TranslationService.getInstance();
export default translationService;
