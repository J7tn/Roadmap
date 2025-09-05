import { dataVersioningService } from './dataVersioningService';
import { supabaseTrendingService } from './supabaseTrendingService';
import { supabaseCareerService } from './supabaseCareerService';

class AppStartupService {
  private isInitialized = false;

  /**
   * Initialize app startup checks
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('🚀 Initializing app startup checks...');
    
    try {
      // Check data freshness and attempt updates if needed
      await this.checkAndUpdateData();
      
      // Log startup completion
      console.log('✅ App startup checks completed');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ App startup checks failed:', error);
    }
  }

  /**
   * Check data freshness and attempt updates
   */
  private async checkAndUpdateData(): Promise<void> {
    const dataStatus = dataVersioningService.getDataStatus();
    
    console.log('📊 Current data status:', dataStatus);

    // Check trending data
    if (dataStatus.trending.needsUpdate) {
      console.log('🔄 Trending data needs update, attempting fetch...');
      try {
        await supabaseTrendingService.getAllTrendingData();
        console.log('✅ Trending data update completed');
      } catch (error) {
        console.warn('⚠️ Trending data update failed:', error);
      }
    } else if (dataStatus.trending.isFresh) {
      console.log('✅ Trending data is fresh');
    } else {
      console.log('📅 Trending data is cached but not fresh (update not needed yet)');
    }

    // Check career data
    if (dataStatus.careers.needsUpdate) {
      console.log('🔄 Career data needs update, attempting fetch...');
      try {
        await supabaseCareerService.getAllCareers();
        console.log('✅ Career data update completed');
      } catch (error) {
        console.warn('⚠️ Career data update failed:', error);
      }
    } else if (dataStatus.careers.isFresh) {
      console.log('✅ Career data is fresh');
    } else {
      console.log('📅 Career data is cached but not fresh (update not needed yet)');
    }
  }

  /**
   * Get startup status for UI
   */
  getStartupStatus(): {
    isInitialized: boolean;
    dataStatus: ReturnType<typeof dataVersioningService.getDataStatus>;
  } {
    return {
      isInitialized: this.isInitialized,
      dataStatus: dataVersioningService.getDataStatus()
    };
  }

  /**
   * Force refresh all data
   */
  async forceRefresh(): Promise<void> {
    console.log('🔄 Force refreshing all data...');
    
    // Clear all cached data
    dataVersioningService.clearAllData();
    
    // Attempt to fetch fresh data
    try {
      await Promise.all([
        supabaseTrendingService.getAllTrendingData(),
        supabaseCareerService.getAllCareers()
      ]);
      console.log('✅ Force refresh completed');
    } catch (error) {
      console.error('❌ Force refresh failed:', error);
    }
  }

  /**
   * Get data update log for debugging
   */
  getUpdateLog() {
    return dataVersioningService.getUpdateLog();
  }
}

export const appStartupService = new AppStartupService();
