import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { bookmarkService, BookmarkedCareer } from "@/services/bookmarkService";
import { careerPathProgressService, CareerPathProgress } from "@/services/careerPathProgressService";
import { ICareerNode } from "@/types/career";
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
  MapPin as LocationIcon,
  Trash2,
  X,
  Code,
  Palette as CreativeIcon,
  Calculator,
  Globe,
  Zap,
  Lightbulb,
  Map,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CareerBlock from "@/components/CareerBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/BottomNavigation";

const MyCareerPathsPage = () => {
  const [activeTab, setActiveTab] = useState("my-career");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedCareers, setBookmarkedCareers] = useState<BookmarkedCareer[]>([]);
  const [careerPathProgress, setCareerPathProgress] = useState<CareerPathProgress[]>([]);
  
  // Load bookmarks and listen for updates
  useEffect(() => {
    const loadBookmarks = () => {
      setBookmarkedCareers(bookmarkService.getAllBookmarks());
    };
    
    // Load initial bookmarks
    loadBookmarks();
    
    // Listen for bookmark updates
    const handleBookmarkUpdate = () => {
      loadBookmarks();
    };
    
    window.addEventListener('bookmarksUpdated', handleBookmarkUpdate);
    
    return () => {
      window.removeEventListener('bookmarksUpdated', handleBookmarkUpdate);
    };
  }, []);

  // Load career path progress and listen for updates
  useEffect(() => {
    const loadCareerPathProgress = () => {
      setCareerPathProgress(careerPathProgressService.getAllProgress());
    };
    
    // Load initial progress
    loadCareerPathProgress();
    
    // Listen for progress updates
    const handleProgressUpdate = () => {
      loadCareerPathProgress();
    };
    
    window.addEventListener('careerPathProgressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('careerPathProgressUpdated', handleProgressUpdate);
    };
  }, []);
  
  // State for saved assessments
  const [savedAssessments, setSavedAssessments] = useState(() => {
    const saved = localStorage.getItem('savedAssessments');
    return saved ? JSON.parse(saved) : [];
  });

  // Load saved career paths from localStorage or API
  const [savedCareerPaths, setSavedCareerPaths] = useState(() => {
    const saved = localStorage.getItem('savedCareerPaths');
    return saved ? JSON.parse(saved) : [];
  });

  // Load career interests from localStorage or API
  const [careerInterests, setCareerInterests] = useState(() => {
    const saved = localStorage.getItem('careerInterests');
    return saved ? JSON.parse(saved) : [];
  });

  // Function to remove a saved career path
  const removeCareerPath = useCallback((id: number) => {
    setSavedCareerPaths(prev => prev.filter(path => path.id !== id));
  }, []);

  // Function to remove a career interest
  const removeCareerInterest = useCallback((id: number) => {
    setCareerInterests(prev => prev.filter(interest => interest.id !== id));
    // Save to localStorage
    const updated = careerInterests.filter(interest => interest.id !== id);
    localStorage.setItem('careerInterests', JSON.stringify(updated));
  }, [careerInterests]);

  // Convert BookmarkedCareer to ICareerNode format
  const convertToCareerNode = (bookmark: BookmarkedCareer): ICareerNode => ({
    id: bookmark.id,
    t: bookmark.title,
    l: bookmark.level as 'E' | 'I' | 'A' | 'X',
    s: bookmark.skills,
    c: bookmark.certifications,
    sr: bookmark.salary,
    te: bookmark.experience,
    d: bookmark.description,
    jt: bookmark.jobTitles,
    r: {
      e: [],
      exp: bookmark.experience,
      sk: bookmark.skills
    }
  });

  // Function to remove a saved assessment
  const removeAssessment = useCallback((id: string) => {
    setSavedAssessments(prev => {
      const updated = prev.filter(assessment => assessment.id !== id);
      localStorage.setItem('savedAssessments', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getInterestColor = (interest: string) => {
    switch (interest) {
      case "High": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Entry-Level": return "bg-blue-100 text-blue-800";
      case "Mid-Level": return "bg-green-100 text-green-800";
      case "Senior": return "bg-purple-100 text-purple-800";
      case "Expert": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };


  // Filter career path progress based on search
  const filteredCareerPaths = careerPathProgress.filter(progress =>
    progress.pathName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    progress.pathCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    progress.pathNodes.some(node => 
      node.t?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.s?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  // Filter bookmarked careers based on search
  const filteredBookmarkedCareers = bookmarkedCareers.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter assessments based on search
  const filteredAssessments = savedAssessments.filter(assessment =>
    assessment.selectedCareerGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
    assessment.experienceLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Header - Fixed */}
      <motion.header 
        className="border-b bg-background sticky top-0 z-50 safe-area-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/home" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <h1 className="text-lg md:text-xl font-bold">My Career</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search */}
            <motion.div 
              className="relative w-48"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search careers..." 
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {/* Content Navigation Tabs */}
        <motion.div 
          className="border-b bg-muted/50"
          initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 overflow-x-auto">
              <Button 
                variant={activeTab === "my-career" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveTab("my-career")}
              >
                My Career Paths ({filteredCareerPaths.length})
              </Button>
              <Button 
                variant={activeTab === "career-interests" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveTab("career-interests")}
              >
                Career Interests ({filteredBookmarkedCareers.length})
              </Button>
              <Button 
                variant={activeTab === "my-assessments" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveTab("my-assessments")}
              >
                My Assessments ({filteredAssessments.length})
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* My Career Paths Tab */}
            <TabsContent value="my-career" className="space-y-6">
              {filteredCareerPaths.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No career path progress yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring career paths and save your progress to track your journey
                  </p>
                  <Button asChild>
                    <Link to="/categories">Explore Careers</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredCareerPaths.map((progress, index) => (
                    <motion.div
                      key={progress.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="hover:shadow-lg transition-all relative group h-full">
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100 hover:text-red-600"
                          onClick={() => careerPathProgressService.removeProgress(progress.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <CardContent className="p-6 h-full flex flex-col">
                          {/* Header */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                              <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h2 className="text-xl font-bold">{progress.pathName}</h2>
                                <Badge variant="outline" className="text-xs">
                                  {progress.pathCategory}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">
                                  Step {progress.currentStep + 1} of {progress.totalSteps}
                                </Badge>
                                <Badge variant="outline">
                                  {careerPathProgressService.getProgressPercentage(progress)}% Complete
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Current Career */}
                          <div className="mb-4 flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Briefcase className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Current Position</span>
                            </div>
                            <p className="text-sm font-semibold">
                              {progress.pathNodes[progress.currentStep]?.t || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Started: {new Date(progress.startedAt).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-muted-foreground">
                                {progress.completedSteps.length}/{progress.totalSteps} steps
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${careerPathProgressService.getProgressPercentage(progress)}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Next Step */}
                          {progress.currentStep < progress.totalSteps - 1 && (
                            <div className="mb-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Target className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Next Step</span>
                              </div>
                              <p className="text-sm font-semibold">
                                {progress.pathNodes[progress.currentStep + 1]?.t || 'Complete'}
                              </p>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Started {new Date(progress.startedAt).toLocaleDateString()}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs"
                              asChild
                            >
                              <Link to={`/jobs/${progress.currentCareerId}`}>
                                Continue Path
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Career Interests Tab */}
            <TabsContent value="career-interests" className="space-y-6">
              {filteredBookmarkedCareers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookmarked careers yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Bookmark careers you're interested in to see them here
                  </p>
                  <Button asChild>
                    <Link to="/categories">Explore Careers</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {filteredBookmarkedCareers.map((bookmark, index) => (
                    <div key={bookmark.id} className="relative group">
                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100 hover:text-red-600"
                        onClick={() => bookmarkService.removeBookmark(bookmark.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <CareerBlock
                        career={convertToCareerNode(bookmark)}
                        index={index}
                        className="pr-10" // Add padding for the remove button
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* My Assessments Tab */}
            <TabsContent value="my-assessments" className="space-y-6">
              {filteredAssessments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved assessments yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete a skills assessment to see your results here
                  </p>
                  <Button asChild>
                    <Link to="/skills">Take Assessment</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredAssessments.map((assessment, index) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="hover:shadow-lg transition-all relative group h-full">
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100 hover:text-red-600"
                          onClick={() => removeAssessment(assessment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <CardContent className="p-6 h-full flex flex-col">
                          {/* Header */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                              <Target className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h2 className="text-xl font-bold">Skills Assessment</h2>
                                <Badge variant="outline" className="text-xs">
                                  {assessment.selectedCareerGoal || 'Not specified'}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getLevelColor(assessment.experienceLevel || 'Not specified')}>
                                  {assessment.experienceLevel || 'Not specified'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {assessment.skills.length} skills
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Skills Summary */}
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Selected Skills</h3>
                            <div className="flex flex-wrap gap-1">
                              {assessment.skills.slice(0, 6).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {assessment.skills.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +{assessment.skills.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Additional Details */}
                          {assessment.currentRole && (
                            <div className="bg-muted/50 rounded-lg p-3 mb-4">
                              <div className="text-sm">
                                <span className="font-medium">Current Role:</span> {assessment.currentRole}
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                            <span>Completed {assessment.completedDate}</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNavigation />
    </motion.div>
  );
};

export default MyCareerPathsPage;
