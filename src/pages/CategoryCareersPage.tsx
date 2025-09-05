import React, { useState, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  ArrowLeft,
  Briefcase,
  Filter,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  ChevronRight,
  Home,
  Grid3X3,
  Target,
  BookOpen,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { INDUSTRY_CATEGORIES } from "@/data/industries";
import { useCareerData } from "@/hooks/useCareerData";
import { useBookmarks } from "@/hooks/useBookmarks";

const CategoryCareersPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "salary" | "level" | "experience">("name");
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  
  // Bookmark functionality
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Use the career data hook with the specific category
  const { useCareerPathsByIndustry } = useCareerData();
  const {
    data: careerData,
    loading,
    error,
    total
  } = useCareerPathsByIndustry(categoryId as any, 1, 200); // Get more items

  // Get category information
  const category = useMemo(() => {
    return INDUSTRY_CATEGORIES.find(cat => cat.id === categoryId);
  }, [categoryId]);

  // Filter and sort careers based on category and search
  const filteredCareers = useMemo(() => {
    if (!careerData || !categoryId) return [];

    // Extract all career nodes from career paths that match the category
    let allCareers: any[] = [];
    
    if (careerData.careers) {
      careerData.careers.forEach((path: any) => {
        if (path.cat === categoryId) {
          // Add career path info to each node
          path.nodes.forEach((node: any) => {
            allCareers.push({
              ...node,
              pathName: path.n,
              pathId: path.id,
              category: path.cat
            });
          });
        }
      });
    }

    // Apply search filter
    if (searchQuery) {
      allCareers = allCareers.filter(career =>
        career.t?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.d?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (career.s && career.s.some((skill: string) => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    // Apply sorting
    allCareers.sort((a, b) => {
      switch (sortBy) {
        case "salary":
          // Extract numeric values from salary range strings
          const aSalary = parseInt(a.sr?.replace(/[^0-9]/g, '') || '0');
          const bSalary = parseInt(b.sr?.replace(/[^0-9]/g, '') || '0');
          return bSalary - aSalary;
        case "level":
          // Sort by career level (E < I < A < X)
          const levelOrder = { 'E': 1, 'I': 2, 'A': 3, 'X': 4 };
          return (levelOrder[b.l as keyof typeof levelOrder] || 0) - (levelOrder[a.l as keyof typeof levelOrder] || 0);
        case "experience":
          // Sort by experience requirement (extract years from te field)
          const getExperienceYears = (te: string) => {
            if (!te) return 0;
            const match = te.match(/(\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          const aExp = getExperienceYears(a.te || '');
          const bExp = getExperienceYears(b.te || '');
          return aExp - bExp; // Sort from lowest to highest experience requirement
        default:
          return a.t?.localeCompare(b.t || '') || 0;
      }
    });

    return allCareers;
  }, [careerData, categoryId, searchQuery, sortBy]);

  const getGrowthIcon = (growthRate: number) => {
    if (growthRate >= 15) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (growthRate >= 5) return <TrendingUp className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getGrowthColor = (growthRate: number) => {
    if (growthRate >= 15) return "text-green-600";
    if (growthRate >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getDemandBadge = (demand: number) => {
    if (demand >= 80) return <Badge className="bg-green-100 text-green-800">High Demand</Badge>;
    if (demand >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Medium Demand</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low Demand</Badge>;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05
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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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

  if (!category) {
    return (
      <motion.div 
        className="min-h-screen bg-background flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
          <Link to="/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Mobile-Optimized Navigation Header */}
      <motion.header 
        className="border-b bg-background sticky top-0 z-50"
        variants={headerVariants}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/categories" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h1 className="text-lg md:text-xl font-bold">{category.name}</h1>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Category Header */}
      <motion.section 
        className="bg-gradient-to-b from-background to-muted py-6 md:py-8"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {category.name} Careers
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-6">
              {category.description}
            </p>
            
            {/* Category Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { value: filteredCareers.length, label: "Careers", color: "text-primary" },
                { value: category.growthRate, label: "Growth Rate", color: "text-green-600" },
                { value: category.jobCount, label: "Job Count", color: "text-blue-600" },
                { value: category.avgSalary, label: "Avg Salary", color: "text-purple-600" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-3 bg-background rounded-lg border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className={`text-lg md:text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Filter */}
      <motion.div 
        className="border-b bg-muted/50"
        variants={searchVariants}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "salary" | "level" | "experience")}
                className="h-11 px-3 border rounded-md bg-background text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="salary">Sort by Salary</option>
                <option value="level">Sort by Level</option>
                <option value="experience">Sort by Experience</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Careers List */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {loading ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading careers...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-600 mb-4">Error loading careers</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </motion.div>
        ) : filteredCareers.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Careers Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search terms." : "No careers available in this category yet."}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
            variants={containerVariants}
          >
            {filteredCareers.map((career, index) => {
              const isExpanded = expandedCareer === career.id;
              return (
                <motion.div
                  key={career.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                  onClick={() => setExpandedCareer(isExpanded ? null : career.id)}
                >
                  <Card className={`hover:shadow-lg transition-all ${isExpanded ? 'ring-2 ring-primary' : ''}`}>
                    {/* Compact Header */}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-sm md:text-base truncate flex-1">{career.t}</CardTitle>
                            {isBookmarked(career.id) && (
                              <BookmarkCheck className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={career.l === 'X' ? 'default' : 'secondary'} 
                              className="text-xs"
                            >
                              {career.l === 'E' ? 'Entry' : 
                               career.l === 'I' ? 'Intermediate' : 
                               career.l === 'A' ? 'Advanced' : 'Expert'}
                            </Badge>
                            {career.sr && (
                              <span className="text-xs font-medium text-green-600">
                                {career.sr}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className={`h-4 w-4 text-muted-foreground flex-shrink-0 ml-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </CardHeader>

                    {/* Compact Content - Always Visible */}
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {/* Career Path */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Path</span>
                          <Badge variant="outline" className="text-xs">
                            {career.pathName}
                          </Badge>
                        </div>

                        {/* Experience */}
                        {career.te && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Experience</span>
                            <span className="text-xs font-medium text-blue-600">
                              {career.te}
                            </span>
                          </div>
                        )}

                        {/* Key Skills - Show only 2 in compact mode */}
                        {career.s && career.s.length > 0 && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Skills</span>
                            <div className="flex flex-wrap gap-1">
                              {career.s.slice(0, 2).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {career.s.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{career.s.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 pt-4 border-t space-y-3"
                        >
                          {/* Full Description */}
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Description</span>
                            <p className="text-xs text-muted-foreground">
                              {career.d}
                            </p>
                          </div>

                          {/* All Skills */}
                          {career.s && career.s.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1">All Skills</span>
                              <div className="flex flex-wrap gap-1">
                                {career.s.map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Job Titles */}
                          {career.jt && career.jt.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1">Job Titles</span>
                              <div className="flex flex-wrap gap-1">
                                {career.jt.map((title, titleIndex) => (
                                  <Badge key={titleIndex} variant="outline" className="text-xs">
                                    {title}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Certifications */}
                          {career.c && career.c.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground block mb-1">Certifications</span>
                              <div className="flex flex-wrap gap-1">
                                {career.c.map((cert, certIndex) => (
                                  <Badge key={certIndex} variant="secondary" className="text-xs">
                                    {cert}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Bookmark Button */}
                          <div className="pt-2 border-t">
                            <Button
                              variant={isBookmarked(career.id) ? "default" : "outline"}
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card expansion/collapse
                                toggleBookmark(career, career.category, career.pathName, career.pathId);
                              }}
                            >
                              {isBookmarked(career.id) ? (
                                <>
                                  <BookmarkCheck className="h-4 w-4 mr-2" />
                                  Bookmarked
                                </>
                              ) : (
                                <>
                                  <Bookmark className="h-4 w-4 mr-2" />
                                  Bookmark Job
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
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
                <Target className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">My Career</span>
            </Link>

            {/* Skill Assessment Button */}
            <Link to="/skills" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Assessment</span>
            </Link>
          </div>
        </div>
              </nav>

      {/* Mobile-Optimized Footer */}
      <motion.footer 
        className="bg-muted py-6 mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            Explore {category.name} careers and find your perfect professional path.
          </p>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default CategoryCareersPage;
