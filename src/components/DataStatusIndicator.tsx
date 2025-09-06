import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Database,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dataVersioningService } from '@/services/dataVersioningService';

interface DataStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

const DataStatusIndicator: React.FC<DataStatusIndicatorProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const [dataStatus, setDataStatus] = useState(dataVersioningService.getDataStatus());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleDataUpdate = () => {
      setDataStatus(dataVersioningService.getDataStatus());
    };

    window.addEventListener('dataVersionUpdated', handleDataUpdate);
    return () => window.removeEventListener('dataVersionUpdated', handleDataUpdate);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatLastUpdated = (lastUpdated?: string) => {
    if (!lastUpdated) return 'Never';
    
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Force refresh by clearing cache and triggering new fetch
      dataVersioningService.clearAllData();
      // The services will automatically attempt to fetch fresh data
      setTimeout(() => {
        setDataStatus(dataVersioningService.getDataStatus());
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setIsRefreshing(false);
    }
  };

  // Only show "failed" if data is actually outdated (more than a month old)
  const overallStatus = dataStatus.trending.status === 'success' && dataStatus.careers.status === 'success' 
    ? 'success' 
    : (dataStatus.trending.status === 'failed' && dataStatus.trending.needsUpdate) || 
      (dataStatus.careers.status === 'failed' && dataStatus.careers.needsUpdate)
    ? 'failed'
    : 'pending';

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon(overallStatus)}
        <span className="text-sm text-muted-foreground">
          {overallStatus === 'success' ? 'Data up to date' : 
           overallStatus === 'failed' ? 'Data outdated' : 
           'Updating data...'}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Data Status</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          <div className="space-y-3">
            {/* Trending Data Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(dataStatus.trending.status || 'unknown')}
                <span className="text-sm font-medium">Trending Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(dataStatus.trending.status || 'unknown')}>
                  {dataStatus.trending.status || 'Unknown'}
                </Badge>
                {dataStatus.trending.needsUpdate && (
                  <Badge variant="outline" className="text-xs">
                    Needs Update
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatLastUpdated(dataStatus.trending.lastUpdated)}
                </span>
              </div>
            </div>

            {/* Career Data Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(dataStatus.careers.status || 'unknown')}
                <span className="text-sm font-medium">Career Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(dataStatus.careers.status || 'unknown')}>
                  {dataStatus.careers.status || 'Unknown'}
                </Badge>
                {dataStatus.careers.needsUpdate && (
                  <Badge variant="outline" className="text-xs">
                    Needs Update
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatLastUpdated(dataStatus.careers.lastUpdated)}
                </span>
              </div>
            </div>

            {/* Update Info */}
            <div className="pt-2 border-t">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p>Data is updated monthly by our AI system.</p>
                  <p>Your app remembers the most recent data even when updates fail.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DataStatusIndicator;
