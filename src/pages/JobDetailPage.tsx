import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search, Target, BookOpen } from "lucide-react";
import CareerDetailsContent from "@/components/CareerDetailsContent";
import CareerTrendDisplay from "@/components/CareerTrendDisplay";
import { getAllCareerNodes } from "@/services/careerService";
import { ICareerNode, ICareerPath } from "@/types/career";
import BottomNavigation from "@/components/BottomNavigation";

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
        console.log('Loading career data for ID:', id);
        // Get all career nodes to find the path containing this node
        const allNodes = await getAllCareerNodes();
        console.log('Total nodes loaded:', allNodes.length);
        
        const nodeWithPath = allNodes.find(item => item.node.id === id);
        console.log('Found node with path:', nodeWithPath ? 'Yes' : 'No');
        
        if (nodeWithPath) {
          setCareer(nodeWithPath.node);
          setCareerPath(nodeWithPath.path);
          
          // Find the current node's index in the path
          const index = nodeWithPath.path.nodes.findIndex(node => node.id === id);
          console.log('Current index in path:', index);
          setCurrentIndex(index >= 0 ? index : 0);
        } else {
          console.error('Career not found for ID:', id);
          console.log('Available career IDs:', allNodes.map(item => item.node.id).slice(0, 10));
          
          // Try to find a similar career or show error
          setCareer(null);
          setCareerPath(null);
        }
      } catch (error) {
        console.error('Failed to load career data:', error);
        setCareer(null);
        setCareerPath(null);
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
            <h1 className="text-xl font-bold leading-none">Job Details</h1>
          </div>
        </div>
      </header>

      {loading && (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading career details...</p>
          </div>
        </div>
      )}
      
      {!loading && career && careerPath && (
        <div className="container mx-auto px-4 pb-12 space-y-6">
          <CareerDetailsContent 
            career={career} 
            careerPath={careerPath}
            currentIndex={currentIndex}
            onNavigate={(newIndex) => {
              console.log('Navigating to index:', newIndex);
              if (careerPath.nodes[newIndex]) {
                const nextCareerId = careerPath.nodes[newIndex].id;
                console.log('Navigating to career ID:', nextCareerId);
                navigate(`/jobs/${nextCareerId}`);
              } else {
                console.error('No career found at index:', newIndex);
              }
            }}
            onCareerClick={(careerId) => {
              console.log('JobDetailPage - Navigating to career:', careerId);
              console.log('JobDetailPage - Current URL:', window.location.href);
              navigate(`/jobs/${careerId}`);
            }}
          />
          
          {/* Career Trend Display */}
          <CareerTrendDisplay career={career} showIndustryTrend={true} />
        </div>
      )}
      
      {!loading && !career && (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Career Not Found</h2>
            <p className="text-muted-foreground mb-4">The career you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/search')}>
              Back to Search
            </Button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default JobDetailPage;


