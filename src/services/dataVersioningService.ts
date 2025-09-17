import { TrendingData } from './supabaseTrendingService';
// import { SupabaseCareerData } from './supabaseCareerService'; // Removed - not needed

export interface DataVersion {
  id: string;
  type: 'trending' | 'careers';
  version: string;
  lastUpdated: string;
  updateStatus: 'success' | 'failed' | 'pending';
  failureReason?: string;
  dataHash: string;
  dataSize: number;
}

export interface CachedData {
  trendingData?: TrendingData;
  careerData?: any[]; // Using any[] for career data for now
  lastFetched: string;
  version: string;
}

class DataVersioningService {
  private readonly VERSION_KEY = 'careering_data_version';
  private readonly CACHE_KEY = 'careering_cached_data';
  private readonly UPDATE_LOG_KEY = 'careering_update_log';

  /**
   * Get current data version information
   */
  getDataVersion(type: 'trending' | 'careers'): DataVersion | null {
    try {
      const versions = this.getAllVersions();
      return versions.find(v => v.type === type) || null;
    } catch (error) {
      console.error('Error getting data version:', error);
      return null;
    }
  }

  /**
   * Get all data versions
   */
  getAllVersions(): DataVersion[] {
    try {
      const versions = localStorage.getItem(this.VERSION_KEY);
      return versions ? JSON.parse(versions) : [];
    } catch (error) {
      console.error('Error getting all versions:', error);
      return [];
    }
  }

  /**
   * Update data version information
   */
  updateDataVersion(type: 'trending' | 'careers', status: 'success' | 'failed' | 'pending', failureReason?: string, dataHash?: string, dataSize?: number): void {
    try {
      const versions = this.getAllVersions();
      const existingIndex = versions.findIndex(v => v.type === type);
      
      const version: DataVersion = {
        id: `${type}_${Date.now()}`,
        type,
        version: this.generateVersion(),
        lastUpdated: new Date().toISOString(),
        updateStatus: status,
        failureReason,
        dataHash: dataHash || '',
        dataSize: dataSize || 0
      };

      if (existingIndex >= 0) {
        versions[existingIndex] = version;
      } else {
        versions.push(version);
      }

      localStorage.setItem(this.VERSION_KEY, JSON.stringify(versions));
      
      // Log the update
      this.logUpdate(type, status, failureReason);
      
      // Dispatch event for UI updates
      window.dispatchEvent(new CustomEvent('dataVersionUpdated', { detail: version }));
    } catch (error) {
      console.error('Error updating data version:', error);
    }
  }

  /**
   * Cache data with version information
   */
  cacheData(type: 'trending' | 'careers', data: TrendingData | any[]): void {
    try {
      const cachedData: CachedData = {
        trendingData: type === 'trending' ? data as TrendingData : undefined,
        careerData: type === 'careers' ? data as any[] : undefined,
        lastFetched: new Date().toISOString(),
        version: this.generateVersion()
      };

      const existingCache = this.getCachedData();
      const updatedCache = {
        ...existingCache,
        ...cachedData
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(updatedCache));
      
      // Update version with success status
      const dataHash = this.generateDataHash(data);
      const dataSize = JSON.stringify(data).length;
      this.updateDataVersion(type, 'success', undefined, dataHash, dataSize);
    } catch (error) {
      console.error('Error caching data:', error);
      this.updateDataVersion(type, 'failed', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Get cached data
   */
  getCachedData(): CachedData | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }

  /**
   * Check if data is fresh (less than 30 days old, aligned with monthly update schedule)
   */
  isDataFresh(type: 'trending' | 'careers'): boolean {
    const version = this.getDataVersion(type);
    if (!version || version.updateStatus !== 'success') {
      return false;
    }

    const lastUpdated = new Date(version.lastUpdated);
    const now = new Date();
    const daysDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff < 30; // Consider data fresh for 30 days (monthly update cycle)
  }

  /**
   * Check if update is needed (more than 30 days old or failed)
   */
  isUpdateNeeded(type: 'trending' | 'careers'): boolean {
    const version = this.getDataVersion(type);
    if (!version) {
      return true; // No version info, need update
    }

    if (version.updateStatus === 'failed') {
      return true; // Last update failed, need retry
    }

    if (version.updateStatus !== 'success') {
      return true; // Update not successful, need retry
    }

    const lastUpdated = new Date(version.lastUpdated);
    const now = new Date();
    const daysDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysDiff >= 30; // Update needed after 30 days
  }

  /**
   * Get update log
   */
  getUpdateLog(): Array<{type: string, status: string, timestamp: string, reason?: string}> {
    try {
      const log = localStorage.getItem(this.UPDATE_LOG_KEY);
      return log ? JSON.parse(log) : [];
    } catch (error) {
      console.error('Error getting update log:', error);
      return [];
    }
  }

  /**
   * Log update attempt
   */
  private logUpdate(type: 'trending' | 'careers', status: 'success' | 'failed' | 'pending', reason?: string): void {
    try {
      const log = this.getUpdateLog();
      const logEntry = {
        type,
        status,
        timestamp: new Date().toISOString(),
        reason
      };
      
      log.unshift(logEntry); // Add to beginning
      
      // Keep only last 50 entries
      if (log.length > 50) {
        log.splice(50);
      }
      
      localStorage.setItem(this.UPDATE_LOG_KEY, JSON.stringify(log));
    } catch (error) {
      console.error('Error logging update:', error);
    }
  }

  /**
   * Generate version string
   */
  private generateVersion(): string {
    return `v${Date.now()}`;
  }

  /**
   * Generate hash for data integrity
   */
  private generateDataHash(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Clear all cached data and versions
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(this.VERSION_KEY);
      localStorage.removeItem(this.CACHE_KEY);
      localStorage.removeItem(this.UPDATE_LOG_KEY);
      window.dispatchEvent(new CustomEvent('dataVersionUpdated'));
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  /**
   * Get data freshness status for UI
   */
  getDataStatus(): {
    trending: { isFresh: boolean; needsUpdate: boolean; lastUpdated?: string; status?: string };
    careers: { isFresh: boolean; needsUpdate: boolean; lastUpdated?: string; status?: string };
  } {
    const trendingVersion = this.getDataVersion('trending');
    const careersVersion = this.getDataVersion('careers');

    return {
      trending: {
        isFresh: this.isDataFresh('trending'),
        needsUpdate: this.isUpdateNeeded('trending'),
        lastUpdated: trendingVersion?.lastUpdated,
        status: trendingVersion?.updateStatus
      },
      careers: {
        isFresh: this.isDataFresh('careers'),
        needsUpdate: this.isUpdateNeeded('careers'),
        lastUpdated: careersVersion?.lastUpdated,
        status: careersVersion?.updateStatus
      }
    };
  }
}

export const dataVersioningService = new DataVersioningService();
