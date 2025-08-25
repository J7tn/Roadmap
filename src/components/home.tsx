import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  ChevronRight,
  MapPin,
  Briefcase,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import CareerRoadmap from "./CareerRoadmap";
import CategorySelector from "./CategorySelector";
import CareerDetails from "./CareerDetails";
import { IndustryCategory, ICareerNode } from "@/types/career";
import { useIndustryBrowser } from "@/hooks/useCareerData";

const HomePage = () => {
  const [selectedCareer, setSelectedCareer] = useState<ICareerNode | null>(null);
  const [showCareerDetails, setShowCareerDetails] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Career Atlas</h1>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-medium">
              Home
            </Link>
            <Link to="/explore" className="font-medium">
              Explore
            </Link>
            <Link to="/skills" className="font-medium">
              Skills
            </Link>
            <Link to="/branching" className="font-medium">
              Career Branching
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search careers..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Your Career Path
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore interactive roadmaps to navigate your professional journey
              from entry-level to expert positions across {total} career paths.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Button size="lg" className="gap-2">
                <Briefcase className="h-5 w-5" />
                Explore Careers
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Skill Assessment
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="roadmap" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-3">
            <TabsTrigger value="roadmap">Career Roadmaps</TabsTrigger>
            <TabsTrigger value="skills">Skill Discovery</TabsTrigger>
            <TabsTrigger value="branching">Career Branching</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Browse Career Categories
              </h2>
              <CategorySelector
                selectedCategory={selectedIndustry}
                onSelectCategory={handleCategorySelect}
                showStats={true}
              />
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {selectedIndustry.charAt(0).toUpperCase() +
                      selectedIndustry.slice(1)}{" "}
                    Career Path
                  </h3>
                  <Button variant="outline" size="sm" className="gap-1">
                    View All Paths
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

          <TabsContent value="skills">
            <Card>
              <CardContent className="p-6 text-center py-16">
                <h3 className="text-xl font-semibold mb-4">
                  Skill-Based Discovery
                </h3>
                <p className="text-muted-foreground mb-6">
                  Input your current skills to receive personalized career
                  suggestions.
                </p>
                <Button>Coming Soon</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branching">
            <Card>
              <CardContent className="p-6 text-center py-16">
                <h3 className="text-xl font-semibold mb-4">
                  Career Branching Visualization
                </h3>
                <p className="text-muted-foreground mb-6">
                  See how to pivot between careers by leveraging transferable
                  skills.
                </p>
                <Button>Coming Soon</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Career Atlas
              </h3>
              <p className="text-sm text-muted-foreground">
                Navigate your professional journey with interactive career
                roadmaps and skill-based discovery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/roadmaps"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Career Roadmaps
                  </Link>
                </li>
                <li>
                  <Link
                    to="/skills"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Skill Discovery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/branching"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Career Branching
                  </Link>
                </li>
                <li>
                  <Link
                    to="/explorer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Explorer Interface
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Career Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Career Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Career Atlas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
