import React, { memo, useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, TrendingUp, Users, Target } from "lucide-react";
import { ICareerNode, CareerLevel } from "@/types/career";

interface CareerTransitionSuggestionsProps {
  currentCareer: ICareerNode;
  onCareerSelect?: (careerId: string) => void;
}

const CareerTransitionSuggestions: React.FC<CareerTransitionSuggestionsProps> = memo(({ 
  currentCareer, 
  onCareerSelect 
}) => {
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

  // Mock transition suggestions based on current career
  const transitionSuggestions = useMemo(() => {
    const suggestions = [];
    
    // Same level, different industry
    suggestions.push({
      id: 'lateral-move',
      title: 'Lateral Career Move',
      description: 'Explore similar roles in different industries',
      careers: [
        { id: 'project-manager', title: 'Project Manager', industry: 'Business', level: currentCareer.l, salary: '$60,000 - $90,000' },
        { id: 'team-lead', title: 'Team Lead', industry: 'Tech', level: currentCareer.l, salary: '$55,000 - $85,000' },
        { id: 'operations-coordinator', title: 'Operations Coordinator', industry: 'Healthcare', level: currentCareer.l, salary: '$50,000 - $75,000' }
      ],
      icon: <ArrowRight className="h-4 w-4" />,
      color: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
    });

    // Next level up
    if (currentCareer.l !== 'X') {
      const nextLevel = currentCareer.l === 'E' ? 'I' : currentCareer.l === 'I' ? 'A' : 'X';
      suggestions.push({
        id: 'level-up',
        title: 'Level Up Your Career',
        description: 'Advance to the next career level',
        careers: [
          { id: 'senior-role', title: `Senior ${currentCareer.t}`, industry: 'Current', level: nextLevel, salary: '$70,000 - $120,000' },
          { id: 'lead-role', title: `Lead ${currentCareer.t}`, industry: 'Current', level: nextLevel, salary: '$80,000 - $130,000' },
          { id: 'principal-role', title: `Principal ${currentCareer.t}`, industry: 'Current', level: nextLevel, salary: '$90,000 - $150,000' }
        ],
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
      });
    }

    // Skill-based transitions
    suggestions.push({
      id: 'skill-transition',
      title: 'Skill-Based Transitions',
      description: 'Leverage your current skills in new areas',
      careers: [
        { id: 'consultant', title: 'Consultant', industry: 'Business', level: currentCareer.l, salary: '$65,000 - $110,000' },
        { id: 'trainer', title: 'Training Specialist', industry: 'Education', level: currentCareer.l, salary: '$45,000 - $75,000' },
        { id: 'freelancer', title: 'Freelance Professional', industry: 'Creative', level: currentCareer.l, salary: '$40,000 - $100,000+' }
      ],
      icon: <Target className="h-4 w-4" />,
      color: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950'
    });

    return suggestions;
  }, [currentCareer]);

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
              {suggestion.careers.map((career) => (
                <div 
                  key={career.id}
                  className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-2 mb-2">
                      <h5 className="font-medium text-sm flex-1 min-w-0">{career.title}</h5>
                      <Badge variant="outline" className={`text-xs flex-shrink-0 ${getLevelColor(career.level)}`}>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ml-3 flex-shrink-0"
                    onClick={() => onCareerSelect?.(career.id)}
                  >
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
        <CardContent className="p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h4 className="font-medium mb-2">Need Personalized Advice?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Get custom career transition recommendations based on your specific skills and goals
          </p>
          <Button variant="outline" size="sm">
            Get Career Consultation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

CareerTransitionSuggestions.displayName = "CareerTransitionSuggestions";

export default CareerTransitionSuggestions;
