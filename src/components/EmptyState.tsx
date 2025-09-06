import React from "react";
import { Search, Bookmark, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: "search" | "bookmark" | "target" | "file" | React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "search",
  title,
  description,
  action,
  className = ""
}) => {
  const getIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    const iconProps = { className: "h-12 w-12 text-muted-foreground" };
    
    switch (icon) {
      case "search":
        return <Search {...iconProps} />;
      case "bookmark":
        return <Bookmark {...iconProps} />;
      case "target":
        return <Target {...iconProps} />;
      case "file":
        return <FileText {...iconProps} />;
      default:
        return <Search {...iconProps} />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        {getIcon()}
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
