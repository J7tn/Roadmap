import React, { useState, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { INDUSTRY_CATEGORIES } from "@/data/industries";
import { useIndustryBrowser } from "@/hooks/useCareerData";

const CategoryCareersPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "salary" | "growth" | "demand">("name");

  // Use the optimized industry browser hook
  const {
    data: careerData,
    loading,
    error,
    total
  } = useIndustryBrowser();

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Get category information
  const category = useMemo(() => {
    return INDUSTRY_CATEGORIES.find(cat => cat.id === categoryId);
  }, [categoryId]);

  // Filter and sort careers based on category and search
  const filteredCareers = useMemo(() => {
    if (!careerData || !categoryId) return [];

    // Extract all career nodes from career paths that match the category
    let allCareers: any[] = [];
    
    if (careerData.paths) {
      careerData.paths.forEach((path: any) => {
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
        career.d?.toLowerCase().includes(searchQuery.toLowerCase())
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
        case "growth":
          // Sort by career level (E < I < A < X)
          const levelOrder = { 'E': 1, 'I': 2, 'A': 3, 'X': 4 };
          return (levelOrder[b.l as keyof typeof levelOrder] || 0) - (levelOrder[a.l as keyof typeof levelOrder] || 0);
        case "demand":
          // Sort by career level as a proxy for demand
          return (levelOrder[b.l as keyof typeof levelOrder] || 0) - (levelOrder[a.l as keyof typeof levelOrder] || 0);
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

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
          <Link to="/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50">
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

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">Career Atlas</h2>
                </div>
                
                <nav className="flex-1">
                  <div className="space-y-2">
                    <Link 
                      to="/" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={handleMobileMenuClose}
                    >
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link 
                      to="/categories" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={handleMobileMenuClose}
                    >
                      <Grid3X3 className="h-5 w-5" />
                      <span className="font-medium">Browse Categories</span>
                    </Link>
                    <Link 
                      to="/my-paths" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={handleMobileMenuClose}
                    >
                      <Target className="h-5 w-5" />
                      <span className="font-medium">My Career Paths</span>
                    </Link>
                    <Link 
                      to="/skills" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={handleMobileMenuClose}
                    >
                      <BookOpen className="h-5 w-5" />
                      <span className="font-medium">Skills Assessment</span>
                    </Link>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Category Header */}
      <section className="bg-gradient-to-b from-background to-muted py-6 md:py-8">
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
              <div className="text-center p-3 bg-background rounded-lg border">
                <div className="text-lg md:text-xl font-bold text-primary">{filteredCareers.length}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Careers</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg border">
                <div className="text-lg md:text-xl font-bold text-green-600">{category.growthRate}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Growth Rate</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg border">
                <div className="text-lg md:text-xl font-bold text-blue-600">{category.jobCount}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Job Count</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg border">
                <div className="text-lg md:text-xl font-bold text-purple-600">{category.avgSalary}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Avg Salary</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <div className="border-b bg-muted/50">
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
                 onChange={(e) => setSortBy(e.target.value as any)}
                 className="h-11 px-3 border rounded-md bg-background text-sm"
               >
                 <option value="name">Sort by Name</option>
                 <option value="salary">Sort by Salary</option>
                 <option value="growth">Sort by Level</option>
                 <option value="demand">Sort by Experience</option>
               </select>
            </div>
          </div>
        </div>
      </div>

      {/* Careers List */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading careers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading careers</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="text-center py-12">
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredCareers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                                     <CardHeader className="pb-3">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <CardTitle className="text-base md:text-lg mb-2">{career.t}</CardTitle>
                         <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                           {career.d}
                         </p>
                       </div>
                       <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                     </div>
                   </CardHeader>
                   <CardContent className="pt-0">
                     <div className="space-y-3">
                       {/* Career Path */}
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-muted-foreground">Career Path</span>
                         <Badge variant="outline" className="text-xs">
                           {career.pathName}
                         </Badge>
                       </div>

                       {/* Salary Range */}
                       {career.sr && (
                         <div className="flex items-center justify-between">
                           <span className="text-xs text-muted-foreground">Salary Range</span>
                           <span className="text-sm font-medium text-green-600">
                             {career.sr}
                           </span>
                         </div>
                       )}

                       {/* Career Level */}
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-muted-foreground">Level</span>
                         <Badge 
                           variant={career.l === 'X' ? 'default' : 'secondary'} 
                           className="text-xs"
                         >
                           {career.l === 'E' ? 'Entry' : 
                            career.l === 'I' ? 'Intermediate' : 
                            career.l === 'A' ? 'Advanced' : 'Expert'}
                         </Badge>
                       </div>

                       {/* Time Estimate */}
                       {career.te && (
                         <div className="flex items-center justify-between">
                           <span className="text-xs text-muted-foreground">Experience</span>
                           <span className="text-sm font-medium text-blue-600">
                             {career.te}
                           </span>
                         </div>
                       )}

                       {/* Skills */}
                       {career.s && career.s.length > 0 && (
                         <div>
                           <span className="text-xs text-muted-foreground block mb-2">Key Skills</span>
                           <div className="flex flex-wrap gap-1">
                             {career.s.slice(0, 3).map((skill, skillIndex) => (
                               <Badge key={skillIndex} variant="outline" className="text-xs">
                                 {skill}
                               </Badge>
                             ))}
                             {career.s.length > 3 && (
                               <Badge variant="outline" className="text-xs">
                                 +{career.s.length - 3} more
                               </Badge>
                             )}
                           </div>
                         </div>
                       )}

                       {/* Job Titles */}
                       {career.jt && career.jt.length > 0 && (
                         <div>
                           <span className="text-xs text-muted-foreground block mb-2">Job Titles</span>
                           <div className="flex flex-wrap gap-1">
                             {career.jt.slice(0, 2).map((title, titleIndex) => (
                               <Badge key={titleIndex} variant="outline" className="text-xs">
                                 {title}
                               </Badge>
                             ))}
                             {career.jt.length > 2 && (
                               <Badge variant="outline" className="text-xs">
                                 +{career.jt.length - 2} more
                               </Badge>
                             )}
                           </div>
                         </div>
                       )}
                     </div>
                   </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile-Optimized Footer */}
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            Explore {category.name} careers and find your perfect professional path.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CategoryCareersPage;
