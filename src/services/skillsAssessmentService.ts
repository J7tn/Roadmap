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

const CHAT2API_BASE_URL = 'http://localhost:8000';

export class SkillsAssessmentService {
  static async getRecommendations(assessmentData: SkillsAssessmentData): Promise<AssessmentRecommendations> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/skills/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: assessmentData.skills,
          experience_level: assessmentData.experienceLevel,
          current_role: assessmentData.currentRole,
          experience_details: assessmentData.experienceDetails,
          selected_career_goal: assessmentData.selectedCareerGoal,
          goals_details: assessmentData.goalsDetails
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching assessment recommendations:', error);
      
      // Throw error instead of returning fallback data
      throw new Error('Assessment service is currently unavailable. Please try again later.');
    }
  }
}
