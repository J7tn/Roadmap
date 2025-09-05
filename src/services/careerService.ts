import { 
  ICareerPath, 
  ICareerNode, 
  ICareerCache, 
  ILazyCareerData, 
  ICareerFilters,
  ICareerSearchResult,
  ICareerRecommendation,
  IndustryCategory,
  CareerLevel
} from '@/types/career';
import { INDUSTRY_CATEGORIES, getIndustryIds } from '@/data/industries';
import { 
  loadCareerPath, 
  loadIndustryCareerPaths, 
  searchCareerPaths, 
  getCareerRecommendations as getRecommendations,
  getCareerPathStats
} from '@/utils/careerDataLoader';

// Performance-optimized career service
// Implements lazy loading, caching, and efficient data management

class CareerService {
  private cache: ICareerCache = {};
  private lazyData: Map<string, ILazyCareerData> = new Map();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 50; // Maximum cached items

  constructor() {
    this.initializeCache();
  }

  // Initialize cache with frequently accessed data
  private initializeCache(): void {
    // Pre-cache popular industries
    const popularIndustries: IndustryCategory[] = ['tech', 'healthcare', 'business'];
    popularIndustries.forEach(industry => {
      this.preloadIndustry(industry);
    });
  }

  // Preload industry data for better performance
  private async preloadIndustry(industry: IndustryCategory): Promise<void> {
    try {
      const data = await this.loadIndustryData(industry);
      this.cacheData(`industry_${industry}`, data);
    } catch (error) {
      console.warn(`Failed to preload industry ${industry}:`, error);
    }
  }

  // Lazy load career path data
  async getCareerPath(pathId: string): Promise<ICareerPath | null> {
    // Check cache first
    const cached = this.getCachedData(pathId);
    if (cached) {
      return cached;
    }

    // Check if already loading
    const lazyData = this.lazyData.get(pathId);
    if (lazyData?.loading) {
      // Wait for existing load to complete
      return new Promise((resolve) => {
        const checkLoading = () => {
          const current = this.lazyData.get(pathId);
          if (current && !current.loading) {
            resolve(current.data || null);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Start loading
    this.setLazyLoading(pathId, true);
    
    try {
      const data = await loadCareerPath(pathId);
      if (data) {
        this.setLazyData(pathId, data);
        this.cacheData(pathId, data);
      }
      return data;
    } catch (error) {
      this.setLazyError(pathId, error as string);
      return null;
    } finally {
      this.setLazyLoading(pathId, false);
    }
  }

  // Get career paths by industry with pagination
  async getCareerPathsByIndustry(
    industry: IndustryCategory, 
    page: number = 1, 
    limit: number = 10
  ): Promise<ICareerSearchResult> {
    const cacheKey = `industry_${industry}_${page}_${limit}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached as ICareerSearchResult;
    }

    try {
      const data = await this.loadIndustryCareerPaths(industry, page, limit);
      this.cacheData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Failed to load career paths for industry ${industry}:`, error);
      return {
        careers: [],
        total: 0,
        filters: { industry: [industry] },
        suggestions: []
      };
    }
  }

  // Search careers with filters
  async searchCareers(
    query: string, 
    filters: ICareerFilters = {}, 
    page: number = 1, 
    limit: number = 20
  ): Promise<ICareerSearchResult> {
    const cacheKey = `search_${query}_${JSON.stringify(filters)}_${page}_${limit}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached as ICareerSearchResult;
    }

    try {
      const results = await searchCareerPaths(query, {
        industry: filters.industry,
        level: filters.level,
        salaryMin: filters.salaryMin,
        salaryMax: filters.salaryMax
      });
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = results.slice(startIndex, endIndex);
      
      const searchResult: ICareerSearchResult = {
        careers: paginatedResults,
        total: results.length,
        filters,
        suggestions: this.generateSearchSuggestions(query, results)
      };
      
      this.cacheData(cacheKey, searchResult);
      return searchResult;
    } catch (error) {
      console.error('Search failed:', error);
      return {
        careers: [],
        total: 0,
        filters,
        suggestions: []
      };
    }
  }

  // Get career recommendations based on user profile
  async getCareerRecommendations(
    userSkills: string[], 
    userInterests: string[], 
    experience: number
  ): Promise<ICareerRecommendation[]> {
    const cacheKey = `recommendations_${userSkills.join('_')}_${userInterests.join('_')}_${experience}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached as ICareerRecommendation[];
    }

    try {
      const recommendations = await getRecommendations(userSkills, userInterests, experience);
      
      // Convert to ICareerRecommendation format
      const formattedRecommendations: ICareerRecommendation[] = recommendations.map(rec => ({
        careerId: rec.path.id,
        matchScore: rec.score,
        reasons: rec.reasons,
        skillGaps: this.calculateSkillGaps(userSkills, rec.path),
        timeToTransition: this.calculateTransitionTime(experience, rec.path),
        estimatedSalary: this.getEstimatedSalary(rec.path)
      }));
      
      this.cacheData(cacheKey, formattedRecommendations);
      return formattedRecommendations;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  }

  // Get career node details
  async getCareerNode(nodeId: string): Promise<ICareerNode | null> {
    const cacheKey = `node_${nodeId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached as ICareerNode;
    }

    try {
      // Find the node across all career paths
      const allPaths = await this.getAllCareerPaths();
      for (const path of allPaths) {
        const node = path.nodes.find(n => n.id === nodeId);
        if (node) {
          this.cacheData(cacheKey, node);
          return node;
        }
      }
      return null;
    } catch (error) {
      console.error(`Failed to load career node ${nodeId}:`, error);
      return null;
    }
  }

  // Get career path statistics
  getCareerPathStats() {
    return getCareerPathStats();
  }

  // Clear cache for memory management
  clearCache(): void {
    this.cache = {};
    this.lazyData.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; hitRate: number } {
    const size = Object.keys(this.cache).length;
    // This is a simplified hit rate calculation
    const hitRate = size > 0 ? 0.8 : 0; // Placeholder
    return { size, hitRate };
  }

  // Private helper methods

  private getCachedData(key: string): any {
    const cached = this.cache[key];
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    // Remove expired cache entry
    delete this.cache[key];
    return null;
  }

  private cacheData(key: string, data: any): void {
    // Implement cache size limit
    if (Object.keys(this.cache).length >= this.MAX_CACHE_SIZE) {
      this.evictOldestCache();
    }

    this.cache[key] = {
      data,
      timestamp: Date.now(),
      ttl: this.CACHE_TTL
    };
  }

  private evictOldestCache(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    Object.entries(this.cache).forEach(([key, value]) => {
      if (value.timestamp < oldestTime) {
        oldestTime = value.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      delete this.cache[oldestKey];
    }
  }

  private setLazyLoading(pathId: string, loading: boolean): void {
    const current = this.lazyData.get(pathId) || { id: pathId, loaded: false, loading: false };
    this.lazyData.set(pathId, { ...current, loading });
  }

  private setLazyData(pathId: string, data: ICareerPath): void {
    const current = this.lazyData.get(pathId) || { id: pathId, loaded: false, loading: false };
    this.lazyData.set(pathId, { ...current, data, loaded: true, loading: false });
  }

  private setLazyError(pathId: string, error: string): void {
    const current = this.lazyData.get(pathId) || { id: pathId, loaded: false, loading: false };
    this.lazyData.set(pathId, { ...current, error, loading: false });
  }

  // Data loading methods
  private async loadIndustryData(industry: IndustryCategory): Promise<ICareerPath[]> {
    return await loadIndustryCareerPaths(industry);
  }

  private async loadIndustryCareerPaths(
    industry: IndustryCategory, 
    page: number, 
    limit: number
  ): Promise<ICareerSearchResult> {
    const allPaths = await loadIndustryCareerPaths(industry);
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPaths = allPaths.slice(startIndex, endIndex);
    
    return {
      careers: paginatedPaths,
      total: allPaths.length,
      filters: { industry: [industry] },
      suggestions: []
    };
  }

  async getAllCareerPaths(): Promise<ICareerPath[]> {
    const allPaths: ICareerPath[] = [];
    const industries = getIndustryIds();
    for (const industry of industries) {
      const paths = await loadIndustryCareerPaths(industry);
      allPaths.push(...paths);
    }
    return allPaths;
  }

  async getAllCareerNodes(): Promise<Array<{ node: ICareerNode; path: ICareerPath }>> {
    const paths = await this.getAllCareerPaths();
    const nodes: Array<{ node: ICareerNode; path: ICareerPath }> = [];
    paths.forEach(path => {
      path.nodes.forEach(node => nodes.push({ node, path }));
    });
    return nodes;
  }

  private generateSearchSuggestions(query: string, results: ICareerPath[]): string[] {
    const suggestions: string[] = [];
    
    // Extract common terms from results
    const terms = new Set<string>();
    results.forEach(path => {
      path.nodes.forEach(node => {
        node.s.forEach(skill => {
          if (skill.toLowerCase().includes(query.toLowerCase())) {
            terms.add(skill);
          }
        });
      });
    });
    
    return Array.from(terms).slice(0, 5);
  }

  private calculateSkillGaps(userSkills: string[], careerPath: ICareerPath): string[] {
    const allRequiredSkills = new Set<string>();
    careerPath.nodes.forEach(node => {
      node.s.forEach(skill => allRequiredSkills.add(skill));
    });
    
    const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));
    return Array.from(allRequiredSkills).filter(skill => 
      !userSkillSet.has(skill.toLowerCase())
    );
  }

  private calculateTransitionTime(experience: number, careerPath: ICareerPath): string {
    const entryLevelNodes = careerPath.nodes.filter(node => node.l === 'E');
    if (experience <= 2 && entryLevelNodes.length > 0) {
      return "0-1 years";
    } else if (experience <= 5) {
      return "1-2 years";
    } else {
      return "2-3 years";
    }
  }

  private getEstimatedSalary(careerPath: ICareerPath): string {
    const salaries = careerPath.nodes.map(node => {
      const match = node.sr.match(/\$([0-9,]+)/);
      return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    }).filter(salary => salary > 0);
    
    if (salaries.length === 0) return "$0";
    
    const average = Math.round(salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length);
    return `$${average?.toLocaleString() || '0'}`;
  }
}

// Export singleton instance
export const careerService = new CareerService();

// Export helper functions
export const getCareerPath = (pathId: string) => careerService.getCareerPath(pathId);
export const getCareerPathsByIndustry = (industry: IndustryCategory, page?: number, limit?: number) => 
  careerService.getCareerPathsByIndustry(industry, page, limit);
export const searchCareers = (query: string, filters?: ICareerFilters, page?: number, limit?: number) => 
  careerService.searchCareers(query, filters, page, limit);
export const getCareerRecommendations = (userSkills: string[], userInterests: string[], experience: number) => 
  careerService.getCareerRecommendations(userSkills, userInterests, experience);
export const getCareerNode = (nodeId: string) => careerService.getCareerNode(nodeId);
export const getAllCareerPaths = () => careerService.getAllCareerPaths();
export const getAllCareerNodes = () => careerService.getAllCareerNodes();
export const clearCareerCache = () => careerService.clearCache();
export const getCareerCacheStats = () => careerService.getCacheStats();
export const getCareerPathStats = () => careerService.getCareerPathStats();
