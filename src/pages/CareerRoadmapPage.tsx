import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Search, Target, BookOpen, Map, Plus, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import CareerTransitionSuggestions from "@/components/CareerTransitionSuggestions";
import { getAllCareerNodes } from "@/services/careerService";
import { ICareerNode } from "@/types/career";

const CareerRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentCareer, setCurrentCareer] = useState<ICareerNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('Loading career data for roadmap...');
        // For demo purposes, let's use a sample career
        // In a real app, this would come from user profile or selection
        const allNodes = await getAllCareerNodes();
        console.log('All career nodes loaded:', allNodes.length);
        
        const sampleCareer = allNodes.find(item => item.node.id === 'mid-dev')?.node;
        console.log('Sample career found:', sampleCareer);
        
        if (sampleCareer) {
          setCurrentCareer(sampleCareer);
        } else {
          // Fallback to any available career
          const fallbackCareer = allNodes[0]?.node;
          if (fallbackCareer) {
            console.log('Using fallback career:', fallbackCareer);
            setCurrentCareer(fallbackCareer);
          } else {
            setError('No career data available');
          }
        }
      } catch (error) {
        console.error('Failed to load career data:', error);
        setError('Failed to load career data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCareerSelect = (careerId: string) => {
    setSelectedCareerId(careerId);
    // Navigate to the career categories page to explore careers
    navigate('/categories');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your career roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load Roadmap</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/categories')}>
              <Search className="h-4 w-4 mr-2" />
              Explore Careers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50 safe-area-top">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <Home className="h-5 w-5" />
            </Button>
            <Map className="h-5 w-5 text-primary mr-2" />
            <h1 className="text-xl font-bold">Career Roadmap</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        {currentCareer ? (
          <div className="space-y-6">
            {/* Current Career Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">Your Current Career</h2>
                <p className="text-muted-foreground">Plan your next step</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-lg">{currentCareer.t}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{currentCareer.d}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Salary Range</h4>
                  <p className="text-lg font-semibold">{currentCareer.sr}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Experience Level</h4>
                  <p className="text-lg font-semibold">{currentCareer.te}</p>
                </div>
              </div>
            </div>

            {/* Career Transition Suggestions */}
            <CareerTransitionSuggestions 
              currentCareer={currentCareer}
              onCareerSelect={handleCareerSelect}
            />

            {/* Roadmap Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Your Roadmap Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">{currentCareer.t}</p>
                      <p className="text-sm text-muted-foreground">Current Position</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                    <div>
                      <p className="font-medium text-muted-foreground">Next Career Goal</p>
                      <p className="text-sm text-muted-foreground">Select a career to add to your roadmap</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    Planned
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Start Your Career Roadmap</h2>
            <p className="text-muted-foreground mb-6">
              Select your current career to begin planning your professional journey
            </p>
            <Button onClick={() => navigate('/categories')}>
              <Search className="h-4 w-4 mr-2" />
              Find My Career
            </Button>
          </div>
        )}
      </div>

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

            {/* Roadmap Button - Active */}
            <Link to="/roadmap" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Map className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Roadmap</span>
            </Link>

            {/* My Career Button */}
            <Link to="/my-paths" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">My Career</span>
            </Link>

            {/* Assessment Button */}
            <Link to="/skills" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Assessment</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CareerRoadmapPage;
