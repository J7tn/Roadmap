import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, MapPin, Briefcase, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllCareerNodes } from "@/services/careerService";
import { ICareerNode, CareerLevel, ICareerPath } from "@/types/career";

const getLevelBadgeColor = (level: CareerLevel): string => {
  switch (level) {
    case 'E': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case 'I': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case 'A': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case 'X': return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getLevelDisplayName = (level: CareerLevel): string => {
  switch (level) {
    case 'E': return 'Entry';
    case 'I': return 'Intermediate';
    case 'A': return 'Advanced';
    case 'X': return 'Expert';
    default: return 'Unknown';
  }
};

const AllJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Array<{ node: ICareerNode; path: ICareerPath }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const nodes = await getAllCareerNodes();
      setItems(nodes);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">All Jobs</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {!loading && `${items.length} jobs available`}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading jobs...</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-3">
            {items.map(({ node, path }) => (
              <motion.div
                key={`${path.id}-${node.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigate(`/jobs/${node.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{node.t}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getLevelBadgeColor(node.l)}`}
                          >
                            {getLevelDisplayName(node.l)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {node.d}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{node.sr}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{node.te}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{path.cat}</span>
                          </div>
                        </div>
                      </div>
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllJobsPage;


