import React from "react";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Skill {
  name: string;
  level: number; // 0-100
}

interface Certification {
  name: string;
  provider: string;
  duration: string;
  url?: string;
}

interface JobTitle {
  title: string;
  company: string;
  description: string;
}

interface CareerDetailsProps {
  isOpen?: boolean;
  onClose?: () => void;
  careerTitle?: string;
  careerLevel?: string;
  description?: string;
  salaryRange?: string;
  timeToAchieve?: string;
  skills?: Skill[];
  certifications?: Certification[];
  jobTitles?: JobTitle[];
  nextSteps?: string[];
}

const CareerDetails: React.FC<CareerDetailsProps> = ({
  isOpen = true,
  onClose = () => {},
  careerTitle = "Senior Frontend Developer",
  careerLevel = "Mid-Level",
  description = "A Senior Frontend Developer creates user interfaces and experiences for web applications, focusing on advanced JavaScript frameworks, performance optimization, and leading development teams.",
  salaryRange = "$90,000 - $140,000",
  timeToAchieve = "3-5 years",
  skills = [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "CSS/SCSS", level: 80 },
    { name: "Performance Optimization", level: 75 },
    { name: "UI/UX Design Principles", level: 70 },
  ],
  certifications = [
    {
      name: "Advanced React Certification",
      provider: "Meta",
      duration: "3 months",
      url: "https://example.com/cert",
    },
    {
      name: "Frontend Performance Optimization",
      provider: "Google",
      duration: "2 months",
      url: "https://example.com/cert",
    },
  ],
  jobTitles = [
    {
      title: "Senior Frontend Engineer",
      company: "Tech Companies",
      description:
        "Lead development of user interfaces using modern frameworks.",
    },
    {
      title: "UI Technical Lead",
      company: "Product Companies",
      description:
        "Guide technical decisions for frontend architecture and implementation.",
    },
  ],
  nextSteps = [
    "Learn advanced state management patterns",
    "Develop mentoring skills",
    "Build a portfolio with complex UI projects",
  ],
}) => {
  const panelVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  if (!isOpen) return null;

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
              <h2 className="text-2xl font-bold">{careerTitle}</h2>
              <Badge variant="outline" className="mt-1">
                {careerLevel}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-muted-foreground mb-6">{description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">Salary Range</p>
                <p className="text-sm">{salaryRange}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Clock className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">Time to Achieve</p>
                <p className="text-sm">{timeToAchieve}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="skills" className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="jobs">Job Titles</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="space-y-4">
              <h3 className="text-lg font-medium">Required Skills</h3>
              {skills.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="certifications">
              <h3 className="text-lg font-medium mb-4">
                Recommended Certifications
              </h3>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cert.provider}
                          </p>
                          <div className="flex items-center mt-2 text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{cert.duration}</span>
                          </div>
                        </div>
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      {cert.url && (
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2"
                          asChild
                        >
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Details
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="jobs">
              <h3 className="text-lg font-medium mb-4">
                Real-World Job Titles
              </h3>
              <div className="space-y-4">
                {jobTitles.map((job, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {job.company}
                          </p>
                        </div>
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm mt-2">{job.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Next Steps</h3>
            <ul className="space-y-2">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="my-6" />

          <div className="flex space-x-4">
            <Button
              className="flex-1"
              onClick={() => console.log("Save career path")}
            >
              <Save className="mr-2 h-4 w-4" /> Save Path
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => console.log("View resources")}
            >
              <BookOpen className="mr-2 h-4 w-4" /> Learning Resources
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerDetails;
