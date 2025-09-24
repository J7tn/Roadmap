import { createClient } from '@supabase/supabase-js';
import { ICareerNode, ICareerPath } from '@/types/career';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// New organized interfaces
export interface Industry {
  id: string;
  name_en: string;
  description_en: string;
  icon: string;
  job_count: number;
  avg_salary: string;
  growth_rate: string;
  global_demand: string;
  top_countries: string[];
  translations?: IndustryTranslation[];
}

export interface IndustryTranslation {
  industry_key: string;
  language_code: string;
  industry_name: string;
  industry_description: string;
}

export interface Career {
  id: string;
  industry_id: string;
  level: string;
  salary_range: string;
  experience_required: string;
  content?: CareerContent;
  trends?: CareerTrend;
  industry?: Industry;
}

export interface CareerContent {
  career_id: string;
  language_code: string;
  title: string;
  description: string;
  skills: string[];
  job_titles: string[];
  certifications: string[];
  requirements: any;
}

export interface CareerTrend {
  career_id: string;
  trend_score: number;
  trend_direction: string;
  demand_level: string;
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
  currency_code: string;
  salary_data: any;
  confidence_score: number;
  last_updated: string;
  next_update_due: string;
}

class OrganizedCareerService {
  private currentLanguage: string = 'en';

  /**
   * Set the current language for translations
   */
  public setLanguage(language: string): void {
    this.currentLanguage = language.toLowerCase();
  }

  /**
   * Get the current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get all industries with translations for the current language
   */
  public async getIndustries(): Promise<Industry[]> {
    try {
      // First get all industries
      const { data: industries, error: industriesError } = await supabase
        .from('industries_new')
        .select('*');

      if (industriesError) {
        console.error('Error fetching industries:', industriesError);
        return [];
      }

      // Then get translations for current language
      const { data: translations, error: translationsError } = await supabase
        .from('industry_translations')
        .select('*')
        .eq('language_code', this.currentLanguage);

      if (translationsError) {
        console.error('Error fetching industry translations:', translationsError);
        // Return industries without translations
        return industries.map(industry => ({
          ...industry,
          industry_translations: []
        }));
      }

      // Combine industries with their translations
      return industries.map(industry => {
        const translation = translations.find(t => t.industry_key === industry.id);
        return {
          ...industry,
          industry_translations: translation ? [translation] : []
        };
      });
    } catch (error) {
      console.error('Error in getIndustries:', error);
      return [];
    }
  }

  /**
   * Get careers by industry with translations for the current language
   */
  public async getCareersByIndustry(industryId: string): Promise<ICareerNode[]> {
    try {
      const { data, error } = await supabase
        .from('careers_new')
        .select(`
          *,
          career_content!inner(title, description, skills, job_titles, certifications, requirements),
          career_trends_new(*)
        `)
        .eq('industry_id', industryId)
        .eq('career_content.language_code', this.currentLanguage);

      if (error) {
        console.error('Error fetching careers by industry:', error);
        return [];
      }

      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error('Error in getCareersByIndustry:', error);
      return [];
    }
  }

  /**
   * Get a single career with all data for the current language
   */
  public async getCareer(careerId: string): Promise<ICareerNode | null> {
    try {
      const { data, error } = await supabase
        .from('careers_new')
        .select(`
          *,
          career_content!inner(*),
          career_trends_new(*),
          industries_new(name_en, industry_translations!inner(name))
        `)
        .eq('id', careerId)
        .eq('career_content.language_code', this.currentLanguage)
        .single();

      if (error) {
        console.error('Error fetching career:', error);
        return null;
      }

      const careerNodes = this.convertToCareerNodes([data]);
      return careerNodes[0] || null;
    } catch (error) {
      console.error('Error in getCareer:', error);
      return null;
    }
  }

  /**
   * Search careers by query with translations for the current language
   */
  public async searchCareers(query: string, industryId?: string, level?: string): Promise<ICareerNode[]> {
    try {
      let queryBuilder = supabase
        .from('careers_new')
        .select(`
          *,
          career_content!inner(title, description, skills, job_titles, certifications, requirements),
          career_trends_new(*)
        `)
        .eq('career_content.language_code', this.currentLanguage)
        .textSearch('career_content.title,career_content.description', query);

      if (industryId && industryId !== 'all') {
        queryBuilder = queryBuilder.eq('industry_id', industryId);
      }

      if (level) {
        queryBuilder = queryBuilder.eq('level', level);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error searching careers:', error);
        return [];
      }

      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error('Error in searchCareers:', error);
      return [];
    }
  }

  /**
   * Get all careers with translations for the current language
   */
  public async getAllCareers(): Promise<ICareerNode[]> {
    try {
      const { data, error } = await supabase
        .from('careers_new')
        .select(`
          *,
          career_content!inner(title, description, skills, job_titles, certifications, requirements),
          career_trends_new(*)
        `)
        .eq('career_content.language_code', this.currentLanguage);

      if (error) {
        console.error('Error fetching all careers:', error);
        return [];
      }

      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error('Error in getAllCareers:', error);
      return [];
    }
  }

  /**
   * Convert database career data to ICareerNode format
   */
  private convertToCareerNodes(careers: any[]): ICareerNode[] {
    return careers.map(career => {
      const content = career.career_content;
      const trends = career.career_trends_new;

      return {
        id: career.id,
        t: content.title, // title
        l: career.level, // level
        s: content.skills || [], // skills
        c: content.certifications || [], // certifications
        sr: career.salary_range, // salary range
        te: career.experience_required, // time estimate/experience
        d: content.description, // description
        jt: content.job_titles || [], // job titles
        r: content.requirements || { e: [], exp: '', sk: [] }, // requirements
        industry: career.industry_id,
        // Add trend data if available
        ...(trends && {
          trend_score: trends.trend_score,
          trend_direction: trends.trend_direction,
          demand_level: trends.demand_level,
          market_insights: trends.market_insights,
          top_locations: trends.top_locations,
          future_outlook: trends.future_outlook
        })
      };
    });
  }

  /**
   * Get career paths (for compatibility with existing code)
   */
  public async getCareerPaths(): Promise<ICareerPath[]> {
    // This is a simplified implementation
    // In a real scenario, you might want to create a separate career_paths table
    const careers = await this.getAllCareers();
    const industries = await this.getIndustries();

    return industries.map(industry => ({
      id: industry.id,
      n: industry.translations?.[0]?.industry_name || industry.name_en,
      cat: industry.id as any, // Cast to IndustryCategory
      nodes: careers.filter(career => career.industry === industry.id),
      conn: [] // Empty connections for now
    }));
  }
}

// Export singleton instance
export const organizedCareerService = new OrganizedCareerService();
export default organizedCareerService;
