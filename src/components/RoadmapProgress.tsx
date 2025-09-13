import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Star, TrendingUp } from "lucide-react";
import { ICareerNode } from "@/types/career";

interface RoadmapProgressProps {
  currentCareer: ICareerNode | null;
  nextCareerGoal: ICareerNode | null;
  targetCareer: ICareerNode | null;
  className?: string;
}

const RoadmapProgress: React.FC<RoadmapProgressProps> = ({
  currentCareer,
  nextCareerGoal,
  targetCareer,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
        Your Roadmap Progress
      </h3>
      <div className="space-y-4">
        {/* Current Career */}
        <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{currentCareer?.t || 'Current Position'}</p>
              <p className="text-sm text-muted-foreground">Current Position</p>
              {currentCareer && (
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">{currentCareer.l}</Badge>
                  <Badge variant="outline" className="text-xs">{currentCareer.te}</Badge>
                </div>
              )}
            </div>
          </div>
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            {currentCareer ? 'Active' : 'Not Set'}
          </Badge>
        </div>

        {/* Next Career Goal */}
        <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-center space-x-3">
            <ArrowRight className="h-5 w-5 text-primary" />
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
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                Set
              </Badge>
            )}
          </div>
        </div>

        {/* Target Career */}
        <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-center space-x-3">
            <Star className="h-5 w-5 text-primary" />
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
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                Target Set
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapProgress;
