import { IIndustryCategory, IndustryCategory } from '@/types/career';

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
    growthRate: 'High'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'heart',
    description: 'Medical, nursing, allied health, and healthcare administration',
    jobCount: 75,
    avgSalary: '$75,000',
    growthRate: 'High'
  },
  {
    id: 'business',
    name: 'Business',
    icon: 'briefcase',
    description: 'Management, operations, consulting, and business development',
    jobCount: 65,
    avgSalary: '$80,000',
    growthRate: 'Medium'
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'dollar-sign',
    description: 'Banking, investment, accounting, and financial services',
    jobCount: 45,
    avgSalary: '$85,000',
    growthRate: 'Medium'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'megaphone',
    description: 'Digital marketing, advertising, PR, and brand management',
    jobCount: 40,
    avgSalary: '$70,000',
    growthRate: 'High'
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'book-open',
    description: 'Teaching, administration, training, and educational technology',
    jobCount: 35,
    avgSalary: '$60,000',
    growthRate: 'Medium'
  },
  {
    id: 'creative',
    name: 'Creative Arts',
    icon: 'palette',
    description: 'Design, writing, photography, and creative production',
    jobCount: 30,
    avgSalary: '$65,000',
    growthRate: 'Medium'
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: 'settings',
    description: 'Mechanical, electrical, civil, and industrial engineering',
    jobCount: 35,
    avgSalary: '$90,000',
    growthRate: 'Medium'
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'flask',
    description: 'Research, laboratory work, and scientific analysis',
    jobCount: 25,
    avgSalary: '$75,000',
    growthRate: 'Medium'
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: 'scale',
    description: 'Law, paralegal, compliance, and legal services',
    jobCount: 20,
    avgSalary: '$85,000',
    growthRate: 'Low'
  },
  {
    id: 'government',
    name: 'Government',
    icon: 'building',
    description: 'Public service, policy, and government administration',
    jobCount: 15,
    avgSalary: '$70,000',
    growthRate: 'Low'
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit',
    icon: 'heart-handshake',
    description: 'Social work, advocacy, and non-profit management',
    jobCount: 15,
    avgSalary: '$55,000',
    growthRate: 'Medium'
  },
  {
    id: 'trades',
    name: 'Skilled Trades',
    icon: 'wrench',
    description: 'Construction, manufacturing, and technical trades',
    jobCount: 20,
    avgSalary: '$65,000',
    growthRate: 'Medium'
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    icon: 'utensils',
    description: 'Food service, tourism, and hospitality management',
    jobCount: 15,
    avgSalary: '$50,000',
    growthRate: 'Medium'
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    icon: 'video',
    description: 'Journalism, broadcasting, and entertainment production',
    jobCount: 20,
    avgSalary: '$60,000',
    growthRate: 'Low'
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
  return `$${average.toLocaleString()}`;
};
