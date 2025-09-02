import { useState, useEffect, useCallback, useRef } from 'react';
import { jobMarketAPI, JobMarketData, MarketTrends, SkillsData } from '@/services/jobMarketAPI';

interface RealTimeDataState {
  jobs: JobMarketData[];
  trends: MarketTrends;
  skills: SkillsData[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface UseRealTimeDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  enableNotifications?: boolean;
  industries?: string[];
  locations?: string[];
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}) => {
  const {
    autoRefresh = true,
    refreshInterval = 300000, // 5 minutes default
    enableNotifications = true,
    industries = [],
    locations = [],
  } = options;

  const [data, setData] = useState<RealTimeDataState>({
    jobs: [],
    trends: { trendingSkills: [], emergingRoles: [], industryInsights: [] },
    skills: [],
    lastUpdated: null,
    isLoading: false,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch all data
  const fetchAllData = useCallback(async (signal?: AbortSignal) => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      // Fetch data from multiple sources in parallel
      const [jobs, trends, skills] = await Promise.all([
        jobMarketAPI.getJobMarketData(
          industries.length > 0 ? industries[0] : undefined,
          locations.length > 0 ? locations[0] : undefined
        ),
        jobMarketAPI.getMarketTrends(),
        jobMarketAPI.getSkillsData(),
      ]);

      if (signal?.aborted) return;

      setData(prev => ({
        ...prev,
        jobs,
        trends,
        skills,
        lastUpdated: new Date(),
        isLoading: false,
      }));

      // Show notification for new data if enabled
      if (enableNotifications && data.lastUpdated) {
        const newJobsCount = jobs.length - data.jobs.length;
        if (newJobsCount > 0) {
          showNotification(`New ${newJobsCount} job opportunities available!`);
        }
      }

    } catch (error) {
      if (signal?.aborted) return;
      
      console.error('Error fetching real-time data:', error);
      setData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        isLoading: false,
      }));
    }
  }, [industries, locations, enableNotifications, data.jobs.length, data.lastUpdated]);

  // Refresh specific data types
  const refreshJobs = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true }));
      const jobs = await jobMarketAPI.refreshJobData();
      setData(prev => ({ ...prev, jobs, lastUpdated: new Date(), isLoading: false }));
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      setData(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to refresh jobs',
        isLoading: false 
      }));
    }
  }, []);

  const refreshTrends = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true }));
      const trends = await jobMarketAPI.refreshMarketTrends();
      setData(prev => ({ ...prev, trends, lastUpdated: new Date(), isLoading: false }));
    } catch (error) {
      console.error('Error refreshing trends:', error);
      setData(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to refresh trends',
        isLoading: false 
      }));
    }
  }, []);

  const refreshSkills = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true }));
      const skills = await jobMarketAPI.refreshSkillsData();
      setData(prev => ({ ...prev, skills, lastUpdated: new Date(), isLoading: false }));
    } catch (error) {
      console.error('Error refreshing skills:', error);
      setData(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to refresh skills',
        isLoading: false 
      }));
    }
  }, []);

  // Manual refresh all data
  const refreshAll = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    await fetchAllData(abortControllerRef.current.signal);
  }, [fetchAllData]);

  // Show notification helper
  const showNotification = useCallback((message: string) => {
    if (!enableNotifications || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification('Career Atlas Update', { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Career Atlas Update', { body: message });
        }
      });
    }
  }, [enableNotifications]);

  // Setup auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    // Initial fetch
    fetchAllData();

    // Setup interval
    intervalRef.current = setInterval(() => {
      fetchAllData();
    }, refreshInterval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoRefresh, refreshInterval, fetchAllData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Filter jobs by industry and location
  const getFilteredJobs = useCallback((filters?: {
    industry?: string;
    location?: string;
    skills?: string[];
    experience?: string;
    type?: string;
  }) => {
    let filtered = data.jobs;

    if (filters?.industry) {
      filtered = filtered.filter(job => 
        job.industry.toLowerCase().includes(filters.industry!.toLowerCase())
      );
    }

    if (filters?.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters?.skills && filters.skills.length > 0) {
      filtered = filtered.filter(job => 
        filters.skills!.some(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters?.experience) {
      filtered = filtered.filter(job => 
        job.experience === filters.experience
      );
    }

    if (filters?.type) {
      filtered = filtered.filter(job => 
        job.type === filters.type
      );
    }

    return filtered;
  }, [data.jobs]);

  // Get trending jobs (high demand, high growth)
  const getTrendingJobs = useCallback(() => {
    return data.jobs
      .filter(job => job.demand === 'high' && job.growthRate > 10)
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 10);
  }, [data.jobs]);

  // Get emerging skills
  const getEmergingSkills = useCallback(() => {
    return data.skills
      .filter(skill => skill.growth > 15)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 10);
  }, [data.skills]);

  // Get industry insights
  const getIndustryInsights = useCallback(() => {
    return data.trends.industryInsights
      .sort((a, b) => b.growth - a.growth);
  }, [data.trends.industryInsights]);

  return {
    // Data
    jobs: data.jobs,
    trends: data.trends,
    skills: data.skills,
    lastUpdated: data.lastUpdated,
    isLoading: data.isLoading,
    error: data.error,

    // Actions
    refreshAll,
    refreshJobs,
    refreshTrends,
    refreshSkills,
    fetchAllData,

    // Filtered data
    getFilteredJobs,
    getTrendingJobs,
    getEmergingSkills,
    getIndustryInsights,

    // State
    hasData: data.jobs.length > 0 || data.trends.trendingSkills.length > 0,
    isStale: data.lastUpdated ? 
      Date.now() - data.lastUpdated.getTime() > refreshInterval : true,
  };
};

// Specialized hooks for specific data types
export const useRealTimeJobs = (options?: Omit<UseRealTimeDataOptions, 'autoRefresh'>) => {
  const { jobs, isLoading, error, refreshJobs, getFilteredJobs, getTrendingJobs } = useRealTimeData({
    ...options,
    autoRefresh: true,
  });

  return {
    jobs,
    isLoading,
    error,
    refreshJobs,
    getFilteredJobs,
    getTrendingJobs,
  };
};

export const useRealTimeTrends = (options?: Omit<UseRealTimeDataOptions, 'autoRefresh'>) => {
  const { trends, isLoading, error, refreshTrends, getEmergingSkills, getIndustryInsights } = useRealTimeData({
    ...options,
    autoRefresh: true,
  });

  return {
    trends,
    isLoading,
    error,
    refreshTrends,
    getEmergingSkills,
    getIndustryInsights,
  };
};

export const useRealTimeSkills = (options?: Omit<UseRealTimeDataOptions, 'autoRefresh'>) => {
  const { skills, isLoading, error, refreshSkills } = useRealTimeData({
    ...options,
    autoRefresh: true,
  });

  return {
    skills,
    isLoading,
    error,
    refreshSkills,
  };
};
