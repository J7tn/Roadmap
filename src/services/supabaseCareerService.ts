import { supabase } from '@/lib/supabase';
import { ICareerNode, ICareerPath, CareerLevel } from '@/types/career';

export interface SupabaseCareerNode {
  id: string;
  career_path_id: string;
  level: string;
  salary_range: string;
  time_to_achieve: string;
  requirements: any;
  language_code: string;
  title: string;
  description: string;
  skills: string[];
  certifications: string[];
  job_titles: string[];
  path_name: string;
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
      const { data, error } = await supabase
        .from('career_nodes_with_translations')
        .select('*')
        .eq('language_code', this.currentLanguage)
        .order('career_path_id, level');

      if (error) {
        console.error('Error fetching career nodes:', error);
        // Fallback to English if current language fails
        if (this.currentLanguage !== 'en') {
          return this.getAllCareerNodesWithFallback();
        }
        return [];
      }

      return this.convertToCareerNodes(data || []);
    } catch (error) {
      console.error('Error in getAllCareerNodes:', error);
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
      id: data.id,
      t: data.title,
      l: data.level as CareerLevel,
      s: data.skills || [],
      c: data.certifications || [],
      sr: data.salary_range || '',
      te: data.time_to_achieve || '',
      d: data.description || '',
      jt: data.job_titles || [],
      r: data.requirements || {}
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