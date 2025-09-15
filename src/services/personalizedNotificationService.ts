import { NotificationService, Notification, NotificationPreferences } from './notificationService';
import { bookmarkService, BookmarkedCareer } from './bookmarkService';
import { careerPathProgressService, CareerPathProgress } from './careerPathProgressService';
import { supabaseCareerService } from './supabaseCareerService';
import { ICareerNode, IndustryCategory } from '@/types/career';
import { supabase } from '@/lib/supabase';

export interface UserCareerProfile {
  userId: string;
  preferredIndustries: IndustryCategory[];
  experienceLevel: 'E' | 'I' | 'A' | 'X';
  currentSkills: string[];
  careerGoals: string[];
  location?: string;
  salaryExpectations?: {
    min: number;
    max: number;
  };
  workPreferences: {
    remote: boolean;
    hybrid: boolean;
    onSite: boolean;
  };
  lastUpdated: string;
}

export interface PersonalizedNotification extends Notification {
  relevanceScore: number; // 0-100, how relevant this is to the user
  userContext: {
    basedOnBookmarks: boolean;
    basedOnProgress: boolean;
    basedOnSkills: boolean;
    basedOnIndustry: boolean;
  };
  careerData?: {
    careerId: string;
    careerTitle: string;
    industry: string;
    skills: string[];
  };
}

export interface CareerTrendAlert {
  careerId: string;
  careerTitle: string;
  trendType: 'growth' | 'salary' | 'demand' | 'skills' | 'opportunities';
  change: number; // percentage change
  message: string;
  priority: 'low' | 'medium' | 'high';
  data: any;
}

class PersonalizedNotificationService {
  private static instance: PersonalizedNotificationService;
  private notificationService: NotificationService;
  private userProfile: UserCareerProfile | null = null;
  private readonly STORAGE_KEY = 'careering_user_profile';
  private readonly PROFILE_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly NOTIFICATION_HISTORY_KEY = 'careering_notification_history';
  private readonly DUPLICATE_CHECK_HOURS = 24; // Don't show same notification for 24 hours
  private notificationHistory: Map<string, number> = new Map(); // notification hash -> timestamp

  private constructor() {
    this.notificationService = NotificationService.getInstance();
    this.loadUserProfile();
    this.loadNotificationHistory();
    this.startPersonalizedUpdates();
  }

  static getInstance(): PersonalizedNotificationService {
    if (!PersonalizedNotificationService.instance) {
      PersonalizedNotificationService.instance = new PersonalizedNotificationService();
    }
    return PersonalizedNotificationService.instance;
  }

  // Load user profile from localStorage
  private loadUserProfile(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.userProfile = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  // Save user profile to localStorage
  private saveUserProfile(): void {
    if (this.userProfile) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.userProfile));
      } catch (error) {
        console.error('Failed to save user profile:', error);
      }
    }
  }

  // Load notification history from localStorage
  private loadNotificationHistory(): void {
    try {
      const saved = localStorage.getItem(this.NOTIFICATION_HISTORY_KEY);
      if (saved) {
        const history = JSON.parse(saved);
        this.notificationHistory = new Map(Object.entries(history));
      }
    } catch (error) {
      console.error('Failed to load notification history:', error);
    }
  }

  // Save notification history to localStorage
  private saveNotificationHistory(): void {
    try {
      const history = Object.fromEntries(this.notificationHistory);
      localStorage.setItem(this.NOTIFICATION_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save notification history:', error);
    }
  }

  // Generate a hash for notification content to detect duplicates
  private generateNotificationHash(notification: Omit<PersonalizedNotification, 'id' | 'time' | 'read'>): string {
    const content = {
      type: notification.type,
      title: notification.title,
      message: notification.message,
      careerId: notification.careerData?.careerId,
      trendType: notification.data?.trendType,
      skill: notification.data?.skill,
      industry: notification.data?.industry
    };
    
    return btoa(JSON.stringify(content)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  // Check if notification is a duplicate
  private isDuplicateNotification(notification: Omit<PersonalizedNotification, 'id' | 'time' | 'read'>): boolean {
    const hash = this.generateNotificationHash(notification);
    const lastShown = this.notificationHistory.get(hash);
    
    if (!lastShown) {
      return false;
    }
    
    const hoursSinceLastShown = (Date.now() - lastShown) / (1000 * 60 * 60);
    return hoursSinceLastShown < this.DUPLICATE_CHECK_HOURS;
  }

  // Record notification in history
  private recordNotification(notification: Omit<PersonalizedNotification, 'id' | 'time' | 'read'>): void {
    const hash = this.generateNotificationHash(notification);
    this.notificationHistory.set(hash, Date.now());
    
    // Clean up old entries (older than 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    for (const [key, timestamp] of this.notificationHistory.entries()) {
      if (timestamp < sevenDaysAgo) {
        this.notificationHistory.delete(key);
      }
    }
    
    this.saveNotificationHistory();
  }

  // Initialize or update user profile based on current app usage
  async initializeUserProfile(userId: string = 'default_user'): Promise<void> {
    const bookmarks = bookmarkService.getAllBookmarks();
    const progress = careerPathProgressService.getAllProgress();
    
    // Analyze user's career interests from bookmarks and progress
    const industries = this.extractIndustriesFromData(bookmarks, progress);
    const skills = this.extractSkillsFromData(bookmarks, progress);
    const experienceLevel = this.determineExperienceLevel(bookmarks, progress);
    const careerGoals = this.extractCareerGoals(bookmarks, progress);

    this.userProfile = {
      userId,
      preferredIndustries: industries,
      experienceLevel,
      currentSkills: skills,
      careerGoals,
      workPreferences: {
        remote: true,
        hybrid: true,
        onSite: false
      },
      lastUpdated: new Date().toISOString()
    };

    this.saveUserProfile();
    console.log('User profile initialized:', this.userProfile);
  }

  // Extract industries from user's bookmarks and progress
  private extractIndustriesFromData(bookmarks: BookmarkedCareer[], progress: CareerPathProgress[]): IndustryCategory[] {
    const industryCount = new Map<string, number>();
    
    // Count industries from bookmarks
    bookmarks.forEach(bookmark => {
      const industry = bookmark.category;
      industryCount.set(industry, (industryCount.get(industry) || 0) + 1);
    });

    // Count industries from progress
    progress.forEach(p => {
      const industry = p.pathCategory;
      industryCount.set(industry, (industryCount.get(industry) || 0) + 1);
    });

    // Return top 3 industries
    return Array.from(industryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([industry]) => industry as IndustryCategory);
  }

  // Extract skills from user's bookmarks and progress
  private extractSkillsFromData(bookmarks: BookmarkedCareer[], progress: CareerPathProgress[]): string[] {
    const skillCount = new Map<string, number>();
    
    // Count skills from bookmarks
    bookmarks.forEach(bookmark => {
      bookmark.skills.forEach(skill => {
        skillCount.set(skill, (skillCount.get(skill) || 0) + 1);
      });
    });

    // Return top 10 skills
    return Array.from(skillCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill);
  }

  // Determine experience level based on user's career choices
  private determineExperienceLevel(bookmarks: BookmarkedCareer[], progress: CareerPathProgress[]): 'E' | 'I' | 'A' | 'X' {
    const levelCount = new Map<string, number>();
    
    // Count levels from bookmarks
    bookmarks.forEach(bookmark => {
      levelCount.set(bookmark.level, (levelCount.get(bookmark.level) || 0) + 1);
    });

    // Return most common level, default to Intermediate
    const mostCommon = Array.from(levelCount.entries())
      .sort((a, b) => b[1] - a[1])[0];
    
    return (mostCommon?.[0] as 'E' | 'I' | 'A' | 'X') || 'I';
  }

  // Extract career goals from user's data
  private extractCareerGoals(bookmarks: BookmarkedCareer[], progress: CareerPathProgress[]): string[] {
    const goals = new Set<string>();
    
    // Add career titles as goals
    bookmarks.forEach(bookmark => {
      goals.add(bookmark.title);
    });

    progress.forEach(p => {
      if (p.currentCareerId) goals.add(p.currentCareerId);
    });

    return Array.from(goals).slice(0, 5);
  }

  // Start personalized notification updates
  private startPersonalizedUpdates(): void {
    // Check for personalized notifications every 2 hours
    setInterval(() => {
      this.checkPersonalizedNotifications();
    }, 2 * 60 * 60 * 1000);

    // Initial check
    setTimeout(() => {
      this.checkPersonalizedNotifications();
    }, 5000); // Wait 5 seconds after initialization
  }

  // Check for personalized notifications
  private async checkPersonalizedNotifications(): Promise<void> {
    if (!this.userProfile) {
      await this.initializeUserProfile();
    }

    if (!this.userProfile) return;

    try {
      // Check for career trend updates
      await this.checkCareerTrendUpdates();
      
      // Check for skill development opportunities
      await this.checkSkillDevelopmentOpportunities();
      
      // Check for job opportunities
      await this.checkJobOpportunities();
      
      // Check for career progress milestones
      await this.checkCareerProgressMilestones();
      
      // Check for industry insights
      await this.checkIndustryInsights();
    } catch (error) {
      console.error('Failed to check personalized notifications:', error);
    }
  }

  // Check for career trend updates based on user's bookmarked careers
  private async checkCareerTrendUpdates(): Promise<void> {
    const bookmarks = bookmarkService.getAllBookmarks();
    
    for (const bookmark of bookmarks.slice(0, 5)) { // Check top 5 bookmarked careers
      try {
        const trendData = await this.getCareerTrendData(bookmark.id);
        if (trendData) {
          const alerts = this.analyzeTrendData(bookmark, trendData);
          alerts.forEach(alert => this.createTrendAlert(alert));
        }
      } catch (error) {
        console.error(`Failed to get trend data for ${bookmark.title}:`, error);
      }
    }
  }

  // Get career trend data from Supabase
  private async getCareerTrendData(careerId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('career_trends')
        .select('*')
        .eq('career_id', careerId)
        .single();

      if (error) {
        console.error('Error fetching trend data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching trend data:', error);
      return null;
    }
  }

  // Analyze trend data and create alerts
  private analyzeTrendData(bookmark: BookmarkedCareer, trendData: any): CareerTrendAlert[] {
    const alerts: CareerTrendAlert[] = [];

    // Check for significant growth
    if (trendData.growth_rate > 25) {
      alerts.push({
        careerId: bookmark.id,
        careerTitle: bookmark.title,
        trendType: 'growth',
        change: trendData.growth_rate,
        message: `${bookmark.title} is experiencing ${trendData.growth_rate}% growth - great time to advance!`,
        priority: 'high',
        data: trendData
      });
    }

    // Check for high demand
    if (trendData.demand_level === 'high' && trendData.job_availability_score > 8) {
      alerts.push({
        careerId: bookmark.id,
        careerTitle: bookmark.title,
        trendType: 'demand',
        change: trendData.job_availability_score * 10,
        message: `${bookmark.title} has high demand with ${trendData.job_availability_score}/10 availability score`,
        priority: 'medium',
        data: trendData
      });
    }

    // Check for trending skills
    if (trendData.key_skills_trending && trendData.key_skills_trending.length > 0) {
      const newSkills = trendData.key_skills_trending.filter((skill: string) => 
        !bookmark.skills.includes(skill)
      );
      
      if (newSkills.length > 0) {
        alerts.push({
          careerId: bookmark.id,
          careerTitle: bookmark.title,
          trendType: 'skills',
          change: newSkills.length * 20,
          message: `New trending skills for ${bookmark.title}: ${newSkills.slice(0, 3).join(', ')}`,
          priority: 'medium',
          data: { newSkills, allTrendingSkills: trendData.key_skills_trending }
        });
      }
    }

    return alerts;
  }

  // Create a trend alert notification
  private createTrendAlert(alert: CareerTrendAlert): void {
    const relevanceScore = this.calculateRelevanceScore(alert);
    
    if (relevanceScore < 30) return; // Only show highly relevant notifications

    const notification: PersonalizedNotification = {
      id: `trend_${alert.careerId}_${Date.now()}`,
      type: 'market',
      title: `${alert.trendType === 'growth' ? '📈' : alert.trendType === 'skills' ? '🛠️' : '💼'} ${alert.careerTitle} Update`,
      message: alert.message,
      time: 'Just now',
      read: false,
      action: 'explore',
      priority: alert.priority,
      data: alert.data,
      relevanceScore,
      userContext: {
        basedOnBookmarks: true,
        basedOnProgress: false,
        basedOnSkills: alert.trendType === 'skills',
        basedOnIndustry: true
      },
      careerData: {
        careerId: alert.careerId,
        careerTitle: alert.careerTitle,
        industry: alert.data?.industry || 'Unknown',
        skills: alert.data?.newSkills || []
      }
    };

    // Check for duplicates and throttling before adding
    if (!this.isDuplicateNotification(notification) && !this.shouldThrottleNotificationType(notification.type)) {
      this.notificationService.addNotification(notification);
      this.recordNotification(notification);
    }
  }

  // Check for skill development opportunities
  private async checkSkillDevelopmentOpportunities(): Promise<void> {
    if (!this.userProfile) return;

    const bookmarks = bookmarkService.getAllBookmarks();
    const userSkills = this.userProfile.currentSkills;
    
    // Find skills that are common in bookmarked careers but not in user's current skills
    const skillGaps = this.identifySkillGaps(bookmarks, userSkills);
    
    if (skillGaps.length > 0) {
      const topSkillGap = skillGaps[0];
      this.createSkillDevelopmentNotification(topSkillGap);
    }
  }

  // Identify skill gaps between user's skills and bookmarked careers
  private identifySkillGaps(bookmarks: BookmarkedCareer[], userSkills: string[]): Array<{skill: string, frequency: number, careers: string[]}> {
    const skillFrequency = new Map<string, {frequency: number, careers: string[]}>();
    
    bookmarks.forEach(bookmark => {
      bookmark.skills.forEach(skill => {
        if (!userSkills.includes(skill)) {
          const current = skillFrequency.get(skill) || {frequency: 0, careers: []};
          current.frequency++;
          current.careers.push(bookmark.title);
          skillFrequency.set(skill, current);
        }
      });
    });

    return Array.from(skillFrequency.entries())
      .map(([skill, data]) => ({skill, ...data}))
      .sort((a, b) => b.frequency - a.frequency);
  }

  // Create skill development notification
  private createSkillDevelopmentNotification(skillGap: {skill: string, frequency: number, careers: string[]}): void {
    const notification: PersonalizedNotification = {
      id: `skill_dev_${Date.now()}`,
      type: 'info',
      title: '🛠️ Skill Development Opportunity',
      message: `Learn ${skillGap.skill} to advance in ${skillGap.careers.slice(0, 2).join(' and ')}`,
      time: 'Just now',
      read: false,
      action: 'learn',
      priority: 'medium',
      data: { skill: skillGap.skill, careers: skillGap.careers },
      relevanceScore: Math.min(90, 50 + skillGap.frequency * 10),
      userContext: {
        basedOnBookmarks: true,
        basedOnProgress: false,
        basedOnSkills: true,
        basedOnIndustry: false
      }
    };

    // Check for duplicates and throttling before adding
    if (!this.isDuplicateNotification(notification) && !this.shouldThrottleNotificationType(notification.type)) {
      this.notificationService.addNotification(notification);
      this.recordNotification(notification);
    }
  }

  // Check for job opportunities (mock implementation - would integrate with job APIs)
  private async checkJobOpportunities(): Promise<void> {
    if (!this.userProfile) return;

    const bookmarks = bookmarkService.getAllBookmarks();
    const topCareer = bookmarks[0]; // Most recently bookmarked
    
    if (topCareer) {
      // Mock job opportunity check
      const hasNewOpportunities = Math.random() > 0.7; // 30% chance
      
      if (hasNewOpportunities) {
        this.createJobOpportunityNotification(topCareer);
      }
    }
  }

  // Create job opportunity notification
  private createJobOpportunityNotification(career: BookmarkedCareer): void {
    const notification: PersonalizedNotification = {
      id: `job_opp_${career.id}_${Date.now()}`,
      type: 'career',
      title: '💼 New Job Opportunities',
      message: `New ${career.title} positions available in your area`,
      time: 'Just now',
      read: false,
      action: 'apply',
      priority: 'medium',
      data: { careerId: career.id, careerTitle: career.title },
      relevanceScore: 80,
      userContext: {
        basedOnBookmarks: true,
        basedOnProgress: false,
        basedOnSkills: false,
        basedOnIndustry: true
      },
      careerData: {
        careerId: career.id,
        careerTitle: career.title,
        industry: career.category,
        skills: career.skills
      }
    };

    // Check for duplicates and throttling before adding
    if (!this.isDuplicateNotification(notification) && !this.shouldThrottleNotificationType(notification.type)) {
      this.notificationService.addNotification(notification);
      this.recordNotification(notification);
    }
  }

  // Check for career progress milestones
  private async checkCareerProgressMilestones(): Promise<void> {
    const progress = careerPathProgressService.getAllProgress();
    
    progress.forEach(p => {
      // Calculate completion percentage
      const completionPercentage = p.totalSteps > 0 ? (p.completedSteps.length / p.totalSteps) * 100 : 0;
      const isCompleted = completionPercentage >= 100;
      
      // Check for completion milestones
      if (completionPercentage >= 100 && !isCompleted) {
        this.createMilestoneNotification(p, 'completed', completionPercentage);
      }
      // Check for progress milestones
      else if (completionPercentage >= 50 && completionPercentage < 100) {
        this.createMilestoneNotification(p, 'halfway', completionPercentage);
      }
    });
  }

  // Create milestone notification
  private createMilestoneNotification(progress: CareerPathProgress, milestone: 'completed' | 'halfway', completionPercentage: number): void {
    const isCompleted = milestone === 'completed';
    const notification: PersonalizedNotification = {
      id: `milestone_${progress.pathId}_${Date.now()}`,
      type: 'success',
      title: isCompleted ? '🎉 Career Path Completed!' : '📈 Great Progress!',
      message: isCompleted 
        ? `You've completed the ${progress.pathName} career path!`
        : `You're ${Math.round(completionPercentage)}% through the ${progress.pathName} career path`,
      time: 'Just now',
      read: false,
      action: isCompleted ? 'explore' : 'continue',
      priority: isCompleted ? 'high' : 'medium',
      data: { progress, milestone, completionPercentage },
      relevanceScore: isCompleted ? 95 : 70,
      userContext: {
        basedOnBookmarks: false,
        basedOnProgress: true,
        basedOnSkills: false,
        basedOnIndustry: false
      }
    };

    // Check for duplicates and throttling before adding
    if (!this.isDuplicateNotification(notification) && !this.shouldThrottleNotificationType(notification.type)) {
      this.notificationService.addNotification(notification);
      this.recordNotification(notification);
    }
  }

  // Check for industry insights
  private async checkIndustryInsights(): Promise<void> {
    if (!this.userProfile) return;

    // Check for insights in user's preferred industries
    for (const industry of this.userProfile.preferredIndustries.slice(0, 2)) {
      const hasInsight = Math.random() > 0.8; // 20% chance
      
      if (hasInsight) {
        this.createIndustryInsightNotification(industry);
      }
    }
  }

  // Create industry insight notification
  private createIndustryInsightNotification(industry: string): void {
    const insights = [
      `${industry} industry is showing strong growth with new opportunities emerging`,
      `Remote work trends are reshaping the ${industry} sector`,
      `New technologies are transforming ${industry} career paths`,
      `Salary trends in ${industry} are on the rise`
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];

    const notification: PersonalizedNotification = {
      id: `insight_${industry}_${Date.now()}`,
      type: 'info',
      title: '📊 Industry Insight',
      message: randomInsight,
      time: 'Just now',
      read: false,
      action: 'explore',
      priority: 'low',
      data: { industry },
      relevanceScore: 60,
      userContext: {
        basedOnBookmarks: false,
        basedOnProgress: false,
        basedOnSkills: false,
        basedOnIndustry: true
      }
    };

    // Check for duplicates and throttling before adding
    if (!this.isDuplicateNotification(notification) && !this.shouldThrottleNotificationType(notification.type)) {
      this.notificationService.addNotification(notification);
      this.recordNotification(notification);
    }
  }

  // Calculate relevance score for a notification
  private calculateRelevanceScore(alert: CareerTrendAlert): number {
    if (!this.userProfile) return 0;

    let score = 50; // Base score

    // Boost score based on user's bookmarked careers
    const bookmarks = bookmarkService.getAllBookmarks();
    const isBookmarked = bookmarks.some(b => b.id === alert.careerId);
    if (isBookmarked) score += 30;

    // Boost score based on user's skills
    if (alert.trendType === 'skills' && alert.data?.newSkills) {
      const relevantSkills = alert.data.newSkills.filter((skill: string) => 
        this.userProfile!.currentSkills.includes(skill)
      );
      score += relevantSkills.length * 10;
    }

    // Boost score based on user's preferred industries
    if (alert.data?.industry && this.userProfile.preferredIndustries.includes(alert.data.industry)) {
      score += 20;
    }

    return Math.min(100, score);
  }

  // Get personalized notifications
  getPersonalizedNotifications(): PersonalizedNotification[] {
    const allNotifications = this.notificationService.getNotifications();
    return allNotifications.filter(n => 'relevanceScore' in n) as PersonalizedNotification[];
  }

  // Get user profile
  getUserProfile(): UserCareerProfile | null {
    return this.userProfile ? { ...this.userProfile } : null;
  }

  // Update user profile
  updateUserProfile(updates: Partial<UserCareerProfile>): void {
    if (this.userProfile) {
      this.userProfile = { ...this.userProfile, ...updates, lastUpdated: new Date().toISOString() };
      this.saveUserProfile();
    }
  }

  // Force refresh user profile based on current data
  async refreshUserProfile(): Promise<void> {
    if (this.userProfile) {
      await this.initializeUserProfile(this.userProfile.userId);
    }
  }

  // Clear notification history (useful for testing or reset)
  clearNotificationHistory(): void {
    this.notificationHistory.clear();
    localStorage.removeItem(this.NOTIFICATION_HISTORY_KEY);
  }

  // Get notification history stats
  getNotificationHistoryStats(): { total: number; oldest: number; newest: number } {
    const timestamps = Array.from(this.notificationHistory.values());
    return {
      total: timestamps.length,
      oldest: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newest: timestamps.length > 0 ? Math.max(...timestamps) : 0
    };
  }

  // Check if a specific notification type should be throttled
  private shouldThrottleNotificationType(type: string): boolean {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Count notifications of this type in the last hour
    const recentCount = Array.from(this.notificationHistory.values())
      .filter(timestamp => timestamp > oneHourAgo)
      .length;
    
    // Throttle if more than 3 notifications in the last hour
    return recentCount >= 3;
  }
}

export const personalizedNotificationService = PersonalizedNotificationService.getInstance();
