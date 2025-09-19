import React from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <div className={`bg-background border border-border rounded-lg p-6 ${className}`} style={{ backgroundColor: 'hsl(var(--background))' }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
        {t('pages.roadmap.yourRoadmapProgress')}
      </h3>
      <div className="space-y-4">
        {/* Current Career */}
        <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{currentCareer?.t || t('pages.roadmap.currentPosition')}</p>
              <p className="text-sm text-muted-foreground">{t('pages.roadmap.currentPosition')}</p>
              {currentCareer && (
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">{currentCareer.l}</Badge>
                  <Badge variant="outline" className="text-xs">{currentCareer.te}</Badge>
                </div>
              )}
            </div>
          </div>
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            {currentCareer ? t('pages.roadmap.active') : t('pages.roadmap.notSet')}
          </Badge>
        </div>

        {/* Next Career Goal */}
        <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-center space-x-3">
            <ArrowRight className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{nextCareerGoal ? nextCareerGoal.t : t('pages.roadmap.nextCareerGoal')}</p>
              <p className="text-sm text-muted-foreground">
                {nextCareerGoal ? `${t('pages.roadmap.nextStep')}: ${nextCareerGoal.t}` : t('pages.roadmap.selectNextCareerGoal')}
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
                {t('pages.roadmap.set')}
              </Badge>
            )}
          </div>
        </div>

        {/* Target Career */}
        <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-muted">
          <div className="flex items-center space-x-3">
            <Star className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{targetCareer ? targetCareer.t : t('pages.roadmap.targetCareer')}</p>
              <p className="text-sm text-muted-foreground">
                {targetCareer ? `${t('pages.roadmap.target')}: ${targetCareer.t}` : t('pages.roadmap.setLongTermTarget')}
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
                {t('pages.roadmap.targetSet')}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapProgress;
