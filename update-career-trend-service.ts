// Updated CareerTrendService to use language-specific trend data
// This is the updated version of src/services/careerTrendService.ts

import { supabase } from '@/lib/supabase';

export interface CareerTrendData {
  career_id: string;
  trend_score: number;
  trend_direction: 'rising' | 'stable' | 'declining';
  demand_level: 'high' | 'medium' | 'low';
  growth_rate: number;
  market_insights: string;
  key_skills_trending: string[];
  salary_trend: string;
  job_availability_score: number;
  top_locations: string[];
  remote_work_trend: number;
  industry_impact: string;
  automation_risk: number;
  future_outlook: string;
  confidence_score: number;
  last_updated: string;
  language_code?: string; // Add language code to track which language was used
}

export interface IndustryTrendData {
  industry: string;
  avg_trend_score: number;
  total_careers: number;
  rising_careers: number;
  stable_careers: number;
  declining_careers: number;
  top_trending_careers: string[];
  emerging_skills: string[];
  last_updated: string;
  language_code?: string; // Add language code to track which language was used
}

export interface TrendingCareer {
  career_id: string;
  title: string;
  industry: string;
  trend_score: number;
  trend_direction: 'rising' | 'stable' | 'declining';
  demand_level: 'high' | 'medium' | 'low';
  growth_rate: number;
  market_insights: string;
}

class CareerTrendService {
  private static instance: CareerTrendService;
  private cache = new Map<string, CareerTrendData>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private currentLanguage: string = 'en'; // Default language

  private constructor() {}

  public static getInstance(): CareerTrendService {
    if (!CareerTrendService.instance) {
      CareerTrendService.instance = new CareerTrendService();
    }
    return CareerTrendService.instance;
  }

  /**
   * Set the current language for trend data
   */
  public setLanguage(language: string): void {
    this.currentLanguage = language;
    // Clear cache when language changes
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Map local career IDs to trend data career IDs
   */
  private getTrendCareerId(localCareerId: string): string {
    // Most careers now have their own unique trend data!
    // Only use fallback mapping for careers that might not have trend data yet
    const fallbackMapping: Record<string, string> = {
      // Keep minimal fallbacks for edge cases
      'junior-dev': 'software-engineer',
      'mid-dev': 'software-engineer', 
      'senior-dev': 'software-engineer',
      'tech-lead': 'software-engineer',
      'data-analyst': 'data-scientist',
      'global-junior-dev': 'software-engineer',
      'global-mid-dev': 'software-engineer'
    };
    
    // First try the career's own ID, then fallback to mapping
    return fallbackMapping[localCareerId] || localCareerId;
  }

  /**
   * Get trend data for a specific career with language-specific translations
   */
  async getCareerTrend(careerId: string): Promise<CareerTrendData | null> {
    try {
      // Create cache key that includes language
      const cacheKey = `${careerId}_${this.currentLanguage}`;
      
      // Check cache first
      if (this.isCached(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }

      // Map local career ID to trend data career ID
      const trendCareerId = this.getTrendCareerId(careerId);
      console.log('🔍 Mapping career ID:', careerId, '→', trendCareerId, 'for language:', this.currentLanguage);
      
      // Fetch from Supabase with language-specific translations
      console.log('🔍 Querying career_trends_with_translations view for career_id:', trendCareerId, 'language:', this.currentLanguage);
      
      const { data, error } = await supabase
        .from('career_trends_with_translations')
        .select('*')
        .eq('career_id', trendCareerId)
        .eq('language_code', this.currentLanguage)
        .limit(1);

      console.log('📊 Supabase query result:', { data, error });

      if (error) {
        console.warn(`No trend data found for career ${careerId} in language ${this.currentLanguage}:`, error.message);
        
        // Fallback to English if current language fails
        if (this.currentLanguage !== 'en') {
          console.log('🔄 Falling back to English trend data...');
          const { data: englishData, error: englishError } = await supabase
            .from('career_trends_with_translations')
            .select('*')
            .eq('career_id', trendCareerId)
            .eq('language_code', 'en')
            .limit(1);
            
          if (englishError || !englishData || englishData.length === 0) {
            console.warn(`No English fallback trend data found for career ${careerId}`);
            return null;
          }
          
          const trendRecord = englishData[0];
          const trendData = this.formatTrendData(trendRecord, 'en');
          this.cache.set(cacheKey, trendData);
          this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL);
          return trendData;
        }
        
        return null;
      }

      if (!data || data.length === 0) {
        console.warn(`No trend data found for career ${careerId} in language ${this.currentLanguage}: No records found`);
        
        // Fallback to English if current language fails
        if (this.currentLanguage !== 'en') {
          console.log('🔄 Falling back to English trend data...');
          const { data: englishData, error: englishError } = await supabase
            .from('career_trends_with_translations')
            .select('*')
            .eq('career_id', trendCareerId)
            .eq('language_code', 'en')
            .limit(1);
            
          if (englishError || !englishData || englishData.length === 0) {
            console.warn(`No English fallback trend data found for career ${careerId}`);
            return null;
          }
          
          const trendRecord = englishData[0];
          const trendData = this.formatTrendData(trendRecord, 'en');
          this.cache.set(cacheKey, trendData);
          this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL);
          return trendData;
        }
        
        return null;
      }

      // Get the first record if multiple exist
      const trendRecord = Array.isArray(data) ? data[0] : data;
      const trendData = this.formatTrendData(trendRecord, this.currentLanguage);

      // Cache the result using the cache key with language
      this.cache.set(cacheKey, trendData);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL);

      return trendData;
    } catch (error) {
      console.error('Failed to get career trend:', error);
      return null;
    }
  }

  /**
   * Format trend data from database record
   */
  private formatTrendData(trendRecord: any, languageCode: string): CareerTrendData {
    return {
      career_id: trendRecord.career_id,
      trend_score: trendRecord.trend_score,
      trend_direction: trendRecord.trend_direction,
      demand_level: trendRecord.demand_level,
      growth_rate: trendRecord.growth_rate,
      market_insights: trendRecord.market_insights || 'No market insights available',
      key_skills_trending: trendRecord.key_skills_trending || [],
      salary_trend: trendRecord.salary_trend || 'No salary trend data available',
      job_availability_score: trendRecord.job_availability_score,
      top_locations: trendRecord.top_locations || [],
      remote_work_trend: trendRecord.remote_work_trend,
      industry_impact: trendRecord.industry_impact || 'No industry impact data available',
      automation_risk: trendRecord.automation_risk,
      future_outlook: trendRecord.future_outlook || 'No future outlook data available',
      confidence_score: trendRecord.confidence_score,
      last_updated: trendRecord.last_updated,
      language_code: languageCode
    };
  }

  /**
   * Get all career IDs that have trend data
   */
  async getAllTrendCareerIds(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('career_trends')
        .select('career_id');

      if (error) {
        console.error('Error fetching trend career IDs:', error);
        return [];
      }

      return data.map(record => record.career_id);
    } catch (error) {
      console.error('Failed to get trend career IDs:', error);
      return [];
    }
  }

  /**
   * Get industry trend data with language-specific translations
   */
  async getIndustryTrend(industry: string): Promise<IndustryTrendData | null> {
    try {
      const cacheKey = `industry_${industry}_${this.currentLanguage}`;
      
      // Check cache first
      if (this.isCached(cacheKey)) {
        return this.cache.get(cacheKey) as IndustryTrendData;
      }

      console.log('🔍 Querying industry_trends_with_translations for industry:', industry, 'language:', this.currentLanguage);
      
      const { data, error } = await supabase
        .from('industry_trends_with_translations')
        .select('*')
        .eq('industry', industry)
        .eq('language_code', this.currentLanguage)
        .limit(1);

      if (error) {
        console.warn(`No industry trend data found for ${industry} in language ${this.currentLanguage}:`, error.message);
        
        // Fallback to English
        if (this.currentLanguage !== 'en') {
          const { data: englishData, error: englishError } = await supabase
            .from('industry_trends_with_translations')
            .select('*')
            .eq('industry', industry)
            .eq('language_code', 'en')
            .limit(1);
            
          if (englishError || !englishData || englishData.length === 0) {
            return null;
          }
          
          const trendRecord = englishData[0];
          const trendData = this.formatIndustryTrendData(trendRecord, 'en');
          this.cache.set(cacheKey, trendData);
          this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL);
          return trendData;
        }
        
        return null;
      }

      if (!data || data.length === 0) {
        console.warn(`No industry trend data found for ${industry} in language ${this.currentLanguage}`);
        return null;
      }

      const trendRecord = data[0];
      const trendData = this.formatIndustryTrendData(trendRecord, this.currentLanguage);

      // Cache the result
      this.cache.set(cacheKey, trendData);
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_TTL);

      return trendData;
    } catch (error) {
      console.error('Failed to get industry trend:', error);
      return null;
    }
  }

  /**
   * Format industry trend data from database record
   */
  private formatIndustryTrendData(trendRecord: any, languageCode: string): IndustryTrendData {
    return {
      industry: trendRecord.industry,
      avg_trend_score: trendRecord.avg_trend_score,
      total_careers: trendRecord.total_careers,
      rising_careers: trendRecord.rising_careers,
      stable_careers: trendRecord.stable_careers,
      declining_careers: trendRecord.declining_careers,
      top_trending_careers: trendRecord.top_trending_careers || [],
      emerging_skills: trendRecord.emerging_skills || [],
      last_updated: trendRecord.last_updated,
      language_code: languageCode
    };
  }

  /**
   * Check if data is cached and not expired
   */
  private isCached(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * Clear all cached data
   */
  public clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

export const careerTrendService = new CareerTrendService();
