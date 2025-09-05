import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, BarChart3, Star, Zap, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabaseTrendingService, TrendingData } from '@/services/supabaseTrendingService';
import DataStatusIndicator from './DataStatusIndicator';

const RealTimeJobFeed: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load trending data from Supabase
  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        setLoading(true);
        const data = await supabaseTrendingService.getAllTrendingData();
        setTrendingData(data);
      } catch (error) {
        console.warn('Failed to load trending data from Supabase:', error);
        // Set empty data instead of fallback
        setTrendingData({
          trendingSkills: [],
          decliningSkills: [],
          trendingIndustries: [],
          decliningIndustries: [],
          emergingRoles: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrendingData();
  }, []);

  const emergingSkills = useMemo(() => trendingData?.trendingSkills.slice(0, 3) || [], [trendingData]);
  const decliningSkills = useMemo(() => trendingData?.decliningSkills.slice(0, 3) || [], [trendingData]);
  const industryInsights = useMemo(() => trendingData?.trendingIndustries.slice(0, 2) || [], [trendingData]);
  const decliningIndustries = useMemo(() => trendingData?.decliningIndustries.slice(0, 2) || [], [trendingData]);
  const emergingRoles = useMemo(() => trendingData?.emergingRoles.slice(0, 2) || [], [trendingData]);
  const formattedTime = useMemo(() => new Date().toLocaleTimeString(), []);

  // Click handlers for navigation
  const handleSkillClick = (skill: string) => {
    console.log('Skill clicked:', skill);
    // Scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    navigate(`/jobs?search=${encodeURIComponent(skill)}`);
  };

  const handleIndustryClick = (industry: string) => {
    console.log('Industry clicked:', industry);
    const industryMap: { [key: string]: string } = {
      'Technology': 'tech',
      'Healthcare': 'healthcare',
      'Finance': 'finance',
      'Manufacturing': 'trades',
      'Print Media': 'media',
      'Traditional Retail': 'business',
      'Coal Mining': 'trades',
      'Telemarketing': 'business'
    };
    const categoryId = industryMap[industry] || 'tech';
    console.log('Navigating to category:', categoryId);
    // Scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    navigate(`/category/${categoryId}`);
  };

  const handleRoleClick = (role: string) => {
    console.log('Role clicked:', role);
    // Scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    navigate(`/jobs?search=${encodeURIComponent(role)}`);
  };

  const getDemandColor = (demand: number) => {
    if (demand >= 90) return 'text-green-600';
    if (demand >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDemandIcon = (demand: number) => {
    if (demand >= 90) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (demand >= 80) return <Star className="h-4 w-4 text-yellow-600" />;
    return <BarChart3 className="h-4 w-4 text-red-600" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Trends</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-64">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Check if we have any data to display
  const hasData = trendingData && (
    trendingData.trendingSkills.length > 0 ||
    trendingData.decliningSkills.length > 0 ||
    trendingData.trendingIndustries.length > 0 ||
    trendingData.decliningIndustries.length > 0 ||
    trendingData.emergingRoles.length > 0
  );

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Career Market Trends</h2>
          <p className="text-muted-foreground">
            Stay updated with the latest career opportunities and market insights
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <DataStatusIndicator />
          <span>Last updated: {formattedTime}</span>
        </div>

        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Market Data Available</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Market trend data is currently unavailable. This may be due to a network issue or the data is being updated.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Career Market Trends</h2>
        <p className="text-muted-foreground">
          Stay updated with the latest career opportunities and market insights
        </p>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <DataStatusIndicator />
        <span>Last updated: {formattedTime}</span>
      </div>

      {/* Market Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Trending Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Trending Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergingSkills.map((skill, index) => (
                <motion.div
                  key={skill.skill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.1, 0.5) }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleSkillClick(skill.skill)}
                >
                  <div className="flex items-center space-x-2">
                    {getDemandIcon(skill.demand)}
                    <span className="font-medium">{skill.skill}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${getDemandColor(skill.demand)}`}>
                        {skill.demand}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +{skill.growth}%
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Declining Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span>Declining Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {decliningSkills.map((skill, index) => (
                <motion.div
                  key={skill.skill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.1, 0.5) }}
                  className="flex items-center justify-between p-2 rounded-lg bg-red-50/50 cursor-pointer hover:bg-red-50/70 transition-colors"
                  onClick={() => handleSkillClick(skill.skill)}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="font-medium">{skill.skill}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        {skill.demand}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {skill.growth}%
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Industry Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Industry Growth</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {industryInsights.map((industry, index) => (
                <motion.div
                  key={industry.industry}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.1, 0.5) }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleIndustryClick(industry.industry)}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{industry.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        +{industry.growth}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {industry.jobCount.toLocaleString()} jobs
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Declining Industries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span>Declining Industries</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {decliningIndustries.map((industry, index) => (
                <motion.div
                  key={industry.industry}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.1, 0.5) }}
                  className="flex items-center justify-between p-2 rounded-lg bg-red-50/50 cursor-pointer hover:bg-red-50/70 transition-colors"
                  onClick={() => handleIndustryClick(industry.industry)}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="font-medium">{industry.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        {industry.growth}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {industry.jobCount.toLocaleString()} jobs
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Emerging Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span>Emerging Roles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergingRoles.map((role, index) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.1, 0.5) }}
                  className="p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => handleRoleClick(role.title)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{role.title}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        +{role.growth}%
                      </Badge>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {role.description}
                  </p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Skills in High Demand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Award className="h-5 w-5 text-purple-600" />
                <span>Skills in High Demand</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trends.trendingSkills.slice(0, 3).map((skill, index) => (
                  <div key={skill.skill} className="flex items-center justify-between">
                    <span className="text-sm">{skill.skill}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getDemandColor(skill.demand)}`}>
                        {skill.demand}%
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Industry Growth Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Industry Growth Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trends.industryInsights.map((industry, index) => (
                  <div key={industry.industry} className="flex items-center justify-between">
                    <span className="text-sm">{industry.industry}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-green-600">
                        +{industry.growth}%
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Career Transition Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Career Transition Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {trends.emergingRoles.slice(0, 3).map((role, index) => (
                  <div key={role.title} className="flex items-center justify-between">
                    <span className="text-sm">{role.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-blue-600">
                        +{role.growth}%
                      </span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-muted-foreground">
        Auto-updating career trends weekly
      </div>
    </div>
  );
});

RealTimeJobFeed.displayName = 'RealTimeJobFeed';

export default RealTimeJobFeed;
