/**
 * Unified Career Data Hook
 * Uses the unified career service with dependency injection
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ICareerPath, ICareerNode, ICareerFilters, ICareerSearchResult, IndustryCategory } from '@/types/career';
import { unifiedCareerService } from '@/services/unifiedCareerService';
import { appConfig } from '@/config/appConfig';

// Hook for individual career path
export const useCareerPath = (pathId: string) => {
  const [data, setData] = useState<ICareerPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pathId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await unifiedCareerService.getCareerPath(pathId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load career path');
    } finally {
      setLoading(false);
    }
  }, [pathId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for career paths by industry
export const useCareerPathsByIndustry = (
  industry: IndustryCategory,
  page: number = 1,
  limit: number = 10
) => {
  const [data, setData] = useState<ICareerSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await unifiedCareerService.getCareerPathsByIndustry(industry, page, limit);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load career paths');
    } finally {
      setLoading(false);
    }
  }, [industry, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for career search with debouncing
export const useCareerSearch = (
  query: string,
  filters: ICareerFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  const [data, setData] = useState<ICareerSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return (searchQuery: string, searchFilters: ICareerFilters, searchPage: number, searchLimit: number) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(async () => {
        if (!searchQuery.trim()) {
          setData(null);
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const result = await unifiedCareerService.searchCareers(searchQuery, searchFilters, searchPage, searchLimit);
          setData(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Search failed');
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce
    };
  }, []);

  useEffect(() => {
    debouncedSearch(query, filters, page, limit);
  }, [query, filters, page, limit, debouncedSearch]);

  return { data, loading, error };
};

// Hook for career node details
export const useCareerNode = (nodeId: string) => {
  const [data, setData] = useState<ICareerNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNode = useCallback(async () => {
    if (!nodeId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await unifiedCareerService.getCareerNode(nodeId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load career node');
    } finally {
      setLoading(false);
    }
  }, [nodeId]);

  useEffect(() => {
    fetchNode();
  }, [fetchNode]);

  return { data, loading, error, refetch: fetchNode };
};

// Hook for service status and configuration
export const useCareerServiceStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dataSource, setDataSource] = useState(unifiedCareerService.getDataSource());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshService = useCallback(async () => {
    await unifiedCareerService.refreshStrategy();
    setDataSource(unifiedCareerService.getDataSource());
  }, []);

  const config = appConfig.getConfig();

  return {
    isOnline,
    dataSource,
    refreshService,
    features: config.features,
    isSupabaseEnabled: config.features.enableSupabase,
    isOfflineModeEnabled: config.features.enableOfflineMode,
  };
};

// Optimized industry browser hook (replaces the old one)
export const useOptimizedIndustryBrowser = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryCategory>('tech');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, loading, error, refetch } = useCareerPathsByIndustry(selectedIndustry, page, limit);

  const changeIndustry = useCallback((industry: IndustryCategory) => {
    setSelectedIndustry(industry);
    setPage(1); // Reset to first page when changing industry
  }, []);

  const nextPage = useCallback(() => {
    if (data?.pagination?.hasMore) {
      setPage(prev => prev + 1);
    }
  }, [data?.pagination?.hasMore]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  return {
    selectedIndustry,
    changeIndustry,
    page,
    nextPage,
    prevPage,
    data,
    loading,
    error,
    refetch,
    hasMore: data?.pagination?.hasMore || false,
    total: data?.total || 0
  };
};
