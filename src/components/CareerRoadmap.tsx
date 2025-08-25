import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  Plus,
  Info,
  Briefcase,
  Award,
  DollarSign,
} from "lucide-react";

interface CareerNode {
  id: string;
  title: string;
  level: string;
  skills: string[];
  certifications: string[];
  salaryRange: string;
  timeEstimate: string;
  description: string;
}

interface CareerPath {
  id: string;
  name: string;
  nodes: CareerNode[];
}

interface CareerRoadmapProps {
  selectedCategory?: string;
  onNodeClick?: (node: CareerNode) => void;
  paths?: CareerPath[];
}

const defaultPaths: CareerPath[] = [
  {
    id: "web-dev",
    name: "Web Development",
    nodes: [
      {
        id: "junior-dev",
        title: "Junior Developer",
        level: "Entry",
        skills: ["HTML", "CSS", "JavaScript", "Git"],
        certifications: ["None required"],
        salaryRange: "$50,000 - $70,000",
        timeEstimate: "0-2 years",
        description:
          "Entry-level position focused on building and maintaining websites under supervision.",
      },
      {
        id: "mid-dev",
        title: "Mid-Level Developer",
        level: "Intermediate",
        skills: ["React/Vue/Angular", "Node.js", "API Integration", "Testing"],
        certifications: [
          "AWS Certified Developer",
          "Microsoft Certified: JavaScript Developer",
        ],
        salaryRange: "$70,000 - $100,000",
        timeEstimate: "2-5 years",
        description:
          "Builds complex web applications and mentors junior developers.",
      },
      {
        id: "senior-dev",
        title: "Senior Developer",
        level: "Advanced",
        skills: [
          "System Architecture",
          "Performance Optimization",
          "Team Leadership",
          "DevOps",
        ],
        certifications: [
          "Google Professional Cloud Developer",
          "AWS Solutions Architect",
        ],
        salaryRange: "$100,000 - $150,000",
        timeEstimate: "5+ years",
        description:
          "Leads development teams and makes high-level architectural decisions.",
      },
      {
        id: "tech-lead",
        title: "Technical Lead",
        level: "Expert",
        skills: [
          "Project Management",
          "System Design",
          "Mentorship",
          "Business Strategy",
        ],
        certifications: ["PMP", "AWS DevOps Engineer"],
        salaryRange: "$130,000 - $180,000",
        timeEstimate: "8+ years",
        description:
          "Oversees multiple projects and teams while bridging technical and business requirements.",
      },
    ],
  },
  {
    id: "data-science",
    name: "Data Science",
    nodes: [
      {
        id: "data-analyst",
        title: "Data Analyst",
        level: "Entry",
        skills: ["SQL", "Excel", "Data Visualization", "Basic Statistics"],
        certifications: [
          "Google Data Analytics Certificate",
          "Microsoft Power BI Certification",
        ],
        salaryRange: "$55,000 - $75,000",
        timeEstimate: "0-2 years",
        description:
          "Analyzes data to identify trends and create reports for business decisions.",
      },
      {
        id: "data-scientist",
        title: "Data Scientist",
        level: "Intermediate",
        skills: [
          "Python/R",
          "Machine Learning",
          "Statistical Analysis",
          "Data Modeling",
        ],
        certifications: [
          "IBM Data Science Professional",
          "Microsoft Certified: Data Analyst Associate",
        ],
        salaryRange: "$80,000 - $120,000",
        timeEstimate: "2-5 years",
        description:
          "Builds predictive models and performs advanced data analysis.",
      },
      {
        id: "senior-data-scientist",
        title: "Senior Data Scientist",
        level: "Advanced",
        skills: ["Deep Learning", "NLP", "Big Data Technologies", "Research"],
        certifications: [
          "Tensorflow Developer Certificate",
          "Cloudera Certified Professional",
        ],
        salaryRange: "$120,000 - $160,000",
        timeEstimate: "5+ years",
        description:
          "Leads data science initiatives and develops cutting-edge algorithms.",
      },
      {
        id: "data-science-director",
        title: "Director of Data Science",
        level: "Expert",
        skills: [
          "AI Strategy",
          "Team Leadership",
          "Business Acumen",
          "Research Direction",
        ],
        certifications: ["PMP", "Executive Data Science Specialization"],
        salaryRange: "$150,000 - $200,000+",
        timeEstimate: "8+ years",
        description:
          "Sets data strategy for the organization and manages multiple data science teams.",
      },
    ],
  },
];

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({
  selectedCategory,
  onNodeClick = () => {},
  paths = defaultPaths,
}) => {
  const [activePath, setActivePath] = useState<string>(paths[0]?.id || "");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Filter paths by category if provided
  const filteredPaths = selectedCategory
    ? paths.filter((path) =>
        path.name.toLowerCase().includes(selectedCategory.toLowerCase()),
      )
    : paths;

  const currentPath =
    filteredPaths.find((path) => path.id === activePath) || filteredPaths[0];

  return (
    <div className="w-full h-full bg-background p-6 rounded-lg">
      {/* Path Selection */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {filteredPaths.map((path) => (
          <Button
            key={path.id}
            variant={path.id === activePath ? "default" : "outline"}
            onClick={() => setActivePath(path.id)}
            className="whitespace-nowrap"
          >
            {path.name}
          </Button>
        ))}
      </div>

      {/* Roadmap Visualization */}
      <div className="relative w-full overflow-x-auto pb-8">
        <div className="min-w-[800px] h-[400px] flex items-center justify-center relative">
          {/* Connecting Lines */}
          <div className="absolute h-2 bg-muted w-[80%] top-1/2 transform -translate-y-1/2 z-0" />

          {/* Career Nodes */}
          <div className="flex justify-between w-[90%] z-10 relative">
            {currentPath?.nodes.map((node, index) => (
              <div key={node.id} className="flex flex-col items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        className={`relative cursor-pointer ${hoveredNode === node.id ? "z-20" : "z-10"}`}
                        whileHover={{ scale: 1.05 }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => onNodeClick(node)}
                      >
                        <Card
                          className={`w-[180px] ${hoveredNode === node.id ? "border-primary shadow-lg" : ""}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelBadgeColor(node.level)}`}
                              >
                                {node.level}
                              </span>
                              <Info
                                size={16}
                                className="text-muted-foreground"
                              />
                            </div>
                            <h3 className="font-semibold text-sm mb-2">
                              {node.title}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground mb-1">
                              <Briefcase size={12} className="mr-1" />
                              <span>{node.timeEstimate}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <DollarSign size={12} className="mr-1" />
                              <span>{node.salaryRange}</span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Node connector to next node */}
                        {index < currentPath.nodes.length - 1 && (
                          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                            <ChevronRight className="text-muted-foreground" />
                          </div>
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Skills preview (top 2) */}
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {node.skills.slice(0, 2).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-muted text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {node.skills.length > 2 && (
                    <span className="bg-muted text-xs px-2 py-1 rounded-full">
                      +{node.skills.length - 2}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Path Button (for future functionality) */}
      <div className="flex justify-center mt-4">
        <Button variant="outline" size="sm">
          <Plus size={16} className="mr-2" />
          Add Custom Path
        </Button>
      </div>
    </div>
  );
};

// Helper function to get badge color based on level
const getLevelBadgeColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case "entry":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "intermediate":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "advanced":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "expert":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export default CareerRoadmap;
