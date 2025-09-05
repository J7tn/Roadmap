import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  ArrowLeft,
  Briefcase,
  Target,
  Star,
  Clock,
  ChevronRight,
  Home,
  Grid3X3,
  BookOpen,
  Activity,
  Bell,
  Plus,
  Bookmark,
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle,
  Play,
  Pause,
  Calendar,
  DollarSign,
  Palette,
  Heart,
  Building,
  LocationIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CategorySelector from "@/components/CategorySelector";
import CareerRoadmap from "@/components/CareerRoadmap";
import { useCareerData } from "@/hooks/useCareerData";

const CareerCategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  
  const { useOptimizedSearch } = useCareerData();
  const { data: searchResults } = useOptimizedSearch(searchQuery, {});

  // Generate search suggestions based on what user types
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const suggestions: string[] = [];
    
    // Add career titles that match the query
    if (searchResults?.careers) {
      searchResults.careers.forEach(path => {
        path.nodes.forEach(node => {
          if (node.t?.toLowerCase().includes(searchQuery.toLowerCase())) {
            suggestions.push(node.t);
          }
          // Add skills that match
          if (node.s) {
            node.s.forEach(skill => {
              if (skill.toLowerCase().includes(searchQuery.toLowerCase()) && !suggestions.includes(skill)) {
                suggestions.push(skill);
              }
            });
          }
        });
      });
    }
    
    // Add industry categories that match
    if (searchQuery.toLowerCase().includes('tech') || searchQuery.toLowerCase().includes('technology')) {
      suggestions.push('Technology');
    }
    if (searchQuery.toLowerCase().includes('health') || searchQuery.toLowerCase().includes('medical')) {
      suggestions.push('Healthcare');
    }
    if (searchQuery.toLowerCase().includes('business') || searchQuery.toLowerCase().includes('finance')) {
      suggestions.push('Business & Finance');
    }
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }, [searchQuery, searchResults]);

  const handleSearchSubmit = useCallback((query: string) => {
    if (query.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  }, [navigate]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSearchSubmit(suggestion);
  }, [handleSearchSubmit]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {/* Career Categories Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <img 
                src="/logo.png" 
                alt="Careering Logo" 
                className="h-16 w-16 mr-3"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Career Categories
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Discover diverse career paths across different industries. Click on any category to explore 
              specific careers and their requirements.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              className="max-w-md mx-auto relative"
              variants={searchVariants}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for jobs, skills, or careers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length >= 2);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit(searchQuery);
                    }
                  }}
                  className="pl-10 h-11 text-base"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  >
                    ×
                  </Button>
                )}
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div 
                  className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      className="px-4 py-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                    >
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Category Selector */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <CategorySelector 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              showStats={true}
            />
          </motion.div>

          {/* Career Roadmap Section */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold">Career Roadmap</h3>
                <Badge variant="secondary" className="text-xs">Interactive</Badge>
              </div>
              <CareerRoadmap />
            </motion.div>
          )}

        </div>
      </main>

      {/* Bottom Navigation Dashboard - Fixed */}
      <nav 
        className="border-t bg-background sticky bottom-0 z-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {/* Home Button */}
            <Link to="/home" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Home</span>
            </Link>

            {/* Search Button */}
            <Link to="/categories" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Search</span>
            </Link>

            {/* Saved Careers Button */}
            <Link to="/my-paths" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Bookmark className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Saved</span>
            </Link>

            {/* Skill Assessment Button */}
            <Link to="/skills" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Assessment</span>
            </Link>
          </div>
        </div>
              </nav>
    </motion.div>
  );
};

export default CareerCategoriesPage;
