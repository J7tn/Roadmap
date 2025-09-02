import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Briefcase,
  Code,
  Palette,
  Calculator,
  Globe,
  Zap,
  Lightbulb,
  Award
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRealTimeTrends } from '@/hooks/useRealTimeData';

const RealTimeJobFeed: React.FC = () => {
  // Use only the trends hook for career insights
  const { 
    trends, 
    getEmergingSkills,
    getIndustryInsights,
    lastUpdated,
    isLoading,
    error
  } = useRealTimeTrends();

  const emergingSkills = getEmergingSkills();
  const industryInsights = getIndustryInsights();

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Trends</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Career Market Trends</h2>
          <p className="text-gray-600">Latest insights on emerging skills and industry growth</p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">
                Real-time market data
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">
                Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live updates</span>
          </div>
        </div>
      </div>

      {/* Market Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trending Skills */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Trending Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {emergingSkills.slice(0, 3).map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.skill}</span>
                  <Badge variant="secondary" className="text-xs">
                    +{skill.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Industry Growth */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Industry Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {industryInsights.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{insight.industry}</span>
                  <Badge variant="secondary" className="text-xs">
                    +{insight.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emerging Roles */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Emerging Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trends.emergingRoles.slice(0, 3).map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{role.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    +{role.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Trends Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Career Development Insights
        </h3>

        {/* Skills Development Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
              Skills in High Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergingSkills.slice(0, 6).map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Code className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{skill.skill}</div>
                      <div className="text-xs text-gray-500">${skill.salary.toLocaleString()}/year avg</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">
                      +{skill.growth}%
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">Demand: {skill.demand}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Industry Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              Industry Growth Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {industryInsights.slice(0, 5).map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{insight.industry}</div>
                      <div className="text-xs text-gray-500">
                        {insight.jobCount.toLocaleString()} active positions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-100 text-blue-800">
                      +{insight.growth}%
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      ${insight.avgSalary.toLocaleString()}/year avg
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Transition Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              Career Transition Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.emergingRoles.slice(0, 4).map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{role.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{role.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          +{role.growth}% growth
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {role.skills.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Auto-updating career trends every 15 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeJobFeed;
