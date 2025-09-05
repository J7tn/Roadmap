import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Initialize Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface TrendingSkill {
  id: number;
  skill: string;
  demand: number;
  growth: number;
  salary?: number;
  category?: string;
  created_at: string;
  updated_at: string;
  is_trending: boolean;
  is_declining: boolean;
}

export interface TrendingIndustry {
  id: number;
  industry: string;
  growth: number;
  job_count: number;
  avg_salary?: number;
  category?: string;
  created_at: string;
  updated_at: string;
  is_trending: boolean;
  is_declining: boolean;
}

export interface EmergingRole {
  id: number;
  title: string;
  description: string;
  growth: number;
  skills: string[];
  industry?: string;
  salary_range?: string;
  experience_level?: string;
  created_at: string;
  updated_at: string;
}

export interface TrendingData {
  trendingSkills: TrendingSkill[];
  decliningSkills: TrendingSkill[];
  trendingIndustries: TrendingIndustry[];
  decliningIndustries: TrendingIndustry[];
  emergingRoles: EmergingRole[];
}

class SupabaseTrendingService {
  private cache: Map<string, any> = new Map();
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour
  private cacheTimestamps: Map<string, number> = new Map();

  /**
   * Get all trending data from Supabase with caching
   */
  async getAllTrendingData(): Promise<TrendingData> {
    const cacheKey = 'all_trending_data';
    const now = Date.now();
    
    // Check cache first
    if (this.cache.has(cacheKey) && this.cacheTimestamps.has(cacheKey)) {
      const cacheTime = this.cacheTimestamps.get(cacheKey)!;
      if (now - cacheTime < this.CACHE_TTL) {
        return this.cache.get(cacheKey)!;
      }
    }

    try {
      // Fetch all trending data in parallel
      const [trendingSkillsResult, decliningSkillsResult, trendingIndustriesResult, decliningIndustriesResult, emergingRolesResult] = await Promise.all([
        supabase.from('trending_skills').select('*').eq('is_trending', true).order('demand', { ascending: false }),
        supabase.from('trending_skills').select('*').eq('is_declining', true).order('growth', { ascending: true }),
        supabase.from('trending_industries').select('*').eq('is_trending', true).order('growth', { ascending: false }),
        supabase.from('trending_industries').select('*').eq('is_declining', true).order('growth', { ascending: true }),
        supabase.from('emerging_roles').select('*').order('growth', { ascending: false })
      ]);

      const trendingData: TrendingData = {
        trendingSkills: trendingSkillsResult.data || [],
        decliningSkills: decliningSkillsResult.data || [],
        trendingIndustries: trendingIndustriesResult.data || [],
        decliningIndustries: decliningIndustriesResult.data || [],
        emergingRoles: emergingRolesResult.data || []
      };

      // Cache the result
      this.cache.set(cacheKey, trendingData);
      this.cacheTimestamps.set(cacheKey, now);

      return trendingData;
    } catch (error) {
      console.error('Failed to fetch trending data from Supabase:', error);
      return this.cache.get(cacheKey) || this.getFallbackData();
    }
  }

  /**
   * Get trending skills only
   */
  async getTrendingSkills(): Promise<TrendingSkill[]> {
    const cacheKey = 'trending_skills';
    const now = Date.now();
    
    if (this.cache.has(cacheKey) && this.cacheTimestamps.has(cacheKey)) {
      const cacheTime = this.cacheTimestamps.get(cacheKey)!;
      if (now - cacheTime < this.CACHE_TTL) {
        return this.cache.get(cacheKey)!;
      }
    }

    try {
      const { data, error } = await supabase
        .from('trending_skills')
        .select('*')
        .eq('is_trending', true)
        .order('demand', { ascending: false });

      if (error) {
        console.error('Error fetching trending skills:', error);
        return this.cache.get(cacheKey) || [];
      }

      this.cache.set(cacheKey, data || []);
      this.cacheTimestamps.set(cacheKey, now);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch trending skills:', error);
      return this.cache.get(cacheKey) || [];
    }
  }

  /**
   * Get declining skills only
   */
  async getDecliningSkills(): Promise<TrendingSkill[]> {
    const cacheKey = 'declining_skills';
    const now = Date.now();
    
    if (this.cache.has(cacheKey) && this.cacheTimestamps.has(cacheKey)) {
      const cacheTime = this.cacheTimestamps.get(cacheKey)!;
      if (now - cacheTime < this.CACHE_TTL) {
        return this.cache.get(cacheKey)!;
      }
    }

    try {
      const { data, error } = await supabase
        .from('trending_skills')
        .select('*')
        .eq('is_declining', true)
        .order('growth', { ascending: true });

      if (error) {
        console.error('Error fetching declining skills:', error);
        return this.cache.get(cacheKey) || [];
      }

      this.cache.set(cacheKey, data || []);
      this.cacheTimestamps.set(cacheKey, now);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch declining skills:', error);
      return this.cache.get(cacheKey) || [];
    }
  }

  /**
   * Get trending industries only
   */
  async getTrendingIndustries(): Promise<TrendingIndustry[]> {
    const cacheKey = 'trending_industries';
    const now = Date.now();
    
    if (this.cache.has(cacheKey) && this.cacheTimestamps.has(cacheKey)) {
      const cacheTime = this.cacheTimestamps.get(cacheKey)!;
      if (now - cacheTime < this.CACHE_TTL) {
        return this.cache.get(cacheKey)!;
      }
    }

    try {
      const { data, error } = await supabase
        .from('trending_industries')
        .select('*')
        .eq('is_trending', true)
        .order('growth', { ascending: false });

      if (error) {
        console.error('Error fetching trending industries:', error);
        return this.cache.get(cacheKey) || [];
      }

      this.cache.set(cacheKey, data || []);
      this.cacheTimestamps.set(cacheKey, now);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch trending industries:', error);
      return this.cache.get(cacheKey) || [];
    }
  }

  /**
   * Get declining industries only
   */
  async getDecliningIndustries(): Promise<TrendingIndustry[]> {
    const cacheKey = 'declining_industries';
    const now = Date.now();
    
    if (this.cache.has(cacheKey) && this.cacheTimestamps.has(cacheKey)) {
      const cacheTime = this.cacheTimestamps.get(cacheKey)!;
      if (now - cacheTime < this.CACHE_TTL) {
        return this.cache.get(cacheKey)!;
      }
    }

    try {
      const { data, error } = await supabase
        .from('trending_industries')
        .select('*')
        .eq('is_declining', true)
        .order('growth', { ascending: true });

      if (error) {
        console.error('Error fetching declining industries:', error);
        return this.cache.get(cacheKey) || [];
      }

      this.cache.set(cacheKey, data || []);
      this.cacheTimestamps.set(cacheKey, now);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch declining industries:', error);
      return this.cache.get(cacheKey) || [];
    }
  }

  /**
   * Get emerging roles only
   */
  async getEmergingRoles(): Promise<EmergingRole[]> {
    const cacheKey = 'emerging_roles';
    const now = Date.now();
    
    if (this.cache.has(cacheKey) && this.cacheTimestamps.has(cacheKey)) {
      const cacheTime = this.cacheTimestamps.get(cacheKey)!;
      if (now - cacheTime < this.CACHE_TTL) {
        return this.cache.get(cacheKey)!;
      }
    }

    try {
      const { data, error } = await supabase
        .from('emerging_roles')
        .select('*')
        .order('growth', { ascending: false });

      if (error) {
        console.error('Error fetching emerging roles:', error);
        return this.cache.get(cacheKey) || [];
      }

      this.cache.set(cacheKey, data || []);
      this.cacheTimestamps.set(cacheKey, now);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch emerging roles:', error);
      return this.cache.get(cacheKey) || [];
    }
  }

  /**
   * Get trending data update statistics
   */
  async getTrendingStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('trending_update_log')
        .select('*')
        .order('update_timestamp', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching trending stats:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to fetch trending stats:', error);
      return null;
    }
  }

  /**
   * Fallback data when Supabase is unavailable
   */
  private getFallbackData(): TrendingData {
    return {
      trendingSkills: [
        { id: 1, skill: 'AI/ML', demand: 95, growth: 25, salary: 120000, category: 'tech', created_at: '', updated_at: '', is_trending: true, is_declining: false },
        { id: 2, skill: 'Cybersecurity', demand: 90, growth: 20, salary: 110000, category: 'tech', created_at: '', updated_at: '', is_trending: true, is_declining: false },
        { id: 3, skill: 'Cloud Computing', demand: 85, growth: 18, salary: 105000, category: 'tech', created_at: '', updated_at: '', is_trending: true, is_declining: false }
      ],
      decliningSkills: [
        { id: 4, skill: 'Flash Development', demand: 15, growth: -35, salary: 45000, category: 'tech', created_at: '', updated_at: '', is_trending: false, is_declining: true },
        { id: 5, skill: 'Silverlight', demand: 8, growth: -45, salary: 40000, category: 'tech', created_at: '', updated_at: '', is_trending: false, is_declining: true },
        { id: 6, skill: 'ColdFusion', demand: 12, growth: -25, salary: 50000, category: 'tech', created_at: '', updated_at: '', is_trending: false, is_declining: true }
      ],
      trendingIndustries: [
        { id: 1, industry: 'Technology', growth: 15, job_count: 50000, avg_salary: 95000, category: 'tech', created_at: '', updated_at: '', is_trending: true, is_declining: false },
        { id: 2, industry: 'Healthcare', growth: 12, job_count: 30000, avg_salary: 85000, category: 'healthcare', created_at: '', updated_at: '', is_trending: true, is_declining: false }
      ],
      decliningIndustries: [
        { id: 3, industry: 'Print Media', growth: -12, job_count: 8000, avg_salary: 55000, category: 'media', created_at: '', updated_at: '', is_trending: false, is_declining: true },
        { id: 4, industry: 'Traditional Retail', growth: -8, job_count: 15000, avg_salary: 45000, category: 'retail', created_at: '', updated_at: '', is_trending: false, is_declining: true }
      ],
      emergingRoles: [
        { id: 1, title: 'AI Engineer', description: 'Build and deploy AI models', growth: 30, skills: ['Python', 'TensorFlow', 'ML'], industry: 'tech', salary_range: '$90,000 - $150,000', experience_level: '2-5 years', created_at: '', updated_at: '' },
        { id: 2, title: 'DevOps Engineer', description: 'Automate deployment processes', growth: 25, skills: ['Docker', 'Kubernetes', 'CI/CD'], industry: 'tech', salary_range: '$85,000 - $140,000', experience_level: '2-5 years', created_at: '', updated_at: '' }
      ]
    };
  }

  /**
   * Force refresh cache
   */
  async refreshCache(): Promise<void> {
    this.cache.clear();
    this.cacheTimestamps.clear();
    await this.getAllTrendingData();
  }

  /**
   * Check if cache needs refresh
   */
  shouldRefreshCache(): boolean {
    const cacheKey = 'all_trending_data';
    if (!this.cacheTimestamps.has(cacheKey)) return true;
    
    const cacheTime = this.cacheTimestamps.get(cacheKey)!;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour
    
    return now - cacheTime > oneHour;
  }
}

export const supabaseTrendingService = new SupabaseTrendingService();
