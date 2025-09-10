import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Target, BookOpen, Map, Plus, CheckCircle, Star, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import CareerTransitionSuggestions from "@/components/CareerTransitionSuggestions";
import { getAllCareerNodes } from "@/services/careerService";
import { ICareerNode } from "@/types/career";
import BottomNavigation from "@/components/BottomNavigation";

const CareerRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentCareer, setCurrentCareer] = useState<ICareerNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [nextCareerGoal, setNextCareerGoal] = useState<ICareerNode | null>(null);
  const [targetCareer, setTargetCareer] = useState<ICareerNode | null>(null);

  // Load saved career selections from localStorage
  useEffect(() => {
    const savedNextGoal = localStorage.getItem('nextCareerGoal');
    const savedTargetCareer = localStorage.getItem('targetCareer');
    
    if (savedNextGoal) {
      try {
        setNextCareerGoal(JSON.parse(savedNextGoal));
      } catch (error) {
        console.error('Error loading next career goal:', error);
      }
    }
    
    if (savedTargetCareer) {
      try {
        setTargetCareer(JSON.parse(savedTargetCareer));
      } catch (error) {
        console.error('Error loading target career:', error);
      }
    }
  }, []);

  // Save career selections to localStorage
  const saveCareerSelection = (career: ICareerNode, type: 'nextGoal' | 'target') => {
    if (type === 'nextGoal') {
      setNextCareerGoal(career);
      localStorage.setItem('nextCareerGoal', JSON.stringify(career));
    } else {
      setTargetCareer(career);
      localStorage.setItem('targetCareer', JSON.stringify(career));
    }
  };

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
    
    if (careerId.startsWith('details-')) {
      // Navigate to career details page
      const actualCareerId = careerId.replace('details-', '');
      navigate(`/jobs/${actualCareerId}`);
    } else {
      // Navigate to career details page for adding to roadmap
      navigate(`/jobs/${careerId}`);
    }
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
              onCareerSelection={saveCareerSelection}
            />

            {/* Roadmap Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Your Roadmap Progress
              </h3>
              <div className="space-y-4">
                {/* Current Career */}
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">{currentCareer.t}</p>
                      <p className="text-sm text-muted-foreground">Current Position</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{currentCareer.l}</Badge>
                        <Badge variant="outline" className="text-xs">{currentCareer.te}</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </Badge>
                </div>

                {/* Next Career Goal */}
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <ArrowRight className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{nextCareerGoal ? nextCareerGoal.t : 'Next Career Goal'}</p>
                      <p className="text-sm text-muted-foreground">
                        {nextCareerGoal ? `Next step: ${nextCareerGoal.t}` : 'Select your next career goal'}
                      </p>
                      {nextCareerGoal && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{nextCareerGoal.l}</Badge>
                          <Badge variant="outline" className="text-xs">{nextCareerGoal.te}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {nextCareerGoal && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Set
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Target Career */}
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{targetCareer ? targetCareer.t : 'Target Career'}</p>
                      <p className="text-sm text-muted-foreground">
                        {targetCareer ? `Target: ${targetCareer.t}` : 'Set your long-term career target'}
                      </p>
                      {targetCareer && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{targetCareer.l}</Badge>
                          <Badge variant="outline" className="text-xs">{targetCareer.te}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {targetCareer && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Target Set
                      </Badge>
                    )}
                  </div>
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
            <Button onClick={() => navigate('/search')}>
              <Search className="h-4 w-4 mr-2" />
              Find My Career
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CareerRoadmapPage;
