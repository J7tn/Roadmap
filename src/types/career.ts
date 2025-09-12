// Optimized career data interfaces for mobile performance
// Designed to minimize bundle size while maintaining functionality

export type CareerLevel = 'E' | 'I' | 'A' | 'X'; // Entry, Intermediate, Advanced, Expert
export type IndustryCategory = 
  | 'tech' | 'healthcare' | 'business' | 'education' | 'creative' 
  | 'finance' | 'marketing' | 'engineering' | 'science' | 'legal'
  | 'government' | 'nonprofit' | 'trades' | 'hospitality' | 'media'
  | 'digital-creator' | 'public-service' | 'sanitation' | 'military'
  | 'music' | 'gaming-casino' | 'transportation' | 'retail'
  | 'agriculture' | 'manufacturing' | 'construction' | 'specialized-trades' | 'drones-aviation'
  | 'marine-science' | 'investment-finance' | 'middle-management' | 'real-estate'
  | 'emergency-services' | 'emerging-tech' | 'environmental' | 'space-aerospace';

// Global career data interfaces
export type CountryCode = 
  | 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'NL' | 'SE' | 'CH' 
  | 'AU' | 'NZ' | 'JP' | 'SG' | 'KR' | 'AE' | 'IL';

export interface ICountryInfo {
  code: CountryCode;
  name: string;
  currency: string;
  avgCostOfLiving: number; // Index relative to US (100)
  safetyRating: number; // 1-10 scale
  visaDifficulty: 'easy' | 'medium' | 'hard';
  remoteWorkFriendly: boolean;
  techHub: boolean;
}

// Optimized career node interface (minimized field names)
export interface ICareerNode {
  id: string;           // Unique identifier
  t: string;           // title (abbreviated)
  l: CareerLevel;      // level (single char)
  s: string[];         // skills (array)
  c: string[];         // certifications
  sr: string;          // salary range
  te: string;          // time estimate
  d: string;           // description
  jt: string[];        // job titles
  r: {                 // requirements
    e: string[];       // education
    exp: string;       // experience
    sk: string[];      // skills
  };
  // Optional: Global data for countries that support this role
  global?: {
    [countryCode in CountryCode]?: {
      salaryRange: string;
      demand: 'high' | 'medium' | 'low';
      visaInfo: string;
      companies: string[];
      requirements: string[];
    };
  };
}

// Optimized career path interface
export interface ICareerPath {
  id: string;
  n: string;           // name
  cat: IndustryCategory; // category
  nodes: ICareerNode[];
  conn: Array<{        // connections
    s: string;         // source
    t: string;         // target
    req: string[];     // requirements
  }>;
  // Optional: Global availability
  global?: {
    availableCountries: CountryCode[];
    remoteFriendly: boolean;
    visaFriendlyCountries: CountryCode[];
  };
}

// Industry category interface
export interface IIndustryCategory {
  id: IndustryCategory;
  name: string;
  icon: string;
  description: string;
  jobCount: number;
  avgSalary: string;
  growthRate: string; // "High", "Medium", "Low"
  globalDemand: 'high' | 'medium' | 'low';
  topCountries: CountryCode[];
}

// User profile interface for personalization
export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  currentRole?: string;
  skills: string[];
  interests: string[];
  education: string[];
  experience: number; // years
  goals: ICareerGoal[];
  bookmarkedPaths: string[];
  progress: IProgressTracker;
}

// Career goal interface
export interface ICareerGoal {
  id: string;
  targetRole: string;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  milestones: IMilestone[];
}

// Milestone interface
export interface IMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

// Progress tracker interface
export interface IProgressTracker {
  completedSkills: string[];
  completedCertifications: string[];
  timeSpent: number; // hours
  lastActivity: string;
}

// Skill interface with proficiency levels
export interface ISkill {
  name: string;
  level: number; // 0-100
  category: 'technical' | 'soft' | 'domain';
  relevance: number; // 0-100 (how relevant to user's goals)
}

// Certification interface
export interface ICertification {
  name: string;
  provider: string;
  duration: string;
  cost: string;
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Job title interface
export interface IJobTitle {
  title: string;
  company: string;
  description: string;
  requirements: string[];
}

// Career search filters
export interface ICareerFilters {
  industry?: IndustryCategory[];
  level?: CareerLevel[];
  salaryMin?: number;
  salaryMax?: number;
  remoteFriendly?: boolean;
  educationLevel?: string[];
  skills?: string[];
  countries?: CountryCode[];
  visaFriendly?: boolean;
  remoteOnly?: boolean;
}

// Career recommendation interface
export interface ICareerRecommendation {
  careerId: string;
  matchScore: number; // 0-100
  reasons: string[];
  skillGaps: string[];
  timeToTransition: string;
  estimatedSalary: string;
}

// Performance optimization: Lazy loading interface
export interface ILazyCareerData {
  id: string;
  loaded: boolean;
  data?: ICareerPath;
  loading: boolean;
  error?: string;
}

// Cache interface for performance
export interface ICareerCache {
  [key: string]: {
    data: ICareerPath;
    timestamp: number;
    ttl: number; // time to live in milliseconds
  };
}

// API response interfaces
export interface ICareerAPIResponse {
  success: boolean;
  data?: ICareerPath | ICareerPath[];
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Search result interface
export interface ICareerSearchResult {
  careers: ICareerPath[];
  total: number;
  filters: ICareerFilters;
  suggestions: string[];
}

// Export all interfaces for easy importing
export type {
  ICareerNode as CareerNode,
  ICareerPath as CareerPath,
  IIndustryCategory as IndustryCategory,
  IUserProfile as UserProfile,
  ICareerGoal as CareerGoal,
  IMilestone as Milestone,
  IProgressTracker as ProgressTracker,
  ISkill as Skill,
  ICertification as Certification,
  IJobTitle as JobTitle,
  ICareerFilters as CareerFilters,
  ICareerRecommendation as CareerRecommendation,
  ILazyCareerData as LazyCareerData,
  ICareerCache as CareerCache,
  ICareerAPIResponse as CareerAPIResponse,
  ICareerSearchResult as CareerSearchResult,
};
