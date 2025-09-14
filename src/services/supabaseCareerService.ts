import { SupabaseClient } from '@supabase/supabase-js';
import { ICareerNode, ICareerPath, IndustryCategory } from '@/types/career';
import { dataVersioningService } from './dataVersioningService';
import { supabase } from '@/lib/supabase';

export interface SupabaseCareerData {
  id: string;
  title: string;
  description: string;
  skills: string[];
  salary: string;
  experience: string;
  level: 'E' | 'I' | 'A' | 'X';
  industry: IndustryCategory;
  job_titles: string[];
  certifications: string[];
  requirements: {
    education: string[];
    experience: string;
    skills: string[];
  };
  created_at: string;
  updated_at: string;
  last_updated_by: string;
}

export interface CareerSearchResult {
  careers: SupabaseCareerData[];
  total: number;
  suggestions: string[];
}

class SupabaseCareerService {
  private cache: Map<string, SupabaseCareerData[]> = new Map();
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour
  private cacheTimestamps: Map<string, number> = new Map();

  /**
   * Get all careers from Supabase with versioning
   */
  async getAllCareers(): Promise<SupabaseCareerData[]> {
    // Check if we have fresh cached data
    const cachedData = dataVersioningService.getCachedData();
    if (cachedData?.careerData && dataVersioningService.isDataFresh('careers')) {
      console.log('Using cached career data');
      return cachedData.careerData;
    }

    // Check if update is needed
    if (!dataVersioningService.isUpdateNeeded('careers')) {
      // Use cached data even if not "fresh" but not needing update
      if (cachedData?.careerData) {
        console.log('Using cached career data (update not needed)');
        return cachedData.careerData;
      }
    }

    // Attempt to fetch fresh data
    try {
      console.log('Fetching fresh career data from Supabase');
      dataVersioningService.updateDataVersion('careers', 'pending');

      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching careers from Supabase:', error);
        dataVersioningService.updateDataVersion('careers', 'failed', error.message);
        
        // Return cached data if available
        if (cachedData?.careerData) {
          console.log('Using cached career data due to fetch error');
          return cachedData.careerData;
        }
        return [];
      }

      if (data) {
        // Cache the successful result
        dataVersioningService.cacheData('careers', data);
        console.log('Successfully fetched and cached career data');
        return data;
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch careers from Supabase:', error);
      
      // Log the failure
      dataVersioningService.updateDataVersion('careers', 'failed', error instanceof Error ? error.message : 'Unknown error');
      
      // Return cached data if available
      if (cachedData?.careerData) {
        console.log('Using cached career data due to fetch failure');
        return cachedData.careerData;
      }
      
      // Return empty array instead of fallback
      console.log('No cached data available, returning empty career data');
      return [];
    }
  }

  /**
   * Search careers by query using Supabase full-text search
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

    try {
      // Use Supabase full-text search for better performance
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .textSearch('title,description,skills,job_titles', searchQuery)
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('Supabase search failed, using local filtering:', error);
        // Fallback to local filtering
        return this.localSearch(allCareers, searchQuery);
      }

      const suggestions = this.generateSuggestions(searchQuery, data || []);
      
      return {
        careers: data || [],
        total: data?.length || 0,
        suggestions
      };
    } catch (error) {
      console.warn('Search failed, using local filtering:', error);
      return this.localSearch(allCareers, searchQuery);
    }
  }

  /**
   * Local search fallback
   */
  private localSearch(careers: SupabaseCareerData[], query: string): CareerSearchResult {
    const filteredCareers = careers.filter(career => {
      // Search in title
      if (career.title.toLowerCase().includes(query)) return true;
      
      // Search in description
      if (career.description.toLowerCase().includes(query)) return true;
      
      // Search in skills
      if (career.skills.some(skill => skill.toLowerCase().includes(query))) return true;
      
      // Search in job titles
      if (career.job_titles.some(title => title.toLowerCase().includes(query))) return true;
      
      // Search in industry
      if (career.industry.toLowerCase().includes(query)) return true;
      
      return false;
    });

    const suggestions = this.generateSuggestions(query, careers);

    return {
      careers: filteredCareers,
      total: filteredCareers.length,
      suggestions
    };
  }

  /**
   * Get careers by industry
   */
  async getCareersByIndustry(industry: IndustryCategory): Promise<SupabaseCareerData[]> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('industry', industry)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching careers by industry:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch careers by industry:', error);
      return [];
    }
  }

  /**
   * Get career by ID
   */
  async getCareerById(id: string): Promise<SupabaseCareerData | null> {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching career by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch career by ID:', error);
      return null;
    }
  }

  /**
   * Convert Supabase career data to ICareerNode format
   */
  convertToCareerNode(career: SupabaseCareerData): ICareerNode {
    return {
      id: career.id,
      t: career.title,
      l: career.level,
      s: career.skills,
      c: career.certifications,
      sr: career.salary,
      te: career.experience,
      d: career.description,
      jt: career.job_titles,
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
  private generateSuggestions(query: string, careers: SupabaseCareerData[]): string[] {
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
      career.job_titles.forEach(title => {
        if (title.toLowerCase().includes(query)) {
          suggestions.add(title);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Get career update statistics
   */
  async getCareerStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('career_update_log')
        .select('*')
        .order('update_timestamp', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching career stats:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to fetch career stats:', error);
      return null;
    }
  }

  /**
   * Force refresh cache
   */
  async refreshCache(): Promise<void> {
    this.cache.clear();
    this.cacheTimestamps.clear();
    await this.getAllCareers();
  }

  /**
   * Check if cache needs refresh
   */
  shouldRefreshCache(): boolean {
    const cacheKey = 'all_careers';
    if (!this.cacheTimestamps.has(cacheKey)) return true;
    
    const cacheTime = this.cacheTimestamps.get(cacheKey)!;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour
    
    return now - cacheTime > oneHour;
  }
}

export const supabaseCareerService = new SupabaseCareerService();
