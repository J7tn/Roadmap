import React, { memo, useMemo, useState } from "react";
import { Award, Clock, DollarSign, Briefcase, Star, TrendingUp, Bookmark, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ICareerNode, ICareerPath, CareerLevel } from "@/types/career";
import { bookmarkService } from "@/services/bookmarkService";

interface CareerDetailsContentProps {
  career: ICareerNode;
  careerPath?: ICareerPath;
  currentIndex?: number;
  onNavigate?: (newIndex: number) => void;
}

const CareerDetailsContent: React.FC<CareerDetailsContentProps> = memo(({ 
  career, 
  careerPath, 
  currentIndex = 0, 
  onNavigate 
}) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarkService.isBookmarked(career.id));
  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);
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

  const getNextLevel = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'Intermediate';
      case 'I': return 'Advanced';
      case 'A': return 'Expert';
      case 'X': return 'Master/Executive';
      default: return 'Next Level';
    }
  }, []);

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
                Saved!
              </>
            ) : isBookmarked ? (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                Save
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
            <p className="text-sm font-medium text-muted-foreground mb-1">Salary Range</p>
            <p className="text-lg font-semibold leading-tight">{career.sr}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-primary mb-2 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground mb-1">Time to Achieve</p>
            <p className="text-lg font-semibold leading-tight">{career.te}</p>
          </CardContent>
        </Card>
      </div>

      {/* Career Path Progress */}
      {careerPath && careerPath.nodes.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Career Path Progress</h3>
            <span className="text-sm text-muted-foreground">
              Step {currentIndex + 1} of {careerPath.nodes.length}
            </span>
          </div>
          <Progress 
            value={((currentIndex + 1) / careerPath.nodes.length) * 100} 
            className="h-2 mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {careerPath.nodes.map((node, index) => (
              <span 
                key={node.id}
                className={`truncate max-w-[80px] ${index <= currentIndex ? 'text-primary font-medium' : ''}`}
                title={node.t}
              >
                {node.t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2" />
          Required Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {career.s.map((skill, index) => (
            <Badge key={index} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      {career.c && career.c.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Recommended Certifications
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
          Common Job Titles
        </h3>
        <div className="flex flex-wrap gap-2">
          {career.jt.map((title, index) => (
            <Badge key={index} variant="outline">
              {title}
            </Badge>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {careerPath && onNavigate && (
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onNavigate(currentIndex - 1)}
            >
              ← Previous Step
            </Button>
          )}
          {currentIndex < careerPath.nodes.length - 1 && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onNavigate(currentIndex + 1)}
            >
              Next Step →
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

CareerDetailsContent.displayName = "CareerDetailsContent";

export default CareerDetailsContent;


