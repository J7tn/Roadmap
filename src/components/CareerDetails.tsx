import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  X,
  BookOpen,
  Save,
  ArrowRight,
  Award,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ICareerNode, CareerLevel } from "@/types/career";

interface CareerDetailsProps {
  isOpen?: boolean;
  onClose?: () => void;
  career?: ICareerNode;
}

const CareerDetails: React.FC<CareerDetailsProps> = memo(({
  isOpen = true,
  onClose = () => {},
  career,
}) => {
  // Helper function to get level display name
  const getLevelDisplayName = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'Entry Level';
      case 'I': return 'Intermediate';
      case 'A': return 'Advanced';
      case 'X': return 'Expert';
      default: return 'Unknown';
    }
  }, []);

  // Helper function to get level color
  const getLevelColor = useMemo(() => (level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'I': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'A': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'X': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }, []);

  const panelVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  if (!isOpen || !career) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end">
      <motion.div
        className="w-full max-w-md bg-background border-l h-full overflow-y-auto"
        initial="closed"
        animate="open"
        exit="closed"
        variants={panelVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6 bg-background">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{career.t}</h2>
              <Badge variant="outline" className={`mt-1 ${getLevelColor(career.l)}`}>
                {getLevelDisplayName(career.l)}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-muted-foreground mb-6">{career.d}</p>

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
                            <BookOpen className="h-4 w-4" />
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

            <div className="flex gap-3">
              <Button className="flex-1" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Path
              </Button>
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 mr-2" />
                Next Step
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

CareerDetails.displayName = "CareerDetails";

export default CareerDetails;
