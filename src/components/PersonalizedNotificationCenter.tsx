import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Star, 
  TrendingUp, 
  Bookmark, 
  Target, 
  Zap,
  Info,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Filter,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { PersonalizedNotification, UserCareerProfile } from '@/services/personalizedNotificationService';
import { Notification } from '@/services/notificationService';
import { personalizedNotificationService } from '@/services/personalizedNotificationService';
import { NotificationService } from '@/services/notificationService';

interface PersonalizedNotificationCenterProps {
  className?: string;
}

const PersonalizedNotificationCenter: React.FC<PersonalizedNotificationCenterProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [personalizedNotifications, setPersonalizedNotifications] = useState<PersonalizedNotification[]>([]);
  const [userProfile, setUserProfile] = useState<UserCareerProfile | null>(null);
  const [filter, setFilter] = useState<'all' | 'personalized' | 'general'>('all');
  const [showRelevance, setShowRelevance] = useState(true);

  const notificationService = NotificationService.getInstance();

  // Load notifications and user profile
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize user profile if not exists
        await personalizedNotificationService.initializeUserProfile();
        
        // Load notifications
        const allNotifications = notificationService.getNotifications();
        const personalized = personalizedNotificationService.getPersonalizedNotifications();
        const profile = personalizedNotificationService.getUserProfile();
        
        setNotifications(allNotifications);
        setPersonalizedNotifications(personalized);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to load notification data:', error);
      }
    };

    loadData();

    // Set up periodic refresh
    const interval = setInterval(loadData, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  // Get filtered notifications
  const getFilteredNotifications = useCallback(() => {
    const allNotifs = [...notifications, ...personalizedNotifications];
    
    switch (filter) {
      case 'personalized':
        return personalizedNotifications;
      case 'general':
        return notifications;
      default:
        return allNotifs.sort((a, b) => {
          // Sort personalized notifications first, then by relevance score
          const aIsPersonalized = 'relevanceScore' in a;
          const bIsPersonalized = 'relevanceScore' in b;
          
          if (aIsPersonalized && !bIsPersonalized) return -1;
          if (!aIsPersonalized && bIsPersonalized) return 1;
          
          if (aIsPersonalized && bIsPersonalized) {
            return (b as PersonalizedNotification).relevanceScore - (a as PersonalizedNotification).relevanceScore;
          }
          
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        });
    }
  }, [notifications, personalizedNotifications, filter]);

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  const handleNotificationClick = useCallback((notification: Notification | PersonalizedNotification) => {
    // Mark as read
    notificationService.markAsRead(notification.id);
    
    // Refresh notifications
    const allNotifications = notificationService.getNotifications();
    const personalized = personalizedNotificationService.getPersonalizedNotifications();
    setNotifications(allNotifications);
    setPersonalizedNotifications(personalized);

    // Handle action
    switch (notification.action) {
      case 'explore':
        // Navigate to career exploration
        window.location.href = '/search';
        break;
      case 'learn':
        // Navigate to skill development
        window.location.href = '/skills';
        break;
      case 'apply':
        // Navigate to job opportunities
        window.location.href = '/jobs';
        break;
      case 'continue':
        // Navigate to career progress
        window.location.href = '/my-career-paths';
        break;
      case 'review':
        // Navigate to assessment results
        window.location.href = '/assessment';
        break;
      default:
        break;
    }
  }, [notificationService]);

  const handleMarkAllAsRead = useCallback(() => {
    filteredNotifications.forEach(notification => {
      notificationService.markAsRead(notification.id);
    });
    
    // Refresh notifications
    const allNotifications = notificationService.getNotifications();
    const personalized = personalizedNotificationService.getPersonalizedNotifications();
    setNotifications(allNotifications);
    setPersonalizedNotifications(personalized);
  }, [filteredNotifications, notificationService]);

  const getNotificationIcon = (notification: Notification | PersonalizedNotification) => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'career':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'market':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'assessment':
        return <Zap className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getContextIcons = (context: any) => {
    const icons = [];
    if (context.basedOnBookmarks) icons.push(<Bookmark className="h-3 w-3" />);
    if (context.basedOnProgress) icons.push(<Target className="h-3 w-3" />);
    if (context.basedOnSkills) icons.push(<Zap className="h-3 w-3" />);
    if (context.basedOnIndustry) icons.push(<TrendingUp className="h-3 w-3" />);
    return icons;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 w-96 max-h-[80vh] overflow-hidden bg-white rounded-lg shadow-lg border"
            >
              {/* Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Filter Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={filter === 'all'}
                          onCheckedChange={() => setFilter('all')}
                        >
                          All Notifications
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filter === 'personalized'}
                          onCheckedChange={() => setFilter('personalized')}
                        >
                          Personalized Only
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filter === 'general'}
                          onCheckedChange={() => setFilter('general')}
                        >
                          General Only
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={showRelevance}
                          onCheckedChange={setShowRelevance}
                        >
                          Show Relevance
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mark All Read */}
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Mark All Read
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* User Profile Summary */}
              {userProfile && (
                <div className="p-3 bg-blue-50 border-b">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Personalized for you:</span>
                    <span className="text-blue-600">
                      {userProfile.preferredIndustries.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                    <p className="text-xs mt-1">
                      We'll notify you about relevant career opportunities
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => {
                      const isPersonalized = 'relevanceScore' in notification;
                      const personalizedNotif = notification as PersonalizedNotification;
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification)}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-sm leading-tight">
                                  {notification.title}
                                </h4>
                                
                                {isPersonalized && showRelevance && (
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getRelevanceColor(personalizedNotif.relevanceScore)}`}
                                  >
                                    {personalizedNotif.relevanceScore}%
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{notification.time}</span>
                                  
                                  {isPersonalized && personalizedNotif.userContext && (
                                    <div className="flex items-center gap-1">
                                      {getContextIcons(personalizedNotif.userContext).map((icon, index) => (
                                        <span key={index} className="opacity-60">
                                          {icon}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                {notification.action && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-6 px-2"
                                  >
                                    {notification.action}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/notifications'}
                    className="text-xs h-6 px-2"
                  >
                    View All
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalizedNotificationCenter;
