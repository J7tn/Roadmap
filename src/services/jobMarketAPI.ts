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
  private apiKeys: {
    linkedin?: string;
    indeed?: string;
    glassdoor?: string;
    bls?: string;
    onet?: string;
  } = {};

  constructor() {
    // Load API keys from environment variables or config
    this.loadAPIKeys();
  }

  private loadAPIKeys() {
    // In production, these would come from environment variables
    this.apiKeys = {
      linkedin: process.env.REACT_APP_LINKEDIN_API_KEY,
      indeed: process.env.REACT_APP_INDEED_API_KEY,
      glassdoor: process.env.REACT_APP_GLASSDOOR_API_KEY,
      bls: process.env.REACT_APP_BLS_API_KEY,
      onet: process.env.REACT_APP_ONET_API_KEY,
    };
  }

  // Fetch real-time job market data
  async getJobMarketData(industry?: string, location?: string): Promise<JobMarketData[]> {
    try {
      // Combine data from multiple sources for comprehensive results
      const [linkedinJobs, indeedJobs, blsData] = await Promise.allSettled([
        this.fetchLinkedInJobs(industry, location),
        this.fetchIndeedJobs(industry, location),
        this.fetchBLSData(industry),
      ]);

      // Merge and deduplicate results
      const allJobs = [
        ...(linkedinJobs.status === 'fulfilled' ? linkedinJobs.value : []),
        ...(indeedJobs.status === 'fulfilled' ? indeedJobs.value : []),
        ...(blsData.status === 'fulfilled' ? this.transformBLSData(blsData.value) : []),
      ];

      return this.deduplicateAndRankJobs(allJobs);
    } catch (error) {
      console.error('Error fetching job market data:', error);
      return this.getFallbackData();
    }
  }

  // Fetch market trends and insights
  async getMarketTrends(): Promise<MarketTrends> {
    try {
      const [skillsData, industryData, roleData] = await Promise.allSettled([
        this.fetchSkillsData(),
        this.fetchIndustryInsights(),
        this.fetchEmergingRoles(),
      ]);

      return {
        trendingSkills: skillsData.status === 'fulfilled' ? skillsData.value : [],
        emergingRoles: roleData.status === 'fulfilled' ? roleData.value : [],
        industryInsights: industryData.status === 'fulfilled' ? industryData.value : [],
      };
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return this.getFallbackTrends();
    }
  }

  // Fetch skills assessment data
  async getSkillsData(skillName?: string): Promise<SkillsData[]> {
    try {
      if (skillName) {
        return await this.fetchSpecificSkillData(skillName);
      }
      return await this.fetchAllSkillsData();
    } catch (error) {
      console.error('Error fetching skills data:', error);
      return this.getFallbackSkillsData();
    }
  }

  // LinkedIn Jobs API integration
  private async fetchLinkedInJobs(industry?: string, location?: string): Promise<JobMarketData[]> {
    if (!this.apiKeys.linkedin) {
      throw new Error('LinkedIn API key not configured');
    }

    const params = new URLSearchParams({
      keywords: industry || 'technology',
      location: location || 'United States',
      count: '50',
    });

    const response = await fetch(`https://api.linkedin.com/v2/jobs?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKeys.linkedin}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const data = await response.json();
    return this.transformLinkedInData(data);
  }

  // Indeed Jobs API integration
  private async fetchIndeedJobs(industry?: string, location?: string): Promise<JobMarketData[]> {
    if (!this.apiKeys.indeed) {
      throw new Error('Indeed API key not configured');
    }

    const params = new URLSearchParams({
      q: industry || 'technology',
      l: location || 'United States',
      limit: '50',
    });

    const response = await fetch(`https://api.indeed.com/ads/apisearch?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKeys.indeed}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Indeed API error: ${response.status}`);
    }

    const data = await response.json();
    return this.transformIndeedData(data);
  }

  // Bureau of Labor Statistics API
  private async fetchBLSData(industry?: string): Promise<any> {
    if (!this.apiKeys.bls) {
      throw new Error('BLS API key not configured');
    }

    const response = await fetch(`https://api.bls.gov/publicAPI/v2/timeseries/data/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BLS-API-KEY': this.apiKeys.bls,
      },
      body: JSON.stringify({
        seriesid: industry ? this.getIndustrySeriesID(industry) : ['CES0000000001'],
        startyear: new Date().getFullYear() - 1,
        endyear: new Date().getFullYear(),
      }),
    });

    if (!response.ok) {
      throw new Error(`BLS API error: ${response.status}`);
    }

    return await response.json();
  }

  // O*NET API for skills and career data
  private async fetchSkillsData(): Promise<MarketTrends['trendingSkills']> {
    if (!this.apiKeys.onet) {
      throw new Error('O*NET API key not configured');
    }

    const response = await fetch('https://services.onetcenter.org/ws/online/occupations', {
      headers: {
        'Authorization': `Bearer ${this.apiKeys.onet}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`O*NET API error: ${response.status}`);
    }

    const data = await response.json();
    return this.transformONETData(data);
  }

  // Data transformation methods
  private transformLinkedInData(data: any): JobMarketData[] {
    // Transform LinkedIn API response to our format
    return data.elements?.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: job.company?.name || 'Unknown',
      location: job.location || 'Remote',
      salary: {
        min: job.salary?.min || 0,
        max: job.salary?.max || 0,
        currency: job.salary?.currency || 'USD',
      },
      skills: job.skills || [],
      experience: job.experience || 'Entry Level',
      type: job.type || 'full-time',
      postedDate: job.postedDate || new Date().toISOString(),
      demand: this.calculateDemand(job.applications || 0),
      growthRate: this.calculateGrowthRate(job),
      industry: job.industry || 'Technology',
      description: job.description || '',
    })) || [];
  }

  private transformIndeedData(data: any): JobMarketData[] {
    // Transform Indeed API response to our format
    return data.results?.map((job: any) => ({
      id: job.jobkey,
      title: job.jobtitle,
      company: job.company || 'Unknown',
      location: job.formattedLocation || 'Remote',
      salary: {
        min: job.salaryMin || 0,
        max: job.salaryMax || 0,
        currency: 'USD',
      },
      skills: job.skills || [],
      experience: job.experience || 'Entry Level',
      type: job.type || 'full-time',
      postedDate: job.date || new Date().toISOString(),
      demand: this.calculateDemand(job.applications || 0),
      growthRate: this.calculateGrowthRate(job),
      industry: job.industry || 'Technology',
      description: job.snippet || '',
    })) || [];
  }

  private transformBLSData(data: any): JobMarketData[] {
    // Transform BLS API response to our format
    // This would be more complex as BLS provides employment statistics
    return [];
  }

  private transformONETData(data: any): MarketTrends['trendingSkills'] {
    // Transform O*NET API response to our format
    return [];
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

  private getIndustrySeriesID(industry: string): string[] {
    // Map industry names to BLS series IDs
    const industryMap: Record<string, string[]> = {
      'technology': ['CES5000000001'],
      'healthcare': ['CES6000000001'],
      'finance': ['CES5500000001'],
      'manufacturing': ['CES3000000001'],
    };
    return industryMap[industry.toLowerCase()] || ['CES0000000001'];
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
    ];
  }

  private getFallbackTrends(): MarketTrends {
    return {
      trendingSkills: [
        { skill: 'AI/ML', demand: 95, growth: 25, salary: 120000 },
        { skill: 'Cybersecurity', demand: 90, growth: 20, salary: 110000 },
        { skill: 'Cloud Computing', demand: 85, growth: 18, salary: 105000 },
      ],
      emergingRoles: [
        { title: 'AI Engineer', description: 'Build and deploy AI models', growth: 30, skills: ['Python', 'TensorFlow', 'ML'] },
        { title: 'DevOps Engineer', description: 'Automate deployment processes', growth: 25, skills: ['Docker', 'Kubernetes', 'CI/CD'] },
      ],
      industryInsights: [
        { industry: 'Technology', growth: 15, jobCount: 50000, avgSalary: 95000 },
        { industry: 'Healthcare', growth: 12, jobCount: 30000, avgSalary: 85000 },
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
    ];
  }

  // Data refresh methods
  async refreshJobData(): Promise<JobMarketData[]> {
    // Force refresh of job data
    return this.getJobMarketData();
  }

  async refreshMarketTrends(): Promise<MarketTrends> {
    // Force refresh of market trends
    return this.getMarketTrends();
  }

  async refreshSkillsData(): Promise<SkillsData[]> {
    // Force refresh of skills data
    return this.getSkillsData();
  }
}

export const jobMarketAPI = new JobMarketAPIService();
