import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  X,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

const HomePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      title: "New Career Path Available",
      message: "Data Science career path has been updated with new skills and requirements",
      time: "2 hours ago",
      read: false,
      action: "view"
    },
    {
      id: 2,
      type: "success",
      title: "Skills Assessment Complete",
      message: "Your recent skills assessment shows 15% improvement in technical skills",
      time: "4 hours ago",
      read: false,
      action: "review"
    },
    {
      id: 3,
      type: "warning",
      title: "Career Transition Opportunity",
      message: "Based on your profile, you might be interested in AI Engineering roles",
      time: "6 hours ago",
      read: false,
      action: "explore"
    },
    {
      id: 4,
      type: "info",
      title: "Market Update",
      message: "Software Engineering salaries have increased by 12% in your region",
      time: "1 day ago",
      read: true,
      action: "details"
    }
  ]);
  
  // Use the optimized industry browser hook
  const {
    data: careerData,
    loading,
    error,
    total
  } = useIndustryBrowser();

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const addNotification = (notification: Omit<typeof notifications[0], 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Simulate real-time notifications (for demo purposes)
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add notifications to simulate real-time updates
      if (Math.random() < 0.1) { // 10% chance every interval
        const notificationTypes = [
          {
            type: "success" as const,
            title: "Career Path Updated",
            message: "Your selected career path has new information available",
            action: "view"
          },
          {
            type: "warning" as const,
            title: "Skills Gap Detected",
            message: "New skills are required for your target role",
            action: "assess"
          },
          {
            type: "info" as const,
            title: "Market Alert",
            message: "New job opportunities in your field",
            action: "explore"
          }
        ];
        
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        addNotification(randomNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <Check className="h-4 w-4 text-green-600" />;
      case "warning": return <Star className="h-4 w-4 text-yellow-600" />;
      case "error": return <X className="h-4 w-4 text-red-600" />;
      default: return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "border-l-green-500";
      case "warning": return "border-l-yellow-500";
      case "error": return "border-l-red-500";
      default: return "border-l-blue-500";
    }
  };

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => addNotification({
                  type: "info",
                  title: "Demo Notification",
                  message: "This is a test notification to demonstrate the system",
                  action: "demo"
                })}
                className="text-xs h-8 px-2"
              >
                Test
              </Button>
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

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-6">
                    <MapPin className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Career Atlas</h2>
                  </div>
                  
                  {/* Mobile Search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search careers..." className="pl-10 h-11" />
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <nav className="flex-1">
                    <div className="space-y-2">
                      <Link 
                        to="/categories" 
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={handleMobileMenuClose}
                      >
                        <Grid3X3 className="h-5 w-5" />
                        <span className="font-medium">Browse Categories</span>
                      </Link>
                      <Link 
                        to="/my-paths" 
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={handleMobileMenuClose}
                      >
                        <Target className="h-5 w-5" />
                        <span className="font-medium">My Career Paths</span>
                      </Link>
                      <Link 
                        to="/about" 
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={handleMobileMenuClose}
                      >
                        <User className="h-5 w-5" />
                        <span className="font-medium">About</span>
                      </Link>
                    </div>
                  </nav>
                  
                  {/* Mobile Footer */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      All data saved locally on your device
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {/* Content Navigation Tabs */}
        <div className="border-b bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 overflow-x-auto">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Customize</span>
              </Button>
              <Button variant="ghost" size="sm" className="border-b-2 border-primary text-primary">
                For You
              </Button>
              <Button variant="ghost" size="sm">
                Following
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                Featured
                <Badge variant="secondary" className="text-xs">New</Badge>
              </Button>
              <Button variant="ghost" size="sm">
                Discover
              </Button>
            </div>
          </div>
        </div>

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
};

export default HomePage;
