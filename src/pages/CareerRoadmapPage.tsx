import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Target, BookOpen, Map, Plus, CheckCircle, Star, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import CareerTransitionSuggestions from "@/components/CareerTransitionSuggestions";
import RoadmapProgress from "@/components/RoadmapProgress";
import { ICareerNode } from "@/types/career";
import BottomNavigation from "@/components/BottomNavigation";

const CareerRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    
    // Dispatch event to notify other components of the update
    window.dispatchEvent(new CustomEvent('roadmapProgressUpdated'));
  };

  useEffect(() => {
    (async () => {
      try {
        console.log('Loading career data for roadmap...');
        
        // Create a sample career for demonstration
        const sampleCareer: ICareerNode = {
          id: 'mid-dev',
          t: 'Mid-Level Developer',
          d: 'Experienced software developer with 3-5 years of experience',
          l: 'I',
          s: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'],
          sr: '$70,000 - $90,000',
          te: '3-5 years',
          // cat: 'tech', // TODO: Add category field to ICareerNode type
          jt: ['Software Developer', 'Frontend Developer', 'Full Stack Developer'],
          c: ['AWS Certified Developer', 'React Certification'],
          r: {
            e: ['Bachelor\'s in Computer Science or related field'],
            exp: '3-5 years of software development experience',
            sk: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git', 'Agile']
          },
          // loc: 'United States' // TODO: Add location field to ICareerNode type
        };
        
        console.log('Using sample career:', sampleCareer);
        setCurrentCareer(sampleCareer);
        localStorage.setItem('currentCareer', JSON.stringify(sampleCareer));
        window.dispatchEvent(new CustomEvent('roadmapProgressUpdated'));
        
      } catch (error) {
        console.error('Failed to load career data:', error);
        setError(t('pages.roadmap.failedToLoadData'));
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
          <p className="text-muted-foreground">{t('pages.roadmap.loadingRoadmap')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">{t('pages.roadmap.unableToLoadRoadmap')}</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()}>
              {t('pages.roadmap.tryAgain')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/categories')}>
              <Search className="h-4 w-4 mr-2" />
              {t('pages.roadmap.exploreCareers')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50 safe-area-top" style={{ touchAction: 'none' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">{t('pages.roadmap.title')}</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        {currentCareer ? (
          <div className="space-y-6">
            {/* Current Career Overview */}
            <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2">{t('pages.roadmap.yourCurrentCareer')}</h2>
                <p className="text-muted-foreground">{t('pages.roadmap.planYourNextStep')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background border border-border rounded-lg p-4" style={{ backgroundColor: 'hsl(var(--background))' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{currentCareer.t}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{currentCareer.d}</p>
                </div>
                <div className="bg-background border border-border rounded-lg p-4" style={{ backgroundColor: 'hsl(var(--background))' }}>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('pages.roadmap.salaryRange')}</h4>
                  <p className="text-lg font-semibold">{currentCareer.sr}</p>
                </div>
                <div className="bg-background border border-border rounded-lg p-4" style={{ backgroundColor: 'hsl(var(--background))' }}>
                  <h4 className="font-medium text-sm text-muted-foreground">{t('pages.roadmap.experienceLevel')}</h4>
                  <p className="text-lg font-semibold">{currentCareer.te}</p>
                </div>
              </div>
            </div>

            {/* Career Transition Suggestions */}
            <CareerTransitionSuggestions
              currentCareer={currentCareer}
              onCareerSelect={handleCareerSelect}
              onCareerSelection={saveCareerSelection}
              targetCareer={targetCareer}
              nextCareerGoal={nextCareerGoal}
            />

            {/* Roadmap Progress */}
            <RoadmapProgress
              currentCareer={currentCareer}
              nextCareerGoal={nextCareerGoal}
              targetCareer={targetCareer}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">{t('pages.roadmap.startYourCareerRoadmap')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('pages.roadmap.selectCurrentCareer')}
            </p>
            <Button onClick={() => navigate('/search')}>
              <Search className="h-4 w-4 mr-2" />
              {t('pages.roadmap.searchCareers')}
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CareerRoadmapPage;
