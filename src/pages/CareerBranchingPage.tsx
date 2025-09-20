import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import {
  Search,
  MapPin,
  ArrowLeft,
  TrendingUp,
  Target,
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
  ArrowRight,
  Home,
  BookOpen,
  Star,
  CheckCircle,
  Circle,
  Building,
  GraduationCap,
  DollarSign,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "@/components/BottomNavigation";

const CareerBranchingPage = () => {
  const { t } = useTranslation();
  // Get user's current career from the MyCareerPathsPage data
  const userCurrentCareer = t('pages.branching.currentCareer'); // This would come from user's actual data
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);

  const careerTransitions = {
    "software-developer": [
      {
        id: "product-manager",
        title: t('pages.branching.transitionData.productManager.title'),
        description: t('pages.branching.transitionData.productManager.description'),
        difficulty: t('pages.branching.transitionData.productManager.difficulty'),
        timeline: t('pages.branching.transitionData.productManager.timeline'),
        transferableSkills: [t('skills.problemSolving'), t('skills.technicalKnowledge'), t('skills.analyticalThinking')],
        newSkills: [t('skills.productStrategy'), t('skills.userResearch'), t('skills.stakeholderManagement')],
        salaryIncrease: t('pages.branching.transitionData.productManager.salaryIncrease'),
        icon: Users,
        color: "bg-blue-100 text-blue-600"
      },
      {
        id: "data-scientist",
        title: t('pages.branching.transitionData.dataScientist.title'),
        description: t('pages.branching.transitionData.dataScientist.description'),
        difficulty: t('pages.branching.transitionData.dataScientist.difficulty'),
        timeline: t('pages.branching.transitionData.dataScientist.timeline'),
        transferableSkills: [t('skills.programming'), t('skills.problemSolving'), t('skills.mathematics')],
        newSkills: [t('skills.statistics'), t('skills.machineLearning'), t('skills.dataVisualization')],
        salaryIncrease: t('pages.branching.transitionData.dataScientist.salaryIncrease'),
        icon: Calculator,
        color: "bg-green-100 text-green-600"
      },
      {
        id: "devops-engineer",
        title: t('pages.branching.transitionData.devopsEngineer.title'),
        description: t('pages.branching.transitionData.devopsEngineer.description'),
        difficulty: t('pages.branching.transitionData.devopsEngineer.difficulty'),
        timeline: t('pages.branching.transitionData.devopsEngineer.timeline'),
        transferableSkills: [t('skills.programming'), t('skills.systemUnderstanding'), t('skills.problemSolving')],
        newSkills: [t('skills.cloudPlatforms'), t('skills.infrastructureAsCode'), t('skills.monitoring')],
        salaryIncrease: t('pages.branching.transitionData.devopsEngineer.salaryIncrease'),
        icon: Zap,
        color: "bg-orange-100 text-orange-600"
      },
      {
        id: "technical-lead",
        title: t('pages.branching.transitionData.technicalLead.title'),
        description: t('pages.branching.transitionData.technicalLead.description'),
        difficulty: t('pages.branching.transitionData.technicalLead.difficulty'),
        timeline: t('pages.branching.transitionData.technicalLead.timeline'),
        transferableSkills: [t('skills.technicalSkills'), t('skills.problemSolving'), t('skills.communication')],
        newSkills: [t('skills.teamLeadership'), t('skills.architectureDesign'), t('skills.mentoring')],
        salaryIncrease: t('pages.branching.transitionData.technicalLead.salaryIncrease'),
        icon: Award,
        color: "bg-purple-100 text-purple-600"
      }
    ],
    "marketing-manager": [
      {
        id: "product-marketing",
        title: t('pages.branching.transitionData.productMarketingManager.title'),
        description: t('pages.branching.transitionData.productMarketingManager.description'),
        difficulty: t('pages.branching.transitionData.productMarketingManager.difficulty'),
        timeline: t('pages.branching.transitionData.productMarketingManager.timeline'),
        transferableSkills: [t('skills.marketingStrategy'), t('skills.communication'), t('skills.analytics')],
        newSkills: [t('skills.productKnowledge'), t('skills.goToMarketStrategy'), t('skills.customerInsights')],
        salaryIncrease: t('pages.branching.transitionData.productMarketingManager.salaryIncrease'),
        icon: Target,
        color: "bg-indigo-100 text-indigo-600"
      },
      {
        id: "growth-hacker",
        title: t('pages.branching.transitionData.growthHacker.title'),
        description: t('pages.branching.transitionData.growthHacker.description'),
        difficulty: t('pages.branching.transitionData.growthHacker.difficulty'),
        timeline: t('pages.branching.transitionData.growthHacker.timeline'),
        transferableSkills: [t('skills.marketing'), t('skills.analytics'), t('skills.creativity')],
        newSkills: [t('skills.abTesting'), t('skills.automation'), t('skills.technicalSkills')],
        salaryIncrease: t('pages.branching.transitionData.growthHacker.salaryIncrease'),
        icon: TrendingUp,
        color: "bg-teal-100 text-teal-600"
      },
      {
        id: "brand-manager",
        title: t('pages.branching.transitionData.brandManager.title'),
        description: t('pages.branching.transitionData.brandManager.description'),
        difficulty: t('pages.branching.transitionData.brandManager.difficulty'),
        timeline: t('pages.branching.transitionData.brandManager.timeline'),
        transferableSkills: [t('skills.marketing'), t('skills.communication'), t('skills.strategy')],
        newSkills: [t('skills.brandStrategy'), t('skills.creativeDirection'), t('skills.stakeholderManagement')],
        salaryIncrease: t('pages.branching.transitionData.brandManager.salaryIncrease'),
        icon: Palette,
        color: "bg-pink-100 text-pink-600"
      }
    ],
    "data-analyst": [
      {
        id: "data-scientist",
        title: t('pages.branching.transitionData.dataScientistAdvanced.title'),
        description: t('pages.branching.transitionData.dataScientistAdvanced.description'),
        difficulty: t('pages.branching.transitionData.dataScientistAdvanced.difficulty'),
        timeline: t('pages.branching.transitionData.dataScientistAdvanced.timeline'),
        transferableSkills: [t('skills.dataAnalysis'), t('skills.statistics'), t('skills.programming')],
        newSkills: [t('skills.machineLearning'), t('skills.deepLearning'), t('skills.modelDeployment')],
        salaryIncrease: t('pages.branching.transitionData.dataScientistAdvanced.salaryIncrease'),
        icon: Calculator,
        color: "bg-green-100 text-green-600"
      },
      {
        id: "business-intelligence",
        title: t('pages.branching.transitionData.biManager.title'),
        description: t('pages.branching.transitionData.biManager.description'),
        difficulty: t('pages.branching.transitionData.biManager.difficulty'),
        timeline: t('pages.branching.transitionData.biManager.timeline'),
        transferableSkills: [t('skills.dataAnalysis'), t('skills.businessAcumen'), t('skills.communication')],
        newSkills: [t('skills.teamLeadership'), t('skills.dataStrategy'), t('skills.stakeholderManagement')],
        salaryIncrease: t('pages.branching.transitionData.biManager.salaryIncrease'),
        icon: BarChart3,
        color: "bg-blue-100 text-blue-600"
      },
      {
        id: "product-analyst",
        title: t('pages.branching.transitionData.productAnalyst.title'),
        description: t('pages.branching.transitionData.productAnalyst.description'),
        difficulty: t('pages.branching.transitionData.productAnalyst.difficulty'),
        timeline: t('pages.branching.transitionData.productAnalyst.timeline'),
        transferableSkills: [t('skills.dataAnalysis'), t('skills.sql'), t('skills.statistics')],
        newSkills: [t('skills.productMetrics'), t('skills.userResearch'), t('skills.abTesting')],
        salaryIncrease: t('pages.branching.transitionData.productAnalyst.salaryIncrease'),
        icon: Target,
        color: "bg-purple-100 text-purple-600"
      }
    ]
  };



  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile-Optimized Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50 safe-area-top" style={{ touchAction: 'none' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/home" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h1 className="text-lg md:text-xl font-bold">{t('pages.branching.title')}</h1>
            </div>
          </div>


        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Explore Career Transitions
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Discover how to leverage your current skills to transition into new career paths. 
              See transferable skills, learning requirements, and potential salary increases.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Current Career Display */}
          <div className="mb-8">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Your Current Career</h3>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Code className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-primary mb-2">{userCurrentCareer}</h4>
                    <p className="text-muted-foreground mb-3">
                      Based on your current role, here are possible career transitions that leverage your existing skills and experience.
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>Mid-Level Position</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>Growth Potential</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Career Transitions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-semibold">Possible Career Transitions</h3>
              <Badge variant="secondary" className="text-xs">
                {careerTransitions["software-developer"]?.length || 0} Options
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {careerTransitions["software-developer"]?.map((transition) => (
                <Card 
                  key={transition.id}
                  className="hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTransition(selectedTransition === transition.id ? null : transition.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${transition.color}`}>
                          <transition.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base md:text-lg">{transition.title}</CardTitle>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            {transition.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          selectedTransition === transition.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">Difficulty</div>
                        <Badge className={`text-xs mt-1 ${getDifficultyColor(transition.difficulty)}`}>
                          {transition.difficulty}
                        </Badge>
                      </div>
                      <div className="text-center p-2 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">Timeline</div>
                        <div className="text-sm font-medium mt-1">{transition.timeline}</div>
                      </div>
                      <div className="text-center p-2 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">Salary</div>
                        <div className="text-sm font-medium text-green-600 mt-1">{transition.salaryIncrease}</div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedTransition === transition.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-sm mb-2 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Transferable Skills
                            </h5>
                            <div className="space-y-1">
                              {transition.transferableSkills.map((skill, index) => (
                                <div key={index} className="text-xs md:text-sm text-muted-foreground">
                                  • {skill}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm mb-2 flex items-center">
                              <Star className="h-4 w-4 mr-2 text-blue-600" />
                              New Skills to Learn
                            </h5>
                            <div className="space-y-1">
                              {transition.newSkills.map((skill, index) => (
                                <div key={index} className="text-xs md:text-sm text-muted-foreground">
                                  • {skill}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button className="flex-1 h-10 text-sm">
                            <Target className="h-4 w-4 mr-2" />
                            {t('buttons.viewRoadmap')}
                          </Button>
                          <Button variant="outline" className="flex-1 h-10 text-sm">
                            <BookOpen className="h-4 w-4 mr-2" />
                            {t('buttons.learningResources')}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
{t('pages.branching.transitionTips.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(t('pages.branching.transitionTips.tips', { returnObjects: true }) as string[]).map((tip: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <Circle className="h-2 w-2 mt-2 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />

      {/* Mobile-Optimized Footer */}
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            Explore career transitions based on your current skills and experience.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CareerBranchingPage;
