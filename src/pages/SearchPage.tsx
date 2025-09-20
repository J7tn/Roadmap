import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
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
  industry?: string;
}
import { getAllCareerNodesArray, getCareerNodesByIndustry } from "@/services/careerService";
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
  const { t } = useTranslation();
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

  // Load career data based on industry selection (lazy loading)
  useEffect(() => {
    const loadCareers = async () => {
      try {
        setError(null);
        setLoading(true);
        
        console.log('SearchPage: Loading careers for industry:', selectedIndustry);
        
        let careerData: ICareerNode[] = [];
        
        if (selectedIndustry === "all") {
          // Don't load all careers at once - show empty state with message
          console.log('SearchPage: No industry selected, showing empty state');
          careerData = [];
        } else {
          // Load careers for specific industry
          careerData = await getCareerNodesByIndustry(selectedIndustry);
          console.log(`SearchPage: Loaded ${careerData.length} careers for industry: ${selectedIndustry}`);
        }
        
        // Map career nodes (career nodes from Supabase already have translations and industry info)
        const careers: ICareerNodeWithCategory[] = careerData.map(item => ({
          ...item,
          cat: item.industry || 'technology' // Use industry from database as category
        }));
        
        console.log('SearchPage: Sample careers:');
        careers.slice(0, 5).forEach((c, index) => {
          console.log(`  ${index + 1}. ${c.t} (Industry: ${c.industry})`);
        });
        
        setAllCareers(careers);
        setLoading(false);
      } catch (err) {
        console.error('SearchPage: Error loading careers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load careers');
        setLoading(false);
      }
    };
    loadCareers();
  }, [selectedIndustry]);

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
    console.log('SearchPage: Filtering careers with:');
    console.log('  - searchQuery:', `"${searchQuery}"`);
    console.log('  - selectedIndustry:', `"${selectedIndustry}"`);
    console.log('  - selectedLevel:', `"${selectedLevel}"`);
    console.log('  - totalCareers:', allCareers.length);
    
    // When no industry is selected, show empty state
    if (selectedIndustry === "all") {
      console.log('SearchPage: No industry selected, showing empty state');
      return [];
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
        career.industry === selectedIndustry;

      // Apply level filter
      const matchesLevel = selectedLevel === "all" || 
        career.l === selectedLevel;
      
      // Debug level matching for first few careers
      if (allCareers.indexOf(career) < 3) {
        console.log(`SearchPage: Career ${career.t} - Level: ${career.l}, Selected: ${selectedLevel}, Matches: ${matchesLevel}`);
      }

      // Debug logging for first few careers and business careers
      if (allCareers.indexOf(career) < 3 || career.industry === 'business') {
        console.log(`SearchPage: Career ${career.t} - Industry: ${career.industry}, Selected: ${selectedIndustry}, Matches: ${matchesIndustry}`);
        console.log(`SearchPage: Career level: ${career.l}, Selected level: ${selectedLevel}, Matches level: ${matchesLevel}`);
      }

      // If filters don't match, return 0 score
      if (!matchesIndustry || !matchesLevel) {
        if (allCareers.indexOf(career) < 3) {
          console.log(`SearchPage: Career ${career.t} filtered out - Industry match: ${matchesIndustry}, Level match: ${matchesLevel}`);
        }
        return { career, score: 0 };
      }

      // If no search query, return all items that match filters
      if (!searchQuery.trim()) {
        if (allCareers.indexOf(career) < 3) {
          console.log(`SearchPage: Career ${career.t} passed filters with score 1 (no search query)`);
        }
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
    console.log('SearchPage: Scored careers count:', scoredCareers.length);
    console.log('SearchPage: Sample scored careers:', scoredCareers.slice(0, 3).map(({ career, score }) => `${career.t} (score: ${score})`));
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
        <LoadingSpinner message={t('pages.search.loadingCareers')} size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title={t('errors.errorLoadingCareers')}
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
      <div className="sticky top-0 z-50 bg-background border-b safe-area-top" style={{ touchAction: 'none' }}>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">{t('pages.search.title')}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('pages.search.filters.title')}
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
          placeholder={t('pages.search.placeholder')}
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
              <h3 className="font-semibold">{t('pages.search.filters.title')}</h3>
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
                <label className="text-sm font-medium mb-2 block">{t('pages.search.filters.industry')}</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full p-2 border border-border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="all">{t('pages.search.filters.allIndustries')}</option>
                  {INDUSTRY_CATEGORIES.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {t(`industries.${industry.id}`) || industry.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">{t('pages.search.filters.experience')}</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-2 border border-border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="all">{t('pages.search.filters.allLevels')}</option>
                  <option value="E">{t('pages.search.filters.entryLevel')}</option>
                  <option value="I">{t('pages.search.filters.intermediate')}</option>
                  <option value="A">{t('pages.search.filters.advanced')}</option>
                  <option value="X">{t('pages.search.filters.expert')}</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="mt-6">
          {filteredCareers.length === 0 ? (
            selectedIndustry === "all" ? (
              <EmptyState
                icon="filter"
                title={t('pages.search.selectIndustry')}
                description={t('pages.search.selectIndustryDescription')}
              />
            ) : (
              <EmptyState
                icon="search"
                title={t('pages.search.noResults')}
                description={t('pages.search.tryAdjustingSearch')}
                action={{
                  label: t('pages.search.clearSearch'),
                  onClick: clearSearch
                }}
              />
            )
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {filteredCareers.length} {filteredCareers.length !== 1 ? t('pages.search.careersFound') : t('pages.search.careerFound')}
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
