import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { SkillsAssessmentService, AssessmentRecommendations } from "@/services/skillsAssessmentService";
import { NotificationService } from "@/services/notificationService";
import {
  Search,
  MapPin,
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
  Map,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { Progress } from "@/components/ui/progress";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SkillsAssessmentPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      // The service now provides fallback recommendations, so this should rarely happen
      setAssessmentError(error instanceof Error ? error.message : t('assessment.failedToGenerateRecommendations'));
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
    alert(t('errors.assessmentSavedSuccessfully'));
  };

  const skillCategories = [
    {
      id: "technical",
      name: t('assessment.skillCategories.technical'),
      icon: Code,
      color: "bg-blue-100 text-blue-600",
      skills: [t('skills.javascript'), t('skills.python'), t('skills.react'), t('skills.nodejs'), t('skills.sql'), t('skills.aws'), t('skills.docker'), t('skills.git')]
    },
    {
      id: "creative",
      name: t('assessment.skillCategories.creative'),
      icon: Palette,
      color: "bg-purple-100 text-purple-600",
      skills: [t('skills.design'), t('skills.copywriting'), t('skills.photography'), t('skills.videoEditing'), t('skills.uiUx'), t('skills.branding'), t('skills.illustration'), t('skills.animation')]
    },
    {
      id: "analytical",
      name: t('assessment.skillCategories.analytical'),
      icon: Calculator,
      color: "bg-green-100 text-green-600",
      skills: [t('skills.dataAnalysis'), t('skills.statistics'), t('skills.excel'), t('skills.tableau'), t('skills.r'), t('skills.python'), t('skills.sql'), t('skills.machineLearning')]
    },
    {
      id: "communication",
      name: t('assessment.skillCategories.communication'),
      icon: Users,
      color: "bg-orange-100 text-orange-600",
      skills: [t('skills.publicSpeaking'), t('skills.writing'), t('skills.presentation'), t('skills.negotiation'), t('skills.leadership'), t('skills.teamManagement'), t('skills.clientRelations'), t('skills.training')]
    },
    {
      id: "business",
      name: t('assessment.skillCategories.business'),
      icon: Briefcase,
      color: "bg-indigo-100 text-indigo-600",
      skills: [t('skills.projectManagement'), t('skills.marketing'), t('skills.sales'), t('skills.finance'), t('skills.strategy'), t('skills.operations'), t('skills.hr'), t('skills.legal')]
    },
    {
      id: "languages",
      name: t('assessment.skillCategories.languages'),
      icon: Globe,
      color: "bg-teal-100 text-teal-600",
      skills: [t('skills.english'), t('skills.spanish'), t('skills.french'), t('skills.german'), t('skills.chinese'), t('skills.japanese'), t('skills.arabic'), t('skills.portuguese')]
    }
  ];

  const experienceLevels = [
    { value: "beginner", label: t('assessment.experienceLevels.beginner'), description: t('assessment.experienceDescriptions.beginner') },
    { value: "intermediate", label: t('assessment.experienceLevels.intermediate'), description: t('assessment.experienceDescriptions.intermediate') },
    { value: "advanced", label: t('assessment.experienceLevels.advanced'), description: t('assessment.experienceDescriptions.advanced') },
    { value: "expert", label: t('assessment.experienceLevels.expert'), description: t('assessment.experienceDescriptions.expert') }
  ];

  const careerGoals = [
    { value: "technical", label: t('assessment.careerGoals.technical'), icon: Code, description: t('assessment.careerGoalDescriptions.technical') },
    { value: "management", label: t('assessment.careerGoals.management'), icon: Users, description: t('assessment.careerGoalDescriptions.management') },
    { value: "entrepreneur", label: t('assessment.careerGoals.entrepreneur'), icon: Zap, description: t('assessment.careerGoalDescriptions.entrepreneur') },
    { value: "specialist", label: t('assessment.careerGoals.specialist'), icon: Star, description: t('assessment.careerGoalDescriptions.specialist') },
    { value: "creative", label: t('assessment.careerGoals.creative'), icon: Palette, description: t('assessment.careerGoalDescriptions.creative') },
    { value: "analyst", label: t('assessment.careerGoals.analyst'), icon: TrendingUp, description: t('assessment.careerGoalDescriptions.analyst') }
  ];


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <h3 className="text-lg md:text-xl font-semibold mb-4">{t('assessment.whatSkillsDoYouHave')}</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                {t('assessment.selectSkills')}
              </p>
            </motion.div>
            
            <div className="space-y-4">
              {skillCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
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
                            {t('assessment.selectRelevantSkills')}
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

                         <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
               <Label htmlFor="custom-skills" className="text-sm md:text-base font-medium">
                 {t('assessment.addCustomSkills')}
               </Label>
               <Textarea
                 id="custom-skills"
                 placeholder={t('assessment.enterAdditionalSkills')}
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
                   ⚠️ {t('assessment.selectAtLeastOneSkill')}
                 </p>
               </div>
             )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <h3 className="text-lg md:text-xl font-semibold mb-4">What's your experience level?</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Tell us about your professional experience and background.
              </p>
            </motion.div>

            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
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

              <motion.div initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
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

                             <motion.div initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
                 <Label htmlFor="experience-details" className="text-sm md:text-base font-medium">
                   Additional Experience Details
                 </Label>
                 <Textarea
                   id="experience-details"
                   placeholder={t('assessment.describeExperience')}
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
                {t('assessment.selectCareerDirection')}
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
                   placeholder={t('assessment.describeGoals')}
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
                     {t('assessment.tryAgain')}
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
                           className={`p-4 border rounded-lg space-y-3 transition-all cursor-pointer shadow-sm hover:shadow-lg ${
                             index % 5 === 0 ? 'card-orange hover:shadow-orange-200' :
                             index % 5 === 1 ? 'card-blue hover:shadow-blue-200' :
                             index % 5 === 2 ? 'card-purple hover:shadow-purple-200' :
                             index % 5 === 3 ? 'card-green hover:shadow-green-200' :
                             'card-pink hover:shadow-pink-200'
                           }`}
                           onClick={() => {
                             if (career.careerNode) {
                               console.log('Navigating to career:', career.careerNode.id);
                               console.log('Career node:', career.careerNode);
                               // Navigate to career details page using React Router
                               navigate(`/jobs/${career.careerNode.id}`);
                             } else {
                               console.log('No career node found for:', career.title);
                             }
                           }}
                         >
                           <div className="flex items-center justify-between">
                             <div className="font-medium text-sm md:text-base">{career.title}</div>
                             <Badge variant={parseInt(career.match) >= 70 ? "default" : "secondary"}>
                               {career.match}
                             </Badge>
                           </div>
                           <div className="text-xs md:text-sm text-muted-foreground">{career.description}</div>
                           <div className="flex items-center justify-between text-xs text-muted-foreground">
                             <span>💰 {career.salary}</span>
                             <span>📈 {career.growth}</span>
                           </div>
                           <div className="text-xs">
                             <span className="font-medium">Required Skills:</span> 
                             <div className="flex flex-wrap gap-1 mt-1">
                               {career.requiredSkills.slice(0, 5).map((skill, skillIndex) => (
                                 <Badge key={skillIndex} variant="outline" className="text-xs">
                                   {skill}
                                 </Badge>
                               ))}
                               {career.requiredSkills.length > 5 && (
                                 <Badge variant="outline" className="text-xs">
                                   +{career.requiredSkills.length - 5} more
                                 </Badge>
                               )}
                             </div>
                           </div>
                           <div className="text-xs">
                             <span className="font-medium">Next Steps:</span> 
                             <ul className="mt-1 space-y-1">
                               {career.nextSteps.map((step, stepIndex) => (
                                 <li key={stepIndex} className="text-muted-foreground">• {step}</li>
                               ))}
                             </ul>
                           </div>
                           <div className="flex items-center justify-between text-xs text-primary font-medium">
                             <span>Click to view detailed career information</span>
                             <ChevronRight className="h-4 w-4" />
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
                           className={`p-4 border rounded-lg space-y-2 transition-all ${
                             index % 4 === 0 ? 'bg-gradient-to-r from-orange-50/80 to-yellow-50/80 hover:from-orange-100/80 hover:to-yellow-100/80' :
                             index % 4 === 1 ? 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 hover:from-blue-100/80 hover:to-cyan-100/80' :
                             index % 4 === 2 ? 'bg-gradient-to-r from-purple-50/80 to-pink-50/80 hover:from-purple-100/80 hover:to-pink-100/80' :
                             'bg-gradient-to-r from-green-50/80 to-emerald-50/80 hover:from-green-100/80 hover:to-emerald-100/80'
                           }`}
                         >
                           <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-2">
                               <div className={`w-2 h-2 rounded-full ${
                                 index % 4 === 0 ? 'bg-orange-500' :
                                 index % 4 === 1 ? 'bg-blue-500' :
                                 index % 4 === 2 ? 'bg-purple-500' :
                                 'bg-green-500'
                               }`}></div>
                               <div className="font-medium text-sm md:text-base">{item.skill}</div>
                             </div>
                               <Badge variant={item.priority === t('priority.high') ? "default" : "secondary"}>
                                 {t(`assessment.priority.${item.priority.toLowerCase()}`)}
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
                 <p className="text-muted-foreground">{t('errors.noRecommendationsAvailable')}</p>
                 <Button onClick={generateRecommendations} className="mt-2">
                   {t('errors.generateRecommendations')}
                 </Button>
               </div>
             )}

             <div className="flex justify-center">
               <Button 
                 variant="outline" 
                 className="h-11 px-8" 
                 onClick={saveAssessment}
                 disabled={!!assessmentError}
               >
                 <BookOpen className="h-4 w-4 mr-2" />
                 {t('errors.saveAssessment')}
               </Button>
             </div>
           </div>
         );

      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">{t('assessment.step')} {currentStep}</h3>
            <p className="text-muted-foreground">{t('errors.stepNotImplemented')}</p>
          </div>
        );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background page-with-bottom-nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile-Optimized Navigation Header */}
      <motion.header 
        className="border-b bg-background sticky top-0 z-50 safe-area-top"
        style={{ touchAction: 'none' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg md:text-xl font-bold">{t('assessment.title')}</h1>
          </div>
        </div>
      </motion.header>

             {/* Progress Bar */}
       <motion.div 
         className="border-b bg-muted/50"
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.4 }}
       >
         <div className="container mx-auto px-4 py-3">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm font-medium">{t('assessment.step')} {currentStep} of 4</span>
             <span className="text-sm text-muted-foreground">
               {Math.round((currentStep / 4) * 100)}% {t('assessment.complete')}
             </span>
           </div>
           <Progress value={(currentStep / 4) * 100} className="h-2" />
           
           {/* Step completion indicator */}
           <div className="mt-2 text-xs text-muted-foreground">
             {currentStep === 1 && (
               <span>{t('assessment.skillsSelected')} {assessmentData.skills.length}</span>
             )}
             {currentStep === 2 && (
               <span>{t('assessment.stepProgress.experienceLevel')} {assessmentData.experienceLevel ? t('assessment.stepProgress.selected') : t('assessment.stepProgress.notSelected')}</span>
             )}
             {currentStep === 3 && (
               <span>{t('assessment.stepProgress.careerGoal')} {assessmentData.selectedCareerGoal ? t('assessment.stepProgress.selected') : t('assessment.stepProgress.notSelected')}</span>
             )}
             {currentStep === 4 && (
               <span>{t('assessment.assessmentComplete')}</span>
             )}
           </div>
         </div>
       </motion.div>

             {/* Main Content */}
       <main className="container mx-auto px-4 py-6 md:py-8 pb-20">
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
                {t('assessment.previous')}
              </Button>
                             <Button 
                 onClick={handleNextStep}
                 disabled={isNextDisabled()}
                 className="h-11"
               >
                 {currentStep === 3 ? t('assessment.buttons.completeAssessment') : t('assessment.buttons.next')}
                 <ChevronRight className="h-4 w-4 ml-2" />
               </Button>
            </motion.div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </motion.div>
  );
};

export default SkillsAssessmentPage;
