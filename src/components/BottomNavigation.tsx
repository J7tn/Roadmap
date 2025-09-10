import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Map,
  Target,
  Activity,
} from "lucide-react";

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = "" }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`border-t bg-background/95 backdrop-blur-sm fixed bottom-0 left-0 right-0 z-50 safe-area-bottom ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {/* Home Button */}
          <Link to="/home" className="flex flex-col items-center space-y-1">
            <div className={`p-2 rounded-lg transition-colors ${
              isActive('/home') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}>
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Search Button */}
          <Link to="/search" className="flex flex-col items-center space-y-1">
            <div className={`p-2 rounded-lg transition-colors ${
              isActive('/search') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}>
              <Search className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Search</span>
          </Link>

          {/* Roadmap Button */}
          <Link to="/roadmap" className="flex flex-col items-center space-y-1">
            <div className={`p-2 rounded-lg transition-colors ${
              isActive('/roadmap') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}>
              <Map className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Roadmap</span>
          </Link>

          {/* My Career Button */}
          <Link to="/my-paths" className="flex flex-col items-center space-y-1">
            <div className={`p-2 rounded-lg transition-colors ${
              isActive('/my-paths') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}>
              <Target className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Profile</span>
          </Link>

          {/* Skill Assessment Button */}
          <Link to="/skills" className="flex flex-col items-center space-y-1">
            <div className={`p-2 rounded-lg transition-colors ${
              isActive('/skills') 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}>
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Assessment</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
