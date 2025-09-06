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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{career.t}</h2>
        <Badge variant="outline" className={`mt-1 ${getLevelColor(career.l)}`}>
          {getLevelDisplayName(career.l)}
        </Badge>
      </div>

      <p className="text-muted-foreground mb-6">{career.d}</p>

      {careerPath && careerPath.nodes.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Career Roadmap Progress</span>
            <span className="text-sm text-muted-foreground">
              Step {currentIndex + 1} of {careerPath.nodes.length}
            </span>
          </div>
          <Progress 
            value={((currentIndex + 1) / careerPath.nodes.length) * 100} 
            className="h-2"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {careerPath.nodes.map((node, index) => (
              <span 
                key={node.id}
                className={index <= currentIndex ? 'text-primary font-medium' : ''}
              >
                {node.t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Career Transition Options */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Your Career Roadmap Options
        </h3>
        
        <div className="grid gap-4">
          {/* Next Step in Current Path */}
          {careerPath && currentIndex < careerPath.nodes.length - 1 && (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-200">Next Step in Your Path</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      {careerPath.nodes[currentIndex + 1].t}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      {careerPath.nodes[currentIndex + 1].te} • {careerPath.nodes[currentIndex + 1].sr}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Direct Path
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alternative Career Transitions */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Alternative Career Transitions</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Explore related careers in different industries
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {career.s.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Transferable Skills
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Career Level Progression */}
          <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-200">Level Progression</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Current: {getLevelDisplayName(career.l)} → Next: {getNextLevel(career.l)}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                    Focus on developing advanced skills and taking on more responsibility
                  </p>
                </div>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Level Up
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <DollarSign className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-medium">Salary Range</p>
            <p className="text-sm">{career.sr}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Clock className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-medium">Time to Achieve</p>
            <p className="text-sm">{career.te}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <div>
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
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Recommended Certifications
            </h3>
            <div className="space-y-3">
              {career.c.map((cert, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{cert}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Education</h4>
                <div className="space-y-2">
                  {career.r.e.map((edu, index) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                      {edu}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm mb-2">Experience</h4>
                <p className="text-sm text-muted-foreground">{career.r.exp}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm mb-2">Key Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {career.r.sk.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <div>
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

        <Separator />

        <div className="space-y-3">
          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              size="sm"
              onClick={handleBookmark}
              variant={isBookmarked ? "outline" : "default"}
            >
              {bookmarkSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : isBookmarked ? (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Remove from Roadmap
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save to My Roadmap
                </>
              )}
            </Button>
            {careerPath && onNavigate && (
              <>
                {currentIndex > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate(currentIndex - 1)}
                  >
                    ← Previous
                  </Button>
                )}
                {currentIndex < careerPath.nodes.length - 1 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate(currentIndex + 1)}
                  >
                    Next Step →
                  </Button>
                )}
              </>
            )}
          </div>
          
          {/* Roadmap Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Find Similar Jobs
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Explore Transitions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

CareerDetailsContent.displayName = "CareerDetailsContent";

export default CareerDetailsContent;


