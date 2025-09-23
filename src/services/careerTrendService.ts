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
    console.log(`CareerTrendService language set to: ${this.currentLanguage}`);
    // Clear cache when language changes to ensure fresh data
    this.clearCache();
  }

  /**
   * Get the current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Format trend data from database record
   */
  private formatTrendData(trendRecord: any, originalCareerId: string): CareerTrendData {
    return {
      career_id: trendRecord.career_id,
      trend_score: trendRecord.trend_score,
      trend_direction: trendRecord.trend_direction,
      demand_level: trendRecord.demand_level,
      growth_rate: trendRecord.growth_rate,
      // Use translated fields if available, otherwise fall back to original fields
      market_insights: trendRecord.market_insights_translated || trendRecord.market_insights,
      key_skills_trending: trendRecord.key_skills_trending_translated || trendRecord.key_skills_trending || [],
      salary_trend: trendRecord.salary_trend_translated || trendRecord.salary_trend,
      job_availability_score: trendRecord.job_availability_score,
      top_locations: trendRecord.top_locations_translated || trendRecord.top_locations || [],
      remote_work_trend: trendRecord.remote_work_trend,
      industry_impact: trendRecord.industry_impact_translated || trendRecord.industry_impact,
      automation_risk: trendRecord.automation_risk,
      future_outlook: trendRecord.future_outlook_translated || trendRecord.future_outlook,
      confidence_score: trendRecord.confidence_score,
      last_updated: trendRecord.last_updated
    };
  }

  /**
   * Format industry trend data from database record
   */
  private formatIndustryTrendData(data: any): IndustryTrendData {
    return {
      industry: data.industry,
      avg_trend_score: data.avg_trend_score,
      total_careers: data.total_careers,
      rising_careers: data.rising_careers,
      stable_careers: data.stable_careers,
      declining_careers: data.declining_careers,
      top_trending_careers: data.top_trending_careers || [],
      emerging_skills: data.emerging_skills || [],
      last_updated: data.last_updated
    };
  }

  /**
   * Map local career IDs to trend data career IDs
   */
  private getTrendCareerId(localCareerId: string): string {
    // Now we have 239+ careers with unique trend data in Supabase!
    // Each career should use its own ID for trend data
    
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
   * Get trend data for a specific career
   */
  async getCareerTrend(careerId: string): Promise<CareerTrendData | null> {
    try {
      // Check cache first
      if (this.isCached(careerId)) {
        return this.cache.get(careerId)!;
      }

      // Map local career ID to trend data career ID
      const trendCareerId = this.getTrendCareerId(careerId);
      console.log('🔍 Mapping career ID:', careerId, '→', trendCareerId);
      
      // Fetch from Supabase using multilingual view
      console.log('🔍 Querying career_trends_with_translations view for career_id:', trendCareerId, 'language:', this.currentLanguage);
      const { data, error } = await supabase
        .from('career_trends_with_translations')
        .select('*')
        .eq('career_id', trendCareerId)
        .eq('language_code', this.currentLanguage)
        .limit(1);

      console.log('📊 Supabase query result:', { data, error });

      if (error) {
        console.warn(`No trend data found for career ${careerId} in ${this.currentLanguage}:`, error.message);
        // Try fallback to English if current language is not English
        if (this.currentLanguage !== 'en') {
          console.log('🔄 Falling back to English trend data...');
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('career_trends_with_translations')
            .select('*')
            .eq('career_id', trendCareerId)
            .eq('language_code', 'en')
            .limit(1);
          
          if (fallbackError || !fallbackData || fallbackData.length === 0) {
            console.warn(`No English fallback trend data found for career ${careerId}`);
            return null;
          }
          
          // Use fallback data
          const fallbackRecord = Array.isArray(fallbackData) ? fallbackData[0] : fallbackData;
          return this.formatTrendData(fallbackRecord, careerId);
        }
        return null;
      }

      if (!data || data.length === 0) {
        console.warn(`No trend data found for career ${careerId} in ${this.currentLanguage}: No records found`);
        // Try fallback to English if current language is not English
        if (this.currentLanguage !== 'en') {
          console.log('🔄 Falling back to English trend data...');
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('career_trends_with_translations')
            .select('*')
            .eq('career_id', trendCareerId)
            .eq('language_code', 'en')
            .limit(1);
          
          if (fallbackError || !fallbackData || fallbackData.length === 0) {
            console.warn(`No English fallback trend data found for career ${careerId}`);
            return null;
          }
          
          // Use fallback data
          const fallbackRecord = Array.isArray(fallbackData) ? fallbackData[0] : fallbackData;
          return this.formatTrendData(fallbackRecord, careerId);
        }
        return null;
      }

      // Get the first record if multiple exist
      const trendRecord = Array.isArray(data) ? data[0] : data;
      const trendData = this.formatTrendData(trendRecord, careerId);

      // Cache the result using the original career ID
      this.cache.set(careerId, trendData);
      this.cacheExpiry.set(careerId, Date.now() + this.CACHE_TTL);

      return trendData;
    } catch (error) {
      console.error('Failed to get career trend:', error);
      return null;
    }
  }

  /**
   * Get all available career IDs with trend data (for debugging)
   */
  async getAllTrendCareerIds(): Promise<string[]> {
    try {
      console.log('🔍 Fetching all career IDs with trend data...');
      const { data, error } = await supabase
        .from('career_trends')
        .select('career_id');

      if (error) {
        console.error('Failed to fetch career IDs:', error);
        return [];
      }

      const careerIds = data.map(row => row.career_id);
      console.log('📊 Available career IDs with trend data:', careerIds);
      return careerIds;
    } catch (error) {
      console.error('Failed to get career IDs:', error);
      return [];
    }
  }

  /**
   * Get industry trend data
   */
  async getIndustryTrend(industry: string): Promise<IndustryTrendData | null> {
    try {
      // Try to get translated industry trend data first
      const { data, error } = await supabase
        .from('industry_trends_with_translations')
        .select('*')
        .eq('industry', industry)
        .eq('language_code', this.currentLanguage)
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.warn(`No industry trend data found for ${industry} in ${this.currentLanguage}:`, error.message);
        // Try fallback to English if current language is not English
        if (this.currentLanguage !== 'en') {
          console.log('🔄 Falling back to English industry trend data...');
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('industry_trends_with_translations')
            .select('*')
            .eq('industry', industry)
            .eq('language_code', 'en')
            .order('last_updated', { ascending: false })
            .limit(1)
            .single();
          
          if (fallbackError) {
            console.warn(`No English fallback industry trend data found for ${industry}:`, fallbackError.message);
            return null;
          }
          
          return this.formatIndustryTrendData(fallbackData);
        }
        return null;
      }

      return this.formatIndustryTrendData(data);
    } catch (error) {
      console.error('Failed to get industry trend:', error);
      return null;
    }
  }

  /**
   * Get trending careers across all industries
   */
  async getTrendingCareers(limit: number = 20): Promise<TrendingCareer[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_trending_careers', { limit_count: limit });

      if (error) {
        console.error('Failed to get trending careers:', error);
        return [];
      }

      return data.map((career: any) => ({
        career_id: career.career_id,
        title: career.title,
        industry: career.industry,
        trend_score: career.trend_score,
        trend_direction: career.trend_direction,
        demand_level: career.demand_level,
        growth_rate: career.growth_rate,
        market_insights: career.market_insights
      }));
    } catch (error) {
      console.error('Failed to get trending careers:', error);
      return [];
    }
  }

  /**
   * Get career trend history
   */
  async getCareerTrendHistory(careerId: string, months: number = 12): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('career_trend_history')
        .select('*')
        .eq('career_id', careerId)
        .order('created_at', { ascending: false })
        .limit(months);

      if (error) {
        console.error('Failed to get career trend history:', error);
        return [];
      }

      return data.map(item => ({
        month_year: item.month_year,
        trend_data: item.trend_data,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Failed to get career trend history:', error);
      return [];
    }
  }

  /**
   * Get trend summary for a career
   */
  async getCareerTrendSummary(careerId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('get_career_trend_summary', { career_id_param: careerId });

      if (error) {
        console.error('Failed to get career trend summary:', error);
        return null;
      }

      return data[0] || null;
    } catch (error) {
      console.error('Failed to get career trend summary:', error);
      return null;
    }
  }

  /**
   * Get industry trend summary
   */
  async getIndustryTrendSummary(industry: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('get_industry_trend_summary', { industry_param: industry });

      if (error) {
        console.error('Failed to get industry trend summary:', error);
        return null;
      }

      return data[0] || null;
    } catch (error) {
      console.error('Failed to get industry trend summary:', error);
      return null;
    }
  }

  /**
   * Check if data is cached and not expired
   */
  private isCached(careerId: string): boolean {
    const expiry = this.cacheExpiry.get(careerId);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export const careerTrendService = CareerTrendService.getInstance();

/**
 * Set the language for career trend service
 */
export const setCareerTrendLanguage = (language: string) => careerTrendService.setLanguage(language);
