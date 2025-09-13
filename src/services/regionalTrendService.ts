import { CareerTrendData } from './careerTrendService';

export interface RegionalFactors {
  techGrowth: number;
  healthcareGrowth: number;
  manufacturingGrowth: number;
  remoteWork: number;
  salaryMultiplier: number;
  topCities: string[];
}

export const REGIONAL_FACTORS: Record<string, RegionalFactors> = {
  'north-america': {
    techGrowth: 1.2,
    healthcareGrowth: 1.1,
    manufacturingGrowth: 0.9,
    remoteWork: 1.3,
    salaryMultiplier: 1.0,
    topCities: ['New York', 'San Francisco', 'Toronto', 'Vancouver', 'Mexico City', 'Los Angeles', 'Chicago', 'Boston']
  },
  'europe': {
    techGrowth: 1.1,
    healthcareGrowth: 1.0,
    manufacturingGrowth: 1.0,
    remoteWork: 1.1,
    salaryMultiplier: 0.85,
    topCities: ['London', 'Berlin', 'Paris', 'Amsterdam', 'Stockholm', 'Zurich', 'Munich', 'Frankfurt']
  },
  'asia-pacific': {
    techGrowth: 1.4,
    healthcareGrowth: 1.2,
    manufacturingGrowth: 1.3,
    remoteWork: 0.9,
    salaryMultiplier: 0.7,
    topCities: ['Tokyo', 'Seoul', 'Singapore', 'Sydney', 'Melbourne', 'Hong Kong', 'Taipei', 'Auckland']
  },
  'south-america': {
    techGrowth: 1.3,
    healthcareGrowth: 1.1,
    manufacturingGrowth: 1.1,
    remoteWork: 1.0,
    salaryMultiplier: 0.4,
    topCities: ['São Paulo', 'Buenos Aires', 'Santiago', 'Bogotá', 'Lima', 'Montevideo']
  },
  'africa': {
    techGrowth: 1.5,
    healthcareGrowth: 1.3,
    manufacturingGrowth: 1.2,
    remoteWork: 0.8,
    salaryMultiplier: 0.3,
    topCities: ['Cape Town', 'Johannesburg', 'Lagos', 'Nairobi', 'Cairo', 'Casablanca']
  },
  'middle-east': {
    techGrowth: 1.2,
    healthcareGrowth: 1.1,
    manufacturingGrowth: 1.0,
    remoteWork: 0.9,
    salaryMultiplier: 0.8,
    topCities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Tel Aviv', 'Doha', 'Kuwait City']
  }
};

export class RegionalTrendService {
  private static instance: RegionalTrendService;

  private constructor() {}

  public static getInstance(): RegionalTrendService {
    if (!RegionalTrendService.instance) {
      RegionalTrendService.instance = new RegionalTrendService();
    }
    return RegionalTrendService.instance;
  }

  /**
   * Apply regional factors to trend data
   */
  public applyRegionalFactors(trendData: CareerTrendData, regionId: string): CareerTrendData {
    const factors = REGIONAL_FACTORS[regionId] || REGIONAL_FACTORS['north-america'];
    
    // Determine industry type based on career ID or other factors
    const industryType = this.getIndustryType(trendData.career_id);
    
    // Apply regional growth factors
    let growthMultiplier = 1.0;
    switch (industryType) {
      case 'tech':
        growthMultiplier = factors.techGrowth;
        break;
      case 'healthcare':
        growthMultiplier = factors.healthcareGrowth;
        break;
      case 'manufacturing':
        growthMultiplier = factors.manufacturingGrowth;
        break;
      default:
        growthMultiplier = (factors.techGrowth + factors.healthcareGrowth + factors.manufacturingGrowth) / 3;
    }

    // Apply regional adjustments
    const adjustedTrendData: CareerTrendData = {
      ...trendData,
      growth_rate: Math.max(-10, Math.min(50, trendData.growth_rate * growthMultiplier)),
      remote_work_trend: Math.max(0, Math.min(10, trendData.remote_work_trend * factors.remoteWork)),
      top_locations: factors.topCities.slice(0, 5),
      market_insights: this.getRegionalMarketInsights(trendData.market_insights, regionId),
      future_outlook: this.getRegionalFutureOutlook(trendData.future_outlook, regionId),
      industry_impact: this.getRegionalIndustryImpact(trendData.industry_impact, regionId)
    };

    // Adjust trend score based on regional factors
    const regionalTrendScore = Math.max(1, Math.min(10, 
      trendData.trend_score * (0.8 + (growthMultiplier - 1) * 0.5)
    ));
    adjustedTrendData.trend_score = Math.round(regionalTrendScore * 100) / 100;

    // Adjust job availability based on regional factors
    const regionalJobAvailability = Math.max(1, Math.min(10,
      trendData.job_availability_score * (0.9 + (growthMultiplier - 1) * 0.3)
    ));
    adjustedTrendData.job_availability_score = Math.round(regionalJobAvailability * 100) / 100;

    return adjustedTrendData;
  }

  /**
   * Determine industry type from career ID
   */
  private getIndustryType(careerId: string): string {
    const techCareers = ['software-engineer', 'data-scientist', 'ai-engineer', 'cloud-engineer', 'cybersecurity-analyst', 'junior-dev', 'mid-dev', 'senior-dev', 'tech-lead'];
    const healthcareCareers = ['cna', 'lpn', 'rn', 'nurse-manager', 'doctor', 'physician', 'surgeon'];
    const manufacturingCareers = ['production-worker', 'machine-operator', 'quality-control-inspector', 'manufacturing-engineer', 'plant-manager'];

    if (techCareers.some(career => careerId.includes(career))) {
      return 'tech';
    } else if (healthcareCareers.some(career => careerId.includes(career))) {
      return 'healthcare';
    } else if (manufacturingCareers.some(career => careerId.includes(career))) {
      return 'manufacturing';
    }

    return 'general';
  }

  /**
   * Get regional market insights
   */
  private getRegionalMarketInsights(baseInsights: string, regionId: string): string {
    const regionNames = {
      'north-america': 'North America',
      'europe': 'Europe',
      'asia-pacific': 'Asia Pacific',
      'south-america': 'South America',
      'africa': 'Africa',
      'middle-east': 'Middle East'
    };

    const regionName = regionNames[regionId] || 'North America';
    
    // Add regional context to insights
    if (baseInsights.includes('growth potential')) {
      return baseInsights.replace('growth potential', `growth potential in ${regionName}`);
    } else if (baseInsights.includes('increasing demand')) {
      return baseInsights.replace('increasing demand', `increasing demand across ${regionName}`);
    } else {
      return `${baseInsights} - Regional trends in ${regionName} show strong potential.`;
    }
  }

  /**
   * Get regional future outlook
   */
  private getRegionalFutureOutlook(baseOutlook: string, regionId: string): string {
    const regionNames = {
      'north-america': 'North America',
      'europe': 'Europe',
      'asia-pacific': 'Asia Pacific',
      'south-america': 'South America',
      'africa': 'Africa',
      'middle-east': 'Middle East'
    };

    const regionName = regionNames[regionId] || 'North America';
    
    if (baseOutlook.includes('positive outlook')) {
      return baseOutlook.replace('positive outlook', `positive outlook in ${regionName}`);
    } else if (baseOutlook.includes('strong future prospects')) {
      return baseOutlook.replace('strong future prospects', `strong future prospects across ${regionName}`);
    } else {
      return `${baseOutlook} - ${regionName} market shows promising growth opportunities.`;
    }
  }

  /**
   * Get regional industry impact
   */
  private getRegionalIndustryImpact(baseImpact: string, regionId: string): string {
    const regionNames = {
      'north-america': 'North America',
      'europe': 'Europe',
      'asia-pacific': 'Asia Pacific',
      'south-america': 'South America',
      'africa': 'Africa',
      'middle-east': 'Middle East'
    };

    const regionName = regionNames[regionId] || 'North America';
    
    if (baseImpact.includes('industry trends')) {
      return baseImpact.replace('industry trends', `industry trends in ${regionName}`);
    } else {
      return `${baseImpact} - ${regionName} regional market dynamics.`;
    }
  }

  /**
   * Get region display name
   */
  public getRegionDisplayName(regionId: string): string {
    const regionNames = {
      'north-america': 'North America',
      'europe': 'Europe',
      'asia-pacific': 'Asia Pacific',
      'south-america': 'South America',
      'africa': 'Africa',
      'middle-east': 'Middle East'
    };

    return regionNames[regionId] || 'North America';
  }

  /**
   * Get all available regions
   */
  public getAllRegions(): Array<{ id: string; name: string }> {
    return Object.keys(REGIONAL_FACTORS).map(regionId => ({
      id: regionId,
      name: this.getRegionDisplayName(regionId)
    }));
  }
}

export const regionalTrendService = RegionalTrendService.getInstance();
