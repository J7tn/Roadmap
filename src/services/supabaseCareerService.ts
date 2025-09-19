import { supabase } from '@/lib/supabase';
import { ICareerNode, ICareerPath, CareerLevel } from '@/types/career';

export interface SupabaseCareerNode {
  career_node_id: string; // Changed from id to career_node_id
  career_path_id: string;
  level: string;
  salary_range?: string; // Made optional since it might not be in the view
  time_to_achieve?: string; // Made optional since it might not be in the view
  requirements?: any; // Made optional since it might not be in the view
  language_code: string;
  title: string;
  description: string;
  skills: string[];
  certifications: string[];
  job_titles: string[];
  career_path_name?: string; // Changed from path_name to career_path_name
  category: string;
  industry: string;
}

export interface SupabaseCareerPath {
  id: string;
  name: string;
  category: string;
  industry: string;
  description: string;
  language_code: string;
  translated_name: string;
  translated_description: string;
}

class SupabaseCareerService {
  private static instance: SupabaseCareerService;
  private currentLanguage: string = 'en';

  private constructor() {}

  public static getInstance(): SupabaseCareerService {
    if (!SupabaseCareerService.instance) {
      SupabaseCareerService.instance = new SupabaseCareerService();
    }
    return SupabaseCareerService.instance;
  }

  public setLanguage(language: string): void {
    this.currentLanguage = language;
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get all career nodes with translations for the current language
   */
  public async getAllCareerNodes(): Promise<ICareerNode[]> {
    try {
      // First, get all unique industries
      const { data: industries, error: industryError } = await supabase
        .from('career_nodes_with_translations')
        .select('industry')
        .eq('language_code', this.currentLanguage)
        .not('industry', 'is', null);

      if (industryError) {
        console.error('Error fetching industries:', industryError);
        return [];
      }

      const uniqueIndustries = [...new Set(industries?.map(i => i.industry) || [])];
      console.log('Available industries:', uniqueIndustries.join(','));

      // Get a sample from each industry to ensure diversity
      const allCareers: any[] = [];
      for (const industry of uniqueIndustries) {
        const { data: industryCareers, error: industryError } = await supabase
          .from('career_nodes_with_translations')
          .select('*')
          .eq('language_code', this.currentLanguage)
          .eq('industry', industry)
          .order('career_node_id')
          .limit(20); // Get up to 20 careers per industry

        if (industryError) {
          console.error(`Error fetching careers for industry ${industry}:`, JSON.stringify(industryError, null, 2));
        } else if (industryCareers && industryCareers.length > 0) {
          console.log(`Loaded ${industryCareers.length} careers for industry: ${industry}`);
          allCareers.push(...industryCareers);
        } else {
          console.log(`No careers found for industry: ${industry}`);
        }
      }

      console.log(`Loaded ${allCareers.length} careers from ${uniqueIndustries.length} industries`);
      return this.convertToCareerNodes(allCareers);
    } catch (error) {
      console.error('Error in getAllCareerNodes:', error);
      return [];
    }
  }

  /**
   * Get career nodes by specific industry
   */
  public async getCareerNodesByIndustry(industry: string): Promise<ICareerNode[]> {
    try {
      console.log(`Loading careers for industry: ${industry}`);
      
      const { data, error } = await supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('language_code', this.currentLanguage)
        .eq('industry', industry)
        .order('career_node_id');

      if (error) {
        console.error(`Error fetching careers for industry ${industry}:`, error);
        // Fallback to English if current language fails
        if (this.currentLanguage !== 'en') {
          return this.getCareerNodesByIndustryWithFallback(industry);
        }
        return [];
      }

      console.log(`Loaded ${data?.length || 0} careers for industry: ${industry}`);
      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error(`Error in getCareerNodesByIndustry for ${industry}:`, error);
      return [];
    }
  }

  /**
   * Get career nodes by specific industry with English fallback
   */
  private async getCareerNodesByIndustryWithFallback(industry: string): Promise<ICareerNode[]> {
    try {
      const { data, error } = await supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('language_code', 'en')
        .eq('industry', industry)
        .order('career_node_id');

      if (error) {
        console.error(`Error fetching English fallback careers for industry ${industry}:`, error);
        return [];
      }

      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error(`Error in getCareerNodesByIndustryWithFallback for ${industry}:`, error);
      return [];
    }
  }

  /**
   * Get all career nodes with English fallback
   */
  private async getAllCareerNodesWithFallback(): Promise<ICareerNode[]> {
    try {
      const { data, error } = await supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('language_code', 'en')
        .order('career_path_id, level');

      if (error) {
        console.error('Error fetching English fallback career nodes:', error);
        return [];
      }

      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error('Error in getAllCareerNodesWithFallback:', error);
      return [];
    }
  }

  /**
   * Get career node by ID with translations
   */
  public async getCareerNodeById(id: string): Promise<ICareerNode | null> {
    try {
      const { data, error } = await supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('id', id)
        .eq('language_code', this.currentLanguage)
        .single();

      if (error) {
        console.error('Error fetching career node:', error);
        // Fallback to English
        if (this.currentLanguage !== 'en') {
          return this.getCareerNodeByIdWithFallback(id);
        }
        return null;
      }

      return this.convertToCareerNode(data);
    } catch (error) {
      console.error('Error in getCareerNodeById:', error);
      return null;
    }
  }

  /**
   * Get career node by ID with English fallback
   */
  private async getCareerNodeByIdWithFallback(id: string): Promise<ICareerNode | null> {
    try {
      const { data, error } = await supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('id', id)
        .eq('language_code', 'en')
        .single();

      if (error) {
        console.error('Error fetching English fallback career node:', error);
        return null;
      }

      return this.convertToCareerNode(data);
    } catch (error) {
      console.error('Error in getCareerNodeByIdWithFallback:', error);
      return null;
    }
  }

  /**
   * Get career path by ID with translations
   */
  public async getCareerPathById(id: string): Promise<ICareerPath | null> {
    try {
      // Get career path info
      const { data: pathData, error: pathError } = await supabase
        .from('career_path_translations')
        .select(`
          *,
          career_paths!inner(*)
        `)
        .eq('career_path_id', id)
        .eq('language_code', this.currentLanguage)
        .single();

      if (pathError) {
        console.error('Error fetching career path:', pathError);
        // Fallback to English
        if (this.currentLanguage !== 'en') {
          return this.getCareerPathByIdWithFallback(id);
        }
        return null;
      }

      // Get career nodes for this path
      const { data: nodesData, error: nodesError } = await supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('career_path_id', id)
        .eq('language_code', this.currentLanguage)
        .order('level');

      if (nodesError) {
        console.error('Error fetching career path nodes:', nodesError);
        return null;
      }

      return this.convertToCareerPath(pathData, nodesData || []);
    } catch (error) {
      console.error('Error in getCareerPathById:', error);
      return null;
    }
  }

  /**
   * Get career path by ID with English fallback
   */
  private async getCareerPathByIdWithFallback(id: string): Promise<ICareerPath | null> {
    try {
      // Get career path info
      const { data: pathData, error: pathError } = await supabase
        .from('career_path_translations')
        .select(`
          *,
          career_paths!inner(*)
        `)
        .eq('career_path_id', id)
        .eq('language_code', 'en')
        .single();

      if (pathError) {
        console.error('Error fetching English fallback career path:', pathError);
        return null;
      }

      // Get career nodes for this path
      const { data: nodesData, error: nodesError } = await supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('career_path_id', id)
        .eq('language_code', 'en')
        .order('level');

      if (nodesError) {
        console.error('Error fetching English fallback career path nodes:', nodesError);
        return null;
      }

      return this.convertToCareerPath(pathData, nodesData || []);
    } catch (error) {
      console.error('Error in getCareerPathByIdWithFallback:', error);
      return null;
    }
  }

  /**
   * Search career nodes with translations
   */
  public async searchCareerNodes(query: string, filters?: {
    industry?: string;
    level?: string;
    category?: string;
  }): Promise<ICareerNode[]> {
    try {
      let queryBuilder = supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('language_code', this.currentLanguage);

      // Apply text search
      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      // Apply filters
      if (filters?.industry) {
        queryBuilder = queryBuilder.eq('industry', filters.industry);
      }
      if (filters?.level) {
        queryBuilder = queryBuilder.eq('level', filters.level);
      }
      if (filters?.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      const { data, error } = await queryBuilder.order('career_path_id, level');

      if (error) {
        console.error('Error searching career nodes:', error);
        // Fallback to English if current language fails
        if (this.currentLanguage !== 'en') {
          return this.searchCareerNodesWithFallback(query, filters);
        }
        return [];
      }

      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error('Error in searchCareerNodes:', error);
      return [];
    }
  }

  /**
   * Search career nodes with English fallback
   */
  private async searchCareerNodesWithFallback(query: string, filters?: {
    industry?: string;
    level?: string;
    category?: string;
  }): Promise<ICareerNode[]> {
    try {
      let queryBuilder = supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('language_code', 'en');

      // Apply text search
      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      // Apply filters
      if (filters?.industry) {
        queryBuilder = queryBuilder.eq('industry', filters.industry);
      }
      if (filters?.level) {
        queryBuilder = queryBuilder.eq('level', filters.level);
      }
      if (filters?.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      const { data, error } = await queryBuilder.order('career_path_id, level');

      if (error) {
        console.error('Error searching English fallback career nodes:', error);
        return [];
      }

      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error('Error in searchCareerNodesWithFallback:', error);
      return [];
    }
  }

  /**
   * Get all career paths with translations
   */
  public async getAllCareerPaths(): Promise<ICareerPath[]> {
    try {
      const { data, error } = await supabase
        .from('career_path_translations')
        .select(`
          *,
          career_paths!inner(*)
        `)
        .eq('language_code', this.currentLanguage)
        .order('name');

      if (error) {
        console.error('Error fetching career paths:', error);
        // Fallback to English if current language fails
        if (this.currentLanguage !== 'en') {
          return this.getAllCareerPathsWithFallback();
        }
        return [];
      }

      return this.convertToCareerPaths(data || []);
    } catch (error) {
      console.error('Error in getAllCareerPaths:', error);
      return [];
    }
  }

  /**
   * Get all career paths with English fallback
   */
  private async getAllCareerPathsWithFallback(): Promise<ICareerPath[]> {
    try {
      const { data, error } = await supabase
        .from('career_path_translations')
        .select(`
          *,
          career_paths!inner(*)
        `)
        .eq('language_code', 'en')
        .order('name');

      if (error) {
        console.error('Error fetching English fallback career paths:', error);
        return [];
      }

      return this.convertToCareerPaths(data || []);
    } catch (error) {
      console.error('Error in getAllCareerPathsWithFallback:', error);
      return [];
    }
  }

  /**
   * Convert Supabase career node data to ICareerNode format
   */
  private convertToCareerNode(data: SupabaseCareerNode): ICareerNode {
    return {
      id: data.career_node_id, // Use career_node_id instead of id
      t: data.title,
      l: data.level as CareerLevel,
      s: data.skills || [],
      c: data.certifications || [],
      sr: data.salary_range || '',
      te: data.time_to_achieve || '',
      d: data.description || '',
      jt: data.job_titles || [],
      industry: data.industry,
      r: data.requirements || { e: [], exp: '', sk: [] } // Provide default structure
    };
  }

  /**
   * Convert array of Supabase career node data to ICareerNode array
   */
  private convertToCareerNodes(data: SupabaseCareerNode[]): ICareerNode[] {
    return data.map(node => this.convertToCareerNode(node));
  }

  /**
   * Convert Supabase career path data to ICareerPath format
   */
  private convertToCareerPath(pathData: any, nodesData: SupabaseCareerNode[]): ICareerPath {
    return {
      id: pathData.career_path_id,
      n: pathData.name,
      cat: pathData.career_paths.category,
      nodes: nodesData.map(node => this.convertToCareerNode(node)),
      conn: [] // Connections not implemented in current schema
    };
  }

  /**
   * Convert array of Supabase career path data to ICareerPath array
   */
  private convertToCareerPaths(data: any[]): ICareerPath[] {
    return data.map(path => ({
      id: path.career_path_id,
      n: path.name,
      cat: path.career_paths.category,
      nodes: [], // Will be populated separately if needed
      conn: []
    }));
  }
}

export default SupabaseCareerService;