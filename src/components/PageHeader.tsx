import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  title: string;
  icon: React.ReactNode;
  backTo?: string;
  backLabel?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  backTo = "/home",
  backLabel,
  badge,
  className = ""
}) => {
  const { t } = useTranslation();
  return (
    <motion.header 
      className={`border-b bg-background sticky top-0 z-50 safe-area-top ${className}`}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link 
            to={backTo} 
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{backLabel || t('common.back')}</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 text-primary">
              {icon}
            </div>
            <h1 className="text-lg md:text-xl font-bold">{title}</h1>
          </div>
        </div>
        {badge && (
          <div className="flex items-center space-x-2">
            <Badge variant={badge.variant || "secondary"} className="text-sm">
              {badge.text}
            </Badge>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default PageHeader;
