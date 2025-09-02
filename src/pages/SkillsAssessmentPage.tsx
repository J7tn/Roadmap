import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  MapPin,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
  Star,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  Code,
  Palette,
  Calculator,
  Globe,
  Heart,
  Zap,
  Lightbulb,
  Award,
  Clock,
  ChevronRight,
  Home,
  User,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SkillsAssessmentPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({
    skills: [],
    experience: "",
    interests: [],
    goals: "",
    currentRole: "",
  });

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skillCategories = [
    {
      id: "technical",
      name: "Technical Skills",
      icon: Code,
      color: "bg-blue-100 text-blue-600",
      skills: ["JavaScript", "Python", "React", "Node.js", "SQL", "AWS", "Docker", "Git"]
    },
    {
      id: "creative",
      name: "Creative Skills",
      icon: Palette,
      color: "bg-purple-100 text-purple-600",
      skills: ["Design", "Copywriting", "Photography", "Video Editing", "UI/UX", "Branding", "Illustration", "Animation"]
    },
    {
      id: "analytical",
      name: "Analytical Skills",
      icon: Calculator,
      color: "bg-green-100 text-green-600",
      skills: ["Data Analysis", "Statistics", "Excel", "Tableau", "R", "Python", "SQL", "Machine Learning"]
    },
    {
      id: "communication",
      name: "Communication",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
      skills: ["Public Speaking", "Writing", "Presentation", "Negotiation", "Leadership", "Team Management", "Client Relations", "Training"]
    },
    {
      id: "business",
      name: "Business Skills",
      icon: Briefcase,
      color: "bg-indigo-100 text-indigo-600",
      skills: ["Project Management", "Marketing", "Sales", "Finance", "Strategy", "Operations", "HR", "Legal"]
    },
    {
      id: "languages",
      name: "Languages",
      icon: Globe,
      color: "bg-teal-100 text-teal-600",
      skills: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "Portuguese"]
    }
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner (0-1 years)", description: "Just starting to learn" },
    { value: "intermediate", label: "Intermediate (1-3 years)", description: "Some practical experience" },
    { value: "advanced", label: "Advanced (3-5 years)", description: "Significant experience" },
    { value: "expert", label: "Expert (5+ years)", description: "Deep expertise and leadership" }
  ];

  const careerGoals = [
    { value: "technical", label: "Technical Leadership", icon: Code, description: "Lead technical teams and projects" },
    { value: "management", label: "People Management", icon: Users, description: "Manage teams and organizations" },
    { value: "entrepreneur", label: "Entrepreneurship", icon: Zap, description: "Start your own business" },
    { value: "specialist", label: "Specialist/Consultant", icon: Star, description: "Deep expertise in specific areas" },
    { value: "creative", label: "Creative Director", icon: Palette, description: "Lead creative projects and teams" },
    { value: "analyst", label: "Data/Analytics", icon: TrendingUp, description: "Focus on data and insights" }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">What skills do you currently have?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Select the skills you're proficient in. You can add custom skills too.
              </p>
            </div>
            
            <div className="space-y-4">
              {skillCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base md:text-lg">{category.name}</CardTitle>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Select relevant skills from this category
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {category.skills.map((skill) => (
                        <Button
                          key={skill}
                          variant="outline"
                          size="sm"
                          className="h-9 text-xs md:text-sm justify-start"
                        >
                          <Circle className="h-3 w-3 mr-2" />
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Label htmlFor="custom-skills" className="text-sm md:text-base font-medium">
                Add Custom Skills
              </Label>
              <Textarea
                id="custom-skills"
                placeholder="Enter any additional skills you have (comma-separated)"
                className="min-h-[80px] md:min-h-[100px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">What's your experience level?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Tell us about your professional experience and background.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="current-role" className="text-sm md:text-base font-medium">
                  Current Role (if any)
                </Label>
                <Input
                  id="current-role"
                  placeholder="e.g., Software Developer, Marketing Manager, Student"
                  className="mt-2 h-11"
                />
              </div>

              <div>
                <Label className="text-sm md:text-base font-medium mb-3 block">
                  Years of Professional Experience
                </Label>
                <RadioGroup className="space-y-3">
                  {experienceLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm md:text-base">{level.label}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">{level.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="experience-details" className="text-sm md:text-base font-medium">
                  Additional Experience Details
                </Label>
                <Textarea
                  id="experience-details"
                  placeholder="Describe your work experience, projects, achievements, or any relevant background..."
                  className="mt-2 min-h-[100px] md:min-h-[120px]"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">What are your career goals?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Select the career direction that interests you most.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerGoals.map((goal) => (
                <Card key={goal.value} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <goal.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm md:text-base mb-1">{goal.label}</h4>
                        <p className="text-xs md:text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                      <RadioGroupItem value={goal.value} id={goal.value} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Label htmlFor="goals-details" className="text-sm md:text-base font-medium">
                Additional Goals & Interests
              </Label>
              <Textarea
                id="goals-details"
                placeholder="Tell us more about your specific career goals, interests, or what you're looking for..."
                className="mt-2 min-h-[100px] md:min-h-[120px]"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Assessment Complete!</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Based on your skills and goals, here are your personalized career recommendations.
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Recommended Career Paths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Software Engineer", match: "95%", description: "Strong technical skills match" },
                    { title: "Product Manager", match: "87%", description: "Good mix of technical and business skills" },
                    { title: "Data Scientist", match: "82%", description: "Analytical skills align well" },
                    { title: "UX Designer", match: "78%", description: "Creative and technical combination" }
                  ].map((career, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm md:text-base">{career.title}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">{career.description}</div>
                      </div>
                      <Badge variant="secondary" className="ml-2">{career.match}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Skill Development Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { skill: "Advanced JavaScript", priority: "High", timeline: "3-6 months" },
                    { skill: "System Design", priority: "Medium", timeline: "6-12 months" },
                    { skill: "Leadership Skills", priority: "Medium", timeline: "Ongoing" },
                    { skill: "Cloud Architecture", priority: "Low", timeline: "12+ months" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm md:text-base">{item.skill}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">Timeline: {item.timeline}</div>
                      </div>
                      <Badge variant={item.priority === "High" ? "default" : "secondary"} className="ml-2">
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 h-11">
                <Target className="h-4 w-4 mr-2" />
                View Detailed Roadmap
              </Button>
              <Button variant="outline" className="flex-1 h-11">
                <BookOpen className="h-4 w-4 mr-2" />
                Save Assessment
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/home" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-lg md:text-xl font-bold">Skills Assessment</h1>
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
                      to="/home" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={handleMobileMenuClose}
                    >
                      <Home className="h-5 w-5" />
                      <span className="text-xs font-medium">Home</span>
                    </Link>
                    <Link 
                      to="/categories" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={handleMobileMenuClose}
                    >
                      <Briefcase className="h-5 w-5" />
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
                      to="/branching" 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={handleMobileMenuClose}
                    >
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-medium">Career Branching</span>
                    </Link>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of 4</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {renderStepContent()}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="h-11"
              >
                Previous
              </Button>
              <Button onClick={handleNextStep} className="h-11">
                {currentStep === 3 ? "Complete Assessment" : "Next"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
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
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Saved</span>
            </Link>

            {/* Skill Assessment Button */}
            <Link to="/skills" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Assessment</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default SkillsAssessmentPage;
