import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICareerPath, ICareerNode, CareerLevel, IndustryCategory } from "@/types/career";
import { useCareerData } from "@/hooks/useCareerData";
import { INDUSTRY_CATEGORIES } from "@/data/industries";
import { useTranslation } from 'react-i18next';
import { formatSalary } from '@/utils/currencyUtils';
import { careerService } from '@/services/careerService';
// Removed complex translation helpers - now using direct language-specific data

interface CareerSearchProps {
  onCareerSelect?: (career: ICareerNode) => void;
  onClose?: () => void;
}

const CareerSearch: React.FC<CareerSearchProps> = ({
  onCareerSelect,
  onClose
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [translatedCareers, setTranslatedCareers] = useState<ICareerNode[]>([]);
  const [loadingTranslated, setLoadingTranslated] = useState(false);

  const { useOptimizedSearch } = useCareerData();
  
  const filters = useMemo(() => ({
    industry: selectedIndustry !== "all" ? [selectedIndustry as IndustryCategory] : undefined,
    level: selectedLevel !== "all" ? [selectedLevel as CareerLevel] : undefined
  }), [selectedIndustry, selectedLevel]);

  const { data: searchResults, loading, error } = useOptimizedSearch(searchQuery, filters);

  // Search translated careers when query changes
  React.useEffect(() => {
    const searchTranslatedCareers = async () => {
      if (!searchQuery.trim()) {
        setTranslatedCareers([]);
        return;
      }

      setLoadingTranslated(true);
      try {
        const translated = await careerService.searchCareersTranslated(searchQuery, filters);
        setTranslatedCareers(translated);
      } catch (error) {
        console.error('Error searching translated careers:', error);
        setTranslatedCareers([]);
      } finally {
        setLoadingTranslated(false);
      }
    };

    const timeoutId = setTimeout(searchTranslatedCareers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedIndustry, selectedLevel]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCareerClick = useCallback((career: ICareerNode) => {
    onCareerSelect?.(career);
  }, [onCareerSelect]);

  const handleClearFilters = useCallback(() => {
    setSelectedIndustry("all");
    setSelectedLevel("all");
  }, []);

  const getLevelBadgeColor = useCallback((level: CareerLevel): string => {
    switch (level) {
      case 'E': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'I': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'A': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'X': return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }, []);

  const getLevelDisplayName = useCallback((level: CareerLevel): string => {
    switch (level) {
      case 'E': return t('pages.search.filters.entryLevel');
      case 'I': return t('pages.search.filters.intermediate');
      case 'A': return t('pages.search.filters.advanced');
      case 'X': return t('pages.search.filters.expert');
      default: return 'Unknown Level';
    }
  }, []);

  const allCareers = useMemo(() => {
    // Use translated careers if available, otherwise fall back to regular search results
    if (translatedCareers.length > 0) {
      return translatedCareers.map(node => ({
        node,
        path: { id: 'translated', n: 'Translated Results', cat: 'healthcare', nodes: [], conn: [] } as ICareerPath
      }));
    }
    
    if (!searchResults?.careers) return [];
    
    const careers: Array<{ node: ICareerNode; path: ICareerPath }> = [];
    searchResults.careers.forEach(path => {
      path.nodes.forEach(node => {
        careers.push({ node, path });
      });
    });
    
    return careers;
  }, [searchResults, translatedCareers]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end">
      <motion.div
        className="w-full max-w-2xl bg-background border-l h-full overflow-y-auto"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Career Search</h2>
              <p className="text-muted-foreground">Find your perfect career path</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="browse">Browse All</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for careers, skills, or job titles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {t('pages.search.filters.title')}
                </Button>
                {(selectedIndustry !== "all" || selectedLevel !== "all") && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    {t('pages.search.clearFilters')}
                  </Button>
                )}
              </div>

              {/* Filter Options */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 p-4 border rounded-lg"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('pages.search.filters.industry')}</label>
                        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('pages.search.filters.allIndustries')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t('pages.search.filters.allIndustries')}</SelectItem>
                            {INDUSTRY_CATEGORIES.map((industry) => (
                              <SelectItem key={industry.id} value={industry.id}>
                                {industry.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">{t('pages.search.filters.experience')}</label>
                        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('pages.search.filters.allLevels')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t('pages.search.filters.allLevels')}</SelectItem>
                <SelectItem value="E">{t('pages.search.filters.entryLevel')}</SelectItem>
                <SelectItem value="I">{t('pages.search.filters.intermediate')}</SelectItem>
                <SelectItem value="A">{t('pages.search.filters.advanced')}</SelectItem>
                <SelectItem value="X">{t('pages.search.filters.expert')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Results */}
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Searching careers...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-8">
                    <p className="text-destructive">Failed to search careers</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      {t('buttons.tryAgain')}
                    </Button>
                  </div>
                )}

                {!loading && !error && searchQuery && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">
                        {allCareers.length} career{allCareers.length !== 1 ? 's' : ''} found
                      </h3>
                      {searchResults?.suggestions && searchResults.suggestions.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Suggestions: {searchResults.suggestions.join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {allCareers.map(({ node, path }) => (
                        <motion.div
                          key={`${path.id}-${node.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card 
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleCareerClick(node)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{node.t}</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {node.d}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      <span>{formatSalary(parseInt(node.sr?.replace(/[^0-9]/g, '') || '0'))}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{node.te}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{path.cat}</span>
                                    </div>
                                  </div>
                                </div>
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {allCareers.length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No careers found for "{searchQuery}"</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try different keywords or adjust your filters
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="browse" className="space-y-4">
              <BrowseAllCareers onCareerSelect={handleCareerClick} />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

// Browse All Careers Component
const BrowseAllCareers: React.FC<{ onCareerSelect: (career: ICareerNode) => void }> = ({ onCareerSelect }) => {
  const { t } = useTranslation();
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [translatedCareers, setTranslatedCareers] = useState<ICareerNode[]>([]);
  const [loadingTranslated, setLoadingTranslated] = useState(false);
  const { useCareerPathsByIndustry } = useCareerData();
  const { data: industryData, loading } = useCareerPathsByIndustry(selectedIndustry as IndustryCategory);

  // Load translated careers when industry changes
  React.useEffect(() => {
    const loadTranslatedCareers = async () => {
      if (selectedIndustry === "all") {
        setTranslatedCareers([]);
        return;
      }

      setLoadingTranslated(true);
      try {
        const filters = {
          industry: [selectedIndustry as IndustryCategory]
        };
        const translated = await careerService.searchCareersTranslated("", filters);
        setTranslatedCareers(translated);
      } catch (error) {
        console.error('Error loading translated careers:', error);
        setTranslatedCareers([]);
      } finally {
        setLoadingTranslated(false);
      }
    };

    loadTranslatedCareers();
  }, [selectedIndustry]);

  const allCareers = useMemo(() => {
    // Use translated careers if available, otherwise fall back to regular industry data
    if (translatedCareers.length > 0) {
      return translatedCareers.map(node => ({
        node,
        path: { id: 'translated', n: 'Translated Results', cat: selectedIndustry, nodes: [], conn: [] } as ICareerPath
      }));
    }
    
    if (!industryData?.careers) return [];
    
    const careers: Array<{ node: ICareerNode; path: ICareerPath }> = [];
    industryData.careers.forEach(path => {
      path.nodes.forEach(node => {
        careers.push({ node, path });
      });
    });
    
    return careers;
  }, [industryData, translatedCareers, selectedIndustry]);

  const getLevelBadgeColor = useCallback((level: CareerLevel): string => {
    switch (level) {
      case 'E': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'I': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'A': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'X': return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }, []);

  const getLevelDisplayName = useCallback((level: CareerLevel): string => {
    switch (level) {
      case 'E': return t('pages.search.filters.entryLevel');
      case 'I': return t('pages.search.filters.intermediate');
      case 'A': return t('pages.search.filters.advanced');
      case 'X': return t('pages.search.filters.expert');
      default: return 'Unknown Level';
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">{t('pages.search.filterByIndustry')}</label>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger>
            <SelectValue placeholder={t('pages.search.filters.allIndustries')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('pages.search.filters.allIndustries')}</SelectItem>
            {INDUSTRY_CATEGORIES.map((industry) => (
              <SelectItem key={industry.id} value={industry.id}>
                {industry.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {(loading || loadingTranslated) && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading careers...</p>
          </div>
        )}

        {!(loading || loadingTranslated) && allCareers.map(({ node, path }) => (
          <motion.div
            key={`${path.id}-${node.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onCareerSelect(node)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{node.t}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {node.d}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatSalary(parseInt(node.sr?.replace(/[^0-9]/g, '') || '0'))}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{node.te}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{path.cat}</span>
                      </div>
                    </div>
                  </div>
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CareerSearch;
