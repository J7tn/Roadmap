import { IIndustryCategory, IndustryCategory, CountryCode } from '@/types/career';

// Industry categories for major job markets
// Covers ~400-600 job titles across 15 major industries
export const INDUSTRY_CATEGORIES: IIndustryCategory[] = [
  {
    id: 'tech',
    name: 'Technology',
    icon: 'computer',
    description: 'Software development, IT, cybersecurity, and emerging tech',
    jobCount: 85,
    avgSalary: '$95,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'DE', 'NL', 'SG', 'AU']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'heart',
    description: 'Medical, nursing, allied health, and healthcare administration',
    jobCount: 75,
    avgSalary: '$75,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'DE', 'AU', 'NZ', 'CH']
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'briefcase',
    description: 'Management, operations, consulting, and business development',
    jobCount: 65,
    avgSalary: '$80,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'UK', 'DE', 'FR', 'SG', 'AE', 'CH']
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'dollar-sign',
    description: 'Banking, investment, accounting, and financial services',
    jobCount: 45,
    avgSalary: '$85,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'UK', 'CH', 'SG', 'AE', 'DE', 'FR']
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'megaphone',
    description: 'Digital marketing, advertising, PR, and brand management',
    jobCount: 40,
    avgSalary: '$70,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'UK', 'DE', 'NL', 'AU', 'SG', 'CA']
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'book-open',
    description: 'Teaching, administration, training, and educational technology',
    jobCount: 35,
    avgSalary: '$60,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'UK', 'AU', 'NZ', 'DE', 'NL']
  },
  {
    id: 'creative',
    name: 'Creative Arts',
    icon: 'palette',
    description: 'Design, writing, photography, and creative production',
    jobCount: 30,
    avgSalary: '$65,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'UK', 'DE', 'NL', 'AU', 'CA', 'SE']
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: 'settings',
    description: 'Mechanical, electrical, civil, and industrial engineering',
    jobCount: 35,
    avgSalary: '$90,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'DE', 'CH', 'SE', 'AU', 'CA', 'UK']
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'flask',
    description: 'Research, laboratory work, and scientific analysis',
    jobCount: 25,
    avgSalary: '$75,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'DE', 'CH', 'SE', 'AU', 'CA', 'UK']
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: 'scale',
    description: 'Law, paralegal, compliance, and legal services',
    jobCount: 20,
    avgSalary: '$85,000',
    growthRate: 'Low',
    globalDemand: 'medium',
    topCountries: ['US', 'UK', 'CH', 'DE', 'AU', 'CA', 'SG']
  },
  {
    id: 'government',
    name: 'Government',
    icon: 'building',
    description: 'Public service, policy, and government administration',
    jobCount: 15,
    avgSalary: '$70,000',
    growthRate: 'Low',
    globalDemand: 'low',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
    icon: 'heart-handshake',
    description: 'Social work, advocacy, and non-profit management',
    jobCount: 15,
    avgSalary: '$55,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'UK', 'DE', 'NL', 'AU', 'SE']
  },
  {
    id: 'trades',
    name: 'Skilled Trades',
    icon: 'wrench',
    description: 'Construction, manufacturing, and technical trades',
    jobCount: 20,
    avgSalary: '$65,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'AU', 'DE', 'CH', 'UK', 'NL']
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    icon: 'utensils',
    description: 'Food service, tourism, and hospitality management',
    jobCount: 15,
    avgSalary: '$50,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'AU', 'UK', 'DE', 'FR', 'SG']
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    icon: 'video',
    description: 'Journalism, broadcasting, and entertainment production',
    jobCount: 20,
    avgSalary: '$60,000',
    growthRate: 'Low',
    globalDemand: 'medium',
    topCountries: ['US', 'UK', 'CA', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'digital-creator',
    name: 'Digital Creator',
    icon: 'users',
    description: 'Content creation, social media, and digital entrepreneurship',
    jobCount: 25,
    avgSalary: '$45,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'UK', 'CA', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'public-service',
    name: 'Public Service',
    icon: 'shield',
    description: 'Government, politics, public administration, and civic service',
    jobCount: 30,
    avgSalary: '$65,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'sanitation',
    name: 'Sanitation & Maintenance',
    icon: 'trash-2',
    description: 'Waste management, cleaning services, and facility maintenance',
    jobCount: 20,
    avgSalary: '$40,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'military',
    name: 'Military & Defense',
    icon: 'shield-check',
    description: 'Armed forces, defense contractors, and security services',
    jobCount: 25,
    avgSalary: '$55,000',
    growthRate: 'Low',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR', 'NL']
  },
  {
    id: 'music',
    name: 'Music & Audio',
    icon: 'music',
    description: 'Music production, performance, audio engineering, and sound design',
    jobCount: 20,
    avgSalary: '$50,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'UK', 'CA', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'gaming-casino',
    name: 'Gaming & Casino',
    icon: 'dice-6',
    description: 'Casino operations, gaming development, and entertainment services',
    jobCount: 15,
    avgSalary: '$45,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'AU', 'SG', 'NL', 'DE', 'UK']
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    icon: 'truck',
    description: 'Shipping, delivery, logistics, and transportation services',
    jobCount: 25,
    avgSalary: '$50,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'DE', 'NL', 'AU', 'SG']
  },
  {
    id: 'retail',
    name: 'Retail & Sales',
    icon: 'shopping-cart',
    description: 'Retail management, sales, customer service, and merchandising',
    jobCount: 30,
    avgSalary: '$45,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Food',
    icon: 'wheat',
    description: 'Farming, food production, agricultural services, and food processing',
    jobCount: 20,
    avgSalary: '$40,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'AU', 'DE', 'NL', 'FR', 'UK']
  },
  {
    id: 'construction',
    name: 'Construction & Real Estate',
    icon: 'hammer',
    description: 'Building, construction, real estate, and property management',
    jobCount: 25,
    avgSalary: '$60,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'AU', 'DE', 'UK', 'NL', 'SE']
  },
  {
    id: 'specialized-trades',
    name: 'Specialized Trades',
    icon: 'wrench',
    description: 'Welding, rope access, specialized construction, and technical trades',
    jobCount: 20,
    avgSalary: '$55,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'AU', 'DE', 'UK', 'NL', 'SE']
  },
  {
    id: 'drones-aviation',
    name: 'Drones & Aviation',
    icon: 'drone',
    description: 'Drone operations, aviation technology, and unmanned systems',
    jobCount: 15,
    avgSalary: '$65,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'marine-science',
    name: 'Marine Science',
    icon: 'waves',
    description: 'Marine biology, oceanography, and aquatic sciences',
    jobCount: 12,
    avgSalary: '$60,000',
    growthRate: 'Medium',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'AU', 'UK', 'DE', 'NL', 'SE']
  },
  {
    id: 'investment-finance',
    name: 'Investment & Finance',
    icon: 'trending-up',
    description: 'Stock trading, hedge funds, investment banking, and financial services',
    jobCount: 18,
    avgSalary: '$120,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'UK', 'CH', 'SG', 'AE', 'DE', 'FR']
  },
  {
    id: 'middle-management',
    name: 'Middle Management',
    icon: 'users-cog',
    description: 'Department managers, team leaders, and operational management',
    jobCount: 25,
    avgSalary: '$75,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: 'home',
    description: 'Real estate sales, property management, and real estate development',
    jobCount: 20,
    avgSalary: '$70,000',
    growthRate: 'Medium',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'emerging-tech',
    name: 'Emerging Technology',
    icon: 'cpu',
    description: 'AI, robotics, blockchain, and cutting-edge technology roles',
    jobCount: 15,
    avgSalary: '$95,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'DE', 'NL', 'SG', 'AU']
  },
  {
    id: 'environmental',
    name: 'Environmental Science',
    icon: 'leaf',
    description: 'Environmental protection, conservation, and sustainability',
    jobCount: 15,
    avgSalary: '$55,000',
    growthRate: 'High',
    globalDemand: 'high',
    topCountries: ['US', 'CA', 'UK', 'AU', 'DE', 'NL', 'SE']
  },
  {
    id: 'space-aerospace',
    name: 'Space & Aerospace',
    icon: 'rocket',
    description: 'Space exploration, aerospace engineering, and satellite technology',
    jobCount: 12,
    avgSalary: '$85,000',
    growthRate: 'High',
    globalDemand: 'medium',
    topCountries: ['US', 'CA', 'UK', 'DE', 'FR', 'NL', 'SE']
  }
];

// Helper function to get industry by ID
export const getIndustryById = (id: IndustryCategory): IIndustryCategory | undefined => {
  return INDUSTRY_CATEGORIES.find(industry => industry.id === id);
};

// Helper function to get all industry IDs
export const getIndustryIds = (): IndustryCategory[] => {
  return INDUSTRY_CATEGORIES.map(industry => industry.id);
};

// Helper function to get industries by growth rate
export const getIndustriesByGrowthRate = (rate: 'High' | 'Medium' | 'Low'): IIndustryCategory[] => {
  return INDUSTRY_CATEGORIES.filter(industry => industry.growthRate === rate);
};

// Helper function to get high-growth industries
export const getHighGrowthIndustries = (): IIndustryCategory[] => {
  return getIndustriesByGrowthRate('High');
};

// Total job count across all industries
export const getTotalJobCount = (): number => {
  return INDUSTRY_CATEGORIES.reduce((total, industry) => total + industry.jobCount, 0);
};

// Average salary across all industries
export const getAverageSalary = (): string => {
  const totalSalary = INDUSTRY_CATEGORIES.reduce((total, industry) => {
    const salary = parseInt(industry.avgSalary.replace(/[$,]/g, ''));
    return total + salary;
  }, 0);
  const average = Math.round(totalSalary / INDUSTRY_CATEGORIES.length);
  return `$${average?.toLocaleString() || '0'}`;
};
