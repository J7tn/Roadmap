// API Configuration for real-time job market data
export const API_CONFIG = {
  // API Keys (should be stored in environment variables)
  KEYS: {
    LINKEDIN: process.env.REACT_APP_LINKEDIN_API_KEY || '',
    INDEED: process.env.REACT_APP_INDEED_API_KEY || '',
    GLASSDOOR: process.env.REACT_APP_GLASSDOOR_API_KEY || '',
    BLS: process.env.REACT_APP_BLS_API_KEY || '',
    ONET: process.env.REACT_APP_ONET_API_KEY || '',
    ADZUNA: process.env.REACT_APP_ADZUNA_API_KEY || '',
    LIGHTCAST: process.env.REACT_APP_LIGHTCAST_API_KEY || '',
  },

  // API Endpoints
  ENDPOINTS: {
    LINKEDIN: 'https://api.linkedin.com/v2',
    INDEED: 'https://api.indeed.com/ads/apisearch',
    GLASSDOOR: 'https://api.glassdoor.com/api/api.htm',
    BLS: 'https://api.bls.gov/publicAPI/v2',
    ONET: 'https://services.onetcenter.org/ws/online',
    ADZUNA: 'https://api.adzuna.com/v1',
    LIGHTCAST: 'https://api.lightcast.io/open',
  },

  // Rate limiting and caching
  RATE_LIMITS: {
    LINKEDIN: { requests: 100, window: 3600000 }, // 100 requests per hour
    INDEED: { requests: 50, window: 3600000 },    // 50 requests per hour
    GLASSDOOR: { requests: 200, window: 3600000 }, // 200 requests per hour
    BLS: { requests: 500, window: 86400000 },     // 500 requests per day
    ONET: { requests: 1000, window: 3600000 },   // 1000 requests per hour
    ADZUNA: { requests: 100, window: 3600000 },  // 100 requests per hour
    LIGHTCAST: { requests: 100, window: 3600000 }, // 100 requests per hour
  },

  // Data refresh intervals (in milliseconds)
  REFRESH_INTERVALS: {
    JOBS: 300000,        // 5 minutes
    TRENDS: 900000,      // 15 minutes
    SKILLS: 1800000,     // 30 minutes
    SALARIES: 3600000,   // 1 hour
    INDUSTRY: 7200000,   // 2 hours
  },

  // Fallback data sources (when primary APIs fail)
  FALLBACK_SOURCES: [
    'mockData',
    'cachedData',
    'staticData',
  ],

  // Data quality thresholds
  QUALITY_THRESHOLDS: {
    MIN_SALARY_RANGE: 5000,      // Minimum salary range to consider valid
    MAX_SKILLS_PER_JOB: 20,      // Maximum skills per job posting
    MIN_DESCRIPTION_LENGTH: 50,   // Minimum job description length
    MAX_APPLICATIONS: 1000,       // Maximum applications to consider realistic
  },

  // Industry mappings for different APIs
  INDUSTRY_MAPPINGS: {
    'technology': ['tech', 'software', 'IT', 'computer', 'digital'],
    'healthcare': ['health', 'medical', 'pharmaceutical', 'biotech'],
    'finance': ['financial', 'banking', 'insurance', 'investment'],
    'manufacturing': ['manufacturing', 'industrial', 'production', 'engineering'],
    'education': ['education', 'academic', 'teaching', 'learning'],
    'retail': ['retail', 'commerce', 'e-commerce', 'sales'],
    'marketing': ['marketing', 'advertising', 'branding', 'communications'],
    'consulting': ['consulting', 'advisory', 'strategy', 'management'],
  },

  // Location mappings
  LOCATION_MAPPINGS: {
    'remote': ['remote', 'work from home', 'virtual', 'telecommute'],
    'united states': ['US', 'USA', 'United States', 'America'],
    'europe': ['EU', 'Europe', 'European Union'],
    'asia': ['Asia', 'Asian', 'APAC'],
  },

  // Skills categorization
  SKILLS_CATEGORIES: {
    'programming': ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript'],
    'frameworks': ['React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Laravel'],
    'databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra'],
    'cloud': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
    'ai_ml': ['Machine Learning', 'AI', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
    'cybersecurity': ['Security', 'Penetration Testing', 'Network Security', 'Cryptography'],
    'data': ['Data Analysis', 'Data Science', 'Business Intelligence', 'ETL', 'Data Engineering'],
  },

  // Experience level mappings
  EXPERIENCE_LEVELS: {
    'entry': ['entry level', 'junior', '0-2 years', 'recent graduate'],
    'mid': ['mid level', 'intermediate', '2-5 years', 'experienced'],
    'senior': ['senior', 'lead', '5+ years', 'expert', 'principal'],
    'executive': ['executive', 'director', 'VP', 'CTO', 'CEO', 'manager'],
  },

  // Job type mappings
  JOB_TYPES: {
    'full-time': ['full time', 'full-time', 'permanent', 'FTE'],
    'part-time': ['part time', 'part-time', 'PT'],
    'contract': ['contract', 'temporary', 'temp', 'freelance'],
    'remote': ['remote', 'work from home', 'virtual', 'telecommute'],
  },
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        enableRealTimeUpdates: true,
        refreshInterval: API_CONFIG.REFRESH_INTERVALS.JOBS,
        enableNotifications: true,
        enableCaching: true,
        enableFallback: true,
        logLevel: 'error',
      };
    
    case 'staging':
      return {
        enableRealTimeUpdates: true,
        refreshInterval: API_CONFIG.REFRESH_INTERVALS.JOBS * 2, // Slower refresh for staging
        enableNotifications: false,
        enableCaching: true,
        enableFallback: true,
        logLevel: 'warn',
      };
    
    case 'development':
    default:
      return {
        enableRealTimeUpdates: false, // Disable in development to avoid API calls
        refreshInterval: API_CONFIG.REFRESH_INTERVALS.JOBS * 10, // Much slower for dev
        enableNotifications: false,
        enableCaching: false,
        enableFallback: true,
        logLevel: 'debug',
      };
  }
};

// API key validation
export const validateAPIKeys = () => {
  const missingKeys: string[] = [];
  
  Object.entries(API_CONFIG.KEYS).forEach(([key, value]) => {
    if (!value) {
      missingKeys.push(key);
    }
  });
  
  if (missingKeys.length > 0) {
    console.warn(`Missing API keys: ${missingKeys.join(', ')}. Some features may not work.`);
    return false;
  }
  
  return true;
};

// Rate limiting configuration
export const getRateLimitConfig = (apiName: keyof typeof API_CONFIG.KEYS) => {
  return API_CONFIG.RATE_LIMITS[apiName] || { requests: 100, window: 3600000 };
};

// Industry mapping helper
export const mapIndustryToAPIs = (industry: string): string[] => {
  const normalizedIndustry = industry.toLowerCase();
  
  for (const [key, values] of Object.entries(API_CONFIG.INDUSTRY_MAPPINGS)) {
    if (values.some(value => normalizedIndustry.includes(value))) {
      return [key];
    }
  }
  
  return ['technology']; // Default fallback
};

// Location mapping helper
export const mapLocationToAPIs = (location: string): string[] => {
  const normalizedLocation = location.toLowerCase();
  
  for (const [key, values] of Object.entries(API_CONFIG.LOCATION_MAPPINGS)) {
    if (values.some(value => normalizedLocation.includes(value))) {
      return [key];
    }
  }
  
  return ['united states']; // Default fallback
};

export default API_CONFIG;
