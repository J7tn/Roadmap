import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translationService } from '@/services/translationService';

// Import local English translations as fallback
import enTranslations from '../locales/en.json';

// Fallback translations (comprehensive English set for initial load)
const fallbackTranslations = {
  en: {
    translation: enTranslations
  }
};

class DynamicI18n {
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.initializeI18n();
  }

  private async initializeI18n(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('Initializing dynamic i18n...');

      // Initialize i18n with fallback translations
      await i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          resources: fallbackTranslations,
          fallbackLng: 'en',
          debug: process.env.NODE_ENV === 'development',
          interpolation: {
            escapeValue: false, // react already safes from xss
          },
          detection: {
            order: ['navigator', 'localStorage', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
          },
          react: {
            useSuspense: false, // Disable suspense for dynamic loading
          },
        });

      console.log('i18n initialized with fallback translations');

      // Load device language translations
      await this.loadDeviceLanguageTranslations();

      this.isInitialized = true;
      console.log('Dynamic i18n initialization complete');
    } catch (error) {
      console.error('Failed to initialize dynamic i18n:', error);
      // Continue with fallback translations
      this.isInitialized = true;
    }
  }

  private async loadDeviceLanguageTranslations(): Promise<void> {
    try {
      // Get device language
      const deviceLanguage = translationService.getDeviceLanguage();
      console.log(`Device language detected: ${deviceLanguage}`);

      // Check if we already have this language loaded
      const currentLanguage = i18n.language;
      if (currentLanguage === deviceLanguage && this.hasFullTranslations(deviceLanguage)) {
        console.log(`Language ${deviceLanguage} already loaded with full translations`);
        return;
      }

      // Download and load translations
      await this.loadLanguage(deviceLanguage);
    } catch (error) {
      console.error('Failed to load device language translations:', error);
      // Fallback to English if device language fails
      if (i18n.language !== 'en') {
        await this.loadLanguage('en');
      }
    }
  }

  private hasFullTranslations(languageCode: string): boolean {
    const resources = i18n.getResourceBundle(languageCode, 'translation');
    // Check if we have comprehensive translations (more than just basic keys)
    return resources && (
      resources.marketTrends || 
      resources.careers || 
      resources.pages || 
      resources.assessment ||
      Object.keys(resources).length > 5
    );
  }

  public async loadLanguage(languageCode: string): Promise<void> {
    try {
      console.log(`Loading translations for language: ${languageCode}`);

      // Download translation data from Supabase
      const translationData = await translationService.getTranslation(languageCode);

      // Add to i18n resources
      i18n.addResourceBundle(languageCode, 'translation', translationData, true, true);

      // Change language if it's different from current
      if (i18n.language !== languageCode) {
        await i18n.changeLanguage(languageCode);
      }

      console.log(`Successfully loaded translations for ${languageCode}`);
    } catch (error) {
      console.error(`Failed to load language ${languageCode}:`, error);
      
      // If loading fails and it's not English, try English as fallback
      if (languageCode !== 'en') {
        console.log('Falling back to English translations');
        // Use local English translations as fallback
        i18n.addResourceBundle('en', 'translation', enTranslations, true, true);
        await i18n.changeLanguage('en');
      } else {
        // For English, use local translations if Supabase fails
        console.log('Using local English translations as fallback');
        i18n.addResourceBundle('en', 'translation', enTranslations, true, true);
        await i18n.changeLanguage('en');
      }
    }
  }

  public async changeLanguage(languageCode: string): Promise<void> {
    try {
      // Check if language is already loaded
      if (i18n.hasResourceBundle(languageCode, 'translation') && this.hasFullTranslations(languageCode)) {
        await i18n.changeLanguage(languageCode);
        return;
      }

      // Load language first, then change
      await this.loadLanguage(languageCode);
    } catch (error) {
      console.error(`Failed to change language to ${languageCode}:`, error);
      throw error;
    }
  }

  public async getAvailableLanguages(): Promise<string[]> {
    return await translationService.getAvailableLanguages();
  }

  public async preloadLanguages(languageCodes: string[]): Promise<void> {
    const promises = languageCodes.map(async (code) => {
      try {
        await this.loadLanguage(code);
        console.log(`Preloaded language: ${code}`);
      } catch (error) {
        console.warn(`Failed to preload language ${code}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public async waitForReady(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }
}

// Create singleton instance
const dynamicI18n = new DynamicI18n();

export default dynamicI18n;
export { i18n };
