import { createClient } from '@supabase/supabase-js';
import { ICareerNode } from '@/types/career';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'ja', 'de', 'es', 'fr'];

class SimpleLanguageService {
  private currentLanguage: string = 'en';

  constructor() {
    // Get initial language from localStorage
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
  }

  /**
   * Set the current language
   */
  setLanguage(language: string): void {
    if (SUPPORTED_LANGUAGES.includes(language)) {
      this.currentLanguage = language;
      localStorage.setItem('app-language', language);
    } else {
      console.warn(`Unsupported language: ${language}. Falling back to English.`);
      this.currentLanguage = 'en';
    }
  }

  /**
   * Get the current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get all careers for the current language
   */
  async getAllCareers(): Promise<ICareerNode[]> {
    try {
      const { data: careers, error } = await supabase
        .from(`careers_${this.currentLanguage}`)
        .select(`
          *,
          careers_core!inner(level, salary_range, experience_required)
        `);

      if (error) {
        console.error(`Error fetching careers for ${this.currentLanguage}:`, error);
        return [];
      }

      return careers.map(career => this.convertToCareerNode(career));
    } catch (error) {
      console.error('Error in getAllCareers:', error);
      return [];
    }
  }

  /**
   * Get career by ID for the current language
   */
  async getCareerById(id: string): Promise<ICareerNode | null> {
    try {
      const { data: career, error } = await supabase
        .from(`careers_${this.currentLanguage}`)
        .select(`
          *,
          careers_core!inner(level, salary_range, experience_required)
        `)
        .eq('career_id', id)
        .single();

      if (error) {
        console.error(`Error fetching career ${id} for ${this.currentLanguage}:`, error);
        return null;
      }

      return this.convertToCareerNode(career);
    } catch (error) {
      console.error('Error in getCareerById:', error);
      return null;
    }
  }

  /**
   * Search careers for the current language
   */
  async searchCareers(query: string): Promise<ICareerNode[]> {
    try {
      const { data: careers, error } = await supabase
        .from(`careers_${this.currentLanguage}`)
        .select(`
          *,
          careers_core!inner(level, salary_range, experience_required)
        `)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`);

      if (error) {
        console.error(`Error searching careers for ${this.currentLanguage}:`, error);
        return [];
      }

      return careers.map(career => this.convertToCareerNode(career));
    } catch (error) {
      console.error('Error in searchCareers:', error);
      return [];
    }
  }

  /**
   * Get all industries for the current language
   */
  async getAllIndustries(): Promise<any[]> {
    try {
      const { data: industries, error } = await supabase
        .from(`industries_${this.currentLanguage}`)
        .select(`
          *,
          industries_core!inner(job_count, avg_salary, growth_rate, global_demand, top_countries)
        `);

      if (error) {
        console.error(`Error fetching industries for ${this.currentLanguage}:`, error);
        return [];
      }

      return industries.map(industry => ({
        id: industry.industry_id,
        name: industry.name,
        description: industry.description,
        job_count: industry.industries_core.job_count,
        avg_salary: industry.industries_core.avg_salary,
        growth_rate: industry.industries_core.growth_rate,
        global_demand: industry.industries_core.global_demand,
        top_countries: industry.industries_core.top_countries
      }));
    } catch (error) {
      console.error('Error in getAllIndustries:', error);
      return [];
    }
  }

  /**
   * Get careers by industry for the current language
   */
  async getCareersByIndustry(industryId: string): Promise<ICareerNode[]> {
    try {
      // For now, return all careers since we don't have industry mapping in the new structure
      // This can be enhanced later if needed
      const allCareers = await this.getAllCareers();
      return allCareers; // Return all careers for now
    } catch (error) {
      console.error('Error in getCareersByIndustry:', error);
      return [];
    }
  }

  /**
   * Get career trends for the current language
   */
  async getCareerTrends(careerId: string): Promise<any | null> {
    try {
      const { data: trends, error } = await supabase
        .from(`career_trends_${this.currentLanguage}`)
        .select('*')
        .eq('career_id', careerId)
        .single();

      if (error) {
        console.error(`Error fetching trends for ${careerId} in ${this.currentLanguage}:`, error);
        return null;
      }

      return trends;
    } catch (error) {
      console.error('Error in getCareerTrends:', error);
      return null;
    }
  }

  /**
   * Convert database record to ICareerNode
   */
  private convertToCareerNode(career: any): ICareerNode {
    return {
      id: career.career_id,
      t: career.title, // title
      l: career.careers_core.level, // level
      s: career.skills || [], // skills
      c: career.certifications || [], // certifications
      sr: career.careers_core.salary_range, // salary range
      te: career.careers_core.experience_required, // time estimate
      d: career.description, // description
      jt: career.job_titles || [], // job titles
      r: career.requirements || { e: [], exp: '', sk: [] }, // requirements
      industry: 'technology' // Default industry for now
    };
  }
}

// Export singleton instance
export const simpleLanguageService = new SimpleLanguageService();
export default simpleLanguageService;
