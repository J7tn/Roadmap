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
      
      // Return fallback data if API fails
      return {
        careerPaths: [
          {
            title: "Software Engineer",
            match: "90%",
            description: "Strong technical skills match your background",
            salary: "$80,000 - $120,000",
            growth: "High growth potential",
            requiredSkills: ["JavaScript", "React", "Node.js"],
            nextSteps: ["Build portfolio projects", "Learn system design"]
          },
          {
            title: "Product Manager",
            match: "85%",
            description: "Good mix of technical and business skills",
            salary: "$90,000 - $140,000",
            growth: "Strong career progression",
            requiredSkills: ["Project Management", "Communication", "Technical Understanding"],
            nextSteps: ["Take product management courses", "Gain stakeholder experience"]
          }
        ],
        skillDevelopment: [
          {
            skill: "Advanced JavaScript",
            priority: "High",
            timeline: "3-6 months",
            description: "Essential for modern web development",
            resources: ["Eloquent JavaScript", "You Don't Know JS"]
          },
          {
            skill: "System Design",
            priority: "Medium",
            timeline: "6-12 months",
            description: "Important for senior engineering roles",
            resources: ["System Design Primer", "Grokking the System Design Interview"]
          }
        ],
        roadmap: {
          shortTerm: ["Master current skill set", "Build portfolio projects"],
          mediumTerm: ["Learn advanced concepts", "Gain leadership experience"],
          longTerm: ["Become a technical leader", "Mentor others"]
        }
      };
    }
  }
}
