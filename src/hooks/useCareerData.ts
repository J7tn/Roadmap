import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ICareerPath, 
  ICareerNode, 
  ICareerFilters, 
  ICareerSearchResult,
  ICareerRecommendation,
  IndustryCategory,
  ILazyCareerData
} from '@/types/career';
import { 
  getCareerPath, 
  getCareerPathsByIndustry, 
  searchCareers, 
  getCareerRecommendations,
  getCareerNode,
  getCareerCacheStats
} from '@/services/careerService';

// Custom hook for optimized career data management
export const useCareerData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState({ size: 0, hitRate: 0 });

  // Update cache stats periodically
  useEffect(() => {
    const updateStats = () => {
      const stats = getCareerCacheStats();
      setCacheStats(stats);
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Get career path with lazy loading
  const useCareerPath = (pathId: string) => {
    const [data, setData] = useState<ICareerPath | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
      if (!pathId) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getCareerPath(pathId);
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

  // Get career paths by industry with pagination
  const useCareerPathsByIndustry = (
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
        const result = await getCareerPathsByIndustry(industry, page, limit);
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

  // Search careers with debouncing
  const useCareerSearch = (
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
            const result = await searchCareers(searchQuery, searchFilters, searchPage, searchLimit);
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

  // Get career recommendations
  const useCareerRecommendations = (
    userSkills: string[], 
    userInterests: string[], 
    experience: number
  ) => {
    const [data, setData] = useState<ICareerRecommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendations = useCallback(async () => {
      if (userSkills.length === 0 && userInterests.length === 0) {
        setData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getCareerRecommendations(userSkills, userInterests, experience);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      } finally {
        setLoading(false);
      }
    }, [userSkills, userInterests, experience]);

    useEffect(() => {
      fetchRecommendations();
    }, [fetchRecommendations]);

    return { data, loading, error, refetch: fetchRecommendations };
  };

  // Get career node details
  const useCareerNode = (nodeId: string) => {
    const [data, setData] = useState<ICareerNode | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNode = useCallback(async () => {
      if (!nodeId) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getCareerNode(nodeId);
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

  // Preload multiple career paths for better performance
  const preloadCareerPaths = useCallback(async (pathIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const promises = pathIds.map(id => getCareerPath(id));
      await Promise.allSettled(promises);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preload career paths');
    } finally {
      setLoading(false);
    }
  }, []);

  // Batch load career nodes
  const batchLoadCareerNodes = useCallback(async (nodeIds: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const promises = nodeIds.map(id => getCareerNode(id));
      const results = await Promise.allSettled(promises);
      
      // Filter out failed requests
      const successfulResults = results
        .map((result, index) => result.status === 'fulfilled' ? result.value : null)
        .filter(Boolean);

      return successfulResults;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to batch load career nodes');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized search with filters
  const useOptimizedSearch = (
    query: string,
    filters: ICareerFilters = {},
    page: number = 1,
    limit: number = 20
  ) => {
    const [data, setData] = useState<ICareerSearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    const performSearch = useCallback(async () => {
      if (!query.trim()) {
        setData(null);
        return;
      }

      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, 10);
        return newHistory;
      });

      setLoading(true);
      setError(null);

      try {
        const result = await searchCareers(query, filters, page, limit);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, [query, filters, page, limit]);

    useEffect(() => {
      performSearch();
    }, [performSearch]);

    return { 
      data, 
      loading, 
      error, 
      searchHistory,
      refetch: performSearch 
    };
  };

  return {
    // Individual hooks
    useCareerPath,
    useCareerPathsByIndustry,
    useCareerSearch,
    useCareerRecommendations,
    useCareerNode,
    useOptimizedSearch,
    
    // Utility functions
    preloadCareerPaths,
    batchLoadCareerNodes,
    
    // Global state
    loading,
    error,
    cacheStats,
    
    // Error handling
    clearError: () => setError(null)
  };
};

// Specialized hook for industry browsing
export const useIndustryBrowser = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryCategory>('tech');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { useCareerPathsByIndustry } = useCareerData();
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

// Hook for career path exploration
export const useCareerPathExplorer = (initialPathId?: string) => {
  const [currentPathId, setCurrentPathId] = useState<string | undefined>(initialPathId);
  const [visitedPaths, setVisitedPaths] = useState<Set<string>>(new Set());
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  const { useCareerPath } = useCareerData();
  const { data: currentPath, loading, error, refetch } = useCareerPath(currentPathId || '');

  const explorePath = useCallback((pathId: string) => {
    setCurrentPathId(pathId);
    setVisitedPaths(prev => new Set([...prev, pathId]));
    setPathHistory(prev => [...prev, pathId]);
  }, []);

  const goBack = useCallback(() => {
    if (pathHistory.length > 1) {
      const newHistory = pathHistory.slice(0, -1);
      const previousPath = newHistory[newHistory.length - 1];
      setPathHistory(newHistory);
      setCurrentPathId(previousPath);
    }
  }, [pathHistory]);

  const clearHistory = useCallback(() => {
    setPathHistory([]);
    setVisitedPaths(new Set());
    setCurrentPathId(undefined);
  }, []);

  return {
    currentPath,
    currentPathId,
    loading,
    error,
    refetch,
    explorePath,
    goBack,
    clearHistory,
    visitedPaths: Array.from(visitedPaths),
    pathHistory,
    canGoBack: pathHistory.length > 1
  };
};
