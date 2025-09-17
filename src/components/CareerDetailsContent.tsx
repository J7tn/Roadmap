import React, { memo, useMemo, useState, useCallback } from "react";
import { Award, Clock, DollarSign, Briefcase, Star, TrendingUp, Bookmark, Check, ExternalLink, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ICareerNode, ICareerPath, CareerLevel } from "@/types/career";
import { bookmarkService } from "@/services/bookmarkService";
import { getAllCareerNodes } from "@/services/careerService";
import { careerPathProgressService } from "@/services/careerPathProgressService";

interface CareerDetailsContentProps {
  career: ICareerNode;
  careerPath?: ICareerPath;
  currentIndex?: number;
  onNavigate?: (newIndex: number) => void;
  onCareerClick?: (careerId: string) => void;
}

const CareerDetailsContent: React.FC<CareerDetailsContentProps> = memo(({ 
  career, 
  careerPath, 
  currentIndex = 0, 
  onNavigate,
  onCareerClick 
}) => {
  const { t } = useTranslation();
  const [isPathTracked, setIsPathTracked] = useState(false);
  const [pathProgress, setPathProgress] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(bookmarkService.isBookmarked(career.id));
  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);
  const [branchingCareers, setBranchingCareers] = useState<ICareerNode[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log('CareerDetailsContent - Career:', career);
    console.log('CareerDetailsContent - CareerPath:', careerPath);
    console.log('CareerDetailsContent - CurrentIndex:', currentIndex);
  }, [career, careerPath, currentIndex]);

  // Check if career path is being tracked
  React.useEffect(() => {
    if (careerPath) {
      const progress = careerPathProgressService.getProgressByPathId(careerPath.id);
      setIsPathTracked(!!progress);
      setPathProgress(progress);
    }
  }, [careerPath]);

  // Handle saving career path progress
  const handleSaveCareerPath = useCallback(() => {
    if (!careerPath) return;
    
    const progress = careerPathProgressService.startCareerPath(careerPath, career.id);
    setIsPathTracked(true);
    setPathProgress(progress);
  }, [careerPath, career.id]);

  // Function to find similar careers based on skills
  const findSimilarCareers = useCallback(async (currentCareer: ICareerNode) => {
    setLoadingBranches(true);
    try {
      const allCareers = await getAllCareerNodes();
      const currentSkills = currentCareer.s || [];
      
      // Find careers with similar skills
      const similarCareers = allCareers
        .filter(c => c.node.id !== currentCareer.id) // Exclude current career
        .map(careerData => {
          const career = careerData.node;
          const careerSkills = career.s || [];
          const skillMatches = careerSkills.filter(skill => 
            currentSkills.some(currentSkill => 
              currentSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(currentSkill.toLowerCase())
            )
          );
          
          return {
            career,
            matchScore: skillMatches.length,
            matchedSkills: skillMatches
          };
        })
        .filter(item => item.matchScore > 0) // Only careers with skill matches
        .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score
        .slice(0, 6) // Take top 6 matches
        .map(item => item.career);
      
      setBranchingCareers(similarCareers);
    } catch (error) {
      console.error('Error finding similar careers:', error);
      setBranchingCareers([]);
    } finally {
      setLoadingBranches(false);
    }
  }, []);

  // Load similar careers when component mounts or career changes
  React.useEffect(() => {
    if (career) {
      findSimilarCareers(career);
    }
  }, [career, findSimilarCareers]);

  const getLevelDisplayName = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return t('jobDetails.entryLevel');
      case 'I': return t('jobDetails.midLevel');
      case 'A': return t('jobDetails.seniorLevel');
      case 'X': return t('jobDetails.expertLevel');
      default: return t('jobDetails.unknownLevel');
    }
  }, [t]);

  const getLevelColor = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'I': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'A': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'X': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }, []);

  const getNextLevel = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return t('jobDetails.midLevel');
      case 'I': return t('jobDetails.seniorLevel');
      case 'A': return t('jobDetails.expertLevel');
      case 'X': return t('jobDetails.topExecutive');
      default: return t('jobDetails.nextLevel');
    }
  }, [t]);

  const handleBookmark = () => {
    if (isBookmarked) {
      bookmarkService.removeBookmark(career.id);
      setIsBookmarked(false);
    } else {
      const success = bookmarkService.addBookmark(
        career, 
        careerPath?.cat || 'unknown', 
        careerPath?.n || 'Unknown Path', 
        careerPath?.id || 'unknown'
      );
      if (success) {
        setIsBookmarked(true);
        setBookmarkSuccess(true);
        setTimeout(() => setBookmarkSuccess(false), 2000);
      }
    }
  };

  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="mb-6 pt-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{career.t}</h2>
            <Badge variant="outline" className={getLevelColor(career.l)}>
              {getLevelDisplayName(career.l)}
            </Badge>
          </div>
          <Button 
            onClick={handleBookmark}
            variant={isBookmarked ? "outline" : "default"}
            size="sm"
          >
            {bookmarkSuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                {t('jobDetails.saved')}
              </>
            ) : isBookmarked ? (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                {t('jobDetails.savedStatus')}
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                {t('jobDetails.save')}
              </>
            )}
          </Button>
        </div>
        
        <p className="text-muted-foreground text-base leading-relaxed">{career.d}</p>
      </div>

      {/* Key Information Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-primary mb-2 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground mb-1">{t('jobDetails.salaryRange')}</p>
            <p className="text-lg font-semibold leading-tight">{career.sr}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-primary mb-2 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground mb-1">{t('jobDetails.timeToAchieve')}</p>
            <p className="text-lg font-semibold leading-tight">{career.te}</p>
          </CardContent>
        </Card>
      </div>


      {/* Skills Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2" />
          {t('jobDetails.requiredSkills')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {career.s && career.s.length > 0 ? career.s.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          )) : (
            <p className="text-muted-foreground text-sm">{t('jobDetails.noSkillsListed')}</p>
          )}
        </div>
      </div>

      {/* Certifications Section */}
      {career.c && career.c.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            {t('jobDetails.recommendedCertifications')}
          </h3>
          <div className="space-y-2">
            {career.c.map((cert, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                {cert}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Titles Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <Briefcase className="h-4 w-4 mr-2" />
          {t('jobDetails.commonJobTitles')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {career.jt && career.jt.length > 0 ? career.jt.map((title, index) => (
            <Badge key={index} variant="outline">
              {title}
            </Badge>
          )) : (
            <p className="text-muted-foreground text-sm">{t('jobDetails.noJobTitlesListed')}</p>
          )}
        </div>
      </div>

      {/* Career Path Progress - Vertical Skill Tree */}
      {careerPath && careerPath.nodes.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('jobDetails.careerPathProgress')}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {t('jobDetails.stepOf', { current: currentIndex + 1, total: careerPath.nodes.length })}
              </span>
              {!isPathTracked && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleSaveCareerPath}
                  className="text-xs"
                >
                  <Bookmark className="h-3 w-3 mr-1" />
                  {t('jobDetails.saveProgress')}
                </Button>
              )}
              {isPathTracked && (
                <Badge variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  {t('jobDetails.tracking')}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {careerPath.nodes.map((node, index) => (
              <div key={node.id} className="relative">
                {/* Connection Line */}
                {index < careerPath.nodes.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
                )}
                
                {/* Node */}
                <div 
                  className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    index === currentIndex 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : pathProgress && pathProgress.completedSteps.includes(index)
                        ? 'border-green-500 bg-green-50 dark:bg-green-950 hover:border-green-600' 
                        : 'border-border bg-muted/30 hover:border-primary/50'
                  }`}
                  onClick={() => {
                    console.log('Career node clicked:', node.id, node.t);
                    onCareerClick?.(node.id);
                  }}
                >
                  {/* Status Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    index === currentIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : pathProgress && pathProgress.completedSteps.includes(index)
                        ? 'bg-green-500 text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {pathProgress && pathProgress.completedSteps.includes(index) ? (
                      <Check className="h-6 w-6" />
                    ) : index === currentIndex ? (
                      <span className="text-lg font-bold">{index + 1}</span>
                    ) : (
                      <span className="text-lg font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${
                        index === currentIndex || (pathProgress && pathProgress.completedSteps.includes(index)) ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {node.t}
                      </h4>
                      {pathProgress && pathProgress.completedSteps.includes(index) && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {t('jobDetails.completed')}
                        </Badge>
                      )}
                      {index === currentIndex && (
                        <Badge className="bg-primary text-primary-foreground">
                          {t('jobDetails.current')}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Level and Time */}
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {t('jobDetails.level')} {node.l}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {node.te}
                      </span>
                    </div>
                    
                    {/* Skills Preview */}
                    {node.s && node.s.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {node.s.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {node.s.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{node.s.length - 3} {t('jobDetails.more')}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Click indicator */}
                  <div className="flex-shrink-0">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branching Career Opportunities */}
      {branchingCareers.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <ChevronRight className="h-4 w-4 mr-2" />
              {t('jobDetails.relatedCareerPaths')}
            </h3>
            <span className="text-sm text-muted-foreground">
              {t('jobDetails.basedOnYourSkills')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {branchingCareers.map((branchCareer) => (
              <Card 
                key={branchCareer.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
                onClick={() => {
                  console.log('Branching career clicked:', branchCareer.id, branchCareer.t);
                  onCareerClick?.(branchCareer.id);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate">
                        {branchCareer.t}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getLevelDisplayName(branchCareer.l)}
                        </Badge>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {branchCareer.te}
                        </span>
                      </div>
                      
                      {/* Skills that match */}
                      {branchCareer.s && branchCareer.s.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {branchCareer.s.slice(0, 2).map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {branchCareer.s.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{branchCareer.s.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 ml-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {loadingBranches && (
            <div className="text-center py-4">
              <div className="text-sm text-muted-foreground">{t('jobDetails.findingRelatedCareers')}</div>
            </div>
          )}
        </div>
      )}

    </div>
  );
});

CareerDetailsContent.displayName = "CareerDetailsContent";

export default CareerDetailsContent;


