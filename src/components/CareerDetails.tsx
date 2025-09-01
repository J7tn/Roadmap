import React, { memo } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ICareerNode } from "@/types/career";
import CareerDetailsContent from "./CareerDetailsContent";

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
          <div className="flex items-center justify-end mb-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CareerDetailsContent career={career} />
        </div>
      </motion.div>
    </div>
  );
});

CareerDetails.displayName = "CareerDetails";

export default CareerDetails;
