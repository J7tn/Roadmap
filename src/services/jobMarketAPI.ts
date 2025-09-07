// Job Market API Service for real-time career data
export interface JobMarketData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  experience: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  postedDate: string;
  demand: 'high' | 'medium' | 'low';
  growthRate: number;
  industry: string;
  description: string;
}

export interface MarketTrends {
  trendingSkills: Array<{
    skill: string;
    demand: number;
    growth: number;
    salary: number;
  }>;
  emergingRoles: Array<{
    title: string;
    description: string;
    growth: number;
    skills: string[];
  }>;
  industryInsights: Array<{
    industry: string;
    growth: number;
    jobCount: number;
    avgSalary: number;
  }>;
}

export interface SkillsData {
  skill: string;
  demand: number;
  salary: number;
  growth: number;
  relatedSkills: string[];
  certifications: string[];
}

class JobMarketAPIService {
  private chat2apiKey: string;
  private chat2apiUrl: string;
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    // Load configuration from environment variables
    this.loadConfig();
  }

  private loadConfig() {
    this.chat2apiKey = import.meta.env.VITE_CHAT2API_KEY || '';
    this.chat2apiUrl = import.meta.env.VITE_CHAT2API_URL || 'https://api.chat2api.com';
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    // Log configuration status
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.warn('Supabase configuration missing. Some features may not work.');
    }
    if (!this.chat2apiKey) {
      console.warn('Chat2API key missing. Real-time updates may not work.');
    }
  }

  // Fetch real-time job market data
  async getJobMarketData(industry?: string, location?: string): Promise<JobMarketData[]> {
    try {
      // First try to get data from Supabase (cached data from Chat2API)
      const cachedData = await this.getCachedJobData(industry, location);
      if (cachedData.length > 0) {
        return cachedData;
      }

      // If no cached data, try to fetch fresh data using Chat2API
      if (this.chat2apiKey) {
        const freshData = await this.fetchJobDataViaChat2API(industry, location);
        if (freshData.length > 0) {
          // Store the fresh data in Supabase for future use
          await this.storeJobDataInSupabase(freshData);
          return freshData;
        }
      }

      // Fallback to local data if APIs fail
      return this.getFallbackData();
    } catch (error) {
      console.error('Error fetching job market data:', error);
      return this.getFallbackData();
    }
  }

  // Fetch market trends and insights
  async getMarketTrends(): Promise<MarketTrends> {
    try {
      // First try to get cached trends from Supabase
      const cachedTrends = await this.getCachedMarketTrends();
      if (cachedTrends) {
        return cachedTrends;
      }

      // If no cached data, try to fetch fresh trends using Chat2API
      if (this.chat2apiKey) {
        const freshTrends = await this.fetchMarketTrendsViaChat2API();
        if (freshTrends) {
          // Store the fresh trends in Supabase for future use
          await this.storeMarketTrendsInSupabase(freshTrends);
          return freshTrends;
        }
      }

      // Fallback to local data if APIs fail
      return this.getFallbackTrends();
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return this.getFallbackTrends();
    }
  }

  // Fetch skills assessment data
  async getSkillsData(skillName?: string): Promise<SkillsData[]> {
    try {
      // First try to get cached skills data from Supabase
      const cachedSkills = await this.getCachedSkillsData(skillName);
      if (cachedSkills.length > 0) {
        return cachedSkills;
      }

      // If no cached data, try to fetch fresh skills data using Chat2API
      if (this.chat2apiKey) {
        const freshSkills = await this.fetchSkillsDataViaChat2API(skillName);
        if (freshSkills.length > 0) {
          // Store the fresh skills data in Supabase for future use
          await this.storeSkillsDataInSupabase(freshSkills);
          return freshSkills;
        }
      }

      // Fallback to local data if APIs fail
      return this.getFallbackSkillsData();
    } catch (error) {
      console.error('Error fetching skills data:', error);
      return this.getFallbackSkillsData();
    }
  }

  // Chat2API integration for fetching job market data
  private async fetchJobDataViaChat2API(industry?: string, location?: string): Promise<JobMarketData[]> {
    if (!this.chat2apiKey) {
      console.warn('Chat2API key not configured, using fallback data');
      return this.getFallbackData();
    }

    try {
      const prompt = `Find current job openings for ${industry || 'technology'} positions in ${location || 'United States'}. 
      Return the data in JSON format with fields: id, title, company, location, salary (min, max, currency), 
      skills, experience, type, postedDate, demand, growthRate, industry, description.`;

      const response = await fetch(`${this.chat2apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.chat2apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat2API error: ${response.status}`);
      }

      const data = await response.json();
      const jobData = this.parseChat2APIResponse(data);
      return jobData.length > 0 ? jobData : this.getFallbackData();
    } catch (error) {
      console.warn('Chat2API failed, using fallback data:', error);
      return this.getFallbackData();
    }
  }

  // Chat2API integration for fetching market trends
  private async fetchMarketTrendsViaChat2API(): Promise<MarketTrends | null> {
    if (!this.chat2apiKey) {
      console.warn('Chat2API key not configured, using fallback data');
      return null;
    }

    try {
      const prompt = `Provide current market trends for technology and other industries including:
      1. Trending skills with demand scores (0-100), growth rates, and salary estimates
      2. Emerging job roles with descriptions, growth rates, and required skills
      3. Industry insights with growth rates, job counts, and average salaries
      Return in JSON format matching the MarketTrends interface.`;

      const response = await fetch(`${this.chat2apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.chat2apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat2API error: ${response.status}`);
      }

      const data = await response.json();
      const trends = this.parseChat2APITrendsResponse(data);
      return trends || null;
    } catch (error) {
      console.warn('Chat2API failed, using fallback data:', error);
      return null;
    }
  }

  // Chat2API integration for fetching skills data
  private async fetchSkillsDataViaChat2API(skillName?: string): Promise<SkillsData[]> {
    if (!this.chat2apiKey) {
      console.warn('Chat2API key not configured, using fallback data');
      return this.getFallbackSkillsData();
    }

    try {
      const prompt = `Provide detailed information about ${skillName || 'in-demand technical skills'} including:
      demand score (0-100), salary estimates, growth rate, related skills, and relevant certifications.
      Return in JSON format matching the SkillsData interface.`;

      const response = await fetch(`${this.chat2apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.chat2apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat2API error: ${response.status}`);
      }

      const data = await response.json();
      const skillsData = this.parseChat2APISkillsResponse(data);
      return skillsData.length > 0 ? skillsData : this.getFallbackSkillsData();
    } catch (error) {
      console.warn('Chat2API failed, using fallback data:', error);
      return this.getFallbackSkillsData();
    }
  }

  // Supabase integration methods
  private async getCachedJobData(industry?: string, location?: string): Promise<JobMarketData[]> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      return [];
    }

    try {
      // This would use your Supabase client to fetch cached job data
      // For now, return empty array - implement when Supabase is set up
      return [];
    } catch (error) {
      console.warn('Failed to fetch cached job data:', error);
      return [];
    }
  }

  private async getCachedMarketTrends(): Promise<MarketTrends | null> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      return null;
    }

    try {
      // This would use your Supabase client to fetch cached market trends
      // For now, return null - implement when Supabase is set up
      return null;
    } catch (error) {
      console.warn('Failed to fetch cached market trends:', error);
      return null;
    }
  }

  private async getCachedSkillsData(skillName?: string): Promise<SkillsData[]> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      return [];
    }

    try {
      // This would use your Supabase client to fetch cached skills data
      // For now, return empty array - implement when Supabase is set up
      return [];
    } catch (error) {
      console.warn('Failed to fetch cached skills data:', error);
      return [];
    }
  }

  private async storeJobDataInSupabase(jobData: JobMarketData[]): Promise<void> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      return;
    }

    try {
      // This would use your Supabase client to store job data
      // For now, just log - implement when Supabase is set up
      console.log('Storing job data in Supabase:', jobData.length, 'jobs');
    } catch (error) {
      console.warn('Failed to store job data in Supabase:', error);
    }
  }

  private async storeMarketTrendsInSupabase(trends: MarketTrends): Promise<void> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      return;
    }

    try {
      // This would use your Supabase client to store market trends
      // For now, just log - implement when Supabase is set up
      console.log('Storing market trends in Supabase');
    } catch (error) {
      console.warn('Failed to store market trends in Supabase:', error);
    }
  }

  private async storeSkillsDataInSupabase(skillsData: SkillsData[]): Promise<void> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      return;
    }

    try {
      // This would use your Supabase client to store skills data
      // For now, just log - implement when Supabase is set up
      console.log('Storing skills data in Supabase:', skillsData.length, 'skills');
    } catch (error) {
      console.warn('Failed to store skills data in Supabase:', error);
    }
  }

  // Response parsing methods for Chat2API
  private parseChat2APIResponse(data: any): JobMarketData[] {
    try {
      const content = data.choices?.[0]?.message?.content;
      if (!content) return [];

      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Array.isArray(parsed) ? parsed : [parsed];
      }

      return [];
    } catch (error) {
      console.warn('Failed to parse Chat2API response:', error);
      return [];
    }
  }

  private parseChat2APITrendsResponse(data: any): MarketTrends | null {
    try {
      const content = data.choices?.[0]?.message?.content;
      if (!content) return null;

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return null;
    } catch (error) {
      console.warn('Failed to parse Chat2API trends response:', error);
      return null;
    }
  }

  private parseChat2APISkillsResponse(data: any): SkillsData[] {
    try {
      const content = data.choices?.[0]?.message?.content;
      if (!content) return [];

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Array.isArray(parsed) ? parsed : [parsed];
      }

      return [];
    } catch (error) {
      console.warn('Failed to parse Chat2API skills response:', error);
      return [];
    }
  }

  // Data transformation methods (kept for fallback data processing)
  private transformJobData(data: any): JobMarketData[] {
    // Generic transformation for any job data format
    if (Array.isArray(data)) {
      return data.map(job => this.transformSingleJob(job));
    }
    return [this.transformSingleJob(data)];
  }

  private transformSingleJob(job: any): JobMarketData {
    return {
      id: job.id || `job-${Date.now()}`,
      title: job.title || 'Unknown Position',
      company: job.company || 'Unknown Company',
      location: job.location || 'Remote',
      salary: {
        min: job.salary?.min || job.salaryMin || 0,
        max: job.salary?.max || job.salaryMax || 0,
        currency: job.salary?.currency || 'USD',
      },
      skills: job.skills || [],
      experience: job.experience || 'Entry Level',
      type: job.type || 'full-time',
      postedDate: job.postedDate || job.date || new Date().toISOString(),
      demand: this.calculateDemand(job.applications || 0),
      growthRate: this.calculateGrowthRate(job),
      industry: job.industry || 'Technology',
      description: job.description || job.snippet || '',
    };
  }

  // Helper methods
  private calculateDemand(applications: number): 'high' | 'medium' | 'low' {
    if (applications < 10) return 'high';
    if (applications < 50) return 'medium';
    return 'low';
  }

  private calculateGrowthRate(job: any): number {
    // Calculate growth rate based on various factors
    return Math.random() * 100; // Placeholder
  }



  private deduplicateAndRankJobs(jobs: JobMarketData[]): JobMarketData[] {
    // Remove duplicates and rank by relevance
    const uniqueJobs = jobs.filter((job, index, self) => 
      index === self.findIndex(j => j.id === job.id)
    );

    return uniqueJobs.sort((a, b) => {
      // Sort by demand, growth rate, and recency
      const demandScore = { high: 3, medium: 2, low: 1 };
      const aScore = demandScore[a.demand] + (a.growthRate / 100) + (1 / (Date.now() - new Date(a.postedDate).getTime()));
      const bScore = demandScore[b.demand] + (b.growthRate / 100) + (1 / (Date.now() - new Date(b.postedDate).getTime()));
      return bScore - aScore;
    });
  }

  // Fallback data when APIs fail
  private getFallbackData(): JobMarketData[] {
    // No fallback data - throw error instead
    throw new Error('Job market data service is currently unavailable. Please try again later.');
  }

  private getFallbackTrends(): MarketTrends {
    // No fallback data - throw error instead
    throw new Error('Market trends service is currently unavailable. Please try again later.');
  }

  private getFallbackSkillsData(): SkillsData[] {
    // No fallback data - throw error instead
    throw new Error('Skills data service is currently unavailable. Please try again later.');
  }

  // Data refresh methods - these are now just aliases to the main methods
  async refreshJobData(): Promise<JobMarketData[]> {
    return this.getJobMarketData();
  }

  async refreshMarketTrends(): Promise<MarketTrends> {
    return this.getMarketTrends();
  }

  async refreshSkillsData(): Promise<SkillsData[]> {
    return this.getSkillsData();
  }
}

export const jobMarketAPI = new JobMarketAPIService();

