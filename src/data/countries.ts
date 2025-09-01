import { ICountryInfo, CountryCode } from '@/types/career';

// Major countries for global career opportunities
// Focused on safety, stability, and tech-friendly environments
export const COUNTRIES: ICountryInfo[] = [
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    avgCostOfLiving: 100, // Base index
    safetyRating: 8,
    visaDifficulty: 'hard',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    avgCostOfLiving: 85,
    safetyRating: 9,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    avgCostOfLiving: 95,
    safetyRating: 8,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    avgCostOfLiving: 80,
    safetyRating: 9,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    avgCostOfLiving: 85,
    safetyRating: 8,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'NL',
    name: 'Netherlands',
    currency: 'EUR',
    avgCostOfLiving: 90,
    safetyRating: 9,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'SE',
    name: 'Sweden',
    currency: 'SEK',
    avgCostOfLiving: 95,
    safetyRating: 9,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'CH',
    name: 'Switzerland',
    currency: 'CHF',
    avgCostOfLiving: 120,
    safetyRating: 10,
    visaDifficulty: 'hard',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    avgCostOfLiving: 90,
    safetyRating: 9,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    currency: 'NZD',
    avgCostOfLiving: 85,
    safetyRating: 9,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    avgCostOfLiving: 95,
    safetyRating: 10,
    visaDifficulty: 'hard',
    remoteWorkFriendly: false,
    techHub: true
  },
  {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    avgCostOfLiving: 110,
    safetyRating: 10,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'KR',
    name: 'South Korea',
    currency: 'KRW',
    avgCostOfLiving: 85,
    safetyRating: 9,
    visaDifficulty: 'medium',
    remoteWorkFriendly: false,
    techHub: true
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    avgCostOfLiving: 80,
    safetyRating: 8,
    visaDifficulty: 'easy',
    remoteWorkFriendly: true,
    techHub: true
  },
  {
    code: 'IL',
    name: 'Israel',
    currency: 'ILS',
    avgCostOfLiving: 90,
    safetyRating: 7,
    visaDifficulty: 'medium',
    remoteWorkFriendly: true,
    techHub: true
  }
];

// Helper functions
export const getCountryByCode = (code: CountryCode): ICountryInfo | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

export const getCountriesBySafety = (minRating: number): ICountryInfo[] => {
  return COUNTRIES.filter(country => country.safetyRating >= minRating);
};

export const getVisaFriendlyCountries = (): ICountryInfo[] => {
  return COUNTRIES.filter(country => country.visaDifficulty === 'easy' || country.visaDifficulty === 'medium');
};

export const getTechHubCountries = (): ICountryInfo[] => {
  return COUNTRIES.filter(country => country.techHub);
};

export const getRemoteFriendlyCountries = (): ICountryInfo[] => {
  return COUNTRIES.filter(country => country.remoteWorkFriendly);
};

export const getCountriesByCostOfLiving = (maxCost: number): ICountryInfo[] => {
  return COUNTRIES.filter(country => country.avgCostOfLiving <= maxCost);
};
