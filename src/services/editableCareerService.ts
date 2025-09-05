export interface EditableCareerData {
  id: string;
  title: string;
  category: string;
  level: 'E' | 'I' | 'A' | 'X';
  salary: {
    min: number;
    max: number;
    currency: string;
    lastUpdated: string;
  };
  requiredSkills: string[];
  growthPotential: {
    percentage: number;
    description: string;
    lastUpdated: string;
  };
  nextSteps: string[];
  roadmap: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
    lastUpdated: string;
  };
  description: string;
  experience: string;
  certifications: string[];
  jobTitles: string[];
  requirements: {
    education: string[];
    experience: string;
    skills: string[];
  };
  lastUpdated: string;
  dataSource: 'chat2api' | 'manual';
}

export interface CareerUpdateRequest {
  careerId: string;
  updates: Partial<EditableCareerData>;
}

export interface CareerRoadmapRequest {
  careerId: string;
  currentLevel: string;
  targetLevel: string;
  skills: string[];
  experience: string;
}

const CHAT2API_BASE_URL = 'http://localhost:8000';

export class EditableCareerService {
  private static careers: Map<string, EditableCareerData> = new Map();

  /**
   * Get career data from chat2api or return cached data
   */
  static async getCareerData(careerId: string): Promise<EditableCareerData | null> {
    try {
      // Try to get fresh data from chat2api
      const response = await fetch(`${CHAT2API_BASE_URL}/api/careers/${careerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.careers.set(careerId, data);
        return data;
      }
    } catch (error) {
      console.warn('Failed to fetch career data from chat2api:', error);
    }

    // Return cached data if available
    return this.careers.get(careerId) || null;
  }

  /**
   * Get all careers from chat2api
   */
  static async getAllCareers(): Promise<EditableCareerData[]> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/careers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Cache all careers
        data.forEach((career: EditableCareerData) => {
          this.careers.set(career.id, career);
        });
        return data;
      }
    } catch (error) {
      console.warn('Failed to fetch careers from chat2api:', error);
    }

    // Return cached data if available
    return Array.from(this.careers.values());
  }

  /**
   * Update career data via chat2api
   */
  static async updateCareerData(request: CareerUpdateRequest): Promise<EditableCareerData> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/careers/${request.careerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.updates),
      });

      if (response.ok) {
        const updatedCareer = await response.json();
        this.careers.set(request.careerId, updatedCareer);
        return updatedCareer;
      } else {
        throw new Error(`Failed to update career: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to update career data:', error);
      throw new Error('Career update service is currently unavailable. Please try again later.');
    }
  }

  /**
   * Generate personalized career roadmap via chat2api
   */
  static async generateCareerRoadmap(request: CareerRoadmapRequest): Promise<{
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  }> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/careers/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const roadmap = await response.json();
        return roadmap;
      } else {
        throw new Error(`Failed to generate roadmap: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to generate career roadmap:', error);
      throw new Error('Roadmap generation service is currently unavailable. Please try again later.');
    }
  }

  /**
   * Refresh career data from chat2api (for yearly updates)
   */
  static async refreshCareerData(careerId: string): Promise<EditableCareerData> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/careers/${careerId}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const refreshedCareer = await response.json();
        this.careers.set(careerId, refreshedCareer);
        return refreshedCareer;
      } else {
        throw new Error(`Failed to refresh career data: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to refresh career data:', error);
      throw new Error('Career refresh service is currently unavailable. Please try again later.');
    }
  }

  /**
   * Get career statistics and market data
   */
  static async getCareerMarketData(careerId: string): Promise<{
    demand: number;
    growth: number;
    averageSalary: number;
    jobOpenings: number;
    lastUpdated: string;
  }> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/careers/${careerId}/market`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to get market data: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get career market data:', error);
      throw new Error('Market data service is currently unavailable. Please try again later.');
    }
  }

  /**
   * Search careers by criteria
   */
  static async searchCareers(criteria: {
    skills?: string[];
    salary?: { min: number; max: number };
    level?: string;
    category?: string;
  }): Promise<EditableCareerData[]> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/careers/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Failed to search careers: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to search careers:', error);
      throw new Error('Career search service is currently unavailable. Please try again later.');
    }
  }

  /**
   * Get cached career data (for offline use)
   */
  static getCachedCareer(careerId: string): EditableCareerData | null {
    return this.careers.get(careerId) || null;
  }

  /**
   * Get all cached careers
   */
  static getAllCachedCareers(): EditableCareerData[] {
    return Array.from(this.careers.values());
  }

  /**
   * Clear cache
   */
  static clearCache(): void {
    this.careers.clear();
  }
}
