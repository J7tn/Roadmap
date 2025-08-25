import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, MapPin, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ICareerPath, ICareerFilters, IndustryCategory, CareerLevel } from '@/types/career';
import { useCareerData } from '@/hooks/useCareerData';

interface CareerSearchProps {
  onCareerSelect?: (career: ICareerPath) => void;
  showFilters?: boolean;
  placeholder?: string;
}

const CareerSearch: React.FC<CareerSearchProps> = ({
  onCareerSelect = () => {},
  showFilters = true,
  placeholder = "Search careers, skills, or industries..."
}) => {
  const [query, setQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<ICareerFilters>({});
  const [salaryRange, setSalaryRange] = useState<[number, number]>([30000, 200000]);

  const { useOptimizedSearch } = useCareerData();
  const { data: searchResults, loading, error } = useOptimizedSearch(query, filters);

  // Memoized filter options
  const industryOptions = useMemo(() => [
    { value: 'tech', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'business', label: 'Business' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'education', label: 'Education' },
    { value: 'creative', label: 'Creative Arts' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'science', label: 'Science' },
    { value: 'legal', label: 'Legal' },
  ], []);

  const levelOptions = useMemo(() => [
    { value: 'E', label: 'Entry Level' },
    { value: 'I', label: 'Intermediate' },
    { value: 'A', label: 'Advanced' },
    { value: 'X', label: 'Expert' },
  ], []);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const handleFilterChange = useCallback((key: keyof ICareerFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleSalaryRangeChange = useCallback((range: [number, number]) => {
    setSalaryRange(range);
    setFilters(prev => ({
      ...prev,
      salaryMin: range[0],
      salaryMax: range[1]
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSalaryRange([30000, 200000]);
  }, []);

  const handleCareerClick = useCallback((career: ICareerPath) => {
    onCareerSelect(career);
  }, [onCareerSelect]);

  const getLevelBadgeColor = useCallback((level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'I': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'A': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'X': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }, []);

  const getLevelDisplayName = useCallback((level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'Entry';
      case 'I': return 'Intermediate';
      case 'A': return 'Advanced';
      case 'X': return 'Expert';
      default: return 'Unknown';
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setQuery('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Filters
            </Button>
            {Object.keys(filters).length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {showAdvancedFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 p-4 border rounded-lg bg-muted/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Industry Filter */}
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select
                    value={filters.industry?.[0] || ''}
                    onValueChange={(value) => handleFilterChange('industry', value ? [value as IndustryCategory] : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Industries</SelectItem>
                      {industryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level Filter */}
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select
                    value={filters.level?.[0] || ''}
                    onValueChange={(value) => handleFilterChange('level', value ? [value as CareerLevel] : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      {levelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Remote Work Filter */}
                <div className="space-y-2">
                  <Label>Remote Work</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remote"
                      checked={filters.remoteFriendly || false}
                      onCheckedChange={(checked) => handleFilterChange('remoteFriendly', checked)}
                    />
                    <Label htmlFor="remote">Remote-friendly positions</Label>
                  </div>
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <Label>Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}</Label>
                <Slider
                  value={salaryRange}
                  onValueChange={handleSalaryRangeChange}
                  max={300000}
                  min={20000}
                  step={5000}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Searching careers...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">Failed to load search results</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && searchResults && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {searchResults.total} career paths found
              </p>
              {searchResults.suggestions.length > 0 && (
                <div className="flex gap-2">
                  {searchResults.suggestions.slice(0, 3).map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleSearch(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {searchResults.careers.map((career) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCareerClick(career)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{career.n}</h3>
                            <Badge variant="outline" className="text-xs">
                              {career.cat}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {career.nodes.map((node) => (
                              <Badge
                                key={node.id}
                                variant="secondary"
                                className={`text-xs ${getLevelBadgeColor(node.l)}`}
                              >
                                {getLevelDisplayName(node.l)}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{career.nodes.length} career stages</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>Avg: {career.nodes[0]?.sr}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>Growth potential</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Button variant="outline" size="sm">
                            View Path
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {searchResults.careers.length === 0 && query && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No careers found matching "{query}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CareerSearch;
