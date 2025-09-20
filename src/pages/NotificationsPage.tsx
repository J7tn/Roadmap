import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  Settings,
  ArrowLeft,
  Trash2,
  Eye,
  EyeOff
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
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [personalizedNotifications, setPersonalizedNotifications] = useState<PersonalizedNotification[]>([]);
  const [userProfile, setUserProfile] = useState<UserCareerProfile | null>(null);
  const [filter, setFilter] = useState<'all' | 'personalized' | 'general'>('all');
  const [showRelevance, setShowRelevance] = useState(true);
  const [showRead, setShowRead] = useState(true);

  const notificationService = NotificationService.getInstance();

  // Load notifications and user profile
  useEffect(() => {
    const loadData = async () => {
      try {
        // Set translation function for the service
        personalizedNotificationService.setTranslationFunction(t);
        
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
    const interval = setInterval(loadData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Get filtered notifications
  const getFilteredNotifications = useCallback(() => {
    const allNotifs = [...notifications, ...personalizedNotifications];
    
    let filtered = allNotifs;
    
    // Filter by type
    switch (filter) {
      case 'personalized':
        filtered = personalizedNotifications;
        break;
      case 'general':
        filtered = notifications;
        break;
      default:
        filtered = allNotifs;
    }
    
    // Filter by read status
    if (!showRead) {
      filtered = filtered.filter(n => !n.read);
    }
    
    // Sort notifications
    return filtered.sort((a, b) => {
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
  }, [notifications, personalizedNotifications, filter, showRead]);

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
    const isPersonalized = 'careerData' in notification;
    const personalizedNotif = notification as PersonalizedNotification;
    
    switch (notification.action) {
      case 'explore':
        // Navigate to career exploration or specific career details
        if (isPersonalized && personalizedNotif.careerData?.careerId) {
          navigate(`/jobs/${personalizedNotif.careerData.careerId}`);
        } else {
          navigate('/search');
        }
        break;
      case 'learn':
        // Navigate to skill development
        navigate('/skills');
        break;
      case 'apply':
        // Navigate to job opportunities or specific career details
        if (isPersonalized && personalizedNotif.careerData?.careerId) {
          navigate(`/jobs/${personalizedNotif.careerData.careerId}`);
        } else {
          navigate('/jobs');
        }
        break;
      case 'continue':
        // Navigate to career progress
        navigate('/my-paths');
        break;
      case 'review':
        // Navigate to assessment results
        navigate('/skills');
        break;
      default:
        // If it's a career-related notification without specific action, go to career details
        if (isPersonalized && personalizedNotif.careerData?.careerId) {
          navigate(`/jobs/${personalizedNotif.careerData.careerId}`);
        }
        break;
    }
  }, [notificationService, navigate]);

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

  const handleDeleteNotification = useCallback((id: string) => {
    notificationService.deleteNotification(id);
    
    // Refresh notifications
    const allNotifications = notificationService.getNotifications();
    const personalized = personalizedNotificationService.getPersonalizedNotifications();
    setNotifications(allNotifications);
    setPersonalizedNotifications(personalized);
  }, [notificationService]);

  const getNotificationIcon = (notification: Notification | PersonalizedNotification) => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'career':
        return <Target className="h-5 w-5 text-blue-500" />;
      case 'market':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'assessment':
        return <Zap className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
    return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b" style={{ touchAction: 'none' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-foreground border-border hover:bg-accent">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('notifications.filter')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                <DropdownMenuLabel className="text-foreground">{t('notifications.filter')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filter === 'all'}
                  onCheckedChange={() => setFilter('all')}
                  className="text-foreground"
                >
                  {t('notifications.allNotifications')}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filter === 'personalized'}
                  onCheckedChange={() => setFilter('personalized')}
                  className="text-foreground"
                >
                  {t('notifications.personalizedNotifications')} Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filter === 'general'}
                  onCheckedChange={() => setFilter('general')}
                  className="text-foreground"
                >
                  {t('notifications.generalNotifications')} Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showRelevance}
                  onCheckedChange={setShowRelevance}
                  className="text-foreground"
                >
                  Show Relevance
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showRead}
                  onCheckedChange={setShowRead}
                  className="text-foreground"
                >
                  Show Read
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mark All Read */}
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-foreground border-border"
              >
                <Check className="h-4 w-4 mr-2" />
                {t('notifications.markAllRead')}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* User Profile Summary */}
      {userProfile && (
        <div className="bg-primary/5 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{t('notifications.personalizedForYou')}</span>
              <span className="text-primary">
                {userProfile.preferredIndustries.slice(0, 2).join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <main className="container mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'personalized' 
                  ? t('notifications.personalizedDescription')
                  : t('notifications.allCaughtUp')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const isPersonalized = 'relevanceScore' in notification;
              const personalizedNotif = notification as PersonalizedNotification;
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className=""
                >
                  <Card className={`transition-all duration-200 ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-card'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {getNotificationIcon(notification)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-foreground leading-tight">
                              {notification.title}
                            </h4>
                            
                            <div className="flex items-center gap-2">
                              {isPersonalized && showRelevance && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getRelevanceColor(personalizedNotif.relevanceScore)}`}
                                >
                                  {personalizedNotif.relevanceScore}%
                                </Badge>
                              )}
                              
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-3 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                            
                            <div className="flex items-center gap-2">
                              {notification.action && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleNotificationClick(notification)}
                                  className="text-xs h-7 px-3 text-foreground border-border"
                                >
                                  {notification.action}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="h-7 w-7 p-0 text-muted-foreground"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default NotificationsPage;
