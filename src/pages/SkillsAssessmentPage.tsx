import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SkillsAssessmentService, AssessmentRecommendations } from "@/services/skillsAssessmentService";
import { NotificationService } from "@/services/notificationService";
import {
  Search,
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SkillsAssessmentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentData, setAssessmentData] = useState({
    skills: [] as string[],
    experience: "",
    interests: [] as string[],
    goals: "",
    currentRole: "",
    experienceLevel: "",
    experienceDetails: "",
    goalsDetails: "",
    selectedCareerGoal: ""
  });

  const [recommendations, setRecommendations] = useState<AssessmentRecommendations | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);



  const handleNextStep = () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Generate recommendations when reaching step 4
      if (nextStep === 4) {
        generateRecommendations();
      }
    }
  };

  const generateRecommendations = async () => {
    setIsLoadingRecommendations(true);
    setAssessmentError(null);
    try {
      const recs = await SkillsAssessmentService.getRecommendations(assessmentData);
      setRecommendations(recs);
      
      // Create notifications for high-priority skill recommendations
      const notificationService = NotificationService.getInstance();
      recs.skillDevelopment.forEach(skill => {
        if (skill.priority === 'High') {
          notificationService.createSkillRecommendationNotification(skill.skill, skill.priority);
        }
      });
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      setAssessmentError(error instanceof Error ? error.message : 'Failed to generate recommendations');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Check if next button should be disabled
  const isNextDisabled = (): boolean => {
    // Always allow progression
    return false;
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  };

  const toggleSkill = (skill: string) => {
    setAssessmentData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setAssessmentData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const updateField = (field: string, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to save assessment to localStorage
  const saveAssessment = () => {
    const assessmentToSave = {
      id: `assessment_${Date.now()}`,
      ...assessmentData,
      recommendations: recommendations, // Include AI-generated recommendations
      completedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    };

    // Get existing assessments
    const existingAssessments = JSON.parse(localStorage.getItem('savedAssessments') || '[]');
    
    // Add new assessment
    const updatedAssessments = [...existingAssessments, assessmentToSave];
    
    // Save to localStorage
    localStorage.setItem('savedAssessments', JSON.stringify(updatedAssessments));
    
    // Create notification
    const notificationService = NotificationService.getInstance();
    notificationService.createAssessmentNotification(assessmentToSave);
    
    // Show success message
    alert('Assessment saved successfully! You can view it in the "My Assessments" tab.');
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

  const progressVariants = {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-lg md:text-xl font-semibold mb-4">What skills do you currently have?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Select the skills you're proficient in. You can add custom skills too.
              </p>
            </motion.div>
            
            <div className="space-y-4">
              {skillCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, y: -2 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
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
                        {category.skills.map((skill, skillIndex) => {
                          const isSelected = assessmentData.skills.includes(skill);
                          return (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className={`h-9 text-xs md:text-sm justify-start ${
                                  isSelected ? "bg-primary text-primary-foreground" : ""
                                }`}
                                onClick={() => toggleSkill(skill)}
                              >
                                {isSelected ? (
                                  <CheckCircle className="h-3 w-3 mr-2" />
                                ) : (
                                  <Circle className="h-3 w-3 mr-2" />
                                )}
                                {skill}
                              </Button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

                         <motion.div className="space-y-4" variants={itemVariants}>
               <Label htmlFor="custom-skills" className="text-sm md:text-base font-medium">
                 Add Custom Skills
               </Label>
               <Textarea
                 id="custom-skills"
                 placeholder="Enter any additional skills you have (comma-separated)"
                 className="min-h-[80px] md:min-h-[100px]"
                 value={assessmentData.interests.join(", ")}
                 onChange={(e) => {
                   const customSkills = e.target.value.split(",").map(s => s.trim()).filter(s => s);
                   updateField("interests", e.target.value);
                 }}
               />
             </motion.div>

             {/* Validation message for Step 1 */}
             {currentStep === 1 && assessmentData.skills.length === 0 && (
               <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                 <p className="text-sm text-amber-700">
                   ⚠️ Please select at least one skill to continue
                 </p>
               </div>
             )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-lg md:text-xl font-semibold mb-4">What's your experience level?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Tell us about your professional experience and background.
              </p>
            </motion.div>

            <div className="space-y-4">
              <motion.div variants={itemVariants}>
                <Label htmlFor="current-role" className="text-sm md:text-base font-medium">
                  Current Role (if any)
                </Label>
                <Input
                  id="current-role"
                  placeholder="e.g., Software Developer, Marketing Manager, Student"
                  className="mt-2 h-11"
                  value={assessmentData.currentRole}
                  onChange={(e) => updateField("currentRole", e.target.value)}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label className="text-sm md:text-base font-medium mb-3 block">
                  Years of Professional Experience
                </Label>
                <RadioGroup 
                  className="space-y-3"
                  value={assessmentData.experienceLevel}
                  onValueChange={(value) => updateField("experienceLevel", value)}
                >
                  {experienceLevels.map((level, index) => (
                    <motion.div
                      key={level.value}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <RadioGroupItem value={level.value} id={level.value} />
                      <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                        <div className="font-medium text-sm md:text-base">{level.label}</div>
                        <div className="text-xs md:text-sm text-muted-foreground">{level.description}</div>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </motion.div>

                             <motion.div variants={itemVariants}>
                 <Label htmlFor="experience-details" className="text-sm md:text-base font-medium">
                   Additional Experience Details
                 </Label>
                 <Textarea
                   id="experience-details"
                   placeholder="Describe your work experience, projects, achievements, or any relevant background..."
                   className="mt-2 min-h-[100px] md:min-h-[120px]"
                   value={assessmentData.experienceDetails}
                   onChange={(e) => updateField("experienceDetails", e.target.value)}
                 />
               </motion.div>

               {/* Validation message for Step 2 */}
               {currentStep === 2 && assessmentData.experienceLevel === "" && (
                 <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                   <p className="text-sm text-amber-700">
                     ⚠️ Please select your experience level to continue
                   </p>
                 </div>
               )}
            </div>
          </motion.div>
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

                         <RadioGroup 
               value={assessmentData.selectedCareerGoal}
                               onValueChange={(value) => updateField("selectedCareerGoal", value)}
               className="grid grid-cols-1 md:grid-cols-2 gap-4"
             >
               {careerGoals.map((goal, index) => (
                 <div key={goal.value}>
                   <Card 
                     className={`hover:shadow-md transition-shadow cursor-pointer ${
                       assessmentData.selectedCareerGoal === goal.value ? "ring-2 ring-primary" : ""
                     }`}
                     onClick={() => updateField("selectedCareerGoal", goal.value)}
                   >
                     <CardContent className="p-4">
                       <div className="flex items-start space-x-3">
                         <div className="p-2 bg-primary/10 rounded-lg">
                           <goal.icon className="h-5 w-5 text-primary" />
                         </div>
                         <div className="flex-1">
                           <h4 className="font-medium text-sm md:text-base mb-1">{goal.label}</h4>
                           <p className="text-xs md:text-sm text-muted-foreground">{goal.description}</p>
                         </div>
                         <RadioGroupItem 
                           value={goal.value} 
                           id={goal.value}
                         />
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               ))}
             </RadioGroup>

                           <div>
                 <Label htmlFor="goals-details" className="text-sm md:text-base font-medium">
                   Additional Goals & Interests
                 </Label>
                 <Textarea
                   id="goals-details"
                   placeholder="Tell us more about your specific career goals, interests, or what you're looking for..."
                   className="mt-2 min-h-[100px] md:min-h-[120px]"
                   value={assessmentData.goalsDetails}
                   onChange={(e) => updateField("goalsDetails", e.target.value)}
                 />
               </div>

               {/* Validation message for Step 3 */}
               {currentStep === 3 && assessmentData.selectedCareerGoal === "" && (
                 <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                   <p className="text-sm text-amber-700">
                     ⚠️ Please select a career goal to continue
                   </p>
                 </div>
               )}
          </div>
        );

             case 4:
         return (
           <div className="space-y-6">
             <div className="text-center">
               <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle className="h-8 w-8 text-primary" />
               </div>
               <h3 className="text-lg md:text-xl font-semibold mb-2">Assessment Complete!</h3>
               <p className="text-muted-foreground">Here are your personalized recommendations.</p>
             </div>

             {isLoadingRecommendations ? (
               <div className="text-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                 <p className="text-muted-foreground">Generating personalized recommendations...</p>
               </div>
             ) : assessmentError ? (
               <div className="text-center py-8">
                 <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                   <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                   </svg>
                 </div>
                 <h3 className="text-lg font-semibold mb-2 text-amber-800">Assessment Unavailable</h3>
                 <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                   {assessmentError}
                 </p>
                 <div className="space-y-3">
                   <Button onClick={generateRecommendations} className="w-full sm:w-auto">
                     Try Again
                   </Button>
                   <p className="text-sm text-muted-foreground">
                     You can still save your assessment data and try again later.
                   </p>
                 </div>
               </div>
             ) : recommendations ? (
               <div className="space-y-4">
                 <div>
                   <Card>
                     <CardHeader>
                       <CardTitle className="text-base md:text-lg flex items-center">
                         <Target className="h-5 w-5 mr-2" />
                         Recommended Career Paths
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                       {recommendations.careerPaths.map((career, index) => (
                         <div
                           key={index}
                           className="p-3 border rounded-lg space-y-2"
                         >
                           <div className="flex items-center justify-between">
                             <div className="font-medium text-sm md:text-base">{career.title}</div>
                             <Badge variant="secondary">{career.match}</Badge>
                           </div>
                           <div className="text-xs md:text-sm text-muted-foreground">{career.description}</div>
                           <div className="flex items-center justify-between text-xs text-muted-foreground">
                             <span>💰 {career.salary}</span>
                             <span>📈 {career.growth}</span>
                           </div>
                           <div className="text-xs">
                             <span className="font-medium">Required Skills:</span> {career.requiredSkills.join(', ')}
                           </div>
                           <div className="text-xs">
                             <span className="font-medium">Next Steps:</span> {career.nextSteps.join(', ')}
                           </div>
                         </div>
                       ))}
                     </CardContent>
                   </Card>
                 </div>

                 <div>
                   <Card>
                     <CardHeader>
                       <CardTitle className="text-base md:text-lg flex items-center">
                         <TrendingUp className="h-5 w-5 mr-2" />
                         Skill Development Plan
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                       {recommendations.skillDevelopment.map((item, index) => (
                         <div
                           key={index}
                           className="p-3 border rounded-lg space-y-2"
                         >
                           <div className="flex items-center justify-between">
                             <div className="font-medium text-sm md:text-base">{item.skill}</div>
                             <Badge variant={item.priority === "High" ? "default" : "secondary"}>
                               {item.priority}
                             </Badge>
                           </div>
                           <div className="text-xs md:text-sm text-muted-foreground">{item.description}</div>
                           <div className="text-xs text-muted-foreground">⏰ Timeline: {item.timeline}</div>
                           <div className="text-xs">
                             <span className="font-medium">Resources:</span> {item.resources.join(', ')}
                           </div>
                         </div>
                       ))}
                     </CardContent>
                   </Card>
                 </div>

                 <div>
                   <Card>
                     <CardHeader>
                       <CardTitle className="text-base md:text-lg flex items-center">
                         <MapPin className="h-5 w-5 mr-2" />
                         Career Roadmap
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div>
                         <h4 className="font-medium text-sm mb-2">Short Term (3-6 months)</h4>
                         <ul className="text-xs text-muted-foreground space-y-1">
                           {recommendations.roadmap.shortTerm.map((goal, index) => (
                             <li key={index}>• {goal}</li>
                           ))}
                         </ul>
                       </div>
                       <div>
                         <h4 className="font-medium text-sm mb-2">Medium Term (6-12 months)</h4>
                         <ul className="text-xs text-muted-foreground space-y-1">
                           {recommendations.roadmap.mediumTerm.map((goal, index) => (
                             <li key={index}>• {goal}</li>
                           ))}
                         </ul>
                       </div>
                       <div>
                         <h4 className="font-medium text-sm mb-2">Long Term (1+ years)</h4>
                         <ul className="text-xs text-muted-foreground space-y-1">
                           {recommendations.roadmap.longTerm.map((goal, index) => (
                             <li key={index}>• {goal}</li>
                           ))}
                         </ul>
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </div>
             ) : (
               <div className="text-center py-8">
                 <p className="text-muted-foreground">No recommendations available. Please try again.</p>
                 <Button onClick={generateRecommendations} className="mt-2">
                   Generate Recommendations
                 </Button>
               </div>
             )}

             <div className="flex flex-col sm:flex-row gap-3">
               <Button 
                 className="flex-1 h-11" 
                 onClick={() => {
                   if (recommendations) {
                     // Save assessment with recommendations
                     const assessmentWithRecs = {
                       ...assessmentData,
                       recommendations: recommendations
                     };
                     localStorage.setItem('currentAssessment', JSON.stringify(assessmentWithRecs));
                     // You could navigate to a detailed roadmap page here
                     alert('Assessment saved! You can now view your detailed roadmap.');
                   }
                 }}
                 disabled={!recommendations || !!assessmentError}
               >
                 <Target className="h-4 w-4 mr-2" />
                 View Detailed Roadmap
               </Button>
               <Button 
                 variant="outline" 
                 className="flex-1 h-11" 
                 onClick={saveAssessment}
                 disabled={!!assessmentError}
               >
                 <BookOpen className="h-4 w-4 mr-2" />
                 Save Assessment
               </Button>
             </div>
           </div>
         );

      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Step {currentStep}</h3>
            <p className="text-muted-foreground">This step is not yet implemented.</p>
          </div>
        );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Mobile-Optimized Navigation Header */}
      <motion.header 
        className="border-b bg-background sticky top-0 z-50 safe-area-top"
        variants={headerVariants}
      >
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
        </div>
      </motion.header>

             {/* Progress Bar */}
       <motion.div 
         className="border-b bg-muted/50"
         variants={progressVariants}
       >
         <div className="container mx-auto px-4 py-3">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm font-medium">Step {currentStep} of 4</span>
             <span className="text-sm text-muted-foreground">
               {Math.round((currentStep / 4) * 100)}% Complete
             </span>
           </div>
           <Progress value={(currentStep / 4) * 100} className="h-2" />
           
           {/* Step completion indicator */}
           <div className="mt-2 text-xs text-muted-foreground">
             {currentStep === 1 && (
               <span>Skills selected: {assessmentData.skills.length}</span>
             )}
             {currentStep === 2 && (
               <span>Experience level: {assessmentData.experienceLevel ? "✓ Selected" : "Not selected"}</span>
             )}
             {currentStep === 3 && (
               <span>Career goal: {assessmentData.selectedCareerGoal ? "✓ Selected" : "Not selected"}</span>
             )}
             {currentStep === 4 && (
               <span>Assessment complete!</span>
             )}
           </div>
         </div>
       </motion.div>

             {/* Main Content */}
       <main className="container mx-auto px-4 py-6 md:py-8">
         <div className="max-w-2xl mx-auto">
           
           
           
           {renderStepContent()}

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <motion.div 
              className="flex justify-between mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="h-11"
              >
                Previous
              </Button>
                             <Button 
                 onClick={handleNextStep}
                 disabled={isNextDisabled()}
                 className="h-11"
               >
                 {currentStep === 3 ? "Complete Assessment" : "Next"}
                 <ChevronRight className="h-4 w-4 ml-2" />
               </Button>
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
    </motion.div>
  );
};

export default SkillsAssessmentPage;
