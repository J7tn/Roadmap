import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
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
  MapPin as LocationIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyCareerPathsPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-path");

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Mock data for user's current career path
  const currentCareerPath = {
    title: "Software Engineer",
    company: "TechCorp Inc.",
    level: "Mid-Level",
    progress: 65,
    nextMilestone: "Senior Software Engineer",
    timeline: "6 months remaining",
    salary: "$85,000 - $120,000",
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    completedMilestones: [
      "Junior Developer (Completed)",
      "Full-Stack Development (Completed)",
      "Team Lead Experience (In Progress)"
    ],
    upcomingMilestones: [
      "Advanced System Design",
      "Architecture Leadership",
      "Senior Developer Certification"
    ]
  };

  // Mock data for saved jobs
  const savedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "InnovateTech",
      location: "San Francisco, CA",
      salary: "$120,000 - $160,000",
      type: "Full-time",
      postedDate: "2 days ago",
      isRemote: true,
      skills: ["React", "TypeScript", "Next.js", "GraphQL"],
      status: "Interested",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: 2,
      title: "Lead Software Engineer",
      company: "DataFlow Systems",
      location: "Austin, TX",
      salary: "$130,000 - $180,000",
      type: "Full-time",
      postedDate: "1 week ago",
      isRemote: false,
      skills: ["Python", "Machine Learning", "Docker", "Kubernetes"],
      status: "Applied",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: 3,
      title: "Full-Stack Developer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$90,000 - $130,000",
      type: "Full-time",
      postedDate: "3 days ago",
      isRemote: true,
      skills: ["React", "Node.js", "MongoDB", "Express"],
      status: "Interested",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudTech Solutions",
      location: "Seattle, WA",
      salary: "$110,000 - $150,000",
      type: "Full-time",
      postedDate: "5 days ago",
      isRemote: true,
      skills: ["AWS", "Docker", "Kubernetes", "Terraform"],
      status: "Interested",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied": return "bg-blue-100 text-blue-800";
      case "Interested": return "bg-yellow-100 text-yellow-800";
      case "Interviewing": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header - Fixed */}
      <header className="border-b bg-background sticky top-0 z-50">
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
            {/* Search - Hidden on mobile to save space */}
            <div className="relative hidden md:block w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8 h-9" />
            </div>
            
            {/* Notifications Button */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">2</Badge>
            </Button>

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
                  
                  {/* Mobile Search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-10 h-11" />
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <nav className="flex-1">
                    <div className="space-y-2">
                      <Link 
                        to="/" 
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={handleMobileMenuClose}
                      >
                        <Home className="h-5 w-5" />
                        <span className="font-medium">Home</span>
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
                        to="/skills" 
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={handleMobileMenuClose}
                      >
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">Skills Assessment</span>
                      </Link>
                    </div>
                  </nav>
                  
                  {/* Mobile Footer */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      Track your career progress
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {/* Content Navigation Tabs */}
        <div className="border-b bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 overflow-x-auto">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add New</span>
              </Button>
              <Button 
                variant={activeTab === "my-path" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveTab("my-path")}
              >
                My Path
              </Button>
              <Button 
                variant={activeTab === "saved-jobs" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveTab("saved-jobs")}
              >
                Saved Jobs ({savedJobs.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* My Path Tab */}
            <TabsContent value="my-path" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Career Icon */}
                      <div className="p-4 rounded-full bg-blue-100 flex-shrink-0">
                        <Briefcase className="h-8 w-8 text-blue-600" />
                      </div>
                      
                      {/* Career Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-bold mb-2">{currentCareerPath.title}</h2>
                            <p className="text-lg text-muted-foreground mb-1">{currentCareerPath.company}</p>
                            <Badge variant="secondary" className="text-sm">{currentCareerPath.level}</Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">{currentCareerPath.salary}</div>
                            <div className="text-sm text-muted-foreground">{currentCareerPath.timeline}</div>
                          </div>
                        </div>
                        
                        {/* Progress Section */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Career Progress</span>
                            <span className="text-sm font-medium">{currentCareerPath.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${getProgressColor(currentCareerPath.progress)}`}
                              style={{ width: `${currentCareerPath.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Next milestone: <span className="font-medium">{currentCareerPath.nextMilestone}</span>
                          </p>
                        </div>
                        
                        {/* Skills Section */}
                        <div className="mb-6">
                          <h3 className="font-semibold mb-3">Current Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {currentCareerPath.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-sm">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {/* Milestones Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold mb-3 text-green-700">Completed Milestones</h3>
                            <ul className="space-y-2">
                              {currentCareerPath.completedMilestones.map((milestone, index) => (
                                <li key={index} className="flex items-center space-x-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-muted-foreground">{milestone}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-3 text-blue-700">Upcoming Milestones</h3>
                            <ul className="space-y-2">
                              {currentCareerPath.upcomingMilestones.map((milestone, index) => (
                                <li key={index} className="flex items-center space-x-2 text-sm">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <span className="text-muted-foreground">{milestone}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Saved Jobs Tab */}
            <TabsContent value="saved-jobs" className="space-y-4">
              {savedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {/* Job Icon */}
                        <div className={`p-3 rounded-full ${job.bgColor} flex-shrink-0`}>
                          <job.icon className={`h-6 w-6 ${job.color}`} />
                        </div>
                        
                        {/* Job Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-base mb-1">{job.title}</h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                                <Building className="h-4 w-4" />
                                <span>{job.company}</span>
                                <span>•</span>
                                <LocationIcon className="h-4 w-4" />
                                <span>{job.location}</span>
                                {job.isRemote && (
                                  <>
                                    <span>•</span>
                                    <Badge variant="secondary" className="text-xs">Remote</Badge>
                                  </>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                          </div>
                          
                          {/* Job Details */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div className="text-sm font-medium text-green-600">{job.salary}</div>
                                <div className="text-xs text-muted-foreground">Salary</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium text-blue-600">{job.type}</div>
                                <div className="text-xs text-muted-foreground">Type</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium text-purple-600">{job.postedDate}</div>
                                <div className="text-xs text-muted-foreground">Posted</div>
                              </div>
                            </div>
                            
                            {/* Status Badge */}
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                          </div>
                          
                          {/* Skills */}
                          <div className="flex flex-wrap gap-1">
                            {job.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Bottom Navigation Dashboard - Fixed */}
      <nav className="border-t bg-background sticky bottom-0 z-50">
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
    </div>
  );
};

export default MyCareerPathsPage;
