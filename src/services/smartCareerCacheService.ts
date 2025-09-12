import { ICareerNode, ICareerPath, IndustryCategory } from '@/types/career';
import { supabase } from '@/lib/supabase';

export interface SmartCacheConfig {
  maxCacheSize: number;
  cacheExpiryMinutes: number;
  preloadIndustries: IndustryCategory[];
  enableOfflineMode: boolean;
}

export interface CachedCareerData {
  careers: ICareerNode[];
  careerPaths: ICareerPath[];
  lastUpdated: string;
  cacheKey: string;
  expiresAt: string;
}

export interface CareerSearchParams {
  query?: string;
  industry?: IndustryCategory;
  level?: string;
  skills?: string[];
  limit?: number;
  offset?: number;
}

class SmartCareerCacheService {
  private static instance: SmartCareerCacheService;
  private cache: Map<string, CachedCareerData> = new Map();
  private config: SmartCacheConfig = {
    maxCacheSize: 50, // Maximum number of cached items
    cacheExpiryMinutes: 30, // Cache expires after 30 minutes
    preloadIndustries: ['tech', 'healthcare', 'business'], // Preload these industries
    enableOfflineMode: true
  };

  private constructor() {
    this.initializeCache();
  }

  public static getInstance(): SmartCareerCacheService {
    if (!SmartCareerCacheService.instance) {
      SmartCareerCacheService.instance = new SmartCareerCacheService();
    }
    return SmartCareerCacheService.instance;
  }

  private initializeCache(): void {
    // Load cached data from localStorage on initialization
    try {
      const cachedData = localStorage.getItem('smart_career_cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        this.cache = new Map(parsed);
      }
    } catch (error) {
      console.warn('Failed to load cached career data:', error);
    }

    // Preload essential data
    this.preloadEssentialData();
  }

  private async preloadEssentialData(): Promise<void> {
    // Preload the most commonly accessed career data
    const essentialSearches = [
      { industry: 'tech' as IndustryCategory },
      { industry: 'healthcare' as IndustryCategory },
      { industry: 'business' as IndustryCategory },
      { query: 'developer' },
      { query: 'engineer' },
      { query: 'manager' }
    ];

    for (const search of essentialSearches) {
      try {
        await this.getCareers(search);
      } catch (error) {
        console.warn(`Failed to preload data for ${JSON.stringify(search)}:`, error);
      }
    }
  }

  private generateCacheKey(params: CareerSearchParams): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key as keyof CareerSearchParams];
        return result;
      }, {} as any);
    
    return `career_search_${JSON.stringify(sortedParams)}`;
  }

  private isCacheValid(cachedData: CachedCareerData): boolean {
    const now = new Date();
    const expiresAt = new Date(cachedData.expiresAt);
    return now < expiresAt;
  }

  private async fetchFromSupabase(params: CareerSearchParams): Promise<ICareerNode[]> {
    try {
      let query = supabase
        .from('careers')
        .select('*')
        .order('updated_at', { ascending: false });

      // Apply filters
      if (params.industry) {
        query = query.eq('industry', params.industry);
      }

      if (params.level) {
        query = query.eq('level', params.level);
      }

      if (params.skills && params.skills.length > 0) {
        query = query.overlaps('skills', params.skills);
      }

      if (params.query) {
        query = query.textSearch('search_vector', params.query);
      }

      // Apply pagination
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        return [];
      }

      // Convert Supabase data to ICareerNode format
      return data?.map(this.convertSupabaseToCareerNode) || [];
    } catch (error) {
      console.error('Failed to fetch careers from Supabase:', error);
      return [];
    }
  }

  private convertSupabaseToCareerNode(data: any): ICareerNode {
    return {
      id: data.id,
      t: data.title,
      l: data.level as 'E' | 'I' | 'A' | 'X',
      s: data.skills || [],
      c: data.certifications || [],
      sr: data.salary,
      te: data.experience,
      d: data.description,
      jt: data.job_titles || [],
      r: data.requirements || {}
    };
  }

  private saveCacheToStorage(): void {
    try {
      const cacheArray = Array.from(this.cache.entries());
      localStorage.setItem('smart_career_cache', JSON.stringify(cacheArray));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  private cleanupExpiredCache(): void {
    const now = new Date();
    for (const [key, data] of this.cache.entries()) {
      if (!this.isCacheValid(data)) {
        this.cache.delete(key);
      }
    }
  }

  private enforceCacheSizeLimit(): void {
    if (this.cache.size > this.config.maxCacheSize) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => new Date(a[1].lastUpdated).getTime() - new Date(b[1].lastUpdated).getTime());
      
      const toRemove = entries.slice(0, entries.length - this.config.maxCacheSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  public async getCareers(params: CareerSearchParams): Promise<ICareerNode[]> {
    const cacheKey = this.generateCacheKey(params);
    
    // Check cache first
    const cachedData = this.cache.get(cacheKey);
    if (cachedData && this.isCacheValid(cachedData)) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cachedData.careers;
    }

    console.log(`Cache miss for key: ${cacheKey}, fetching from Supabase`);
    
    // Fetch from Supabase
    const careers = await this.fetchFromSupabase(params);
    
    // Cache the results
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.config.cacheExpiryMinutes);
    
    const cacheData: CachedCareerData = {
      careers,
      careerPaths: [], // Not used in this context
      lastUpdated: new Date().toISOString(),
      cacheKey,
      expiresAt: expiresAt.toISOString()
    };
    
    this.cache.set(cacheKey, cacheData);
    this.cleanupExpiredCache();
    this.enforceCacheSizeLimit();
    this.saveCacheToStorage();
    
    return careers;
  }

  public async getCareerRecommendations(
    userId: string,
    preferences: {
      industries?: IndustryCategory[];
      experienceLevel?: string;
      skills?: string[];
    }
  ): Promise<ICareerNode[]> {
    try {
      const { data, error } = await supabase.rpc('get_smart_career_recommendations', {
        p_user_id: userId,
        p_industries: preferences.industries,
        p_experience_level: preferences.experienceLevel,
        p_skills: preferences.skills,
        p_limit: 20
      });

      if (error) {
        console.error('Failed to get career recommendations:', error);
        return [];
      }

      // Convert the results back to ICareerNode format
      return data?.map((item: any) => ({
        id: item.career_id,
        t: item.title,
        l: item.level as 'E' | 'I' | 'A' | 'X',
        s: [], // Skills would need to be fetched separately
        c: [],
        sr: '',
        te: '',
        d: '',
        jt: [],
        r: {}
      })) || [];
    } catch (error) {
      console.error('Failed to get career recommendations:', error);
      return [];
    }
  }

  public async updateUserPreferences(
    userId: string,
    preferences: {
      industries?: IndustryCategory[];
      experienceLevel?: string;
      skills?: string[];
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_career_preferences')
        .upsert({
          user_id: userId,
          preferred_industries: preferences.industries,
          experience_level: preferences.experienceLevel,
          skills: preferences.skills,
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to update user preferences:', error);
      }
    } catch (error) {
      console.error('Failed to update user preferences:', error);
    }
  }

  public clearCache(): void {
    this.cache.clear();
    localStorage.removeItem('smart_career_cache');
  }

  public getCacheStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    expiredEntries: number;
  } {
    const now = new Date();
    let expiredCount = 0;
    
    for (const data of this.cache.values()) {
      if (!this.isCacheValid(data)) {
        expiredCount++;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.config.maxCacheSize,
      hitRate: 0, // Would need to track hits/misses for accurate rate
      expiredEntries: expiredCount
    };
  }

  public setConfig(newConfig: Partial<SmartCacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const smartCareerCacheService = SmartCareerCacheService.getInstance();
