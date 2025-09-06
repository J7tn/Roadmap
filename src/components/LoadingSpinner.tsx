import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {message && (
        <p className="text-muted-foreground text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
