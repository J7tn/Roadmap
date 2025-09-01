import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import CareerDetailsContent from "@/components/CareerDetailsContent";
import { getCareerNode } from "@/services/careerService";
import { ICareerNode } from "@/types/career";

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [career, setCareer] = useState<ICareerNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      const node = await getCareerNode(id);
      setCareer(node);
      setLoading(false);
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background sticky top-0 z-50">
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

      {!loading && career && (
        <div className="container mx-auto px-4 pb-12">
          <CareerDetailsContent career={career} />
        </div>
      )}
      {!loading && !career && (
        <div className="container mx-auto px-4 py-6">
          <p className="text-muted-foreground">Job not found.</p>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;


