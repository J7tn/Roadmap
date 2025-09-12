import { ICareerNode, ICareerPath, IndustryCategory } from '@/types/career';
import { smartCareerCacheService } from './smartCareerCacheService';
import { loadCareerPath, loadIndustryCareerPaths } from '@/utils/careerDataLoader';

export interface CareerSearchResult {
  careers: ICareerNode[];
  total: number;
  hasMore: boolean;
  suggestions: string[];
}

export interface CareerFilters {
  industry?: IndustryCategory;
  level?: string;
  skills?: string[];
  experience?: string;
}

/**
 * Hybrid Career Service
 * Combines local data loading with smart Supabase caching for optimal performance
 */
class HybridCareerService {
  private static instance: HybridCareerService;
  private localDataCache = new Map<string, ICareerNode[]>();
  private useSupabase = true; // Flag to enable/disable Supabase integration

  private constructor() {}

  public static getInstance(): HybridCareerService {
    if (!HybridCareerService.instance) {
      HybridCareerService.instance = new HybridCareerService();
    }
    return HybridCareerService.instance;
  }

  /**
   * Search careers with hybrid approach
   */
  async searchCareers(
    query: string,
    filters: CareerFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<CareerSearchResult> {
    try {
      if (this.useSupabase) {
        // Use smart caching service for Supabase-based search
        const careers = await smartCareerCacheService.getCareers({
          query,
          industry: filters.industry,
          level: filters.level,
          skills: filters.skills,
          limit,
          offset: (page - 1) * limit
        });

        return {
          careers,
          total: careers.length,
          hasMore: careers.length === limit,
          suggestions: this.generateSuggestions(query, careers)
        };
      } else {
        // Fallback to local data loading
        return this.searchCareersLocally(query, filters, page, limit);
      }
    } catch (error) {
      console.warn('Supabase search failed, falling back to local data:', error);
      return this.searchCareersLocally(query, filters, page, limit);
    }
  }

  /**
   * Get career recommendations based on user profile
   */
  async getCareerRecommendations(
    userId: string,
    preferences: {
      industries?: IndustryCategory[];
      experienceLevel?: string;
      skills?: string[];
    }
  ): Promise<ICareerNode[]> {
    try {
      if (this.useSupabase) {
        return await smartCareerCacheService.getCareerRecommendations(userId, preferences);
      } else {
        // Fallback to local recommendations
        return this.getLocalRecommendations(preferences);
      }
    } catch (error) {
      console.warn('Supabase recommendations failed, falling back to local data:', error);
      return this.getLocalRecommendations(preferences);
    }
  }

  /**
   * Get career by ID
   */
  async getCareerById(careerId: string): Promise<ICareerNode | null> {
    try {
      if (this.useSupabase) {
        const careers = await smartCareerCacheService.getCareers({
          limit: 1
        });
        return careers.find(career => career.id === careerId) || null;
      } else {
        return this.getCareerByIdLocally(careerId);
      }
    } catch (error) {
      console.warn('Supabase career lookup failed, falling back to local data:', error);
      return this.getCareerByIdLocally(careerId);
    }
  }

  /**
   * Get careers by industry
   */
  async getCareersByIndustry(
    industry: IndustryCategory,
    page: number = 1,
    limit: number = 20
  ): Promise<CareerSearchResult> {
    try {
      if (this.useSupabase) {
        const careers = await smartCareerCacheService.getCareers({
          industry,
          limit,
          offset: (page - 1) * limit
        });

        return {
          careers,
          total: careers.length,
          hasMore: careers.length === limit,
          suggestions: this.generateIndustrySuggestions(industry, careers)
        };
      } else {
        return this.getCareersByIndustryLocally(industry, page, limit);
      }
    } catch (error) {
      console.warn('Supabase industry search failed, falling back to local data:', error);
      return this.getCareersByIndustryLocally(industry, page, limit);
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: {
      industries?: IndustryCategory[];
      experienceLevel?: string;
      skills?: string[];
    }
  ): Promise<void> {
    try {
      if (this.useSupabase) {
        await smartCareerCacheService.updateUserPreferences(userId, preferences);
      }
    } catch (error) {
      console.warn('Failed to update user preferences:', error);
    }
  }

  /**
   * Toggle between Supabase and local data
   */
  setUseSupabase(useSupabase: boolean): void {
    this.useSupabase = useSupabase;
    console.log(`Hybrid service now using ${useSupabase ? 'Supabase' : 'local'} data`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    if (this.useSupabase) {
      return smartCareerCacheService.getCacheStats();
    } else {
      return {
        size: this.localDataCache.size,
        maxSize: 100,
        hitRate: 0,
        expiredEntries: 0
      };
    }
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    if (this.useSupabase) {
      smartCareerCacheService.clearCache();
    } else {
      this.localDataCache.clear();
    }
  }

  // Private methods for local data fallback

  private async searchCareersLocally(
    query: string,
    filters: CareerFilters,
    page: number,
    limit: number
  ): Promise<CareerSearchResult> {
    const cacheKey = `local_search_${query}_${JSON.stringify(filters)}`;
    
    if (this.localDataCache.has(cacheKey)) {
      const cached = this.localDataCache.get(cacheKey)!;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const careers = cached.slice(startIndex, endIndex);
      
      return {
        careers,
        total: cached.length,
        hasMore: endIndex < cached.length,
        suggestions: this.generateSuggestions(query, careers)
      };
    }

    // Load from local data
    const allCareers = await this.loadAllCareersLocally();
    const filtered = this.filterCareers(allCareers, query, filters);
    
    this.localDataCache.set(cacheKey, filtered);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const careers = filtered.slice(startIndex, endIndex);
    
    return {
      careers,
      total: filtered.length,
      hasMore: endIndex < filtered.length,
      suggestions: this.generateSuggestions(query, careers)
    };
  }

  private async loadAllCareersLocally(): Promise<ICareerNode[]> {
    const industries: IndustryCategory[] = [
      'tech', 'healthcare', 'business', 'finance', 'marketing', 'education',
      'creative', 'engineering', 'science', 'legal', 'government', 'nonprofit',
      'trades', 'hospitality', 'media', 'agriculture', 'manufacturing', 'retail',
      'transportation', 'emergency-services'
    ];

    const allCareers: ICareerNode[] = [];

    for (const industry of industries) {
      try {
        const careerPaths = await loadIndustryCareerPaths(industry);
        for (const path of careerPaths) {
          if (path.nodes) {
            allCareers.push(...path.nodes);
          }
        }
      } catch (error) {
        console.warn(`Failed to load careers for industry ${industry}:`, error);
      }
    }

    return allCareers;
  }

  private filterCareers(
    careers: ICareerNode[],
    query: string,
    filters: CareerFilters
  ): ICareerNode[] {
    return careers.filter(career => {
      // Text search
      if (query) {
        const searchText = `${career.t} ${career.d} ${career.s?.join(' ')}`.toLowerCase();
        if (!searchText.includes(query.toLowerCase())) {
          return false;
        }
      }

      // Industry filter
      if (filters.industry) {
        // This would need to be mapped from career data
        // For now, we'll skip this filter in local mode
      }

      // Level filter
      if (filters.level && career.l !== filters.level) {
        return false;
      }

      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        const hasMatchingSkill = filters.skills.some(skill =>
          career.s?.some(careerSkill =>
            careerSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) {
          return false;
        }
      }

      return true;
    });
  }

  private async getLocalRecommendations(
    preferences: {
      industries?: IndustryCategory[];
      experienceLevel?: string;
      skills?: string[];
    }
  ): Promise<ICareerNode[]> {
    const allCareers = await this.loadAllCareersLocally();
    
    // Simple scoring based on preferences
    const scoredCareers = allCareers.map(career => {
      let score = 0;
      
      if (preferences.experienceLevel && career.l === preferences.experienceLevel) {
        score += 3;
      }
      
      if (preferences.skills) {
        const skillMatches = preferences.skills.filter(skill =>
          career.s?.some(careerSkill =>
            careerSkill.toLowerCase().includes(skill.toLowerCase())
          )
        ).length;
        score += skillMatches;
      }
      
      return { career, score };
    });

    return scoredCareers
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(item => item.career);
  }

  private async getCareerByIdLocally(careerId: string): Promise<ICareerNode | null> {
    const allCareers = await this.loadAllCareersLocally();
    return allCareers.find(career => career.id === careerId) || null;
  }

  private async getCareersByIndustryLocally(
    industry: IndustryCategory,
    page: number,
    limit: number
  ): Promise<CareerSearchResult> {
    try {
      const careerPaths = await loadIndustryCareerPaths(industry);
      const allCareers: ICareerNode[] = [];
      
      for (const path of careerPaths) {
        if (path.nodes) {
          allCareers.push(...path.nodes);
        }
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const careers = allCareers.slice(startIndex, endIndex);

      return {
        careers,
        total: allCareers.length,
        hasMore: endIndex < allCareers.length,
        suggestions: this.generateIndustrySuggestions(industry, careers)
      };
    } catch (error) {
      console.error(`Failed to load careers for industry ${industry}:`, error);
      return {
        careers: [],
        total: 0,
        hasMore: false,
        suggestions: []
      };
    }
  }

  private generateSuggestions(query: string, careers: ICareerNode[]): string[] {
    const suggestions = new Set<string>();
    
    careers.forEach(career => {
      if (career.t.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(career.t);
      }
      career.s?.forEach(skill => {
        if (skill.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(skill);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  private generateIndustrySuggestions(industry: IndustryCategory, careers: ICareerNode[]): string[] {
    const suggestions = new Set<string>();
    
    careers.forEach(career => {
      suggestions.add(career.t);
      career.s?.forEach(skill => {
        suggestions.add(skill);
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }
}

export const hybridCareerService = HybridCareerService.getInstance();
