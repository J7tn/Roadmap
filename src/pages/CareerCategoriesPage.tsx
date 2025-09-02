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
  LocationIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CategorySelector from "@/components/CategorySelector";
import CareerRoadmap from "@/components/CareerRoadmap";

const CareerCategoriesPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
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
              <Grid3X3 className="h-5 w-5 text-primary" />
              <h1 className="text-lg md:text-xl font-bold">Browse Career Categories</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search - Hidden on mobile to save space */}
            <div className="relative hidden md:block w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search categories..." className="pl-8 h-9" />
            </div>
            
            {/* Notifications Button */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">1</Badge>
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
                    <Input placeholder="Search categories..." className="pl-10 h-11" />
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
                        to="/my-paths" 
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={handleMobileMenuClose}
                      >
                        <Target className="h-5 w-5" />
                        <span className="font-medium">My Career Paths</span>
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
                      Explore career opportunities
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
              <Button variant="default" size="sm" className="border-b-2 border-primary text-primary">
                All Categories
              </Button>
              <Button variant="ghost" size="sm">
                Popular
              </Button>
              <Button variant="ghost" size="sm">
                Trending
              </Button>
              <Button variant="ghost" size="sm">
                New
              </Button>
            </div>
          </div>
        </div>

        {/* Career Categories Content */}
        <div className="container mx-auto px-4 py-6">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Explore Career Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover diverse career paths across different industries. Click on any category to explore 
              specific careers and their requirements.
            </p>
          </div>

                      {/* Category Selector */}
            <div className="mb-8">
              <CategorySelector 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                showStats={true}
              />
            </div>

          {/* Career Roadmap Section */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold">Career Roadmap</h3>
                <Badge variant="secondary" className="text-xs">Interactive</Badge>
              </div>
              <CareerRoadmap />
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium text-sm mb-1">Find Your Path</h3>
                <p className="text-xs text-muted-foreground">Discover careers that match your skills</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium text-sm mb-1">Growth Areas</h3>
                <p className="text-xs text-muted-foreground">Explore high-demand career fields</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium text-sm mb-1">Learn Skills</h3>
                <p className="text-xs text-muted-foreground">Build the skills you need to succeed</p>
              </CardContent>
            </Card>
          </div>
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
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Search</span>
            </Link>

            {/* Saved Careers Button */}
            <Link to="/my-paths" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
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

export default CareerCategoriesPage;
