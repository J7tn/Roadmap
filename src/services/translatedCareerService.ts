import { supabase } from '@/lib/supabase';
import { CareerNode, CareerPath } from '@/types/career';

export interface TranslatedCareerData {
  id: string;
  title: string;
  description: string;
  skills: string[];
  salary: string;
  experience: string;
  level: string;
  industry: string;
  job_titles: string[];
  certifications: string[];
  requirements: any;
  created_at: string;
  updated_at: string;
  last_updated_by: string;
}

export interface CareerTranslation {
  career_id: string;
  language_code: string;
  title: string;
  description: string;
  skills: string[];
  job_titles: string[];
  certifications: string[];
}

export interface IndustryTranslation {
  industry_key: string;
  language_code: string;
  industry_name: string;
  industry_description?: string;
}

export interface SkillTranslation {
  skill_key: string;
  language_code: string;
  skill_name: string;
  skill_category?: string;
}

class TranslatedCareerService {
  private static instance: TranslatedCareerService;
  private currentLanguage: string = 'en';
  private translationCache: Map<string, any> = new Map();

  public static getInstance(): TranslatedCareerService {
    if (!TranslatedCareerService.instance) {
      TranslatedCareerService.instance = new TranslatedCareerService();
    }
    return TranslatedCareerService.instance;
  }

  public setLanguage(language: string): void {
    this.currentLanguage = language;
    // Clear cache when language changes
    this.translationCache.clear();
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get all career nodes with translations
   */
  public async getAllCareerNodes(): Promise<CareerNode[]> {
    try {
      // Get careers with their translations
      const { data: careers, error: careersError } = await supabase
        .from('careers')
        .select(`
          *,
          career_translations!inner(
            title,
            description,
            skills,
            job_titles,
            certifications
          )
        `)
        .eq('career_translations.language_code', this.currentLanguage);

      if (careersError) {
        console.error('Error fetching translated careers:', careersError);
        // Fallback to English if current language fails
        if (this.currentLanguage !== 'en') {
          return this.getAllCareerNodesWithFallback();
        }
        throw careersError;
      }

      return this.convertToCareerNodes(careers);
    } catch (error) {
      console.error('Error in getAllCareerNodes:', error);
      throw error;
    }
  }

  /**
   * Get career nodes with fallback to English
   */
  private async getAllCareerNodesWithFallback(): Promise<CareerNode[]> {
    const { data: careers, error } = await supabase
      .from('careers')
      .select(`
        *,
        career_translations!inner(
          title,
          description,
          skills,
          job_titles,
          certifications
        )
      `)
      .eq('career_translations.language_code', 'en');

    if (error) {
      throw error;
    }

    return this.convertToCareerNodes(careers);
  }

  /**
   * Get career by ID with translations
   */
  public async getCareerById(id: string): Promise<CareerNode | null> {
    try {
      const { data: career, error } = await supabase
        .from('careers')
        .select(`
          *,
          career_translations!inner(
            title,
            description,
            skills,
            job_titles,
            certifications
          )
        `)
        .eq('id', id)
        .eq('career_translations.language_code', this.currentLanguage)
        .single();

      if (error) {
        console.error('Error fetching translated career:', error);
        // Fallback to English
        if (this.currentLanguage !== 'en') {
          return this.getCareerByIdWithFallback(id);
        }
        return null;
      }

      return this.convertToCareerNode(career);
    } catch (error) {
      console.error('Error in getCareerById:', error);
      return null;
    }
  }

  /**
   * Get career by ID with English fallback
   */
  private async getCareerByIdWithFallback(id: string): Promise<CareerNode | null> {
    const { data: career, error } = await supabase
      .from('careers')
      .select(`
        *,
        career_translations!inner(
          title,
          description,
          skills,
          job_titles,
          certifications
        )
      `)
      .eq('id', id)
      .eq('career_translations.language_code', 'en')
      .single();

    if (error) {
      return null;
    }

    return this.convertToCareerNode(career);
  }

  /**
   * Get translated industry name
   */
  public async getTranslatedIndustry(industryKey: string): Promise<string> {
    const cacheKey = `industry_${industryKey}_${this.currentLanguage}`;
    
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }

    try {
      const { data: translation, error } = await supabase
        .from('industry_translations')
        .select('industry_name')
        .eq('industry_key', industryKey)
        .eq('language_code', this.currentLanguage)
        .single();

      if (error || !translation) {
        // Fallback to English
        if (this.currentLanguage !== 'en') {
          const { data: englishTranslation } = await supabase
            .from('industry_translations')
            .select('industry_name')
            .eq('industry_key', industryKey)
            .eq('language_code', 'en')
            .single();
          
          const result = englishTranslation?.industry_name || industryKey;
          this.translationCache.set(cacheKey, result);
          return result;
        }
        return industryKey;
      }

      this.translationCache.set(cacheKey, translation.industry_name);
      return translation.industry_name;
    } catch (error) {
      console.error('Error getting translated industry:', error);
      return industryKey;
    }
  }

  /**
   * Get translated skill name
   */
  public async getTranslatedSkill(skillKey: string): Promise<string> {
    const cacheKey = `skill_${skillKey}_${this.currentLanguage}`;
    
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }

    try {
      const { data: translation, error } = await supabase
        .from('skill_translations')
        .select('skill_name')
        .eq('skill_key', skillKey)
        .eq('language_code', this.currentLanguage)
        .single();

      if (error || !translation) {
        // Fallback to English
        if (this.currentLanguage !== 'en') {
          const { data: englishTranslation } = await supabase
            .from('skill_translations')
            .select('skill_name')
            .eq('skill_key', skillKey)
            .eq('language_code', 'en')
            .single();
          
          const result = englishTranslation?.skill_name || skillKey;
          this.translationCache.set(cacheKey, result);
          return result;
        }
        return skillKey;
      }

      this.translationCache.set(cacheKey, translation.skill_name);
      return translation.skill_name;
    } catch (error) {
      console.error('Error getting translated skill:', error);
      return skillKey;
    }
  }

  /**
   * Convert database career data to CareerNode format
   */
  private convertToCareerNodes(careers: any[]): CareerNode[] {
    return careers.map(career => this.convertToCareerNode(career));
  }

  /**
   * Convert single career data to CareerNode format
   */
  private convertToCareerNode(career: any): CareerNode {
    const translation = career.career_translations?.[0] || {};
    
    return {
      id: career.id,
      t: translation.title || career.title, // title
      l: career.level, // level
      s: translation.skills || career.skills || [], // skills
      c: translation.certifications || career.certifications || [], // certifications
      sr: career.salary, // salary range
      te: career.experience, // time estimate
      d: translation.description || career.description, // description
      jt: translation.job_titles || career.job_titles || [], // job titles
      r: career.requirements || { e: [], exp: '', sk: [] } // requirements
    };
  }

  /**
   * Search careers with translations
   */
  public async searchCareers(query: string, filters?: {
    industry?: string;
    level?: string;
    experience?: string;
  }): Promise<CareerNode[]> {
    try {
      let queryBuilder = supabase
        .from('careers')
        .select(`
          *,
          career_translations!inner(
            title,
            description,
            skills,
            job_titles,
            certifications
          )
        `)
        .eq('career_translations.language_code', this.currentLanguage);

      // Apply text search
      if (query) {
        queryBuilder = queryBuilder.or(
          `career_translations.title.ilike.%${query}%,career_translations.description.ilike.%${query}%`
        );
      }

      // Apply filters
      if (filters?.industry) {
        queryBuilder = queryBuilder.eq('industry', filters.industry);
      }
      if (filters?.level) {
        queryBuilder = queryBuilder.eq('level', filters.level);
      }
      if (filters?.experience) {
        queryBuilder = queryBuilder.eq('experience', filters.experience);
      }

      const { data: careers, error } = await queryBuilder;

      if (error) {
        console.error('Error searching translated careers:', error);
        throw error;
      }

      return this.convertToCareerNodes(careers || []);
    } catch (error) {
      console.error('Error in searchCareers:', error);
      throw error;
    }
  }
}

export default TranslatedCareerService;
