import { ICareerPath, IndustryCategory } from '@/types/career';

// Career path data imports
import techSoftwareDev from '@/data/careerPaths/tech.json';
import globalTechSoftwareDev from '@/data/careerPaths/global-tech.json';
import techCybersecurity from '@/data/careerPaths/tech-cybersecurity.json';
import techDataScience from '@/data/careerPaths/tech-data-science.json';
import healthcareNursing from '@/data/careerPaths/healthcare.json';
import businessManagement from '@/data/careerPaths/business.json';
import financeAnalyst from '@/data/careerPaths/finance.json';
import marketingCareers from '@/data/careerPaths/marketing.json';
import educationCareers from '@/data/careerPaths/education.json';
import creativeCareers from '@/data/careerPaths/creative.json';
import engineeringCareers from '@/data/careerPaths/engineering.json';
import scienceCareers from '@/data/careerPaths/science.json';
import legalCareers from '@/data/careerPaths/legal.json';
import governmentCareers from '@/data/careerPaths/government.json';
import nonprofitCareers from '@/data/careerPaths/nonprofit.json';
import tradesCareers from '@/data/careerPaths/trades.json';
import hospitalityCareers from '@/data/careerPaths/hospitality.json';
import mediaCareers from '@/data/careerPaths/media.json';
import digitalCreatorCareers from '@/data/careerPaths/digital-creator.json';
import dronesAviationCareers from '@/data/careerPaths/drones-aviation.json';
import gamingCasinoCareers from '@/data/careerPaths/gaming-casino.json';
import investmentFinanceCareers from '@/data/careerPaths/investment-finance.json';
import marineScienceCareers from '@/data/careerPaths/marine-science.json';
import middleManagementCareers from '@/data/careerPaths/middle-management.json';
import militaryCareers from '@/data/careerPaths/military.json';
import musicCareers from '@/data/careerPaths/music.json';
import publicServiceCareers from '@/data/careerPaths/public-service.json';
import realEstateCareers from '@/data/careerPaths/real-estate.json';
import sanitationCareers from '@/data/careerPaths/sanitation.json';
import specializedTradesCareers from '@/data/careerPaths/specialized-trades.json';

// Data mapping for efficient loading
const CAREER_PATH_DATA: Record<string, ICareerPath> = {
  'software-development': techSoftwareDev as ICareerPath,
  'global-software-development': globalTechSoftwareDev as ICareerPath,
  'cybersecurity-careers': techCybersecurity as ICareerPath,
  'data-science-careers': techDataScience as ICareerPath,
  'nursing-career-path': healthcareNursing as ICareerPath,
  'business-management-path': businessManagement as ICareerPath,
  'finance-analyst-path': financeAnalyst as ICareerPath,
  'marketing-careers': marketingCareers as ICareerPath,
  'education-careers': educationCareers as ICareerPath,
  'creative-careers': creativeCareers as ICareerPath,
  'engineering-careers': engineeringCareers as ICareerPath,
  'science-careers': scienceCareers as ICareerPath,
  'legal-careers': legalCareers as ICareerPath,
  'government-careers': governmentCareers as ICareerPath,
  'nonprofit-careers': nonprofitCareers as ICareerPath,
  'trades-careers': tradesCareers as ICareerPath,
  'hospitality-careers': hospitalityCareers as ICareerPath,
  'media-careers': mediaCareers as ICareerPath,
  'digital-creator-careers': digitalCreatorCareers as ICareerPath,
  'drones-aviation-careers': dronesAviationCareers as ICareerPath,
  'gaming-casino-careers': gamingCasinoCareers as ICareerPath,
  'investment-finance-careers': investmentFinanceCareers as ICareerPath,
  'marine-science-careers': marineScienceCareers as ICareerPath,
  'middle-management-careers': middleManagementCareers as ICareerPath,
  'military-careers': militaryCareers as ICareerPath,
  'music-careers': musicCareers as ICareerPath,
  'public-service-careers': publicServiceCareers as ICareerPath,
  'real-estate-careers': realEstateCareers as ICareerPath,
  'sanitation-careers': sanitationCareers as ICareerPath,
  'specialized-trades-careers': specializedTradesCareers as ICareerPath,
};

// Industry to career paths mapping - expanded to include multiple paths per industry
const INDUSTRY_CAREER_PATHS: Record<IndustryCategory, string[]> = {
  tech: ['software-development', 'global-software-development', 'cybersecurity-careers', 'data-science-careers', 'digital-creator-careers'],
  healthcare: ['nursing-career-path'],
  business: ['business-management-path', 'middle-management-careers'],
  finance: ['finance-analyst-path', 'investment-finance-careers', 'real-estate-careers'],
  marketing: ['marketing-careers'],
  education: ['education-careers'],
  creative: ['creative-careers', 'music-careers'],
  engineering: ['engineering-careers', 'specialized-trades-careers'],
  science: ['science-careers', 'marine-science-careers'],
  legal: ['legal-careers'],
  government: ['government-careers', 'public-service-careers', 'military-careers'],
  nonprofit: ['nonprofit-careers'],
  trades: ['trades-careers', 'sanitation-careers'],
  hospitality: ['hospitality-careers'],
  media: ['media-careers'],
  'gaming-casino': ['gaming-casino-careers'],
  'digital-creator': ['digital-creator-careers'],
  'public-service': ['public-service-careers'],
  'sanitation': ['sanitation-careers'],
  'military': ['military-careers'],
  'music': ['music-careers'],
  'investment-finance': ['investment-finance-careers'],
  'marine-science': ['marine-science-careers'],
  'middle-management': ['middle-management-careers'],
  'real-estate': ['real-estate-careers'],
  'specialized-trades': ['specialized-trades-careers'],
  'drones-aviation': ['drones-aviation-careers'],
};

// Cache for loaded data
const dataCache = new Map<string, ICareerPath>();
const industryCache = new Map<IndustryCategory, ICareerPath[]>();

/**
 * Load a specific career path by ID
 */
export const loadCareerPath = async (pathId: string): Promise<ICareerPath | null> => {
  // Check cache first
  if (dataCache.has(pathId)) {
    return dataCache.get(pathId)!;
  }

  // Load from data mapping
  const careerPath = CAREER_PATH_DATA[pathId];
  if (careerPath) {
    dataCache.set(pathId, careerPath);
    return careerPath;
  }

  return null;
};

/**
 * Load all career paths for a specific industry
 */
export const loadIndustryCareerPaths = async (industry: IndustryCategory): Promise<ICareerPath[]> => {
  // Check cache first
  if (industryCache.has(industry)) {
    return industryCache.get(industry)!;
  }

  const pathIds = INDUSTRY_CAREER_PATHS[industry] || [];
  const careerPaths: ICareerPath[] = [];

  // Load all career paths for the industry
  for (const pathId of pathIds) {
    const careerPath = await loadCareerPath(pathId);
    if (careerPath) {
      careerPaths.push(careerPath);
    }
  }

  // Cache the result
  industryCache.set(industry, careerPaths);
  return careerPaths;
};

/**
 * Search career paths by query
 */
export const searchCareerPaths = async (
  query: string,
  filters?: {
    industry?: IndustryCategory[];
    level?: string[];
    salaryMin?: number;
    salaryMax?: number;
  }
): Promise<ICareerPath[]> => {
  const allPaths = Object.values(CAREER_PATH_DATA);
  const results: ICareerPath[] = [];

  for (const path of allPaths) {
    // Text search
    const searchText = `${path.n} ${path.nodes.map(n => n.t).join(' ')}`.toLowerCase();
    const queryLower = query.toLowerCase();
    
    if (!searchText.includes(queryLower)) {
      continue;
    }

    // Apply filters
    if (filters?.industry && !filters.industry.includes(path.cat)) {
      continue;
    }

    if (filters?.level) {
      const hasMatchingLevel = path.nodes.some(node => 
        filters.level!.includes(node.l)
      );
      if (!hasMatchingLevel) {
        continue;
      }
    }

    if (filters?.salaryMin || filters?.salaryMax) {
      const hasMatchingSalary = path.nodes.some(node => {
        const salaryRange = node.sr;
        const minSalary = parseInt(salaryRange.match(/\$([0-9,]+)/)?.[1]?.replace(/,/g, '') || '0');
        
        if (filters.salaryMin && minSalary < filters.salaryMin) {
          return false;
        }
        if (filters.salaryMax && minSalary > filters.salaryMax) {
          return false;
        }
        return true;
      });
      
      if (!hasMatchingSalary) {
        continue;
      }
    }

    results.push(path);
  }

  return results;
};

/**
 * Get career recommendations based on skills
 */
export const getCareerRecommendations = async (
  userSkills: string[],
  userInterests: string[],
  experience: number
): Promise<Array<{ path: ICareerPath; score: number; reasons: string[] }>> => {
  const allPaths = Object.values(CAREER_PATH_DATA);
  const recommendations: Array<{ path: ICareerPath; score: number; reasons: string[] }> = [];

  for (const path of allPaths) {
    let score = 0;
    const reasons: string[] = [];

    // Score based on skill matches
    for (const node of path.nodes) {
      const skillMatches = node.s.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );

      if (skillMatches.length > 0) {
        score += skillMatches.length * 10;
        reasons.push(`Matches skills: ${skillMatches.join(', ')}`);
      }
    }

    // Score based on experience level
    const entryLevelNodes = path.nodes.filter(node => node.l === 'E');
    const intermediateNodes = path.nodes.filter(node => node.l === 'I');
    const advancedNodes = path.nodes.filter(node => node.l === 'A');

    if (experience <= 2 && entryLevelNodes.length > 0) {
      score += 20;
      reasons.push('Suitable for your experience level');
    } else if (experience <= 5 && intermediateNodes.length > 0) {
      score += 15;
      reasons.push('Good progression opportunity');
    } else if (experience > 5 && advancedNodes.length > 0) {
      score += 25;
      reasons.push('Advanced career opportunities available');
    }

    // Score based on interests
    const interestMatches = userInterests.filter(interest =>
      path.n.toLowerCase().includes(interest.toLowerCase()) ||
      path.nodes.some(node => 
        node.t.toLowerCase().includes(interest.toLowerCase()) ||
        node.d.toLowerCase().includes(interest.toLowerCase())
      )
    );

    if (interestMatches.length > 0) {
      score += interestMatches.length * 5;
      reasons.push(`Aligns with interests: ${interestMatches.join(', ')}`);
    }

    if (score > 0) {
      recommendations.push({ path, score, reasons });
    }
  }

  // Sort by score and return top recommendations
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

/**
 * Get career path statistics
 */
export const getCareerPathStats = () => {
  const allPaths = Object.values(CAREER_PATH_DATA);
  
  return {
    totalPaths: allPaths.length,
    totalNodes: allPaths.reduce((sum, path) => sum + path.nodes.length, 0),
    industries: Object.keys(INDUSTRY_CAREER_PATHS).length,
    averageSalary: calculateAverageSalary(allPaths),
    experienceLevels: {
      entry: allPaths.reduce((sum, path) => sum + path.nodes.filter(n => n.l === 'E').length, 0),
      intermediate: allPaths.reduce((sum, path) => sum + path.nodes.filter(n => n.l === 'I').length, 0),
      advanced: allPaths.reduce((sum, path) => sum + path.nodes.filter(n => n.l === 'A').length, 0),
      expert: allPaths.reduce((sum, path) => sum + path.nodes.filter(n => n.l === 'X').length, 0),
    }
  };
};

/**
 * Calculate average salary across all career paths
 */
const calculateAverageSalary = (paths: ICareerPath[]): string => {
  let totalSalary = 0;
  let salaryCount = 0;

  for (const path of paths) {
    for (const node of path.nodes) {
      const salaryMatch = node.sr.match(/\$([0-9,]+)/);
      if (salaryMatch) {
        const salary = parseInt(salaryMatch[1].replace(/,/g, ''));
        totalSalary += salary;
        salaryCount++;
      }
    }
  }

  if (salaryCount === 0) return '$0';
  
  const average = Math.round(totalSalary / salaryCount);
  return `$${average?.toLocaleString() || '0'}`;
};

/**
 * Clear all caches
 */
export const clearCache = () => {
  dataCache.clear();
  industryCache.clear();
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    dataCacheSize: dataCache.size,
    industryCacheSize: industryCache.size,
    totalCachedItems: dataCache.size + industryCache.size
  };
};
