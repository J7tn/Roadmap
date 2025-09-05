/**
 * Centralized Application Configuration
 * Manages all environment variables and app settings
 */

export interface AppConfig {
  // Supabase Configuration
  supabase: {
    url: string;
    anonKey: string;
  };
  
  // Chat2API Configuration
  chat2api: {
    url: string;
    key?: string;
  };
  
  // API Keys
  apiKeys: {
    openai?: string;
    googleMaps?: string;
    linkedin?: string;
    indeed?: string;
  };
  
  // App Settings
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
    debug: boolean;
  };
  
  // Performance Settings
  performance: {
    cacheTimeout: number;
    maxCacheSize: number;
    lazyLoadThreshold: number;
  };
  
  // Feature Flags
  features: {
    enableSupabase: boolean;
    enableChat2API: boolean;
    enableNotifications: boolean;
    enableOfflineMode: boolean;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    return {
      supabase: {
        url: this.getEnvVar('VITE_SUPABASE_URL', ''),
        anonKey: this.getEnvVar('VITE_SUPABASE_ANON_KEY', ''),
      },
      
      chat2api: {
        url: this.getEnvVar('VITE_CHAT2API_URL', 'http://localhost:8000'),
        key: this.getEnvVar('VITE_CHAT2API_KEY', ''),
      },
      
      apiKeys: {
        openai: this.getEnvVar('VITE_OPENAI_API_KEY', ''),
        googleMaps: this.getEnvVar('VITE_GOOGLE_MAPS_API_KEY', ''),
        linkedin: this.getEnvVar('VITE_LINKEDIN_API_KEY', ''),
        indeed: this.getEnvVar('VITE_INDEED_API_KEY', ''),
      },
      
      app: {
        name: 'Career Atlas',
        version: '1.0.0',
        environment: this.getEnvVar('NODE_ENV', 'development') as 'development' | 'production' | 'test',
        debug: this.getEnvVar('VITE_DEBUG', 'false') === 'true',
      },
      
      performance: {
        cacheTimeout: parseInt(this.getEnvVar('VITE_CACHE_TIMEOUT', '1800000')), // 30 minutes
        maxCacheSize: parseInt(this.getEnvVar('VITE_MAX_CACHE_SIZE', '50')),
        lazyLoadThreshold: parseInt(this.getEnvVar('VITE_LAZY_LOAD_THRESHOLD', '10')),
      },
      
      features: {
        enableSupabase: this.getEnvVar('VITE_ENABLE_SUPABASE', 'true') === 'true',
        enableChat2API: this.getEnvVar('VITE_ENABLE_CHAT2API', 'true') === 'true',
        enableNotifications: this.getEnvVar('VITE_ENABLE_NOTIFICATIONS', 'true') === 'true',
        enableOfflineMode: this.getEnvVar('VITE_ENABLE_OFFLINE_MODE', 'true') === 'true',
      },
    };
  }

  private getEnvVar(key: string, defaultValue: string): string {
    // Check both import.meta.env (Vite) and process.env (Node.js)
    const value = import.meta.env?.[key] || process.env?.[key] || defaultValue;
    
    if (!value && key.startsWith('VITE_')) {
      console.warn(`Environment variable ${key} is not set`);
    }
    
    return value;
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  public isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  public isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  public isDebugMode(): boolean {
    return this.config.app.debug;
  }

  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required Supabase config
    if (this.isFeatureEnabled('enableSupabase')) {
      if (!this.config.supabase.url) {
        errors.push('VITE_SUPABASE_URL is required when Supabase is enabled');
      }
      if (!this.config.supabase.anonKey) {
        errors.push('VITE_SUPABASE_ANON_KEY is required when Supabase is enabled');
      }
    }

    // Validate Chat2API config
    if (this.isFeatureEnabled('enableChat2API')) {
      if (!this.config.chat2api.url) {
        errors.push('VITE_CHAT2API_URL is required when Chat2API is enabled');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const appConfig = new ConfigManager();

// Export convenience functions
export const getConfig = () => appConfig.getConfig();
export const isFeatureEnabled = (feature: keyof AppConfig['features']) => appConfig.isFeatureEnabled(feature);
export const isDevelopment = () => appConfig.isDevelopment();
export const isProduction = () => appConfig.isProduction();
export const isDebugMode = () => appConfig.isDebugMode();
