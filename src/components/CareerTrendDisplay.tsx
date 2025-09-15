import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Briefcase, 
  DollarSign,
  AlertTriangle,
  Star,
  Calendar,
  BarChart3,
  Target
} from 'lucide-react';
import { careerTrendService, CareerTrendData, IndustryTrendData } from '@/services/careerTrendService';
import { regionalTrendService } from '@/services/regionalTrendService';
import { ICareerNode } from '@/types/career';
import { useRegion } from '@/contexts/RegionContext';

interface CareerTrendDisplayProps {
  career: ICareerNode;
  showIndustryTrend?: boolean;
}

const CareerTrendDisplay: React.FC<CareerTrendDisplayProps> = ({ 
  career, 
  showIndustryTrend = true 
}) => {
  const [trendData, setTrendData] = useState<CareerTrendData | null>(null);
  const [industryTrend, setIndustryTrend] = useState<IndustryTrendData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRegion, getRegionDisplayName } = useRegion();

  useEffect(() => {
    const loadTrendData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('=== CAREER TREND DEBUG ===');
        console.log('Loading trend data for career:', career.id, career.t);
        console.log('Career object:', career);

        // First, let's see what career IDs are available in the trend data
        const availableCareerIds = await careerTrendService.getAllTrendCareerIds();
        console.log('Available career IDs with trend data:', availableCareerIds);

        // Load career trend data
        let careerTrend = await careerTrendService.getCareerTrend(career.id);
        console.log('Career trend result for', career.id, ':', careerTrend);
        
        // Apply regional factors if trend data exists
        if (careerTrend) {
          careerTrend = regionalTrendService.applyRegionalFactors(careerTrend, selectedRegion);
          console.log('Regional trend data for', selectedRegion, ':', careerTrend);
        }
        
        // If no trend data found, try some common variations
        if (!careerTrend) {
          console.log('No trend data found for', career.id, '- checking for similar IDs...');
          // Try some common ID variations
          const variations = [
            career.id.replace('-', '_'),
            career.id.replace('_', '-'),
            career.t.toLowerCase().replace(/\s+/g, '-'),
            career.t.toLowerCase().replace(/\s+/g, '_')
          ];
          
          for (const variation of variations) {
            if (variation !== career.id) {
              console.log('Trying variation:', variation);
              const altTrend = await careerTrendService.getCareerTrend(variation);
              if (altTrend) {
                console.log('Found trend data with variation:', variation);
                careerTrend = altTrend;
                break;
              }
            }
          }
        }
        setTrendData(careerTrend);

        // Load industry trend data if requested
        if (showIndustryTrend && careerTrend) {
          const industryTrendData = await careerTrendService.getIndustryTrend(careerTrend.career_id);
          console.log('Industry trend result:', industryTrendData);
          setIndustryTrend(industryTrendData);
        }
      } catch (err) {
        console.error('Failed to load trend data:', err);
        setError('Failed to load trend data');
      } finally {
        setLoading(false);
      }
    };

    loadTrendData();
  }, [career.id, showIndustryTrend, selectedRegion]);

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'rising':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'declining':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 4) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading trend data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !trendData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {error || 'No trend data available for this career'}
            </p>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Trend data is updated monthly from Supabase. Some careers may not have trend data yet.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Career ID: <code className="bg-muted px-1 rounded">{career.id}</code>
              </p>
              <p className="text-xs text-muted-foreground">
                Look for this ID in the <code className="bg-muted px-1 rounded">career_trends</code> table
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  console.log('Manual trend update requested for:', career.id);
                  // Open Supabase dashboard to the career_trends table
                  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                  if (supabaseUrl) {
                    const projectId = supabaseUrl.split('//')[1].split('.')[0];
                    // Open to the table editor for career_trends
                    window.open(`https://supabase.com/dashboard/project/${projectId}/editor`, '_blank');
                  } else {
                    console.error('VITE_SUPABASE_URL not found in environment variables');
                    alert('Supabase URL not configured. Please check your environment variables.');
                  }
                }}
              >
                Check Database
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Career Trend Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Trends for {career.t}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Last updated: {new Date(trendData.last_updated).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Region Indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span>Data customized for {getRegionDisplayName()}</span>
          </div>

          {/* Trend Score and Direction */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-primary">
                {trendData.trend_score.toFixed(1)}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Trend Score</div>
                <div className="text-xs text-muted-foreground">Out of 10</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(trendData.trend_direction)}
              <Badge className={getTrendColor(trendData.trend_direction)}>
                {trendData.trend_direction}
              </Badge>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {trendData.growth_rate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Growth Rate</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-lg font-semibold ${getScoreColor(trendData.job_availability_score)}`}>
                {trendData.job_availability_score.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Job Availability</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-lg font-semibold ${getScoreColor(trendData.remote_work_trend)}`}>
                {trendData.remote_work_trend.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Remote Work</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className={`text-lg font-semibold ${getScoreColor(10 - trendData.automation_risk)}`}>
                {(10 - trendData.automation_risk).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Job Security</div>
            </div>
          </div>

          {/* Demand Level */}
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Demand Level:</span>
            <Badge className={getDemandColor(trendData.demand_level)}>
              {trendData.demand_level}
            </Badge>
          </div>

          {/* Market Insights */}
          {trendData.market_insights && (
            <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Market Insights</h4>
              <p className="text-sm text-muted-foreground">{trendData.market_insights}</p>
            </div>
          )}

          {/* Trending Skills */}
          {trendData.key_skills_trending.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Trending Skills</h4>
              <div className="flex flex-wrap gap-2">
                {trendData.key_skills_trending.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-primary border-primary/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Locations */}
          {trendData.top_locations.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Top Locations</h4>
              <div className="flex flex-wrap gap-2">
                {trendData.top_locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salary Trend */}
          {trendData.salary_trend && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-400 mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Salary Trend
              </h4>
              <p className="text-sm text-green-800 dark:text-green-300">{trendData.salary_trend}</p>
            </div>
          )}

          {/* Future Outlook */}
          {trendData.future_outlook && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-400 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Future Outlook
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-300">{trendData.future_outlook}</p>
            </div>
          )}

          {/* Industry Impact */}
          {trendData.industry_impact && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-400 mb-2">Industry Impact</h4>
              <p className="text-sm text-orange-800 dark:text-orange-300">{trendData.industry_impact}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Industry Trend Comparison */}
      {showIndustryTrend && industryTrend && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Industry Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-primary">
                  {industryTrend.avg_trend_score.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Industry Avg</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {industryTrend.rising_careers}
                </div>
                <div className="text-xs text-muted-foreground">Rising Careers</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-muted-foreground">
                  {industryTrend.stable_careers}
                </div>
                <div className="text-xs text-muted-foreground">Stable Careers</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {industryTrend.declining_careers}
                </div>
                <div className="text-xs text-muted-foreground">Declining Careers</div>
              </div>
            </div>

            {industryTrend.emerging_skills.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-foreground mb-2">Emerging Industry Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {industryTrend.emerging_skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CareerTrendDisplay;
