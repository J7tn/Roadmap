import React, { useCallback } from "react";
import CareerSearch from "@/components/CareerSearch";
import { ICareerNode } from "@/types/career";
import { useNavigate } from "react-router-dom";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCareerSelect = useCallback((career: ICareerNode) => {
    navigate(`/jobs/${career.id}`);
  }, [navigate]);

  const handleClose = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CareerSearch onCareerSelect={handleCareerSelect} onClose={handleClose} />
    </div>
  );
};

export default SearchPage;


