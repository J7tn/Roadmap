import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { setCareerLanguage } from '@/services/careerService';
import dynamicI18n from '@/lib/dynamicI18n';
import { translationService } from '@/services/translationService';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => Promise<void>;
  availableLanguages: { code: string; name: string; nativeName: string }[];
  isRTL: boolean;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

// RTL languages
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to detect device language
  const detectDeviceLanguage = (): string => {
    return translationService.getDeviceLanguage();
  };

  // Initialize language on app start
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        setIsLoading(true);
        
        // Wait for dynamic i18n to be ready
        await dynamicI18n.waitForReady();
        
        const savedLanguage = localStorage.getItem('app-language');
        const deviceLanguage = detectDeviceLanguage();
        
        // Use saved language if available, otherwise use device language
        const initialLanguage = savedLanguage || deviceLanguage;
        
        // Load the language translations
        await dynamicI18n.changeLanguage(initialLanguage);
        
        setCurrentLanguage(initialLanguage);
        
        // Set career data language
        setCareerLanguage(initialLanguage);
        
        // Save the detected/set language
        localStorage.setItem('app-language', initialLanguage);
        
        console.log(`Language initialized: ${initialLanguage}`);
      } catch (error) {
        console.error('Failed to initialize language:', error);
        // Fallback to English
        setCurrentLanguage('en');
        setCareerLanguage('en');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = useCallback(async (language: string) => {
    try {
      setIsLoading(true);
      
      // Load the language translations
      await dynamicI18n.changeLanguage(language);
      
      setCurrentLanguage(language);
      localStorage.setItem('app-language', language);
      
      // Update career data language
      setCareerLanguage(language);
      
      // Update document direction for RTL languages
      const isRTL = rtlLanguages.includes(language);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      
      console.log(`Language changed to: ${language}`);
    } catch (error) {
      console.error(`Failed to change language to ${language}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isRTL = rtlLanguages.includes(currentLanguage);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    availableLanguages,
    isRTL,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
