import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SplashScreen } from '@capacitor/splash-screen';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  Search,
  MapPin,
  TrendingUp,
  Users,
  BarChart3,
  Star,
  Clock,
  ArrowRight,
  Home,
  FolderOpen,
  User,
  Settings,
  Bell,
  TrendingDown,
  DollarSign,
  Briefcase,
  Heart,
  Zap,
  Award,
  ChevronRight,
  Plus,
  Bookmark,
  Activity,
  Share,
  Shield,
  Check,
  Trash2,
  X,
  Target,
  Map,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

import { useIndustryBrowser } from "@/hooks/useCareerData";
import RealTimeJobFeed from "./RealTimeJobFeed";
import ErrorBoundary from "./ErrorBoundary";
import { NotificationService, Notification } from "@/services/notificationService";
import PersonalizedNotificationCenter from "@/components/PersonalizedNotificationCenter";
import LoadingStateService from "@/services/loadingStateService";
import BottomNavigation from "@/components/BottomNavigation";

const HomePage = React.memo(() => {
  // Temporarily simplified for debugging
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAnyComponentLoading, setIsAnyComponentLoading] = useState(true);
  const notificationService = NotificationService.getInstance();
  const loadingStateService = LoadingStateService.getInstance();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
   
  const {
    data: careerData,
    loading,
    error,
    total
  } = useIndustryBrowser();

  // Update loading state for career data
  useEffect(() => {
    loadingStateService.setLoading('careerData', loading);
  }, [loading]);

  // Subscribe to overall loading state changes
  useEffect(() => {
    const unsubscribe = loadingStateService.subscribe((isLoading) => {
      setIsAnyComponentLoading(isLoading);
    });

    return unsubscribe;
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Home component - careerData:', careerData);
    console.log('Home component - loading:', loading);
    console.log('Home component - error:', error);
    console.log('Home component - isAnyComponentLoading:', isAnyComponentLoading);
  }, [careerData, loading, error, isAnyComponentLoading]);

  // Hide splash screen only after ALL components load
  useEffect(() => {
    const hideSplashWhenReady = async () => {
      // Wait for ALL components to finish loading
      if (!isAnyComponentLoading && (careerData || error)) {
        console.log('🎉 All components loaded, hiding splash screen');
        // Add a small delay to ensure smooth transition
        setTimeout(async () => {
          try {
            // Import and use the splash screen service
            const { splashScreenService } = await import('../main');
            await splashScreenService.hide();
            
            // Show app content after splash screen is hidden
            const appContent = document.getElementById('app-content');
            if (appContent) {
              appContent.classList.add('loaded');
            }
          } catch (err) {
            console.warn('⚠️ Failed to hide splash screen:', err);
            // Show app content even if splash screen hide fails
            const appContent = document.getElementById('app-content');
            if (appContent) {
              appContent.classList.add('loaded');
            }
          }
        }, 500); // Increased delay for smoother transition
      }
    };

    hideSplashWhenReady();
  }, [isAnyComponentLoading, careerData, error]);




  useEffect(() => {
    const loadNotifications = () => {
      loadingStateService.setLoading('notifications', true);
      const notifs = notificationService.getNotifications();
      setNotifications(notifs);
      loadingStateService.setLoading('notifications', false);
    };

    loadNotifications();

    // Set up interval to refresh notifications
    const interval = setInterval(loadNotifications, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [notificationService]);

  const handleNotificationClick = useCallback((notificationId: string) => {
    const notification = notificationService.getNotifications().find(n => n.id === notificationId);
    if (!notification) return;

    // Mark as read first
    notificationService.markAsRead(notificationId);
    setNotifications(notificationService.getNotifications());

    // Handle the action based on notification type and action
    switch (notification.action) {
      case 'explore':
        if (notification.data?.skill) {
          // Navigate to jobs page with skill search
          navigate(`/jobs?search=${encodeURIComponent(notification.data.skill)}`);
        } else if (notification.data?.role) {
          // Navigate to jobs page with role search
          navigate(`/jobs?search=${encodeURIComponent(notification.data.role)}`);
        } else {
          // Default to jobs page
          navigate('/jobs');
        }
        break;
      
      case 'view':
        if (notification.data?.industry) {
          // Import the mapping function and navigate to search page with industry filter
          import('@/utils/industryMapping').then(({ getIndustryIdFromName }) => {
            const industryId = getIndustryIdFromName(notification.data.industry);
            navigate(`/search?industry=${encodeURIComponent(industryId)}`);
          });
        } else {
          navigate('/search');
        }
        break;
      
      case 'review':
        // Navigate to skills assessment page
        navigate('/skills');
        break;
      
      case 'learn':
        if (notification.data?.skill) {
          // Navigate to jobs page with skill search for learning opportunities
          navigate(`/jobs?search=${encodeURIComponent(notification.data.skill)}`);
        } else {
          navigate('/skills');
        }
        break;
      
      case 'apply':
        if (notification.data?.jobId) {
          // Navigate to specific job detail page
          navigate(`/jobs/${notification.data.jobId}`);
        } else {
          navigate('/jobs');
        }
        break;
      
      default:
        // Default action - just mark as read (already done above)
        break;
    }
  }, [notificationService, navigate]);

  const handleMarkAllAsRead = useCallback(() => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getNotifications());
  }, [notificationService]);

  const handleDeleteNotification = useCallback((notificationId: string) => {
    notificationService.deleteNotification(notificationId);
    setNotifications(notificationService.getNotifications());
  }, [notificationService]);

  // Memoize expensive calculations
  const unreadCount = useMemo(() => 
    notificationService.getUnreadCount(), 
    [notificationService, notifications]
  );

  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case "success": return <Check className="h-4 w-4 text-green-600" />;
      case "warning": return <Star className="h-4 w-4 text-yellow-600" />;
      case "error": return <X className="h-4 w-4 text-red-600" />;
      case "career": return <Briefcase className="h-4 w-4 text-blue-600" />;
      case "market": return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case "assessment": return <Target className="h-4 w-4 text-orange-600" />;
      default: return <Bell className="h-4 w-4 text-blue-600" />;
    }
  }, []);

  const getNotificationColor = useCallback((type: string) => {
    switch (type) {
      case "success": return "border-l-green-500";
      case "warning": return "border-l-yellow-500";
      case "error": return "border-l-red-500";
      case "career": return "border-l-blue-500";
      case "market": return "border-l-purple-500";
      case "assessment": return "border-l-orange-500";
      default: return "border-l-blue-500";
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Top Header - Fixed with proper status bar spacing */}
      <header className="border-b bg-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 safe-area-top" style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src={isDarkMode ? "/logo small dark mode 64x64.png" : "/logo-small.png"} 
              alt={t('app.logoAlt')} 
              className="h-8 w-8"
              onError={(e) => {
                // Fallback to icon if logo not found
                e.currentTarget.style.display = 'none';
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
              }}
            />
            <MapPin className="h-6 w-6 text-primary" style={{ display: 'none' }} />
            <h1 className="text-xl font-bold">{t('app.name')}</h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search - Hidden on mobile to save space */}
            <div className="relative hidden md:block w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('search.placeholder')} className="pl-8 h-9" />
            </div>
            
            {/* Notifications and Settings Buttons */}
            <div className="flex items-center space-x-2">
              {/* Settings Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/settings')}
                className="relative"
                title={t('navigation.settings')}
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              {/* Personalized Notifications */}
              <PersonalizedNotificationCenter />
            </div>


          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto main-content-with-header" style={{ touchAction: 'pan-y' }}>
        {/* Career Market Trends */}
        <div className="container mx-auto px-4 py-6">
          {/* Debug Info */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold">{t('errors.errorLoadingData')}</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {loading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-600">{t('common.loading')}</p>
            </div>
          )}



          {/* Temporarily disabled for debugging */}
          <ErrorBoundary fallback={<div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">{t('errors.genericError')}</h3>
            <p className="text-muted-foreground mb-4">{t('errors.serverError')}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>}>
            <RealTimeJobFeed />
          </ErrorBoundary>

        </div>
      </main>

      <BottomNavigation />
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
