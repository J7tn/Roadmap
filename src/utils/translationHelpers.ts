/**
 * Translation Helper Functions
 * 
 * This file provides helper functions to map database content to translation keys
 * for comprehensive internationalization support.
 */

// Career ID to translation key mapping
const careerTranslationMapping: { [key: string]: string } = {
  'cybersecurity-analyst': 'cybersecurityAnalyst',
  'business-analyst': 'businessAnalyst',
  'marketing-manager': 'marketingManager',
  'marketing-assistant': 'marketingAssistant',
  'social-media-specialist': 'socialMediaSpecialist',
  'content-marketer': 'contentMarketer',
  'software-engineer': 'softwareEngineer',
  'data-scientist': 'dataScientist',
  'project-manager': 'projectManager',
  'ui-ux-designer': 'uiUxDesigner',
  'cloud-engineer': 'cloudEngineer',
  'ai-engineer': 'aiEngineer',
  'devops-engineer': 'devopsEngineer',
  'product-manager': 'productManager',
  'sales-manager': 'salesManager',
  'hr-manager': 'hrManager',
  'financial-analyst': 'financialAnalyst',
  'registered-nurse': 'registeredNurse',
  'physician': 'physician',
  'teacher': 'teacher',
  'lawyer': 'lawyer',
  'accountant': 'accountant',
  'graphic-designer': 'graphicDesigner',
  'content-writer': 'contentWriter',
  'customer-service': 'customerService'
};

// Industry name to translation key mapping
const industryTranslationMapping: { [key: string]: string } = {
  'Technology': 'technology',
  'Healthcare': 'healthcare',
  'Finance': 'finance',
  'Marketing': 'marketing',
  'Education': 'education',
  'Manufacturing': 'manufacturing',
  'Retail': 'retail',
  'Government': 'government',
  'Non-profit': 'nonprofit',
  'Real Estate': 'realEstate',
  'Agriculture': 'agriculture',
  'Transportation': 'transportation',
  'Energy': 'energy',
  'Media': 'media',
  'Entertainment': 'entertainment',
  // Additional industry mappings from INDUSTRY_CATEGORIES
  'Business': 'business',
  'Creative Arts': 'creativeArts',
  'Engineering': 'engineering',
  'Science': 'science',
  'Legal': 'legal',
  'Skilled Trades': 'skilledTrades',
  'Hospitality': 'hospitality',
  'Media & Entertainment': 'mediaEntertainment',
  'Digital Creator': 'digitalCreator',
  'Public Service': 'publicService',
  'Sanitation & Maintenance': 'sanitationMaintenance',
  'Military & Defense': 'militaryDefense',
  'Music & Audio': 'musicAudio',
  'Gaming & Casino': 'gamingCasino',
  'Transportation & Logistics': 'transportationLogistics',
  'Retail & Sales': 'retailSales',
  'Agriculture & Food': 'agricultureFood',
  'Construction & Real Estate': 'constructionRealEstate',
  'Specialized Trades': 'specializedTrades',
  'Drones & Aviation': 'dronesAviation',
  'Marine Science': 'marineScience',
  'Investment & Finance': 'investmentFinance',
  'Middle Management': 'middleManagement',
  'Emerging Technology': 'emergingTechnology',
  'Environmental Science': 'environmentalScience',
  'Space & Aerospace': 'spaceAerospace'
};

// Skill name to translation key mapping
const skillTranslationMapping: { [key: string]: string } = {
  'Network Security': 'networkSecurity',
  'Data Analysis': 'dataAnalysis',
  'Digital Marketing': 'digitalMarketing',
  'Project Management': 'projectManagement',
  'Software Development': 'softwareDevelopment',
  'UI/UX Design': 'uiUxDesign',
  'Cybersecurity': 'cybersecurity',
  'Cloud Computing': 'cloudComputing',
  'Machine Learning': 'machineLearning',
  'DevOps': 'devOps',
  'AI/ML': 'aiMl',
  'Data Science': 'dataScience',
  'Python': 'python',
  'JavaScript': 'javascript',
  'React': 'react',
  'Node.js': 'nodejs',
  'SQL': 'sql',
  'AWS': 'aws',
  'Azure': 'azure',
  'Google Cloud': 'googleCloud',
  'Docker': 'docker',
  'Kubernetes': 'kubernetes',
  'Git': 'git',
  'Agile': 'agile',
  'Scrum': 'scrum',
  'Leadership': 'leadership',
  'Communication': 'communication',
  'Problem Solving': 'problemSolving',
  'Critical Thinking': 'criticalThinking',
  'Teamwork': 'teamwork',
  'Time Management': 'timeManagement'
};

// Career path ID to translation key mapping
const careerPathTranslationMapping: { [key: string]: string } = {
  'healthcare-nursing': 'healthcareNursing',
  'technology-software': 'technologySoftware',
  'marketing-digital': 'marketingDigital',
  'finance-investment': 'financeInvestment',
  'education-teaching': 'educationTeaching',
  'legal-law': 'legalLaw',
  'engineering-civil': 'engineeringCivil',
  'design-graphic': 'designGraphic',
  'sales-business': 'salesBusiness',
  'hr-human-resources': 'hrHumanResources'
};

/**
 * Get translation key for a career ID
 */
export const getCareerTranslationKey = (careerId: string): string => {
  return careerTranslationMapping[careerId] || 'unknown';
};

/**
 * Get translation key for an industry name
 */
export const getIndustryTranslationKey = (industryName: string): string => {
  return industryTranslationMapping[industryName] || 'unknown';
};

/**
 * Get translation key for a skill name
 */
export const getSkillTranslationKey = (skillName: string): string => {
  return skillTranslationMapping[skillName] || 'unknown';
};

/**
 * Get translation key for a career path ID
 */
export const getCareerPathTranslationKey = (careerPathId: string): string => {
  return careerPathTranslationMapping[careerPathId] || 'unknown';
};

/**
 * Get translated career title
 */
export const getTranslatedCareerTitle = (t: any, careerId: string, fallbackTitle?: string): string => {
  const translationKey = getCareerTranslationKey(careerId);
  const translated = t(`careers.${translationKey}.title`);
  
  // If translation key doesn't exist or returns the key itself, use fallback
  if (translated === `careers.${translationKey}.title` || translationKey === 'unknown') {
    return fallbackTitle || careerId;
  }
  
  return translated;
};

/**
 * Get translated industry name
 */
export const getTranslatedIndustryName = (t: any, industryName: string): string => {
  const translationKey = getIndustryTranslationKey(industryName);
  const translated = t(`industries.${translationKey}.name`);
  
  // If translation key doesn't exist or returns the key itself, use fallback
  if (translated === `industries.${translationKey}.name` || translationKey === 'unknown') {
    return industryName;
  }
  
  return translated;
};

/**
 * Get translated skill name
 */
export const getTranslatedSkillName = (t: any, skillName: string): string => {
  const translationKey = getSkillTranslationKey(skillName);
  const translated = t(`skills.${translationKey}.name`);
  
  // If translation key doesn't exist or returns the key itself, use fallback
  if (translated === `skills.${translationKey}.name` || translationKey === 'unknown') {
    return skillName;
  }
  
  return translated;
};

/**
 * Get translated career path name
 */
export const getTranslatedCareerPathName = (t: any, careerPathId: string, fallbackName?: string): string => {
  const translationKey = getCareerPathTranslationKey(careerPathId);
  const translated = t(`careerPaths.${translationKey}.name`);
  
  // If translation key doesn't exist or returns the key itself, use fallback
  if (translated === `careerPaths.${translationKey}.name` || translationKey === 'unknown') {
    return fallbackName || careerPathId;
  }
  
  return translated;
};

/**
 * Get translated career description
 */
export const getTranslatedCareerDescription = (t: any, careerId: string, fallbackDescription?: string): string => {
  const translationKey = getCareerTranslationKey(careerId);
  const translated = t(`careers.${translationKey}.description`);
  
  // If translation key doesn't exist or returns the key itself, use fallback
  if (translated === `careers.${translationKey}.description` || translationKey === 'unknown') {
    return fallbackDescription || '';
  }
  
  return translated;
};

/**
 * Get translated skills array
 */
export const getTranslatedSkills = (t: any, skills: string[]): string[] => {
  return skills.map(skill => getTranslatedSkillName(t, skill));
};

/**
 * Get translated job titles array
 */
export const getTranslatedJobTitles = (t: any, careerId: string, fallbackJobTitles?: string[]): string[] => {
  const translationKey = getCareerTranslationKey(careerId);
  const translated = t(`careers.${translationKey}.jobTitles`, { returnObjects: true });
  
  // If translation key doesn't exist or returns the key itself, use fallback
  if (Array.isArray(translated) && translated.length > 0 && translated[0] !== `careers.${translationKey}.jobTitles`) {
    return translated;
  }
  
  return fallbackJobTitles || [];
};

/**
 * Get translated certifications array
 */
export const getTranslatedCertifications = (t: any, careerId: string, fallbackCertifications?: string[]): string[] => {
  const translationKey = getCareerTranslationKey(careerId);
  const translated = t(`careers.${translationKey}.certifications`, { returnObjects: true });
  
  // If translation key doesn't exist or returns the key itself, use fallback
  if (Array.isArray(translated) && translated.length > 0 && translated[0] !== `careers.${translationKey}.certifications`) {
    return translated;
  }
  
  return fallbackCertifications || [];
};

/**
 * Get translated common term
 */
export const getTranslatedCommonTerm = (t: any, termKey: string, fallbackTerm?: string): string => {
  const translated = t(`commonTerms.${termKey}`);
  
  // If translation key doesn't exist or returns the key itself, use fallback
  if (translated === `commonTerms.${termKey}`) {
    return fallbackTerm || termKey;
  }
  
  return translated;
};

// Export all mapping objects for reference
export {
  careerTranslationMapping,
  industryTranslationMapping,
  skillTranslationMapping,
  careerPathTranslationMapping
};
