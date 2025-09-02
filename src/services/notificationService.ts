export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error" | "career" | "market" | "assessment";
  title: string;
  message: string;
  time: string;
  read: boolean;
  action: string;
  data?: any; // Additional data for the notification
  priority: "low" | "medium" | "high";
}

export interface NotificationPreferences {
  careerPaths: boolean;
  marketUpdates: boolean;
  assessmentResults: boolean;
  skillRecommendations: boolean;
  jobOpportunities: boolean;
  industryTrends: boolean;
}

const CHAT2API_BASE_URL = 'http://localhost:8000';

export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences = {
    careerPaths: true,
    marketUpdates: true,
    assessmentResults: true,
    skillRecommendations: true,
    jobOpportunities: true,
    industryTrends: true
  };

  private constructor() {
    this.loadNotifications();
    this.loadPreferences();
    this.startPeriodicUpdates();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Load notifications from localStorage
  private loadNotifications(): void {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  // Save notifications to localStorage
  private saveNotifications(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  // Load preferences from localStorage
  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem('notificationPreferences');
      if (saved) {
        this.preferences = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }

  // Save preferences to localStorage
  private savePreferences(): void {
    try {
      localStorage.setItem('notificationPreferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  }

  // Start periodic updates for real-time notifications
  private startPeriodicUpdates(): void {
    // Check for new notifications every 5 minutes
    setInterval(() => {
      this.checkForNewNotifications();
    }, 5 * 60 * 1000);

    // Initial check
    this.checkForNewNotifications();
  }

  // Check for new notifications from Chat2API
  private async checkForNewNotifications(): Promise<void> {
    try {
      // Check for market updates
      if (this.preferences.marketUpdates) {
        await this.checkMarketUpdates();
      }

      // Check for new career paths
      if (this.preferences.careerPaths) {
        await this.checkNewCareerPaths();
      }

      // Check for industry trends
      if (this.preferences.industryTrends) {
        await this.checkIndustryTrends();
      }
    } catch (error) {
      console.error('Failed to check for new notifications:', error);
    }
  }

  // Check for market updates
  private async checkMarketUpdates(): Promise<void> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/trends/market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industries: ['technology', 'healthcare', 'finance'] })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check for significant changes and create notifications
        if (data.trendingSkills && data.trendingSkills.length > 0) {
          const topSkill = data.trendingSkills[0];
          if (topSkill.growth > 20) {
            this.addNotification({
              type: 'market',
              title: 'High-Growth Skill Alert',
              message: `${topSkill.skill} is experiencing ${topSkill.growth}% growth with $${topSkill.salary.toLocaleString()} average salary`,
              action: 'explore',
              priority: 'high',
              data: { skill: topSkill.skill, growth: topSkill.growth, salary: topSkill.salary }
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to check market updates:', error);
    }
  }

  // Check for new career paths
  private async checkNewCareerPaths(): Promise<void> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/jobs/market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          industry: 'technology', 
          location: 'United States', 
          limit: 10 
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check for emerging roles
        if (data.emergingRoles && data.emergingRoles.length > 0) {
          const newRole = data.emergingRoles[0];
          this.addNotification({
            type: 'career',
            title: 'New Career Opportunity',
            message: `${newRole.title} is an emerging role with ${newRole.growth}% growth potential`,
            action: 'explore',
            priority: 'medium',
            data: { role: newRole.title, growth: newRole.growth, skills: newRole.skills }
          });
        }
      }
    } catch (error) {
      console.error('Failed to check new career paths:', error);
    }
  }

  // Check for industry trends
  private async checkIndustryTrends(): Promise<void> {
    try {
      const response = await fetch(`${CHAT2API_BASE_URL}/api/trends/market`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industries: ['technology'] })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.industryInsights && data.industryInsights.length > 0) {
          const insight = data.industryInsights[0];
          if (insight.growth > 10) {
            this.addNotification({
              type: 'market',
              title: 'Industry Growth Alert',
              message: `${insight.industry} industry shows ${insight.growth}% growth with ${insight.jobCount.toLocaleString()} active jobs`,
              action: 'view',
              priority: 'medium',
              data: { industry: insight.industry, growth: insight.growth, jobCount: insight.jobCount }
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to check industry trends:', error);
    }
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'time' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}`,
      time: 'Just now',
      read: false
    };

    this.notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.saveNotifications();
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  // Delete notification
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
  }

  // Get notification preferences
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Update notification preferences
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
  }

  // Create assessment completion notification
  createAssessmentNotification(assessmentData: any): void {
    if (!this.preferences.assessmentResults) return;

    this.addNotification({
      type: 'success',
      title: 'Skills Assessment Complete',
      message: `Your assessment shows ${assessmentData.skills.length} skills with ${assessmentData.selectedCareerGoal} career focus`,
      action: 'review',
      priority: 'medium',
      data: { assessmentId: assessmentData.id, skills: assessmentData.skills }
    });
  }

  // Create skill recommendation notification
  createSkillRecommendationNotification(skill: string, priority: string): void {
    if (!this.preferences.skillRecommendations) return;

    this.addNotification({
      type: 'info',
      title: 'Skill Development Recommendation',
      message: `${skill} is recommended as a ${priority} priority skill for your career goals`,
      action: 'learn',
      priority: priority === 'High' ? 'high' : 'medium',
      data: { skill, priority }
    });
  }

  // Create job opportunity notification
  createJobOpportunityNotification(job: any): void {
    if (!this.preferences.jobOpportunities) return;

    this.addNotification({
      type: 'career',
      title: 'New Job Opportunity',
      message: `${job.title} position available with ${job.salary} salary range`,
      action: 'apply',
      priority: 'medium',
      data: { jobId: job.id, title: job.title, company: job.company }
    });
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
  }
}
