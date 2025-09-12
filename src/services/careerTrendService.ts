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

  private constructor() {}

  public static getInstance(): CareerTrendService {
    if (!CareerTrendService.instance) {
      CareerTrendService.instance = new CareerTrendService();
    }
    return CareerTrendService.instance;
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

      // Fetch from Supabase
      const { data, error } = await supabase
        .from('career_trends')
        .select('*')
        .eq('career_id', careerId)
        .single();

      if (error) {
        console.warn(`No trend data found for career ${careerId}:`, error.message);
        return null;
      }

      const trendData: CareerTrendData = {
        career_id: data.career_id,
        trend_score: data.trend_score,
        trend_direction: data.trend_direction,
        demand_level: data.demand_level,
        growth_rate: data.growth_rate,
        market_insights: data.market_insights,
        key_skills_trending: data.key_skills_trending || [],
        salary_trend: data.salary_trend,
        job_availability_score: data.job_availability_score,
        top_locations: data.top_locations || [],
        remote_work_trend: data.remote_work_trend,
        industry_impact: data.industry_impact,
        automation_risk: data.automation_risk,
        future_outlook: data.future_outlook,
        confidence_score: data.confidence_score,
        last_updated: data.last_updated
      };

      // Cache the result
      this.cache.set(careerId, trendData);
      this.cacheExpiry.set(careerId, Date.now() + this.CACHE_TTL);

      return trendData;
    } catch (error) {
      console.error('Failed to get career trend:', error);
      return null;
    }
  }

  /**
   * Get industry trend data
   */
  async getIndustryTrend(industry: string): Promise<IndustryTrendData | null> {
    try {
      const { data, error } = await supabase
        .from('industry_trends')
        .select('*')
        .eq('industry', industry)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.warn(`No industry trend data found for ${industry}:`, error.message);
        return null;
      }

      return {
        industry: data.industry,
        avg_trend_score: data.avg_trend_score,
        total_careers: data.total_careers,
        rising_careers: data.rising_careers,
        stable_careers: data.stable_careers,
        declining_careers: data.declining_careers,
        top_trending_careers: data.top_trending_careers || [],
        emerging_skills: data.emerging_skills || [],
        last_updated: data.updated_at
      };
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
