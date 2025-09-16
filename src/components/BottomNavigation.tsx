import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  Home,
  Search,
  Map,
  User,
  Activity,
} from "lucide-react";

interface BottomNavigationProps {
  className?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ className = "" }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`border-t bg-background/95 backdrop-blur-sm fixed bottom-0 left-0 right-0 z-50 safe-area-bottom ${className}`}>
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {/* Home Button */}
          <Link to="/home" className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              isActive('/home') 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}>
              <Home className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium text-center leading-tight px-1 truncate w-full">{t('navigation.home')}</span>
          </Link>

          {/* Search Button */}
          <Link to="/search" className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              isActive('/search') 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}>
              <Search className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium text-center leading-tight px-1 truncate w-full">{t('navigation.search')}</span>
          </Link>

          {/* Roadmap Button */}
          <Link to="/roadmap" className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              isActive('/roadmap') 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}>
              <Map className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium text-center leading-tight px-1 truncate w-full">{t('navigation.roadmap')}</span>
          </Link>

          {/* My Career Button */}
          <Link to="/my-paths" className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              isActive('/my-paths') 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}>
              <User className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium text-center leading-tight px-1 truncate w-full">{t('navigation.careerPaths')}</span>
          </Link>

          {/* Skill Assessment Button */}
          <Link to="/skills" className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              isActive('/skills') 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}>
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium text-center leading-tight px-1 truncate w-full">{t('navigation.assessment')}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
