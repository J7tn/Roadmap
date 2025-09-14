import { ICareerNode, ICareerPath, IndustryCategory } from '@/types/career';
import { loadCareerPath, loadIndustryCareerPaths } from '@/utils/careerDataLoader';
import { smartCareerCacheService } from './smartCareerCacheService';

export interface SkillsAssessmentData {
  skills: string[];
  experience: string;
  interests: string[];
  goals: string;
  currentRole: string;
  experienceLevel: string;
  experienceDetails: string;
  goalsDetails: string;
  selectedCareerGoal: string;
}

export interface CareerPath {
  title: string;
  match: string;
  description: string;
  salary: string;
  growth: string;
  requiredSkills: string[];
  nextSteps: string[];
  careerNode?: ICareerNode;
}

export interface SkillDevelopment {
  skill: string;
  priority: "High" | "Medium" | "Low";
  timeline: string;
  description: string;
  resources: string[];
}

export interface Roadmap {
  shortTerm: string[];
  mediumTerm: string[];
  longTerm: string[];
}

export interface AssessmentRecommendations {
  careerPaths: CareerPath[];
  skillDevelopment: SkillDevelopment[];
  roadmap: Roadmap;
}

export class SkillsAssessmentService {
  private static careerDataCache: Map<string, ICareerNode[]> = new Map();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private static cacheTimestamps: Map<string, number> = new Map();

  static async getRecommendations(assessmentData: SkillsAssessmentData): Promise<AssessmentRecommendations> {
    // Use local career data instead of chat2api
    return this.generateLocalRecommendations(assessmentData);
  }

  // Method to clear cache if needed (useful for testing or when data changes)
  static clearCache(): void {
    this.careerDataCache.clear();
    this.cacheTimestamps.clear();
  }

  private static async generateLocalRecommendations(assessmentData: SkillsAssessmentData): Promise<AssessmentRecommendations> {
    const { skills, experienceLevel, selectedCareerGoal } = assessmentData;
    
    // Find matching career nodes from local data
    const matchingCareers = await this.findMatchingCareers(skills, experienceLevel, selectedCareerGoal);
    
    // Generate career paths from matching careers
    const careerPaths = this.generateCareerPathsFromNodes(matchingCareers, skills);
    
    // Generate skill development recommendations
    const skillDevelopment = this.generateSkillDevelopment(skills, experienceLevel, selectedCareerGoal, matchingCareers);
    
    // Generate roadmap based on career goal
    const roadmap = this.generateRoadmap(selectedCareerGoal, experienceLevel);

    return {
      careerPaths,
      skillDevelopment,
      roadmap
    };
  }

  private static async findMatchingCareers(userSkills: string[], experienceLevel: string, careerGoal: string): Promise<ICareerNode[]> {
    try {
      // Use smart caching service for better performance
      const careers = await smartCareerCacheService.getCareers({
        skills: userSkills,
        level: experienceLevel,
        limit: 50
      });
      
      // Filter and score careers based on assessment criteria
      const matchingCareers = careers
        .map(career => {
          const skillMatch = this.calculateSkillMatch(userSkills, career.s || []);
          const levelMatch = this.matchesExperienceLevel(career.l, experienceLevel);
          const goalMatch = this.matchesCareerGoal(career, careerGoal);
          
          if (skillMatch > 0.3 && levelMatch && goalMatch) {
            return {
              ...career,
              matchPercentage: skillMatch
            } as ICareerNode & { matchPercentage: number };
          }
          return null;
        })
        .filter((career): career is ICareerNode & { matchPercentage: number } => career !== null)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 8); // Return top 8 matches
      
      return matchingCareers;
    } catch (error) {
      console.error('Failed to find matching careers:', error);
      return [];
    }
  }

  private static getCachedResults(cacheKey: string): ICareerNode[] | null {
    const timestamp = this.cacheTimestamps.get(cacheKey);
    if (timestamp && Date.now() - timestamp < this.CACHE_TTL) {
      return this.careerDataCache.get(cacheKey) || null;
    }
    return null;
  }

  private static cacheResults(cacheKey: string, results: ICareerNode[]): void {
    this.careerDataCache.set(cacheKey, results);
    this.cacheTimestamps.set(cacheKey, Date.now());
    
    // Clean up old cache entries if cache gets too large
    if (this.careerDataCache.size > 50) {
      const oldestKey = Array.from(this.cacheTimestamps.entries())
        .reduce((oldest, [key, time]) => time < oldest.time ? { key, time } : oldest,
                { key: '', time: Date.now() });
      this.careerDataCache.delete(oldestKey.key);
      this.cacheTimestamps.delete(oldestKey.key);
    }
  }

  private static calculateSkillMatch(userSkills: string[], careerSkills: string[]): number {
    if (careerSkills.length === 0) return 0;
    
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const careerSkillsLower = careerSkills.map(s => s.toLowerCase());
    
    // Count exact matches
    const exactMatches = careerSkillsLower.filter(careerSkill => 
      userSkillsLower.some(userSkill => userSkill === careerSkill)
    ).length;
    
    // Count partial matches (skills that contain each other)
    const partialMatches = careerSkillsLower.filter(careerSkill => 
      userSkillsLower.some(userSkill => 
        userSkill.includes(careerSkill) || careerSkill.includes(userSkill)
      )
    ).length;
    
    // Weight exact matches more heavily
    const totalMatches = exactMatches + (partialMatches * 0.5);
    return totalMatches / careerSkills.length;
  }

  private static matchesExperienceLevel(careerLevel: string, userExperienceLevel: string): boolean {
    if (!userExperienceLevel) return true;
    
    const levelMapping = {
      'beginner': ['E'],
      'intermediate': ['E', 'I'],
      'advanced': ['I', 'A'],
      'expert': ['A', 'X']
    };
    
    const allowedLevels = levelMapping[userExperienceLevel as keyof typeof levelMapping] || ['E', 'I', 'A', 'X'];
    return allowedLevels.includes(careerLevel);
  }

  private static matchesCareerGoal(node: ICareerNode, careerGoal: string): boolean {
    if (!careerGoal) return true;
    
    const goalMappings = {
      'technical': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'System Design', 'API Development'],
      'management': ['Leadership', 'Project Management', 'Team Management', 'Strategic Planning'],
      'entrepreneur': ['Business Development', 'Marketing', 'Sales', 'Strategy'],
      'specialist': ['Data Analysis', 'Machine Learning', 'Cybersecurity', 'DevOps'],
      'creative': ['Design', 'UI/UX', 'Graphic Design', 'Creative Writing', 'Photography'],
      'analyst': ['Data Analysis', 'Statistics', 'Excel', 'Tableau', 'R', 'Python', 'SQL']
    };
    
    const goalSkills = goalMappings[careerGoal as keyof typeof goalMappings] || [];
    const nodeSkills = node.s || [];
    
    // Check if any of the career goal skills match the node skills
    return goalSkills.some(goalSkill => 
      nodeSkills.some(nodeSkill => 
        nodeSkill.toLowerCase().includes(goalSkill.toLowerCase()) ||
        goalSkill.toLowerCase().includes(nodeSkill.toLowerCase())
      )
    );
  }

  private static generateCareerPathsFromNodes(careerNodes: ICareerNode[], userSkills: string[]): CareerPath[] {
    return careerNodes.map(node => {
      const skillMatch = this.calculateSkillMatch(userSkills, node.s || []);
      const matchPercentage = Math.round(skillMatch * 100);
      
      console.log('Generating career path for node:', node.id, node.t);
      
      return {
        title: node.t || 'Unknown Career',
        match: `${matchPercentage}%`,
        description: node.d || 'No description available',
        salary: node.sr || 'Salary not specified',
        growth: this.getGrowthDescription(node.l),
        requiredSkills: node.s || [],
        nextSteps: this.generateNextSteps(node, userSkills),
        careerNode: node
      };
    });
  }

  private static getGrowthDescription(level: string): string {
    const growthDescriptions = {
      'E': 'Entry-level position with high growth potential',
      'I': 'Intermediate role with steady career progression',
      'A': 'Advanced position with leadership opportunities',
      'X': 'Expert-level role with high demand and compensation'
    };
    return growthDescriptions[level as keyof typeof growthDescriptions] || 'Career growth opportunities available';
  }

  private static generateNextSteps(node: ICareerNode, userSkills: string[]): string[] {
    const nextSteps: string[] = [];
    
    // Add missing skills as next steps
    const missingSkills = (node.s || []).filter(skill => 
      !userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    if (missingSkills.length > 0) {
      nextSteps.push(`Learn: ${missingSkills.slice(0, 2).join(', ')}`);
    }
    
    // Add certifications
    if (node.c && node.c.length > 0) {
      nextSteps.push(`Consider certification: ${node.c[0]}`);
    }
    
    // Add experience requirements
    if (node.r?.exp) {
      nextSteps.push(`Gain experience: ${node.r.exp}`);
    }
    
    // Add education requirements
    if (node.r?.e && node.r.e.length > 0) {
      nextSteps.push(`Education: ${node.r.e[0]}`);
    }
    
    return nextSteps.slice(0, 3); // Limit to 3 next steps
  }

  private static generateSkillDevelopment(userSkills: string[], experienceLevel: string, careerGoal: string, matchingCareers: ICareerNode[]): SkillDevelopment[] {
    const development: SkillDevelopment[] = [];
    
    // Find skills that appear frequently in matching careers but user doesn't have
    const skillFrequency = new Map<string, number>();
    
    matchingCareers.forEach(career => {
      (career.s || []).forEach(skill => {
        const hasSkill = userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        );
        
        if (!hasSkill) {
          skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
        }
      });
    });
    
    // Convert to skill development recommendations
    const sortedSkills = Array.from(skillFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 missing skills
    
    sortedSkills.forEach(([skill, frequency]) => {
      const priority = frequency >= 3 ? 'High' : frequency >= 2 ? 'Medium' : 'Low';
      const timeline = this.getSkillTimeline(skill, experienceLevel);
      
      development.push({
        skill,
        priority,
        timeline,
        description: `This skill appears in ${frequency} of your matching career paths`,
        resources: this.getSkillResources(skill)
      });
    });
    
    // Add career goal specific skills
    if (careerGoal === 'technical' && !userSkills.some(s => s.toLowerCase().includes('system design'))) {
      development.push({
        skill: 'System Design',
        priority: 'High',
        timeline: '3-6 months',
        description: 'Essential for senior technical roles',
        resources: ['System Design Interview course', 'Architecture patterns', 'Distributed systems']
      });
    }
    
    if (careerGoal === 'management' && !userSkills.some(s => s.toLowerCase().includes('leadership'))) {
      development.push({
        skill: 'Leadership & Team Management',
        priority: 'High',
        timeline: '6-12 months',
        description: 'Core skills for management roles',
        resources: ['Leadership courses', 'Management books', 'Mentoring experience']
      });
    }
    
    return development.slice(0, 6); // Limit to 6 recommendations
  }

  private static getSkillTimeline(skill: string, experienceLevel: string): string {
    const skillComplexity = {
      'JavaScript': '2-3 months',
      'Python': '2-4 months',
      'React': '1-2 months',
      'Node.js': '2-3 months',
      'SQL': '1-2 months',
      'AWS': '3-6 months',
      'Docker': '1-2 months',
      'Git': '1 month',
      'System Design': '3-6 months',
      'Leadership': '6-12 months',
      'Project Management': '3-6 months'
    };
    
    return skillComplexity[skill as keyof typeof skillComplexity] || '2-4 months';
  }

  private static getSkillResources(skill: string): string[] {
    const resourceMappings = {
      'JavaScript': ['MDN Web Docs', 'JavaScript.info', 'FreeCodeCamp'],
      'Python': ['Python.org tutorial', 'Real Python', 'Codecademy'],
      'React': ['React documentation', 'React Tutorial', 'Next.js docs'],
      'Node.js': ['Node.js documentation', 'Express.js guide', 'MongoDB tutorial'],
      'SQL': ['SQLBolt', 'W3Schools SQL', 'PostgreSQL tutorial'],
      'AWS': ['AWS Free Tier', 'AWS documentation', 'Cloud Academy'],
      'Docker': ['Docker documentation', 'Docker Compose guide', 'Kubernetes basics'],
      'Git': ['Git documentation', 'Atlassian Git tutorial', 'GitHub guides'],
      'System Design': ['System Design Interview', 'High Scalability', 'AWS Architecture'],
      'Leadership': ['Harvard Business Review', 'Leadership books', 'Management courses'],
      'Project Management': ['PMI resources', 'Agile methodologies', 'Scrum guide']
    };
    
    return resourceMappings[skill as keyof typeof resourceMappings] || ['Online courses', 'Documentation', 'Practice projects'];
  }

  private static generateRoadmap(careerGoal: string, experienceLevel: string): Roadmap {
    const roadmap: Roadmap = {
      shortTerm: [],
      mediumTerm: [],
      longTerm: []
    };

    if (careerGoal === 'technical') {
      roadmap.shortTerm = [
        "Complete 2-3 technical projects to build portfolio",
        "Learn a new programming language or framework",
        "Contribute to open source projects"
      ];
      roadmap.mediumTerm = [
        "Earn relevant technical certifications",
        "Lead a technical project or team",
        "Build a strong professional network in tech"
      ];
      roadmap.longTerm = [
        "Become a technical expert in your domain",
        "Consider technical leadership roles",
        "Mentor junior developers"
      ];
    } else if (careerGoal === 'management') {
      roadmap.shortTerm = [
        "Take on leadership responsibilities in current role",
        "Learn project management methodologies",
        "Develop communication and presentation skills"
      ];
      roadmap.mediumTerm = [
        "Lead a team or major project",
        "Earn management certifications",
        "Build cross-functional relationships"
      ];
      roadmap.longTerm = [
        "Move into senior management role",
        "Develop strategic thinking skills",
        "Consider executive leadership positions"
      ];
    } else {
      // General roadmap based on experience level
      if (experienceLevel === 'beginner') {
        roadmap.shortTerm = [
          "Build foundational skills in your chosen field",
          "Complete relevant courses or certifications",
          "Start building a professional network"
        ];
        roadmap.mediumTerm = [
          "Gain practical experience through projects or internships",
          "Develop specialized skills",
          "Build a strong portfolio or resume"
        ];
        roadmap.longTerm = [
          "Achieve intermediate-level expertise",
          "Consider advanced education or certifications",
          "Plan for career advancement"
        ];
      } else {
        roadmap.shortTerm = [
          "Identify specific career interests and goals",
          "Develop advanced skills in your field",
          "Build a strong professional network"
        ];
        roadmap.mediumTerm = [
          "Gain leadership experience",
          "Consider advanced certifications or education",
          "Build expertise in specialized areas"
        ];
        roadmap.longTerm = [
          "Achieve senior-level expertise",
          "Consider leadership opportunities",
          "Plan for long-term career growth"
        ];
      }
    }

    return roadmap;
  }
}