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
import { ICareerNode } from '@/types/career';

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

  useEffect(() => {
    const loadTrendData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load career trend data
        const careerTrend = await careerTrendService.getCareerTrend(career.id);
        setTrendData(careerTrend);

        // Load industry trend data if requested
        if (showIndustryTrend && careerTrend) {
          const industryTrendData = await careerTrendService.getIndustryTrend(careerTrend.career_id);
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
  }, [career.id, showIndustryTrend]);

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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declining':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading trend data...</span>
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
            <p className="text-gray-600">
              {error || 'No trend data available for this career'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Trend data is updated monthly
            </p>
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
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            Last updated: {new Date(trendData.last_updated).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trend Score and Direction */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-blue-600">
                {trendData.trend_score.toFixed(1)}
              </div>
              <div>
                <div className="text-sm text-gray-600">Trend Score</div>
                <div className="text-xs text-gray-500">Out of 10</div>
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
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">
                {trendData.growth_rate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">Growth Rate</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-lg font-semibold ${getScoreColor(trendData.job_availability_score)}`}>
                {trendData.job_availability_score.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Job Availability</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-lg font-semibold ${getScoreColor(trendData.remote_work_trend)}`}>
                {trendData.remote_work_trend.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Remote Work</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`text-lg font-semibold ${getScoreColor(10 - trendData.automation_risk)}`}>
                {(10 - trendData.automation_risk).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Job Security</div>
            </div>
          </div>

          {/* Demand Level */}
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">Demand Level:</span>
            <Badge className={getDemandColor(trendData.demand_level)}>
              {trendData.demand_level}
            </Badge>
          </div>

          {/* Market Insights */}
          {trendData.market_insights && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Market Insights</h4>
              <p className="text-sm text-blue-800">{trendData.market_insights}</p>
            </div>
          )}

          {/* Trending Skills */}
          {trendData.key_skills_trending.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Trending Skills</h4>
              <div className="flex flex-wrap gap-2">
                {trendData.key_skills_trending.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Locations */}
          {trendData.top_locations.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Top Locations</h4>
              <div className="flex flex-wrap gap-2">
                {trendData.top_locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salary Trend */}
          {trendData.salary_trend && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Salary Trend
              </h4>
              <p className="text-sm text-green-800">{trendData.salary_trend}</p>
            </div>
          )}

          {/* Future Outlook */}
          {trendData.future_outlook && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Future Outlook
              </h4>
              <p className="text-sm text-purple-800">{trendData.future_outlook}</p>
            </div>
          )}

          {/* Industry Impact */}
          {trendData.industry_impact && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Industry Impact</h4>
              <p className="text-sm text-orange-800">{trendData.industry_impact}</p>
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
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">
                  {industryTrend.avg_trend_score.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Industry Avg</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">
                  {industryTrend.rising_careers}
                </div>
                <div className="text-xs text-gray-600">Rising Careers</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-600">
                  {industryTrend.stable_careers}
                </div>
                <div className="text-xs text-gray-600">Stable Careers</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-red-600">
                  {industryTrend.declining_careers}
                </div>
                <div className="text-xs text-gray-600">Declining Careers</div>
              </div>
            </div>

            {industryTrend.emerging_skills.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Emerging Industry Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {industryTrend.emerging_skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-purple-600 border-purple-200">
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
