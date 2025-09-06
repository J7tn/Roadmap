import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try Again",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground text-center max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
