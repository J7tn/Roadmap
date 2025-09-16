/**
 * Unified Career Data Service
 * Consolidates all career-related data operations with strategy pattern
 */

import { ICareerPath, ICareerNode, ICareerFilters, ICareerSearchResult, IndustryCategory } from '@/types/career';
import { appConfig } from '@/config/appConfig';
import { careerService } from './careerService';
import { supabaseCareerService } from './supabaseCareerService';

// Strategy interface for different data sources
export interface ICareerDataStrategy {
  getCareerPath(pathId: string): Promise<ICareerPath | null>;
  getCareerPathsByIndustry(industry: IndustryCategory, page?: number, limit?: number): Promise<ICareerSearchResult>;
  searchCareers(query: string, filters?: ICareerFilters, page?: number, limit?: number): Promise<ICareerSearchResult>;
  getCareerNode(nodeId: string): Promise<ICareerNode | null>;
}

// Local data strategy (fallback)
class LocalDataStrategy implements ICareerDataStrategy {
  async getCareerPath(pathId: string): Promise<ICareerPath | null> {
    return careerService.getCareerPath(pathId);
  }

  async getCareerPathsByIndustry(industry: IndustryCategory, page = 1, limit = 10): Promise<ICareerSearchResult> {
    return careerService.getCareerPathsByIndustry(industry, page, limit);
  }

  async searchCareers(query: string, filters?: ICareerFilters, page = 1, limit = 20): Promise<ICareerSearchResult> {
    return careerService.searchCareers(query, filters, page, limit);
  }

  async getCareerNode(nodeId: string): Promise<ICareerNode | null> {
    return careerService.getCareerNode(nodeId);
  }
}

// Supabase data strategy (primary)
class SupabaseDataStrategy implements ICareerDataStrategy {
  async getCareerPath(pathId: string): Promise<ICareerPath | null> {
    try {
      // Supabase doesn't have getCareerPath, fall back to local data
      return careerService.getCareerPath(pathId);
    } catch (error) {
      console.warn('Career path fetch failed:', error);
      return null;
    }
  }

  async getCareerPathsByIndustry(industry: IndustryCategory, page = 1, limit = 10): Promise<ICareerSearchResult> {
    try {
      // Use translated career service for better language support
      const translatedCareers = await careerService.getAllCareerNodesArray();
      const filteredCareers = translatedCareers.filter(career => 
        career.r?.exp?.toLowerCase().includes(industry.toLowerCase()) || 
        career.d?.toLowerCase().includes(industry.toLowerCase())
      );
      
      // Convert ICareerNode to ICareerPath format
      const careerPaths = filteredCareers.map(career => this.convertCareerNodeToPath(career));
      
      return {
        careers: careerPaths,
        total: careerPaths.length,
        filters: { industry: [industry], level: [], skills: [] },
        suggestions: [],
        pagination: {
          hasMore: false,
          currentPage: page,
          totalPages: Math.ceil(careerPaths.length / limit)
        }
      };
    } catch (error) {
      console.warn('Translated industry fetch failed, falling back to local data:', error);
      return careerService.getCareerPathsByIndustry(industry, page, limit);
    }
  }

  async searchCareers(query: string, filters?: ICareerFilters, page = 1, limit = 20): Promise<ICareerSearchResult> {
    try {
      // Use translated career service for better language support
      const translatedCareers = await careerService.searchCareersTranslated(query, filters);
      
      // Convert ICareerNode to ICareerPath format
      const careerPaths = translatedCareers.map(career => this.convertCareerNodeToPath(career));
      
      return {
        careers: careerPaths,
        total: careerPaths.length,
        filters: filters || { industry: [], level: [], skills: [] },
        suggestions: [],
        pagination: {
          hasMore: false,
          currentPage: page,
          totalPages: Math.ceil(careerPaths.length / limit)
        }
      };
    } catch (error) {
      console.warn('Translated search failed, falling back to local data:', error);
      return careerService.searchCareers(query, filters, page, limit);
    }
  }

  async getCareerNode(nodeId: string): Promise<ICareerNode | null> {
    try {
      // Use translated career service for better language support
      return await careerService.getCareerByIdTranslated(nodeId);
    } catch (error) {
      console.warn('Career node fetch failed:', error);
      return null;
    }
  }

  private convertToCareerPath(career: any): ICareerPath {
    // Convert Supabase career data to ICareerPath format
    return {
      id: career.id,
      n: career.title,
      cat: career.industry,
      nodes: [{
        id: career.id,
        t: career.title,
        l: career.level || 'entry',
        s: career.skills || [],
        c: career.certifications || [],
        sr: career.salary || '',
        te: career.experience || '',
        d: career.description || '',
        jt: career.job_titles || [],
        r: {
          e: career.requirements?.education || [],
          exp: career.requirements?.experience || '',
          sk: career.requirements?.skills || []
        }
      }],
      conn: []
    };
  }

  private convertCareerNodeToPath(career: ICareerNode): ICareerPath {
    // Convert ICareerNode to ICareerPath format
    return {
      id: career.id,
      n: career.t,
      cat: 'tech' as IndustryCategory, // Default to tech category
      nodes: [career],
      conn: []
    };
  }
}

// Hybrid strategy (best of both worlds)
class HybridDataStrategy implements ICareerDataStrategy {
  private supabaseStrategy = new SupabaseDataStrategy();
  private localStrategy = new LocalDataStrategy();

  async getCareerPath(pathId: string): Promise<ICareerPath | null> {
    // Try Supabase first, fallback to local
    const supabaseResult = await this.supabaseStrategy.getCareerPath(pathId);
    if (supabaseResult) {
      return supabaseResult;
    }
    return this.localStrategy.getCareerPath(pathId);
  }

  async getCareerPathsByIndustry(industry: IndustryCategory, page = 1, limit = 10): Promise<ICareerSearchResult> {
    // Try Supabase first, fallback to local
    const supabaseResult = await this.supabaseStrategy.getCareerPathsByIndustry(industry, page, limit);
    if (supabaseResult && supabaseResult.careers.length > 0) {
      return supabaseResult;
    }
    return this.localStrategy.getCareerPathsByIndustry(industry, page, limit);
  }

  async searchCareers(query: string, filters?: ICareerFilters, page = 1, limit = 20): Promise<ICareerSearchResult> {
    // Try Supabase first, fallback to local
    const supabaseResult = await this.supabaseStrategy.searchCareers(query, filters, page, limit);
    if (supabaseResult && supabaseResult.careers.length > 0) {
      return supabaseResult;
    }
    return this.localStrategy.searchCareers(query, filters, page, limit);
  }

  async getCareerNode(nodeId: string): Promise<ICareerNode | null> {
    // Try Supabase first, fallback to local
    const supabaseResult = await this.supabaseStrategy.getCareerNode(nodeId);
    if (supabaseResult) {
      return supabaseResult;
    }
    return this.localStrategy.getCareerNode(nodeId);
  }
}

// Unified Career Service
export class UnifiedCareerService {
  private strategy: ICareerDataStrategy;

  constructor() {
    this.strategy = this.selectStrategy();
  }

  private selectStrategy(): ICareerDataStrategy {
    // Use Supabase as primary data source for all operations
    // Local data is only used as fallback when Supabase is unavailable
    console.log('Using Supabase as primary data source with local fallback');
    return new HybridDataStrategy();
  }

  // Public API methods
  async getCareerPath(pathId: string): Promise<ICareerPath | null> {
    return this.strategy.getCareerPath(pathId);
  }

  async getCareerPathsByIndustry(industry: IndustryCategory, page = 1, limit = 10): Promise<ICareerSearchResult> {
    return this.strategy.getCareerPathsByIndustry(industry, page, limit);
  }

  async searchCareers(query: string, filters?: ICareerFilters, page = 1, limit = 20): Promise<ICareerSearchResult> {
    return this.strategy.searchCareers(query, filters, page, limit);
  }

  async getCareerNode(nodeId: string): Promise<ICareerNode | null> {
    return this.strategy.getCareerNode(nodeId);
  }

  // Utility methods
  getDataSource(): string {
    if (this.strategy instanceof HybridDataStrategy) {
      return 'hybrid';
    } else if (this.strategy instanceof SupabaseDataStrategy) {
      return 'supabase';
    } else {
      return 'local';
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async refreshStrategy(): Promise<void> {
    this.strategy = this.selectStrategy();
  }
}

// Export singleton instance
export const unifiedCareerService = new UnifiedCareerService();
