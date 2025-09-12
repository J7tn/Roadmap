import React, { memo, useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, TrendingUp, Users, Target, ChevronDown, Star } from "lucide-react";
import { ICareerNode, CareerLevel } from "@/types/career";
// import { smartCareerCacheService } from "@/services/smartCareerCacheService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CareerTransitionSuggestionsProps {
  currentCareer: ICareerNode;
  onCareerSelect?: (careerId: string) => void;
  onCareerSelection?: (career: ICareerNode, type: 'nextGoal' | 'target') => void;
  targetCareer?: ICareerNode | null;
  nextCareerGoal?: ICareerNode | null;
}

const CareerTransitionSuggestions: React.FC<CareerTransitionSuggestionsProps> = memo(({ 
  currentCareer, 
  onCareerSelect,
  onCareerSelection,
  targetCareer,
  nextCareerGoal
}) => {
  const [allCareers, setAllCareers] = useState<ICareerNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCareers = async () => {
      try {
        setLoading(true);
        // Use smart caching service to load careers
        const careers = await smartCareerCacheService.getCareers({
          limit: 100 // Load more careers for better suggestions
        });
        setAllCareers(careers);
      } catch (error) {
        console.error('Failed to load careers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCareers();
  }, []);

  const getLevelDisplayName = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'Entry Level';
      case 'I': return 'Intermediate';
      case 'A': return 'Advanced';
      case 'X': return 'Expert';
      default: return 'Unknown';
    }
  }, []);

  const getLevelColor = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'I': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'A': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'X': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }, []);

  // Generate real transition suggestions based on actual career data
  const transitionSuggestions = useMemo(() => {
    if (loading || allCareers.length === 0) return [];

    const suggestions = [];
    
    // Helper function to check if career makes logical sense as next step
    const isLogicalNextStep = (career: ICareerNode, targetType: 'nextGoal' | 'target') => {
      // For next goal: should be same level or one level up
      if (targetType === 'nextGoal') {
        const currentLevel = currentCareer.l;
        const careerLevel = career.l;
        
        // Allow same level (lateral move) or one level up
        if (currentLevel === 'E' && careerLevel === 'I') return true; // Entry to Intermediate
        if (currentLevel === 'I' && careerLevel === 'A') return true; // Intermediate to Advanced
        if (currentLevel === 'A' && careerLevel === 'X') return true; // Advanced to Expert
        if (currentLevel === careerLevel) return true; // Same level (lateral)
        
        return false;
      }
      
      // For target career: should be at least one level up from current
      if (targetType === 'target') {
        const currentLevel = currentCareer.l;
        const careerLevel = career.l;
        
        // Target should be higher level than current
        if (currentLevel === 'E' && (careerLevel === 'I' || careerLevel === 'A' || careerLevel === 'X')) return true;
        if (currentLevel === 'I' && (careerLevel === 'A' || careerLevel === 'X')) return true;
        if (currentLevel === 'A' && careerLevel === 'X') return true;
        
        return false;
      }
      
      return false;
    };

    // Game-like filtering: Check if a career is a valid step toward the target career
    const isStepTowardTarget = (career: ICareerNode) => {
      if (!targetCareer) return true; // No target set, show all valid options
      
      const currentLevel = currentCareer.l;
      const careerLevel = career.l;
      const targetLevel = targetCareer.l;
      
      // If target is set, next step should be closer to target level
      const levelHierarchy = { 'E': 1, 'I': 2, 'A': 3, 'X': 4 };
      const currentLevelNum = levelHierarchy[currentLevel as keyof typeof levelHierarchy];
      const careerLevelNum = levelHierarchy[careerLevel as keyof typeof levelHierarchy];
      const targetLevelNum = levelHierarchy[targetLevel as keyof typeof levelHierarchy];
      
      // Next step should be between current and target levels
      if (targetLevelNum > currentLevelNum) {
        // Moving up: next step should be current level or one level up, but not beyond target
        return careerLevelNum >= currentLevelNum && careerLevelNum <= targetLevelNum;
      } else if (targetLevelNum < currentLevelNum) {
        // Moving down: next step should be current level or one level down, but not beyond target
        return careerLevelNum <= currentLevelNum && careerLevelNum >= targetLevelNum;
      } else {
        // Same level: allow lateral moves
        return careerLevelNum === currentLevelNum;
      }
    };

    // Check if career is "locked" (not available due to target career constraints)
    const isCareerLocked = (career: ICareerNode) => {
      if (!targetCareer) return false; // No target set, nothing is locked
      
      // If target is set, lock careers that don't lead toward the target
      return !isStepTowardTarget(career);
    };
    
    // Same level careers (lateral moves) - only for next goal
    const sameLevelCareers = allCareers
      .filter(career => 
        career.l === currentCareer.l && 
        career.id !== currentCareer.id &&
        isLogicalNextStep(career, 'nextGoal') &&
        isStepTowardTarget(career)
      )
      .slice(0, 3);
    
    if (sameLevelCareers.length > 0) {
      suggestions.push({
        id: 'lateral-move',
        title: 'Lateral Career Move',
        description: 'Explore similar roles at your current level',
        careers: sameLevelCareers.map(career => ({
          id: career.id,
          title: career.t,
          industry: 'Various',
          level: career.l,
          salary: career.sr || 'Salary not specified',
          canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
          canBeTarget: isLogicalNextStep(career, 'target')
        })),
        icon: <ArrowRight className="h-4 w-4" />,
        color: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
      });
    }

    // Next level up careers
    if (currentCareer.l !== 'X') {
      const nextLevel = currentCareer.l === 'E' ? 'I' : currentCareer.l === 'I' ? 'A' : 'X';
      const nextLevelCareers = allCareers
        .filter(career => 
          career.l === nextLevel &&
          isLogicalNextStep(career, 'nextGoal') &&
          isStepTowardTarget(career)
        )
        .slice(0, 3);
      
      if (nextLevelCareers.length > 0) {
        suggestions.push({
          id: 'level-up',
          title: 'Level Up Your Career',
          description: 'Advance to the next career level',
          careers: nextLevelCareers.map(career => ({
            id: career.id,
            title: career.t,
            industry: 'Various',
            level: career.l,
            salary: career.sr || 'Salary not specified',
            canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
            canBeTarget: isLogicalNextStep(career, 'target')
          })),
          icon: <TrendingUp className="h-4 w-4" />,
          color: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
        });
      }
    }

    // Skill-based transitions (careers with similar skills)
    const skillBasedCareers = allCareers
      .filter(career => {
        if (career.id === currentCareer.id || !career.s || !currentCareer.s) return false;
        // Find careers that share at least one skill AND make logical sense AND lead toward target
        const hasSharedSkills = career.s.some(skill => currentCareer.s?.includes(skill));
        const isLogical = isLogicalNextStep(career, 'nextGoal') || isLogicalNextStep(career, 'target');
        const leadsToTarget = isStepTowardTarget(career);
        return hasSharedSkills && isLogical && leadsToTarget;
      })
      .slice(0, 3);
    
    if (skillBasedCareers.length > 0) {
      suggestions.push({
        id: 'skill-transition',
        title: 'Skill-Based Transitions',
        description: 'Leverage your current skills in new areas',
        careers: skillBasedCareers.map(career => ({
          id: career.id,
          title: career.t,
          industry: 'Various',
          level: career.l,
          salary: career.sr || 'Salary not specified',
          canBeNextGoal: isLogicalNextStep(career, 'nextGoal'),
          canBeTarget: isLogicalNextStep(career, 'target')
        })),
        icon: <Target className="h-4 w-4" />,
        color: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950'
      });
    }

    return suggestions;
  }, [currentCareer, allCareers, loading]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Your Career Transition Options</h3>
          <p className="text-sm text-muted-foreground">
            Loading career suggestions...
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (transitionSuggestions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Your Career Transition Options</h3>
          <p className="text-sm text-muted-foreground">
            No career transition options found. Try exploring careers manually.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Your Career Transition Options</h3>
        <p className="text-sm text-muted-foreground">
          Based on your current role as <strong>{currentCareer.t}</strong>, here are potential career paths to explore
        </p>
      </div>

      {transitionSuggestions.map((suggestion) => (
        <Card key={suggestion.id} className={suggestion.color}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {suggestion.icon}
                <h4 className="font-medium">{suggestion.title}</h4>
              </div>
              <Badge variant="outline" className="text-xs">
                {suggestion.careers.length} options
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {suggestion.description}
            </p>

            <div className="grid gap-3">
              {suggestion.careers.map((career) => {
                const fullCareer = allCareers.find(c => c.id === career.id);
                const isLocked = fullCareer ? !isStepTowardTarget(fullCareer) : false;
                
                return (
                <div 
                  key={career.id}
                  className={`flex items-start justify-between p-3 rounded-lg border ${
                    isLocked 
                      ? 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 opacity-50' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-2 mb-2">
                      <h5 className={`font-medium text-sm flex-1 min-w-0 ${isLocked ? 'text-gray-500' : ''}`}>
                        {career.title}
                        {isLocked && targetCareer && (
                          <span className="text-xs text-gray-400 ml-2">
                            (Doesn't lead to {targetCareer.t})
                          </span>
                        )}
                      </h5>
                      <Badge variant="outline" className={`text-xs flex-shrink-0 ${getLevelColor(career.level)} ${isLocked ? 'opacity-50' : ''}`}>
                        {getLevelDisplayName(career.level)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {career.industry}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground min-w-[120px] text-right">
                        {career.salary}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-3 flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`justify-between ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isLocked}
                        >
                          {isLocked ? 'Locked' : 'Set Career'}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            // Find the full career object from allCareers
                            const fullCareer = allCareers.find(c => c.id === career.id);
                            if (fullCareer) {
                              onCareerSelection?.(fullCareer, 'nextGoal');
                            }
                          }}
                          className="flex items-center"
                          disabled={!career.canBeNextGoal}
                        >
                          <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                          Set as Next Goal
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            // Find the full career object from allCareers
                            const fullCareer = allCareers.find(c => c.id === career.id);
                            if (fullCareer) {
                              onCareerSelection?.(fullCareer, 'target');
                            }
                          }}
                          className="flex items-center"
                          disabled={!career.canBeTarget}
                        >
                          <Star className="h-4 w-4 mr-2 text-purple-500" />
                          Set as Target Career
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onCareerSelect?.(`details-${career.id}`)}
                    >
                      Career Details
                    </Button>
                  </div>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

    </div>
  );
});

CareerTransitionSuggestions.displayName = "CareerTransitionSuggestions";

export default CareerTransitionSuggestions;
