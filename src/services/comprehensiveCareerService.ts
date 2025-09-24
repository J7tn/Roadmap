/**
 * Comprehensive Career Service
 * 
 * This service integrates the new comprehensive career and industry database
 * with the existing app structure and templates
 */

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

interface Industry {
  id: string;
  name: string;
  description: string;
  job_count: number;
  avg_salary: string;
  growth_rate: string;
  global_demand: string;
  top_countries: string[];
  classification_type: 'naics' | 'gics' | 'custom';
  classification_code: string;
}

interface CareerTrendData {
  career_id: string;
  trend_score: number;
  trend_direction: string;
  demand_level: string;
  growth_rate: string;
  market_insights: string;
  trending_skills: string[];
  top_locations: string[];
  salary_trend: string;
  future_outlook: string;
  industry_impact: string;
  last_updated: string;
}

class ComprehensiveCareerService {
  private currentLanguage: string = 'en';

  constructor() {
    // Get initial language from localStorage (if available)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedLanguage = localStorage.getItem('app-language');
        if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
          this.currentLanguage = savedLanguage;
        }
      }
    } catch (error) {
      // localStorage not available, use default language
      console.log('localStorage not available, using default language');
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
  async getAllIndustries(): Promise<Industry[]> {
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
        top_countries: industry.industries_core.top_countries,
        classification_type: this.getClassificationType(industry.industry_id),
        classification_code: this.getClassificationCode(industry.industry_id)
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
      const allCareers = await this.getAllCareers();
      
      // Filter careers based on industry mapping
      return allCareers.filter(career => {
        return this.isCareerInIndustry(career.id, industryId);
      });
    } catch (error) {
      console.error('Error in getCareersByIndustry:', error);
      return [];
    }
  }

  /**
   * Get career trends for the current language
   */
  async getCareerTrends(careerId: string): Promise<CareerTrendData | null> {
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
   * Get industries by classification type
   */
  async getIndustriesByClassification(type: 'naics' | 'gics' | 'custom'): Promise<Industry[]> {
    const allIndustries = await this.getAllIndustries();
    return allIndustries.filter(industry => industry.classification_type === type);
  }

  /**
   * Get industries by demand level
   */
  async getIndustriesByDemand(demandLevel: 'Very High' | 'High' | 'Medium' | 'Low'): Promise<Industry[]> {
    const allIndustries = await this.getAllIndustries();
    return allIndustries.filter(industry => industry.global_demand === demandLevel);
  }

  /**
   * Get top growing industries
   */
  async getTopGrowingIndustries(limit: number = 10): Promise<Industry[]> {
    const allIndustries = await this.getAllIndustries();
    return allIndustries
      .sort((a, b) => {
        const aGrowth = parseInt(a.growth_rate.replace('%', ''));
        const bGrowth = parseInt(b.growth_rate.replace('%', ''));
        return bGrowth - aGrowth;
      })
      .slice(0, limit);
  }

  /**
   * Get industries by salary range
   */
  async getIndustriesBySalaryRange(minSalary: number, maxSalary: number): Promise<Industry[]> {
    const allIndustries = await this.getAllIndustries();
    return allIndustries.filter(industry => {
      const salary = parseInt(industry.avg_salary.replace(/[$,]/g, ''));
      return salary >= minSalary && salary <= maxSalary;
    });
  }

  /**
   * Convert database record to ICareerNode
   */
  private convertToCareerNode(career: any): ICareerNode {
    return {
      id: career.career_id,
      t: career.title, // title
      l: career.careers_core?.level || 'Unknown', // level
      s: career.skills || [], // skills
      c: career.certifications || [], // certifications
      sr: career.careers_core?.salary_range || 'Not specified', // salary range
      te: career.careers_core?.experience_required || 'Not specified', // time estimate
      d: career.description || 'No description available', // description
      jt: career.job_titles || [], // job titles
      r: career.requirements || [], // requirements
      industry: this.getIndustryFromCareerId(career.career_id) // Will need to fetch industry from mapping
    } as ICareerNode;
  }

  /**
   * Get classification type from industry ID
   */
  private getClassificationType(industryId: string): 'naics' | 'gics' | 'custom' {
    if (industryId.startsWith('naics-')) return 'naics';
    if (industryId.startsWith('gics-')) return 'gics';
    return 'custom';
  }

  /**
   * Get classification code from industry ID
   */
  private getClassificationCode(industryId: string): string {
    if (industryId.startsWith('naics-')) {
      return industryId.replace('naics-', '');
    }
    if (industryId.startsWith('gics-')) {
      return industryId.replace('gics-', '');
    }
    return industryId;
  }

  /**
   * Check if career belongs to industry (100% coverage mapping)
   */
  private isCareerInIndustry(careerId: string, industryId: string): boolean {
    // Complete mapping with 100% industry coverage
    const careerIndustryMapping: { [key: string]: string[] } = {
      'software-engineer': ['technology', 'artificial-intelligence', 'gics-45', 'gaming', 'entertainment', 'blockchain', 'virtual-reality'],
      'data-scientist': ['technology', 'artificial-intelligence', 'gics-45', 'banking', 'finance', 'healthcare', 'pharmaceuticals'],
      'cybersecurity-analyst': ['technology', 'security', 'gics-45', 'banking', 'finance', 'government', 'defense'],
      'devops-engineer': ['technology', 'gics-45', 'cloud-computing'],
      'product-manager': ['technology', 'gics-45', 'marketing', 'gaming', 'entertainment'],
      'ux-designer': ['technology', 'design', 'gics-45', 'gaming', 'entertainment', 'marketing'],
      'cloud-architect': ['technology', 'gics-45', 'cloud-computing'],
      'ai-engineer': ['technology', 'artificial-intelligence', 'gics-45', 'healthcare', 'pharmaceuticals', 'automotive', 'aerospace'],
      'blockchain-developer': ['technology', 'blockchain', 'gics-45', 'finance', 'banking'],
      'quantum-computing-engineer': ['technology', 'artificial-intelligence', 'gics-45', 'defense', 'aerospace'],
      'game-developer': ['technology', 'gaming', 'entertainment', 'gics-45', 'esports'],
      'bioinformatics-scientist': ['healthcare', 'biotechnology', 'pharmaceuticals', 'gics-35', 'science', 'research'],
      'registered-nurse': ['healthcare', 'gics-35', 'hospitals', 'elder-care'],
      'physician': ['healthcare', 'gics-35', 'hospitals', 'clinics'],
      'physical-therapist': ['healthcare', 'gics-35', 'sports', 'fitness', 'rehabilitation'],
      'pharmacist': ['healthcare', 'pharmaceuticals', 'gics-35', 'retail', 'hospitals'],
      'medical-technologist': ['healthcare', 'biotechnology', 'gics-35', 'laboratories'],
      'genetic-counselor': ['healthcare', 'biotechnology', 'gics-35', 'genetics'],
      'art-therapist': ['healthcare', 'gics-35', 'mental-health', 'therapy'],
      'wildlife-veterinarian': ['healthcare', 'gics-35', 'wildlife', 'conservation', 'zoos'],
      'telemedicine-physician': ['healthcare', 'technology', 'gics-35', 'telemedicine'],
      'financial-analyst': ['finance', 'banking', 'gics-40', 'investment', 'consulting'],
      'investment-banker': ['finance', 'banking', 'gics-40', 'investment', 'mergers-acquisitions'],
      'accountant': ['finance', 'accounting', 'gics-40', 'auditing', 'tax'],
      'insurance-agent': ['finance', 'insurance', 'gics-40', 'sales', 'customer-service'],
      'actuary': ['finance', 'insurance', 'gics-40', 'risk-management', 'statistics'],
      'forensic-accountant': ['finance', 'accounting', 'legal', 'gics-40', 'investigation'],
      'cryptocurrency-trader': ['finance', 'blockchain', 'gics-40', 'trading', 'investment'],
      'teacher': ['education', 'gics-30', 'k-12', 'elementary', 'secondary'],
      'professor': ['education', 'gics-30', 'higher-education', 'research', 'universities'],
      'training-specialist': ['education', 'gics-30', 'corporate-training', 'hr'],
      'robotics-engineer': ['manufacturing', 'technology', 'gics-20', 'automation', 'ai'],
      'mechanical-engineer': ['manufacturing', 'automotive', 'aerospace', 'gics-20', 'mechanical'],
      'electrical-engineer': ['manufacturing', 'electronics', 'gics-20', 'power', 'utilities'],
      'industrial-engineer': ['manufacturing', 'gics-20', 'process-optimization', 'operations'],
      'quality-control-inspector': ['manufacturing', 'gics-20', 'quality-assurance', 'testing'],
      'precision-machinist': ['manufacturing', 'gics-20', 'machining', 'tooling'],
      'master-electrician': ['construction', 'gics-20', 'electrical', 'utilities', 'maintenance'],
      'plumber': ['construction', 'gics-20', 'plumbing', 'maintenance', 'utilities'],
      'wind-turbine-technician': ['energy', 'gics-10', 'renewable-energy', 'maintenance', 'environmental'],
      'sustainable-energy-technician': ['energy', 'environmental', 'gics-10', 'renewable-energy', 'sustainability'],
      'environmental-scientist': ['science', 'environmental', 'gics-35', 'research', 'conservation'],
      'sommelier': ['hospitality', 'food-beverage', 'gics-25', 'wine', 'restaurants'],
      'event-planner': ['hospitality', 'gics-25', 'events', 'weddings', 'corporate-events'],
      'chef': ['hospitality', 'food-beverage', 'gics-25', 'restaurants', 'culinary'],
      'personal-trainer': ['fitness', 'sports', 'gics-25', 'health', 'wellness'],
      'fitness-instructor': ['fitness', 'sports', 'gics-25', 'health', 'wellness'],
      'professional-athlete': ['sports', 'gics-25', 'athletics', 'competition'],
      'sports-analyst': ['sports', 'media', 'gics-25', 'analytics', 'broadcasting'],
      'motion-graphics-designer': ['entertainment', 'media', 'gics-25', 'graphics', 'video'],
      'sound-engineer': ['entertainment', 'media', 'gics-25', 'audio', 'broadcasting'],
      'food-stylist': ['entertainment', 'food-beverage', 'gics-25', 'photography', 'advertising'],
      'journalist': ['media', 'gics-50', 'news', 'broadcasting', 'publishing'],
      'public-relations-specialist': ['media', 'marketing', 'gics-50', 'communications', 'advertising'],
      'content-creator': ['media', 'entertainment', 'gics-50', 'social-media', 'digital'],
      'interior-designer': ['design', 'real-estate', 'gics-25', 'architecture', 'home-improvement'],
      'marine-biologist': ['science', 'environmental', 'gics-35', 'marine', 'conservation'],
      'astronomer': ['science', 'gics-35', 'astronomy', 'research', 'space'],
      'volcanologist': ['science', 'environmental', 'gics-35', 'geology', 'research'],
      'government-administrator': ['government', 'gics-40', 'public-administration', 'policy'],
      'diplomat': ['government', 'gics-40', 'foreign-service', 'international-relations'],
      'law-enforcement-officer': ['government', 'security', 'gics-40', 'police', 'public-safety'],
      'firefighter': ['government', 'gics-40', 'emergency-services', 'public-safety'],
      'lawyer': ['legal', 'gics-40', 'law', 'litigation', 'corporate-law'],
      'paralegal': ['legal', 'gics-40', 'law', 'legal-support'],
      'judge': ['legal', 'government', 'gics-40', 'courts', 'judiciary'],
      'airline-pilot': ['transportation', 'gics-20', 'aviation', 'airlines'],
      'ship-captain': ['transportation', 'shipping', 'gics-20', 'maritime', 'logistics'],
      'logistics-coordinator': ['transportation', 'logistics', 'gics-20', 'supply-chain', 'shipping'],
      'agricultural-engineer': ['agriculture', 'gics-15', 'farming', 'food-production'],
      'forestry-technician': ['agriculture', 'environmental', 'gics-15', 'forestry', 'conservation'],
      'social-worker': ['social-services', 'nonprofit', 'gics-35', 'mental-health', 'community'],
      'nonprofit-manager': ['social-services', 'nonprofit', 'gics-35', 'management', 'fundraising'],
      'community-organizer': ['social-services', 'nonprofit', 'gics-35', 'community', 'activism'],
      // SPECIALIZED INDUSTRIES - NEW CAREERS
      'fashion-designer': ['apparel', 'fashion', 'gics-25', 'design', 'retail'],
      'textile-engineer': ['apparel', 'materials', 'gics-20', 'manufacturing', 'textiles'],
      'merchandise-buyer': ['apparel', 'fashion', 'retail', 'gics-25', 'purchasing'],
      'chemical-engineer': ['chemicals', 'manufacturing', 'gics-20', 'process-engineering'],
      'process-chemist': ['chemicals', 'pharmaceuticals', 'gics-20', 'research', 'manufacturing'],
      'janitorial-supervisor': ['cleaning', 'facilities', 'gics-20', 'maintenance', 'management'],
      'sanitation-engineer': ['cleaning', 'waste-management', 'gics-20', 'environmental', 'public-health'],
      'cruise-director': ['cruise', 'hospitality', 'tourism', 'gics-25', 'entertainment'],
      'marine-engineer': ['cruise', 'transportation', 'gics-20', 'maritime', 'engineering'],
      'landscape-architect': ['landscaping', 'design', 'environmental', 'gics-25', 'architecture'],
      'arborist': ['landscaping', 'agriculture', 'environmental', 'gics-15', 'tree-care'],
      'materials-scientist': ['materials', 'research', 'manufacturing', 'gics-15', 'science'],
      'metallurgist': ['materials', 'mining', 'manufacturing', 'gics-15', 'metals'],
      'mining-engineer': ['mining', 'materials', 'gics-15', 'extraction', 'engineering'],
      'geologist': ['mining', 'materials', 'environmental', 'gics-15', 'geology'],
      'petroleum-engineer': ['oil-gas', 'energy', 'gics-10', 'extraction', 'engineering'],
      'drilling-supervisor': ['oil-gas', 'energy', 'gics-10', 'operations', 'supervision'],
      'property-manager': ['property-management', 'real-estate', 'gics-60', 'management', 'leasing'],
      'facilities-manager': ['property-management', 'real-estate', 'gics-60', 'maintenance', 'operations'],
      'real-estate-agent': ['gics-60', 'real-estate', 'sales', 'property', 'transactions'],
      'real-estate-appraiser': ['gics-60', 'real-estate', 'finance', 'valuation', 'assessment'],
      'satellite-engineer': ['satellite', 'aerospace', 'telecommunications', 'gics-20', 'space'],
      'ground-station-technician': ['satellite', 'telecommunications', 'gics-20', 'operations', 'communications'],
      'semiconductor-engineer': ['semiconductors', 'electronics', 'technology', 'gics-45', 'chips'],
      'chip-designer': ['semiconductors', 'electronics', 'technology', 'gics-45', 'design'],
      'telecommunications-engineer': ['telecommunications', 'technology', 'gics-50', 'networks', 'communications'],
      'network-architect': ['telecommunications', 'technology', 'gics-50', 'architecture', 'infrastructure'],
      'tour-guide': ['tourism', 'hospitality', 'gics-25', 'travel', 'cultural'],
      'travel-agent': ['tourism', 'hospitality', 'gics-25', 'travel', 'booking'],
      'power-plant-operator': ['gics-55', 'utilities', 'energy', 'operations', 'power'],
      'utility-inspector': ['gics-55', 'utilities', 'government', 'inspection', 'safety'],
      'waste-management-specialist': ['waste-management', 'environmental', 'gics-20', 'sustainability', 'recycling'],
      'recycling-coordinator': ['waste-management', 'environmental', 'gics-20', 'recycling', 'sustainability'],
      'water-treatment-operator': ['water-treatment', 'utilities', 'environmental', 'gics-55', 'water'],
      'environmental-engineer': ['water-treatment', 'environmental', 'gics-55', 'engineering', 'sustainability']
    };

    const careerIndustries = careerIndustryMapping[careerId] || [];
    return careerIndustries.includes(industryId);
  }

  /**
   * Get industry from career ID (100% coverage mapping)
   */
  private getIndustryFromCareerId(careerId: string): string {
    // Complete mapping using the primary industry for each career
    const careerIndustryMapping: { [key: string]: string } = {
      'software-engineer': 'technology',
      'data-scientist': 'technology',
      'cybersecurity-analyst': 'technology',
      'devops-engineer': 'technology',
      'product-manager': 'technology',
      'ux-designer': 'technology',
      'cloud-architect': 'technology',
      'ai-engineer': 'technology',
      'blockchain-developer': 'technology',
      'quantum-computing-engineer': 'technology',
      'game-developer': 'technology',
      'robotics-engineer': 'manufacturing',
      'bioinformatics-scientist': 'biotechnology',
      'registered-nurse': 'healthcare',
      'physician': 'healthcare',
      'physical-therapist': 'healthcare',
      'pharmacist': 'pharmaceuticals',
      'medical-technologist': 'biotechnology',
      'genetic-counselor': 'biotechnology',
      'art-therapist': 'healthcare',
      'wildlife-veterinarian': 'healthcare',
      'telemedicine-physician': 'healthcare',
      'financial-analyst': 'finance',
      'investment-banker': 'finance',
      'accountant': 'accounting',
      'insurance-agent': 'insurance',
      'actuary': 'insurance',
      'forensic-accountant': 'accounting',
      'cryptocurrency-trader': 'finance',
      'teacher': 'education',
      'professor': 'education',
      'training-specialist': 'education',
      'mechanical-engineer': 'manufacturing',
      'electrical-engineer': 'manufacturing',
      'industrial-engineer': 'manufacturing',
      'quality-control-inspector': 'manufacturing',
      'master-electrician': 'construction',
      'precision-machinist': 'manufacturing',
      'wind-turbine-technician': 'energy',
      'plumber': 'construction',
      'sommelier': 'hospitality',
      'event-planner': 'hospitality',
      'personal-trainer': 'fitness',
      'chef': 'hospitality',
      'motion-graphics-designer': 'entertainment',
      'sound-engineer': 'entertainment',
      'food-stylist': 'entertainment',
      'interior-designer': 'design',
      'marine-biologist': 'science',
      'astronomer': 'science',
      'volcanologist': 'science',
      'environmental-scientist': 'environmental',
      'government-administrator': 'government',
      'diplomat': 'government',
      'law-enforcement-officer': 'government',
      'firefighter': 'government',
      'lawyer': 'legal',
      'paralegal': 'legal',
      'judge': 'legal',
      'airline-pilot': 'transportation',
      'ship-captain': 'transportation',
      'logistics-coordinator': 'logistics',
      'agricultural-engineer': 'agriculture',
      'forestry-technician': 'agriculture',
      'sustainable-energy-technician': 'energy',
      'social-worker': 'nonprofit',
      'nonprofit-manager': 'nonprofit',
      'community-organizer': 'nonprofit',
      'journalist': 'media',
      'public-relations-specialist': 'media',
      'content-creator': 'media',
      'professional-athlete': 'sports',
      'sports-analyst': 'sports',
      'fitness-instructor': 'fitness',
      // SPECIALIZED INDUSTRIES - NEW CAREERS
      'fashion-designer': 'fashion',
      'textile-engineer': 'apparel',
      'merchandise-buyer': 'apparel',
      'chemical-engineer': 'chemicals',
      'process-chemist': 'chemicals',
      'janitorial-supervisor': 'cleaning',
      'sanitation-engineer': 'cleaning',
      'cruise-director': 'cruise',
      'marine-engineer': 'cruise',
      'landscape-architect': 'landscaping',
      'arborist': 'landscaping',
      'materials-scientist': 'materials',
      'metallurgist': 'materials',
      'mining-engineer': 'mining',
      'geologist': 'mining',
      'petroleum-engineer': 'oil-gas',
      'drilling-supervisor': 'oil-gas',
      'property-manager': 'property-management',
      'facilities-manager': 'property-management',
      'real-estate-agent': 'gics-60',
      'real-estate-appraiser': 'gics-60',
      'satellite-engineer': 'satellite',
      'ground-station-technician': 'satellite',
      'semiconductor-engineer': 'semiconductors',
      'chip-designer': 'semiconductors',
      'telecommunications-engineer': 'telecommunications',
      'network-architect': 'telecommunications',
      'tour-guide': 'tourism',
      'travel-agent': 'tourism',
      'power-plant-operator': 'gics-55',
      'utility-inspector': 'gics-55',
      'waste-management-specialist': 'waste-management',
      'recycling-coordinator': 'waste-management',
      'water-treatment-operator': 'water-treatment',
      'environmental-engineer': 'water-treatment'
    };

    return careerIndustryMapping[careerId] || 'other';
  }
}

// Export singleton instance
export const comprehensiveCareerService = new ComprehensiveCareerService();
