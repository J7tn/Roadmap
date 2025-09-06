import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ICareerNode } from "@/types/career";
import { getAllCareerNodes } from "@/services/careerService";
import { INDUSTRY_CATEGORIES } from "@/data/industries";
import CareerBlock from "@/components/CareerBlock";
import BottomNavigation from "@/components/BottomNavigation";
import SearchInput from "@/components/SearchInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

const SearchPage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [allCareers, setAllCareers] = useState<ICareerNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");


  // Get search query from URL
  const urlSearchQuery = searchParams.get('search') || "";

  // Load all career data
  useEffect(() => {
    const loadCareers = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const careerData = await getAllCareerNodes();
        
        // Extract career nodes and add category from path
        const careers = careerData.map(item => ({
          ...item.node,
          cat: item.path.cat // Add category from path to node
        }));
        
        setAllCareers(careers);
        setLoading(false);
      } catch (err) {
        console.error('SearchPage: Error loading careers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load careers');
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
    if (!searchQuery.trim() && selectedIndustry === "all" && selectedLevel === "all") {
      return allCareers.slice(0, 20); // Show first 20 careers by default
    }

    const query = searchQuery.toLowerCase();
    
    const filtered = allCareers.filter(career => {
      // Ensure career object has required properties
      if (!career || !career.id || !career.t || !career.cat) {
        return false;
      }

      // Search in title, description, skills, job titles
      const matchesSearch = !searchQuery.trim() || 
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

      const matches = matchesSearch && matchesIndustry && matchesLevel;
      
      // Log matches for debugging
      if (matches && searchQuery.trim()) {
        console.log('SearchPage: Found match:', career.t, 'for query:', query);
      }

      return matches;
    }).slice(0, 50); // Limit to 50 results for performance
    
    console.log('SearchPage: Filtered results:', filtered.length);
    return filtered;
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
      // Update URL with search query
      const params = new URLSearchParams();
      params.set('search', searchQuery);
      navigate(`/search?${params.toString()}`);
    }
  }, [searchQuery, navigate]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    navigate('/search');
  }, [navigate]);


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Loading careers..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title="Error Loading Careers"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b safe-area-top">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Search Careers</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="p-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearchSubmit}
          placeholder="Search careers, skills, or job titles..."
          loading={loading}
          suggestions={searchSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-muted rounded-lg space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Industries</option>
                  {INDUSTRY_CATEGORIES.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Experience Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-2 border rounded-md"
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

        {/* Results */}
        <div className="mt-6">
          {filteredCareers.length === 0 ? (
            <EmptyState
              icon="search"
              title="No careers found"
              description="Try adjusting your search terms or filters"
              action={{
                label: "Clear Search",
                onClick: clearSearch
              }}
            />
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {filteredCareers.length} career{filteredCareers.length !== 1 ? 's' : ''} found
              </p>
              {filteredCareers.filter(career => career && career.id && career.t && career.cat).map((career, index) => (
                <CareerBlock
                  key={career.id}
                  career={career}
                  onClick={handleCareerClick}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </motion.div>
  );
});

SearchPage.displayName = 'SearchPage';

export default SearchPage;