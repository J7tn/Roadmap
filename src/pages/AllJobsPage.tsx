import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, MapPin, Briefcase, Home, Search, Target, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllCareerNodes } from "@/services/careerService";
import { unifiedCareerService } from "@/services/unifiedCareerService";
import { ICareerNode, CareerLevel, ICareerPath } from "@/types/career";
import BottomNavigation from "@/components/BottomNavigation";

const getLevelBadgeColor = (level: CareerLevel): string => {
  switch (level) {
    case 'E': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case 'I': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case 'A': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case 'X': return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getLevelDisplayName = (level: CareerLevel): string => {
  switch (level) {
    case 'E': return 'Entry';
    case 'I': return 'Intermediate';
    case 'A': return 'Advanced';
    case 'X': return 'Expert';
    default: return 'Unknown';
  }
};

const AllJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Array<{ node: ICareerNode; path: ICareerPath }>>([]);
  const [filteredItems, setFilteredItems] = useState<Array<{ node: ICareerNode; path: ICareerPath }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get search query from URL
  const urlSearchQuery = searchParams.get('search') || "";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Use unified service which automatically falls back to local data
        const allNodes = await getAllCareerNodes();
        setItems(allNodes);
        console.log('Loaded career data:', allNodes.length, 'items');
      } catch (error) {
        console.error('Failed to load career data:', error);
        setItems([]);
      }
      setLoading(false);
    })();
  }, []);

  // Update local search query when URL changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]); // Show no items when search bar is empty
      return;
    }

    // Use local filtering for all data (unified service handles fallback)
    const query = searchQuery.toLowerCase().trim();
    console.log('Searching for:', query, 'in', items.length, 'items');
    
    const filtered = items.filter(({ node, path }) => {
      // Search in title
      if (node.t?.toLowerCase().includes(query)) {
        console.log('Match in title:', node.t);
        return true;
      }
      
      // Search in description
      if (node.d?.toLowerCase().includes(query)) {
        console.log('Match in description:', node.t);
        return true;
      }
      
      // Search in skills (more flexible matching)
      if (node.s && node.s.some(skill => {
        const skillLower = skill.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Exact match
        if (skillLower === queryLower) return true;
        
        // Contains match
        if (skillLower.includes(queryLower)) return true;
        
        // Split by common separators and check each part
        const skillParts = skillLower.split(/[\/\s\-&,]+/).map(part => part.trim()).filter(part => part.length > 0);
        const queryParts = queryLower.split(/[\/\s\-&,]+/).map(part => part.trim()).filter(part => part.length > 0);
        
        // Check if any skill part contains any query part
        const matches = skillParts.some(skillPart => 
          queryParts.some(queryPart => skillPart.includes(queryPart) || queryPart.includes(skillPart))
        );
        
        if (matches) {
          console.log('Match in skills:', node.t, 'skill:', skill, 'query:', query);
        }
        return matches;
      })) return true;
      
      // Search in job titles
      if (node.jt && node.jt.some(title => title.toLowerCase().includes(query))) {
        console.log('Match in job titles:', node.t);
        return true;
      }
      
      // Search in category
      if (path.cat?.toLowerCase().includes(query)) {
        console.log('Match in category:', node.t);
        return true;
      }
      
      // Search in requirements skills (with improved matching)
      if (node.r?.sk && node.r.sk.some(skill => {
        const skillLower = skill.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Exact match
        if (skillLower === queryLower) return true;
        
        // Contains match
        if (skillLower.includes(queryLower)) return true;
        
        // Split by common separators and check each part
        const skillParts = skillLower.split(/[\/\s\-&,]+/).map(part => part.trim()).filter(part => part.length > 0);
        const queryParts = queryLower.split(/[\/\s\-&,]+/).map(part => part.trim()).filter(part => part.length > 0);
        
        // Check if any skill part contains any query part
        const matches = skillParts.some(skillPart => 
          queryParts.some(queryPart => skillPart.includes(queryPart) || queryPart.includes(skillPart))
        );
        
        if (matches) {
          console.log('Match in requirements skills:', node.t, 'skill:', skill, 'query:', query);
        }
        return matches;
      })) return true;
      
      return false;
    });
    
    console.log('Filtered results:', filtered.length, 'out of', items.length);
    setFilteredItems(filtered);
  }, [items, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    navigate('/jobs');
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

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navigation Header */}
      <motion.header 
        className="border-b bg-background sticky top-0 z-50 safe-area-top"
        variants={headerVariants}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.h1 
              className="text-xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {urlSearchQuery ? `Search Results: "${urlSearchQuery}"` : 'All Jobs'}
            </motion.h1>
          </div>
          <motion.div 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {!loading && `${filteredItems.length} jobs found`}
          </motion.div>
        </div>
      </motion.header>

      {/* Search Bar */}
      <motion.div 
        className="border-b bg-muted/50"
        variants={searchVariants}
      >
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for jobs, skills, or careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Button type="submit" className="h-11 px-6">
              Search
            </Button>
            {urlSearchQuery && (
              <Button type="button" variant="outline" onClick={clearSearch} className="h-11">
                Clear
              </Button>
            )}
          </form>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
        {loading && (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground mt-2">Loading jobs...</p>
          </motion.div>
        )}

        {!loading && urlSearchQuery && filteredItems.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">
              No jobs match your search for "{urlSearchQuery}". Try different keywords or browse all jobs.
            </p>
            <Button variant="outline" onClick={clearSearch}>
              Browse All Jobs
            </Button>
          </motion.div>
        )}

        {!loading && filteredItems.length > 0 && (
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
          >
            {filteredItems.map(({ node, path }, index) => (
              <motion.div
                key={`${path.id}-${node.id}`}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
              >
                <Card 
                  className="hover:border-primary transition-colors"
                  onClick={() => navigate(`/jobs/${node.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{node.t}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getLevelBadgeColor(node.l)}`}
                          >
                            {getLevelDisplayName(node.l)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {node.d}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{node.sr}</span>
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
                        
                        {/* Show matching skills if searching */}
                        {urlSearchQuery && node.s && (
                          <motion.div 
                            className="mt-3"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <span className="text-xs text-muted-foreground block mb-2">Matching Skills:</span>
                            <div className="flex flex-wrap gap-1">
                              {node.s
                                .filter(skill => skill.toLowerCase().includes(urlSearchQuery.toLowerCase()))
                                .map((skill, skillIndex) => (
                                  <motion.div
                                    key={skillIndex}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: skillIndex * 0.05 }}
                                  >
                                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
                                      {skill}
                                    </Badge>
                                  </motion.div>
                                ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <BottomNavigation />
    </motion.div>
  );
};

export default AllJobsPage;


