import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyCareerPathsPage = () => {
  const [activeTab, setActiveTab] = useState("my-career");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for saved assessments
  const [savedAssessments, setSavedAssessments] = useState(() => {
    const saved = localStorage.getItem('savedAssessments');
    return saved ? JSON.parse(saved) : [];
  });

  // Mock data for saved career paths (career types, not specific jobs)
  const [savedCareerPaths, setSavedCareerPaths] = useState([
    {
      id: 1,
      title: "Software Engineer",
      category: "Technology",
      level: "Mid-Level",
      interest: "High",
      nextStep: "Senior Software Engineer",
      timeline: "6-12 months",
      salary: "$85,000 - $120,000",
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
      description: "Building scalable web applications and software solutions",
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      savedDate: "2 weeks ago"
    },
    {
      id: 2,
      title: "Data Scientist",
      category: "Technology",
      level: "Entry-Level",
      interest: "Medium",
      nextStep: "Junior Data Scientist",
      timeline: "1-2 years",
      salary: "$70,000 - $90,000",
      skills: ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
      description: "Analyzing data to extract insights and build predictive models",
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-100",
      savedDate: "1 week ago"
    },
    {
      id: 3,
      title: "Product Manager",
      category: "Business",
      level: "Senior",
      interest: "High",
      nextStep: "Director of Product",
      timeline: "8-12 months",
      salary: "$120,000 - $160,000",
      skills: ["Product Strategy", "User Research", "Agile", "Data Analysis", "Leadership"],
      description: "Leading product development and strategy for digital products",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      savedDate: "3 days ago"
    },
    {
      id: 4,
      title: "UX Designer",
      category: "Creative",
      level: "Mid-Level",
      interest: "Medium",
      nextStep: "Senior UX Designer",
      timeline: "1-2 years",
      salary: "$80,000 - $110,000",
      skills: ["User Research", "Wireframing", "Prototyping", "User Testing", "Design Systems"],
      description: "Creating intuitive and engaging user experiences",
      icon: CreativeIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      savedDate: "5 days ago"
    }
  ]);

  // Mock data for career interests (career types user is exploring)
  const careerInterests = [
    {
      id: 1,
      title: "AI Engineer",
      category: "Technology",
      description: "Building and deploying artificial intelligence models",
      interest: "High",
      skills: ["Python", "TensorFlow", "Machine Learning", "Deep Learning"],
      icon: Lightbulb,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      savedDate: "1 day ago"
    },
    {
      id: 2,
      title: "DevOps Engineer",
      category: "Technology",
      description: "Automating deployment and infrastructure management",
      interest: "Medium",
      skills: ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms"],
      icon: Zap,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      savedDate: "2 days ago"
    },
    {
      id: 3,
      title: "Business Analyst",
      category: "Business",
      description: "Analyzing business processes and recommending improvements",
      interest: "Medium",
      skills: ["Data Analysis", "SQL", "Excel", "Business Process Modeling"],
      icon: Calculator,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      savedDate: "4 days ago"
    }
  ];

  // Function to remove a saved career path
  const removeCareerPath = useCallback((id: number) => {
    setSavedCareerPaths(prev => prev.filter(path => path.id !== id));
  }, []);

  // Function to remove a career interest
  const removeCareerInterest = useCallback((id: number) => {
    // This would update the careerInterests state in a real app
  }, []);

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

  // Filter career paths based on search
  const filteredCareerPaths = savedCareerPaths.filter(path =>
    path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    path.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    path.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter career interests based on search
  const filteredCareerInterests = careerInterests.filter(interest =>
    interest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interest.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interest.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
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
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Header - Fixed */}
      <motion.header 
        className="border-b bg-background sticky top-0 z-50"
        variants={headerVariants}
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
              variants={searchVariants}
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
          variants={itemVariants}
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
                Career Interests ({filteredCareerInterests.length})
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
                  <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No saved career paths yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring career paths and save the ones that interest you
                  </p>
                  <Button asChild>
                    <Link to="/categories">Explore Careers</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredCareerPaths.map((careerPath, index) => (
                    <motion.div
                      key={careerPath.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="hover:shadow-lg transition-all relative group h-full">
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100 hover:text-red-600"
                          onClick={() => removeCareerPath(careerPath.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <CardContent className="p-6 h-full flex flex-col">
                          {/* Header */}
                          <div className="flex items-start space-x-4 mb-4">
                            <div className={`p-3 rounded-full ${careerPath.bgColor} flex-shrink-0`}>
                              <careerPath.icon className={`h-6 w-6 ${careerPath.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h2 className="text-xl font-bold">{careerPath.title}</h2>
                                <Badge variant="outline" className="text-xs">
                                  {careerPath.category}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getLevelColor(careerPath.level)}>
                                  {careerPath.level}
                                </Badge>
                                <Badge className={getInterestColor(careerPath.interest)}>
                                  {careerPath.interest} Interest
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-muted-foreground mb-4 flex-1">
                            {careerPath.description}
                          </p>

                          {/* Next Step */}
                          <div className="bg-muted/50 rounded-lg p-3 mb-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <Target className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">Next Step</span>
                            </div>
                            <p className="text-sm font-semibold">{careerPath.nextStep}</p>
                            <p className="text-xs text-muted-foreground">
                              Timeline: {careerPath.timeline} • Salary: {careerPath.salary}
                            </p>
                          </div>

                          {/* Skills */}
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Key Skills</h3>
                            <div className="flex flex-wrap gap-1">
                              {careerPath.skills.slice(0, 4).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {careerPath.skills.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{careerPath.skills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Saved {careerPath.savedDate}</span>
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

            {/* Career Interests Tab */}
            <TabsContent value="career-interests" className="space-y-6">
              {filteredCareerInterests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No career interests yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Save career types you're interested in exploring
                  </p>
                  <Button asChild>
                    <Link to="/categories">Explore Careers</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCareerInterests.map((interest, index) => (
                    <motion.div
                      key={interest.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="hover:shadow-lg transition-all relative group h-full">
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100 hover:text-red-600"
                          onClick={() => removeCareerInterest(interest.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <CardContent className="p-4 h-full flex flex-col">
                          {/* Header */}
                          <div className="text-center mb-4">
                            <div className={`p-3 rounded-full ${interest.bgColor} mx-auto mb-3`}>
                              <interest.icon className={`h-6 w-6 ${interest.color}`} />
                            </div>
                            <h3 className="font-semibold text-base mb-1">{interest.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {interest.category}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-4 flex-1 text-center">
                            {interest.description}
                          </p>

                          {/* Skills */}
                          <div className="mb-4">
                            <h4 className="text-xs font-medium mb-2 text-center">Skills to Learn</h4>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {interest.skills.slice(0, 3).map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {interest.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{interest.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="text-center">
                            <Badge className={getInterestColor(interest.interest)}>
                              {interest.interest} Interest
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-2">
                              Saved {interest.savedDate}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
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
                      variants={itemVariants}
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
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Search</span>
            </Link>

            {/* Saved Careers Button */}
            <Link to="/my-paths" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
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

export default MyCareerPathsPage;
