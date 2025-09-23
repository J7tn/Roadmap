import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ICareerNode } from "@/types/career";
import { getTranslatedCareerTitle, getTranslatedCareerDescription } from "@/utils/translationHelpers";

interface CareerBlockProps {
  career: ICareerNode;
  onClick?: (career: ICareerNode) => void;
  index?: number;
  className?: string;
}

const CareerBlock: React.FC<CareerBlockProps> = ({ 
  career, 
  onClick, 
  index = 0,
  className = "" 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    if (onClick) {
      // If custom onClick is provided, use it
      onClick(career);
    } else {
      // Default behavior: navigate to job details
      navigate(`/jobs/${career.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={className}
    >
      <div 
        className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-base mb-1">
              {getTranslatedCareerTitle(t, career.id, career.t || 'Unknown Career')}
            </h3>
            
            {career.d && (
              <p className="text-muted-foreground text-sm line-clamp-2">
                {getTranslatedCareerDescription(t, career.id, career.d)}
              </p>
            )}
          </div>
          
          <ChevronRight className="h-4 w-4 text-muted-foreground ml-3 flex-shrink-0 mt-0.5" />
        </div>
      </div>
    </motion.div>
  );
};

export default CareerBlock;
