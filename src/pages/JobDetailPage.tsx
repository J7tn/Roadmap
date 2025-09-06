import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search, Target, BookOpen } from "lucide-react";
import CareerDetailsContent from "@/components/CareerDetailsContent";
import { getAllCareerNodes } from "@/services/careerService";
import { ICareerNode, ICareerPath } from "@/types/career";

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [career, setCareer] = useState<ICareerNode | null>(null);
  const [careerPath, setCareerPath] = useState<ICareerPath | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      
      try {
        // Get all career nodes to find the path containing this node
        const allNodes = await getAllCareerNodes();
        const nodeWithPath = allNodes.find(item => item.node.id === id);
        
        if (nodeWithPath) {
          setCareer(nodeWithPath.node);
          setCareerPath(nodeWithPath.path);
          
          // Find the current node's index in the path
          const index = nodeWithPath.path.nodes.findIndex(node => node.id === id);
          setCurrentIndex(index);
        }
      } catch (error) {
        console.error('Failed to load career data:', error);
      }
      
      setLoading(false);
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50 safe-area-top">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Job Details</h1>
          </div>
        </div>
      </header>

      {!loading && career && careerPath && (
        <div className="container mx-auto px-4 pb-12">
          <CareerDetailsContent 
            career={career} 
            careerPath={careerPath}
            currentIndex={currentIndex}
            onNavigate={(newIndex) => {
              if (careerPath.nodes[newIndex]) {
                navigate(`/job/${careerPath.nodes[newIndex].id}`);
              }
            }}
          />
        </div>
      )}
      {!loading && !career && (
        <div className="container mx-auto px-4 py-6">
          <p className="text-muted-foreground">Job not found.</p>
        </div>
      )}

      {/* Bottom Navigation Dashboard - Fixed */}
      <nav className="border-t bg-background sticky bottom-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {/* Home Button */}
            <Link to="/home" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Home</span>
            </Link>

            {/* Search Button */}
            <Link to="/categories" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Search</span>
            </Link>

            {/* Saved Careers Button */}
            <Link to="/my-paths" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Target className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">My Career</span>
            </Link>

            {/* Skill Assessment Button */}
            <Link to="/skills" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Assessment</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default JobDetailPage;


