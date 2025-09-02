import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  BookOpen,
  Grid3X3,
  Target,
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
import { NotificationService, Notification } from "@/services/notificationService";

const HomePage = React.memo(() => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationService = NotificationService.getInstance();
   
  // Use the optimized industry browser hook
  const {
    data: careerData,
    loading,
    error,
    total
  } = useIndustryBrowser();



  // Load notifications on component mount
  useEffect(() => {
    const loadNotifications = () => {
      const notifs = notificationService.getNotifications();
      setNotifications(notifs);
    };

    loadNotifications();

    // Set up interval to refresh notifications
    const interval = setInterval(loadNotifications, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [notificationService]);

  const handleNotificationClick = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId);
    setNotifications(notificationService.getNotifications());
  }, [notificationService]);

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header - Fixed */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Career Atlas</h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search - Hidden on mobile to save space */}
            <div className="relative hidden md:block w-48">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search careers..." className="pl-8 h-9" />
            </div>
            
            {/* Notifications Button */}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">{unreadCount}</Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    <>
                      {notifications.map((notification) => (
                        <div key={notification.id} className="relative group">
                          <DropdownMenuItem
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer w-full ${
                              !notification.read ? "bg-muted" : ""
                            } ${getNotificationColor(notification.type)} border-l-4`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </DropdownMenuItem>
                        </div>
                      ))}
                      <DropdownMenuSeparator />
                      <div className="flex justify-between p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          className="text-xs"
                        >
                          Mark all as read
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setNotifications([])}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Clear all
                        </Button>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>


          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {/* Career Market Trends */}
        <div className="container mx-auto px-4 py-6">
          <RealTimeJobFeed />
        </div>
      </main>

      {/* Bottom Navigation Dashboard - Fixed */}
      <nav className="border-t bg-background sticky bottom-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {/* Home Button */}
            <Link to="/home" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Home</span>
            </Link>

            {/* Search Button */}
            <Link to="/categories" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Search</span>
            </Link>

            {/* Saved Careers Button */}
            <Link to="/my-paths" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Bookmark className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Saved</span>
            </Link>

            {/* Skill Assessment Button */}
            <Link to="/skills" className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Assessment</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;
