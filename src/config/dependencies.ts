/**
 * Dependency Injection Container
 * Centralizes service dependencies and configuration
 */

import { careerService } from '@/services/careerService';
import { supabaseCareerService } from '@/services/supabaseCareerService';
import { supabaseTrendingService } from '@/services/supabaseTrendingService';
import { bookmarkService } from '@/services/bookmarkService';
import { NotificationService } from '@/services/notificationService';
import { personalizedNotificationService } from '@/services/personalizedNotificationService';
import { SkillsAssessmentService } from '@/services/skillsAssessmentService';
import { appStartupService } from '@/services/appStartupService';

// Service interfaces for dependency injection
export interface ICareerDataService {
  getCareerPath(pathId: string): Promise<any>;
  getCareerPathsByIndustry(industry: string, page?: number, limit?: number): Promise<any>;
  searchCareers(query: string, filters?: any, page?: number, limit?: number): Promise<any>;
}

export interface ITrendingDataService {
  getAllTrendingData(): Promise<any>;
  getTrendingSkills(): Promise<any>;
  getTrendingIndustries(): Promise<any>;
}

export interface IBookmarkService {
  addBookmark(careerId: string): void;
  removeBookmark(careerId: string): void;
  getBookmarks(): string[];
}

export interface INotificationService {
  addNotification(notification: any): void;
  getNotifications(): any[];
  markAsRead(id: string): void;
}

export interface IPersonalizedNotificationService {
  initializeUserProfile(userId?: string): Promise<void>;
  getUserProfile(): any;
  getPersonalizedNotifications(): any[];
  refreshUserProfile(): Promise<void>;
}

export interface ISkillsAssessmentService {
  assessSkills(skills: string[]): Promise<any>;
  getRecommendations(skills: string[], interests: string[], experience: number): Promise<any>;
}

// Dependency container
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeServices(): void {
    // Register services
    this.services.set('careerService', careerService);
    this.services.set('supabaseCareerService', supabaseCareerService);
    this.services.set('supabaseTrendingService', supabaseTrendingService);
    this.services.set('bookmarkService', bookmarkService);
    this.services.set('notificationService', NotificationService.getInstance());
    this.services.set('personalizedNotificationService', personalizedNotificationService);
    this.services.set('skillsAssessmentService', new SkillsAssessmentService());
    this.services.set('appStartupService', appStartupService);
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  public register<T>(serviceName: string, service: T): void {
    this.services.set(serviceName, service);
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Convenience getters
export const getCareerService = () => container.get<ICareerDataService>('careerService');
export const getTrendingService = () => container.get<ITrendingDataService>('supabaseTrendingService');
export const getBookmarkService = () => container.get<IBookmarkService>('bookmarkService');
export const getNotificationService = () => container.get<INotificationService>('notificationService');
export const getPersonalizedNotificationService = () => container.get<IPersonalizedNotificationService>('personalizedNotificationService');
export const getSkillsAssessmentService = () => container.get<ISkillsAssessmentService>('skillsAssessmentService');
export const getAppStartupService = () => container.get('appStartupService');
