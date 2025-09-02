import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  MapPin,
  Briefcase,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CareerRoadmap from "./CareerRoadmap";
import CategorySelector from "./CategorySelector";
import CareerDetails from "./CareerDetails";
import { IndustryCategory, ICareerNode } from "@/types/career";
import { useIndustryBrowser } from "@/hooks/useCareerData";

const MobileOptimizedHome = () => {
  const [selectedCareer, setSelectedCareer] = useState<ICareerNode | null>(null);
  const [showCareerDetails, setShowCareerDetails] = useState(false);
  const navigate = useNavigate();

  // Use the optimized industry browser hook
  const {
    selectedIndustry,
    changeIndustry,
    data: careerData,
    loading,
    error,
    total
  } = useIndustryBrowser();

  const handleCategorySelect = useCallback((category: IndustryCategory) => {
    changeIndustry(category);
    setSelectedCareer(null);
    setShowCareerDetails(false);
  }, [changeIndustry]);

  const handleCareerSelect = useCallback((career: ICareerNode) => {
    setSelectedCareer(career);
    setShowCareerDetails(true);
  }, []);

  const handleCloseCareerDetails = useCallback(() => {
    setShowCareerDetails(false);
    setSelectedCareer(null);
  }, []);

  // Handle hero section button clicks
  const handleExploreCareers = useCallback(() => {
    // Scroll to the career categories section
    const categoriesSection = document.querySelector('main');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSkillAssessment = useCallback(() => {
    navigate('/search');
  }, [navigate]);



  const handleViewAllCareers = useCallback(() => {
    navigate('/jobs');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Career Atlas</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate('/search')}>
              <Search className="h-5 w-5" />
            </Button>

          </div>
        </div>


      </header>

      {/* Mobile-Optimized Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-8 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-3">
              Discover Your Career Path
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Explore interactive roadmaps to navigate your professional journey
              from entry-level to expert positions across {total} career paths.
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Button size="lg" className="gap-2" onClick={handleExploreCareers}>
                <Briefcase className="h-5 w-5" />
                Explore Careers
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={handleSkillAssessment}>
                <BookOpen className="h-5 w-5" />
                Skill Assessment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile-Optimized Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="roadmap" className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-6">
            <TabsTrigger value="roadmap">Career Roadmaps</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">
                Browse Career Categories
              </h2>
              <CategorySelector
                selectedCategory={selectedIndustry}
                onSelectCategory={handleCategorySelect}
                showStats={true}
              />
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {selectedIndustry.charAt(0).toUpperCase() +
                      selectedIndustry.slice(1)}{" "}
                    Career Path
                  </h3>
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleViewAllCareers}>
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative">
                  <CareerRoadmap
                    selectedCategory={selectedIndustry}
                    onNodeClick={handleCareerSelect}
                    pathId="software-development"
                  />

                  {showCareerDetails && selectedCareer && (
                    <CareerDetails
                      isOpen={showCareerDetails}
                      onClose={handleCloseCareerDetails}
                      career={selectedCareer}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation Dashboard - Fixed */}
      <nav className="border-t bg-background sticky bottom-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {/* Home Button */}
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Home</span>
            </div>

            {/* Search Button */}
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Search</span>
            </div>

            {/* Saved Careers Button */}
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">My Career</span>
            </div>

            {/* Skill Assessment Button */}
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile-Optimized Footer */}
      <footer className="bg-muted py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="font-bold mb-2 flex items-center justify-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Career Atlas
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Navigate your professional journey with interactive career
              roadmaps and skill-based discovery.
            </p>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Career Atlas. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MobileOptimizedHome;
