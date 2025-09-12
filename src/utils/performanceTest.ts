/**
 * Performance Testing Utilities
 * Tests the mobile performance of the new hybrid career system
 */

import { hybridCareerService } from '@/services/hybridCareerService';
import { smartCareerCacheService } from '@/services/smartCareerCacheService';

export interface PerformanceMetrics {
  searchTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  dataSize: number;
  networkRequests: number;
}

export class PerformanceTester {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;
  private networkRequestCount: number = 0;

  /**
   * Test career search performance
   */
  async testCareerSearch(): Promise<PerformanceMetrics> {
    console.log('🧪 Testing career search performance...');
    
    const startTime = performance.now();
    const initialMemory = this.getMemoryUsage();
    
    try {
      // Test different search scenarios
      const searches = [
        { query: 'developer', filters: { industry: 'tech' as const } },
        { query: 'engineer', filters: { level: 'I' } },
        { query: 'manager', filters: { industry: 'business' as const } },
        { query: 'nurse', filters: { industry: 'healthcare' as const } },
        { query: 'designer', filters: { industry: 'creative' as const } }
      ];

      for (const search of searches) {
        await hybridCareerService.searchCareers(search.query, search.filters, 1, 20);
      }

      const endTime = performance.now();
      const finalMemory = this.getMemoryUsage();
      
      const metrics: PerformanceMetrics = {
        searchTime: endTime - startTime,
        cacheHitRate: this.calculateCacheHitRate(),
        memoryUsage: finalMemory - initialMemory,
        dataSize: this.estimateDataSize(),
        networkRequests: this.networkRequestCount
      };

      this.metrics.push(metrics);
      console.log('✅ Search performance test completed:', metrics);
      
      return metrics;
    } catch (error) {
      console.error('❌ Search performance test failed:', error);
      throw error;
    }
  }

  /**
   * Test cache performance
   */
  async testCachePerformance(): Promise<PerformanceMetrics> {
    console.log('🧪 Testing cache performance...');
    
    const startTime = performance.now();
    
    try {
      // Test cache with repeated searches
      const searchQuery = { query: 'developer', filters: { industry: 'tech' as const } };
      
      // First search (should miss cache)
      await hybridCareerService.searchCareers(searchQuery.query, searchQuery.filters, 1, 20);
      
      // Second search (should hit cache)
      await hybridCareerService.searchCareers(searchQuery.query, searchQuery.filters, 1, 20);
      
      // Third search (should hit cache)
      await hybridCareerService.searchCareers(searchQuery.query, searchQuery.filters, 1, 20);
      
      const endTime = performance.now();
      
      const metrics: PerformanceMetrics = {
        searchTime: endTime - startTime,
        cacheHitRate: this.calculateCacheHitRate(),
        memoryUsage: this.getMemoryUsage(),
        dataSize: this.estimateDataSize(),
        networkRequests: this.networkRequestCount
      };

      this.metrics.push(metrics);
      console.log('✅ Cache performance test completed:', metrics);
      
      return metrics;
    } catch (error) {
      console.error('❌ Cache performance test failed:', error);
      throw error;
    }
  }

  /**
   * Test memory usage
   */
  testMemoryUsage(): PerformanceMetrics {
    console.log('🧪 Testing memory usage...');
    
    const startTime = performance.now();
    const initialMemory = this.getMemoryUsage();
    
    // Simulate loading multiple career datasets
    const testData = new Array(1000).fill(null).map((_, i) => ({
      id: `test-career-${i}`,
      title: `Test Career ${i}`,
      description: `Test description for career ${i}`,
      skills: [`skill-${i}-1`, `skill-${i}-2`],
      level: 'I' as const,
      salary: '$50,000 - $70,000',
      experience: '2-5 years'
    }));
    
    const endTime = performance.now();
    const finalMemory = this.getMemoryUsage();
    
    const metrics: PerformanceMetrics = {
      searchTime: endTime - startTime,
      cacheHitRate: 0,
      memoryUsage: finalMemory - initialMemory,
      dataSize: JSON.stringify(testData).length,
      networkRequests: 0
    };

    this.metrics.push(metrics);
    console.log('✅ Memory usage test completed:', metrics);
    
    return metrics;
  }

  /**
   * Test offline performance
   */
  async testOfflinePerformance(): Promise<PerformanceMetrics> {
    console.log('🧪 Testing offline performance...');
    
    const startTime = performance.now();
    
    try {
      // Disable Supabase to test offline mode
      hybridCareerService.setUseSupabase(false);
      
      // Test local data loading
      await hybridCareerService.searchCareers('developer', { industry: 'tech' as const }, 1, 20);
      
      // Re-enable Supabase
      hybridCareerService.setUseSupabase(true);
      
      const endTime = performance.now();
      
      const metrics: PerformanceMetrics = {
        searchTime: endTime - startTime,
        cacheHitRate: 0,
        memoryUsage: this.getMemoryUsage(),
        dataSize: this.estimateDataSize(),
        networkRequests: 0
      };

      this.metrics.push(metrics);
      console.log('✅ Offline performance test completed:', metrics);
      
      return metrics;
    } catch (error) {
      console.error('❌ Offline performance test failed:', error);
      throw error;
    }
  }

  /**
   * Run comprehensive performance test
   */
  async runComprehensiveTest(): Promise<{
    overall: PerformanceMetrics;
    individual: PerformanceMetrics[];
    recommendations: string[];
  }> {
    console.log('🚀 Starting comprehensive performance test...');
    
    try {
      // Run all tests
      const searchTest = await this.testCareerSearch();
      const cacheTest = await this.testCachePerformance();
      const memoryTest = this.testMemoryUsage();
      const offlineTest = await this.testOfflinePerformance();
      
      const individual = [searchTest, cacheTest, memoryTest, offlineTest];
      
      // Calculate overall metrics
      const overall: PerformanceMetrics = {
        searchTime: individual.reduce((sum, m) => sum + m.searchTime, 0) / individual.length,
        cacheHitRate: individual.reduce((sum, m) => sum + m.cacheHitRate, 0) / individual.length,
        memoryUsage: Math.max(...individual.map(m => m.memoryUsage)),
        dataSize: Math.max(...individual.map(m => m.dataSize)),
        networkRequests: individual.reduce((sum, m) => sum + m.networkRequests, 0)
      };
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(overall);
      
      const results = {
        overall,
        individual,
        recommendations
      };
      
      console.log('🎉 Comprehensive performance test completed:', results);
      
      return results;
    } catch (error) {
      console.error('❌ Comprehensive performance test failed:', error);
      throw error;
    }
  }

  /**
   * Get memory usage (approximate)
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Calculate cache hit rate
   */
  private calculateCacheHitRate(): number {
    const stats = smartCareerCacheService.getCacheStats();
    return stats.hitRate;
  }

  /**
   * Estimate data size
   */
  private estimateDataSize(): number {
    const stats = smartCareerCacheService.getCacheStats();
    return stats.size * 1024; // Rough estimate: 1KB per cached item
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];
    
    if (metrics.searchTime > 1000) {
      recommendations.push('Search time is high (>1s). Consider optimizing queries or increasing cache size.');
    }
    
    if (metrics.cacheHitRate < 0.5) {
      recommendations.push('Cache hit rate is low (<50%). Consider increasing cache TTL or preloading more data.');
    }
    
    if (metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      recommendations.push('Memory usage is high (>50MB). Consider reducing cache size or implementing data cleanup.');
    }
    
    if (metrics.networkRequests > 10) {
      recommendations.push('Too many network requests. Consider batching requests or improving caching strategy.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance looks good! No optimizations needed.');
    }
    
    return recommendations;
  }

  /**
   * Get test results summary
   */
  getResultsSummary(): string {
    if (this.metrics.length === 0) {
      return 'No test results available. Run tests first.';
    }
    
    const avgSearchTime = this.metrics.reduce((sum, m) => sum + m.searchTime, 0) / this.metrics.length;
    const avgCacheHitRate = this.metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / this.metrics.length;
    const maxMemoryUsage = Math.max(...this.metrics.map(m => m.memoryUsage));
    const totalNetworkRequests = this.metrics.reduce((sum, m) => sum + m.networkRequests, 0);
    
    return `
📊 Performance Test Summary:
   Average Search Time: ${avgSearchTime.toFixed(2)}ms
   Average Cache Hit Rate: ${(avgCacheHitRate * 100).toFixed(1)}%
   Max Memory Usage: ${(maxMemoryUsage / 1024 / 1024).toFixed(2)}MB
   Total Network Requests: ${totalNetworkRequests}
   Tests Run: ${this.metrics.length}
    `;
  }
}

// Export singleton instance
export const performanceTester = new PerformanceTester();
