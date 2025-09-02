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
    this.chat2apiKey = process.env.REACT_APP_CHAT2API_KEY || '';
    this.chat2apiUrl = process.env.REACT_APP_CHAT2API_URL || 'https://api.chat2api.com';
    this.supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
    this.supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
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
    return [
      {
        id: 'fallback-1',
        title: 'Software Engineer',
        company: 'Tech Company',
        location: 'Remote',
        salary: { min: 80000, max: 120000, currency: 'USD' },
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 'Mid Level',
        type: 'full-time',
        postedDate: new Date().toISOString(),
        demand: 'high',
        growthRate: 15,
        industry: 'Technology',
        description: 'Fallback job data when APIs are unavailable.',
      },
      {
        id: 'fallback-2',
        title: 'Data Scientist',
        company: 'Analytics Corp',
        location: 'Remote',
        salary: { min: 90000, max: 140000, currency: 'USD' },
        skills: ['Python', 'Machine Learning', 'SQL'],
        experience: 'Mid Level',
        type: 'full-time',
        postedDate: new Date().toISOString(),
        demand: 'high',
        growthRate: 20,
        industry: 'Technology',
        description: 'Fallback job data when APIs are unavailable.',
      },
    ];
  }

  private getFallbackTrends(): MarketTrends {
    return {
      trendingSkills: [
        { skill: 'AI/ML', demand: 95, growth: 25, salary: 120000 },
        { skill: 'Cybersecurity', demand: 90, growth: 20, salary: 110000 },
        { skill: 'Cloud Computing', demand: 85, growth: 18, salary: 105000 },
        { skill: 'Data Science', demand: 88, growth: 22, salary: 115000 },
        { skill: 'DevOps', demand: 82, growth: 16, salary: 100000 },
      ],
      emergingRoles: [
        { title: 'AI Engineer', description: 'Build and deploy AI models', growth: 30, skills: ['Python', 'TensorFlow', 'ML'] },
        { title: 'DevOps Engineer', description: 'Automate deployment processes', growth: 25, skills: ['Docker', 'Kubernetes', 'CI/CD'] },
        { title: 'Data Engineer', description: 'Build data pipelines and infrastructure', growth: 28, skills: ['Python', 'SQL', 'Big Data'] },
        { title: 'Security Engineer', description: 'Protect systems and data', growth: 22, skills: ['Cybersecurity', 'Networking', 'Incident Response'] },
      ],
      industryInsights: [
        { industry: 'Technology', growth: 15, jobCount: 50000, avgSalary: 95000 },
        { industry: 'Healthcare', growth: 12, jobCount: 30000, avgSalary: 85000 },
        { industry: 'Finance', growth: 8, jobCount: 25000, avgSalary: 90000 },
        { industry: 'Manufacturing', growth: 5, jobCount: 20000, avgSalary: 75000 },
      ],
    };
  }

  private getFallbackSkillsData(): SkillsData[] {
    return [
      {
        skill: 'JavaScript',
        demand: 90,
        salary: 95000,
        growth: 15,
        relatedSkills: ['TypeScript', 'React', 'Node.js'],
        certifications: ['AWS Certified Developer', 'Microsoft Certified: Azure Developer'],
      },
      {
        skill: 'Python',
        demand: 92,
        salary: 98000,
        growth: 18,
        relatedSkills: ['Data Science', 'Machine Learning', 'Django'],
        certifications: ['Google Cloud Professional Data Engineer', 'AWS Machine Learning Specialty'],
      },
      {
        skill: 'React',
        demand: 88,
        salary: 92000,
        growth: 12,
        relatedSkills: ['JavaScript', 'TypeScript', 'Next.js'],
        certifications: ['Meta Front-End Developer', 'React Developer Certification'],
      },
    ];
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

