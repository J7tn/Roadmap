import React, { useState, memo, useMemo, useCallback } from "react";
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
  Loader2,
} from "lucide-react";
import { ICareerPath, ICareerNode, CareerLevel } from "@/types/career";
import { useCareerData } from "@/hooks/useCareerData";

interface CareerRoadmapProps {
  selectedCategory?: string;
  onNodeClick?: (node: ICareerNode) => void;
  pathId?: string;
}

const CareerRoadmap: React.FC<CareerRoadmapProps> = memo(({
  selectedCategory,
  onNodeClick = () => {},
  pathId = "software-development",
}) => {
  const { useCareerPath } = useCareerData();
  const { data: careerPath, loading, error, refetch } = useCareerPath(pathId);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Memoize the career path data to prevent unnecessary re-renders
  const memoizedCareerPath = useMemo(() => careerPath, [careerPath]);

  // Handle node click with callback
  const handleNodeClick = useCallback((node: ICareerNode) => {
    onNodeClick(node);
  }, [onNodeClick]);

  // Helper function to get badge color based on level
  const getLevelBadgeColor = useCallback((level: CareerLevel): string => {
    switch (level) {
      case 'E':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'I':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'A':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'X':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }, []);

  // Helper function to get level display name
  const getLevelDisplayName = useCallback((level: CareerLevel): string => {
    switch (level) {
      case 'E': return 'Entry';
      case 'I': return 'Intermediate';
      case 'A': return 'Advanced';
      case 'X': return 'Expert';
      default: return 'Unknown';
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full bg-background p-6 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading career path...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-full bg-background p-6 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-destructive">Failed to load career path</p>
          <Button onClick={refetch} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // No data state
  if (!memoizedCareerPath || !memoizedCareerPath.nodes.length) {
    return (
      <div className="w-full h-full bg-background p-6 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <p className="text-muted-foreground">No career path data available</p>
          <Button onClick={refetch} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background p-6 rounded-lg">
      {/* Career Path Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{memoizedCareerPath.n}</h2>
        <p className="text-muted-foreground">
          {memoizedCareerPath.nodes.length} career stages • {selectedCategory} industry
        </p>
      </div>

      {/* Roadmap Visualization */}
      <div className="relative w-full overflow-x-auto pb-8">
        <div className="min-w-[800px] h-[400px] flex items-center justify-center relative">
          {/* Connecting Lines */}
          <div className="absolute h-2 bg-muted w-[80%] top-1/2 transform -translate-y-1/2 z-0" />

          {/* Career Nodes */}
          <div className="flex justify-between w-[90%] z-10 relative">
            {memoizedCareerPath.nodes.map((node, index) => (
              <div key={node.id} className="flex flex-col items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        className={`relative cursor-pointer ${hoveredNode === node.id ? "z-20" : "z-10"}`}
                        whileHover={{ scale: 1.05 }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => handleNodeClick(node)}
                      >
                        <Card
                          className={`w-[180px] ${hoveredNode === node.id ? "border-primary shadow-lg" : ""}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelBadgeColor(node.l)}`}
                              >
                                {getLevelDisplayName(node.l)}
                              </span>
                              <Info
                                size={16}
                                className="text-muted-foreground"
                              />
                            </div>
                            <h3 className="font-semibold text-sm mb-2">
                              {node.t}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground mb-1">
                              <Briefcase size={12} className="mr-1" />
                              <span>{node.te}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <DollarSign size={12} className="mr-1" />
                              <span>{node.sr}</span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Node connector to next node */}
                        {index < memoizedCareerPath.nodes.length - 1 && (
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
                  {node.s.slice(0, 2).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-muted text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {node.s.length > 2 && (
                    <span className="bg-muted text-xs px-2 py-1 rounded-full">
                      +{node.s.length - 2}
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
});

CareerRoadmap.displayName = "CareerRoadmap";

export default CareerRoadmap;
