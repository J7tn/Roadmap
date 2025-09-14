import { ICareerNode, ICareerPath, IndustryCategory } from '@/types/career';

const CHAT2API_BASE_URL = 'http://localhost:8000';

export interface DynamicCareerData {
  id: string;
  title: string;
  description: string;
  skills: string[];
  salary: string;
  experience: string;
  level: 'E' | 'I' | 'A' | 'X';
  industry: IndustryCategory;
  jobTitles: string[];
  certifications: string[];
  requirements: {
    education: string[];
    experience: string;
    skills: string[];
  };
}

export interface CareerSearchResult {
  careers: DynamicCareerData[];
  total: number;
  suggestions: string[];
}

class DynamicCareerService {
  private cache: Map<string, DynamicCareerData[]> = new Map();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private cacheTimestamps: Map<string, number> = new Map();

  /**
   * Get all careers from chat2api with caching
   */
  async getAllCareers(): Promise<DynamicCareerData[]> {
    const cacheKey = 'all_careers';
    const now = Date.now();
    
    // Check cache first
    if (this.cache.has(cacheKey) && this.cacheTimestamps.has(cacheKey)) {
      const cacheTime = this.cacheTimestamps.get(cacheKey)!;
      if (now - cacheTime < this.CACHE_TTL) {
        return this.cache.get(cacheKey)!;
      }
    }

    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/careers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.cache.set(cacheKey, data);
        this.cacheTimestamps.set(cacheKey, now);
        return data;
      }
    } catch (error) {
      console.warn('Failed to fetch careers from chat2api:', error);
    }

    // Return cached data if available, otherwise return empty array
    return this.cache.get(cacheKey) || [];
  }

  /**
   * Search careers by query
   */
  async searchCareers(query: string): Promise<CareerSearchResult> {
    const allCareers = await this.getAllCareers();
    const searchQuery = query.toLowerCase().trim();

    if (!searchQuery) {
      return {
        careers: allCareers,
        total: allCareers.length,
        suggestions: []
      };
    }

    const filteredCareers = allCareers.filter(career => {
      // Search in title
      if (career.title.toLowerCase().includes(searchQuery)) return true;
      
      // Search in description
      if (career.description.toLowerCase().includes(searchQuery)) return true;
      
      // Search in skills
      if (career.skills.some(skill => skill.toLowerCase().includes(searchQuery))) return true;
      
      // Search in job titles
      if (career.jobTitles.some(title => title.toLowerCase().includes(searchQuery))) return true;
      
      // Search in industry
      if (career.industry.toLowerCase().includes(searchQuery)) return true;
      
      return false;
    });

    // Generate suggestions based on similar terms
    const suggestions = this.generateSuggestions(searchQuery, allCareers);

    return {
      careers: filteredCareers,
      total: filteredCareers.length,
      suggestions
    };
  }

  /**
   * Get careers by industry
   */
  async getCareersByIndustry(industry: IndustryCategory): Promise<DynamicCareerData[]> {
    const allCareers = await this.getAllCareers();
    return allCareers.filter(career => career.industry === industry);
  }

  /**
   * Get career by ID
   */
  async getCareerById(id: string): Promise<DynamicCareerData | null> {
    const allCareers = await this.getAllCareers();
    return allCareers.find(career => career.id === id) || null;
  }

  /**
   * Convert dynamic career data to ICareerNode format
   */
  convertToCareerNode(career: DynamicCareerData): ICareerNode {
    return {
      id: career.id,
      t: career.title,
      l: career.level,
      s: career.skills,
      c: career.certifications,
      sr: career.salary,
      te: career.experience,
      d: career.description,
      jt: career.jobTitles,
      r: {
        e: career.requirements.education,
        exp: career.requirements.experience,
        sk: career.requirements.skills
      }
    };
  }

  /**
   * Generate search suggestions
   */
  private generateSuggestions(query: string, careers: DynamicCareerData[]): string[] {
    const suggestions = new Set<string>();
    
    careers.forEach(career => {
      // Add similar titles
      if (career.title.toLowerCase().includes(query)) {
        suggestions.add(career.title);
      }
      
      // Add similar skills
      career.skills.forEach(skill => {
        if (skill.toLowerCase().includes(query)) {
          suggestions.add(skill);
        }
      });
      
      // Add similar job titles
      career.jobTitles.forEach(title => {
        if (title.toLowerCase().includes(query)) {
          suggestions.add(title);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Force refresh cache (for monthly updates)
   */
  async refreshCache(): Promise<void> {
    this.cache.clear();
    this.cacheTimestamps.clear();
    await this.getAllCareers();
  }

  /**
   * Check if cache needs refresh (for monthly updates)
   */
  shouldRefreshCache(): boolean {
    const cacheKey = 'all_careers';
    if (!this.cacheTimestamps.has(cacheKey)) return true;
    
    const cacheTime = this.cacheTimestamps.get(cacheKey)!;
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    return now - cacheTime > oneMonth;
  }
}

export const dynamicCareerService = new DynamicCareerService();
