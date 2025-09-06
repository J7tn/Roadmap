import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Briefcase, 
  DollarSign, 
  Clock, 
  MapPin,
  Star,
  TrendingUp,
  Users,
  Bookmark,
  Filter,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICareerNode } from "@/types/career";
import { getAllCareerNodes } from "@/services/careerService";
import { INDUSTRY_CATEGORIES } from "@/data/industries";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [allCareers, setAllCareers] = useState<ICareerNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  // Add error boundary for component rendering
  const [renderError, setRenderError] = useState<string | null>(null);

  // Get search query from URL
  const urlSearchQuery = searchParams.get('search') || "";

  // Load all career data
  useEffect(() => {
    console.log('SearchPage: Starting to load career data...');
    const loadCareers = async () => {
      try {
        console.log('SearchPage: Setting error to null and starting data fetch...');
        setError(null);
        setLoading(true);
        
        console.log('SearchPage: Calling getAllCareerNodes...');
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Data loading timeout')), 10000)
        );
        
        const allNodes = await Promise.race([
          getAllCareerNodes(),
          timeoutPromise
        ]) as any[];
        
        console.log('SearchPage: Received data:', allNodes?.length, 'nodes');
        
        if (allNodes && allNodes.length > 0) {
          const careerNodes = allNodes.map(item => item.node);
          console.log('SearchPage: Setting careers:', careerNodes.length);
          setAllCareers(careerNodes);
        } else {
          console.log('SearchPage: No career data received');
          setError('No career data available. Please try again later.');
        }
      } catch (error) {
        console.error('SearchPage: Failed to load careers:', error);
        setError('Failed to load career data. Please check your connection and try again.');
      } finally {
        console.log('SearchPage: Setting loading to false');
        setLoading(false);
      }
    };
    loadCareers();
  }, []);

  // Update local search query when URL changes
  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  // Filter careers based on search query and filters
  const filteredCareers = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    
    return allCareers.filter(career => {
      // Search in title, description, skills, job titles
      const matchesSearch = 
        career.t?.toLowerCase().includes(query) ||
        career.d?.toLowerCase().includes(query) ||
        career.s?.some(skill => skill.toLowerCase().includes(query)) ||
        career.jt?.some(jobTitle => jobTitle.toLowerCase().includes(query));

      // Apply industry filter
      const matchesIndustry = selectedIndustry === "all" || 
        career.cat === selectedIndustry;

      // Apply level filter
      const matchesLevel = selectedLevel === "all" || 
        career.l === selectedLevel;

      return matchesSearch && matchesIndustry && matchesLevel;
    }).slice(0, 50); // Limit to 50 results for performance
  }, [searchQuery, allCareers, selectedIndustry, selectedLevel]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions = new Set<string>();
    
    // Add career titles
    allCareers.forEach(career => {
      if (career.t?.toLowerCase().includes(query)) {
        suggestions.add(career.t);
      }
      // Add skills
      career.s?.forEach(skill => {
        if (skill.toLowerCase().includes(query)) {
          suggestions.add(skill);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, [searchQuery, allCareers]);

  const handleCareerClick = useCallback((career: ICareerNode) => {
    navigate(`/jobs/${career.id}`);
  }, [navigate]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [navigate, searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'E': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'I': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'A': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'X': return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'E': return 'Entry Level';
      case 'I': return 'Intermediate';
      case 'A': return 'Advanced';
      case 'X': return 'Expert';
      default: return 'Unknown';
    }
  };

  console.log('SearchPage: Rendering with loading:', loading, 'error:', error, 'careers:', allCareers.length);

  // Catch any rendering errors
  if (renderError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Search className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">Search Page Error</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {renderError}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  // Fallback render to prevent white screen
  if (loading && allCareers.length === 0 && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading search...</p>
        </div>
      </div>
    );
  }

  // Additional fallback for any rendering issues
  if (!loading && allCareers.length === 0 && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Search Careers</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Type in the search bar above to find careers, skills, or job titles.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b safe-area-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for jobs, skills, or careers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-11 text-base"
                  autoFocus
                />
              </form>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Industry:</label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Industries</option>
                      {INDUSTRY_CATEGORIES.map(industry => (
                        <option key={industry.id} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Level:</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="all">All Levels</option>
                      <option value="E">Entry Level</option>
                      <option value="I">Intermediate</option>
                      <option value="A">Advanced</option>
                      <option value="X">Expert</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading careers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error Loading Data</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : allCareers.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Career Data Available</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Unable to load career data. Please try refreshing the page or contact support if the issue persists.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              Refresh Page
            </Button>
          </div>
        ) : !searchQuery.trim() ? (
          /* Empty State */
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Search Careers</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Type in the search bar above to find careers, skills, or job titles. 
              Results will appear here as you type.
            </p>
            
            {/* Popular Searches */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Popular Searches</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Software Engineer', 'Data Scientist', 'Marketing Manager', 'Nurse', 'Teacher', 'Designer'].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(term)}
                    className="text-xs"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="space-y-4">
            {/* Search Suggestions */}
            {searchSuggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Suggestions</h3>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {filteredCareers.length} result{filteredCareers.length !== 1 ? 's' : ''} for "{searchQuery}"
              </h2>
            </div>

            {/* Results List */}
            {filteredCareers.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try different keywords or check your spelling
                </p>
                <Button variant="outline" onClick={clearSearch}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCareers.filter(career => career && career.id && career.t).map((career, index) => (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleCareerClick(career)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{career.t || 'Unknown Career'}</h3>
                              {career.l && (
                                <Badge className={getLevelColor(career.l)}>
                                  {getLevelName(career.l)}
                                </Badge>
                              )}
                            </div>
                            
                            {career.d && (
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {career.d}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {career.sr && typeof career.sr === 'string' && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{career.sr}</span>
                                </div>
                              )}
                              {career.te && typeof career.te === 'string' && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{career.te}</span>
                                </div>
                              )}
                              {career.cat && typeof career.cat === 'string' && (
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-4 w-4" />
                                  <span className="capitalize">{career.cat}</span>
                                </div>
                              )}
                            </div>

                            {career.s && career.s.length > 0 && (
                              <div className="mt-3">
                                <div className="flex flex-wrap gap-1">
                                  {career.s.slice(0, 4).filter(skill => skill && typeof skill === 'string').map((skill, skillIndex) => (
                                    <Badge key={skillIndex} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {career.s.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{career.s.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <ChevronRight className="h-5 w-5 text-muted-foreground ml-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    );
  } catch (error) {
    console.error('SearchPage rendering error:', error);
    setRenderError('An error occurred while rendering the search page');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Search className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">Search Page Error</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            An error occurred while rendering the search page
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
};

export default SearchPage;


