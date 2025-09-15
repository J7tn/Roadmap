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

// Extended career node with category for search page
interface ICareerNodeWithCategory extends ICareerNode {
  cat?: string;
}
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
  const [allCareers, setAllCareers] = useState<ICareerNodeWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");


  // Get search query and industry from URL
  const urlSearchQuery = searchParams.get('search') || "";
  const urlIndustry = searchParams.get('industry') || "";

  // Load all career data
  useEffect(() => {
    const loadCareers = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const careerData = await getAllCareerNodes();
        
        // Extract career nodes and add category from path
        const careers: ICareerNodeWithCategory[] = careerData.map(item => ({
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

  // Update industry filter when URL changes
  useEffect(() => {
    if (urlIndustry) {
      setSelectedIndustry(urlIndustry);
      setShowFilters(true); // Show filters when industry is specified
    }
  }, [urlIndustry]);

  // Filter careers based on search query and filters
  const filteredCareers = useMemo(() => {
    if (!searchQuery.trim() && selectedIndustry === "all" && selectedLevel === "all") {
      return []; // Show no careers when no filters are applied
    }

    const query = searchQuery.toLowerCase();
    
    // Score and filter careers based on relevance
    const scoredCareers = allCareers.map(career => {
      // Ensure career object has required properties
      if (!career || !career.id || !career.t) {
        return { career, score: 0 };
      }

      let score = 0;
      const title = career.t?.toLowerCase() || '';
      const description = career.d?.toLowerCase() || '';
      
      // Apply industry filter
      const matchesIndustry = selectedIndustry === "all" || 
        career.cat === selectedIndustry;

      // Apply level filter
      const matchesLevel = selectedLevel === "all" || 
        career.l === selectedLevel;

      // If filters don't match, return 0 score
      if (!matchesIndustry || !matchesLevel) {
        return { career, score: 0 };
      }

      // If no search query, return all items that match filters
      if (!searchQuery.trim()) {
        return { career, score: 1 };
      }

      // Exact title match (highest priority)
      if (title === query) {
        score += 100;
      }
      // Title starts with query
      else if (title.startsWith(query)) {
        score += 80;
      }
      // Title contains query
      else if (title.includes(query)) {
        score += 60;
      }
      
      // Job titles exact match
      if (career.jt?.some(jobTitle => jobTitle.toLowerCase() === query)) {
        score += 70;
      }
      // Job titles contains match
      else if (career.jt?.some(jobTitle => jobTitle.toLowerCase().includes(query))) {
        score += 40;
      }
      
      // Skills exact match
      if (career.s?.some(skill => skill.toLowerCase() === query)) {
        score += 50;
      }
      // Skills contains match
      else if (career.s?.some(skill => skill.toLowerCase().includes(query))) {
        score += 25;
      }
      
      // Requirements skills exact match
      if (career.r?.sk?.some(skill => skill.toLowerCase() === query)) {
        score += 45;
      }
      // Requirements skills contains match
      else if (career.r?.sk?.some(skill => skill.toLowerCase().includes(query))) {
        score += 20;
      }
      
      // Description match (lowest priority)
      if (description.includes(query)) {
        score += 10;
      }
      
      // Multi-word query handling - boost score for careers that match multiple words
      const queryWords = query.split(/\s+/).filter(word => word.length > 2);
      if (queryWords.length > 1) {
        const matchedWords = queryWords.filter(word => 
          title.includes(word) || 
          career.jt?.some(jobTitle => jobTitle.toLowerCase().includes(word)) ||
          career.s?.some(skill => skill.toLowerCase().includes(word))
        );
        score += matchedWords.length * 10; // Bonus for matching multiple words
      }
      
      // Special boost for emerging technology careers
      const emergingTechKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'data science', 'devops', 'cloud', 'quantum', 'blockchain', 'robotics', 'automation'];
      const isEmergingTechQuery = emergingTechKeywords.some(keyword => query.includes(keyword));
      const isEmergingTechCareer = career.cat === 'emerging-tech' || 
        title.includes('ai') || title.includes('machine learning') || title.includes('data science') ||
        career.s?.some(skill => emergingTechKeywords.some(keyword => skill.toLowerCase().includes(keyword)));
      
      if (isEmergingTechQuery && isEmergingTechCareer) {
        score += 30; // Extra boost for emerging tech careers when searching for emerging tech terms
      }
      
      return { career, score };
    }).filter(({ score }) => score > 0); // Only include items with positive scores
    
    // Sort by score (highest first) and limit results
    const filtered = scoredCareers
      .sort((a, b) => b.score - a.score)
      .slice(0, 20) // Limit to top 20 most relevant results
      .map(({ career }) => career);
    
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
      className="min-h-screen bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b safe-area-top">
        <div className="flex items-center justify-between p-4">
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

      {/* Main Content - flex-1 to take remaining space */}
      <div className="flex-1 pb-20">
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
              {filteredCareers.filter(career => career && career.id && career.t).map((career, index) => (
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
      </div>

      {/* Bottom Navigation - positioned at bottom */}
      <BottomNavigation />
    </motion.div>
  );
});

SearchPage.displayName = 'SearchPage';

export default SearchPage;