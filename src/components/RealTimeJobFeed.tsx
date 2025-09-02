import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, BarChart3, Star, Zap, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RealTimeJobFeed: React.FC = React.memo(() => {
  // Mock data for career trends - in production this would come from real-time APIs
  const trends = useMemo(() => ({
    trendingSkills: [
      { skill: 'AI/ML', demand: 95, growth: 25, salary: 120000 },
      { skill: 'Cybersecurity', demand: 90, growth: 20, salary: 110000 },
      { skill: 'Cloud Computing', demand: 85, growth: 18, salary: 105000 },
      { skill: 'Data Science', demand: 88, growth: 22, salary: 115000 },
      { skill: 'DevOps', demand: 82, growth: 16, salary: 100000 },
    ],
    emergingRoles: [
      { title: 'AI Engineer', description: 'Build and deploy AI models', growth: 30, skills: ['Python', 'TensorFlow', 'ML'] },
      { title: 'DevOps Engineer', description: 'Automate deployment processes', growth: 25, skills: ['Docker', 'Kubernetes', 'CI/CD'] },
      { title: 'Data Engineer', description: 'Build data pipelines and infrastructure', growth: 28, skills: ['Python', 'SQL', 'Big Data'] },
      { title: 'Security Engineer', description: 'Protect systems and data', growth: 22, skills: ['Cybersecurity', 'Networking', 'Incident Response'] },
    ],
    industryInsights: [
      { industry: 'Technology', growth: 15, jobCount: 50000, avgSalary: 95000 },
      { industry: 'Healthcare', growth: 12, jobCount: 30000, avgSalary: 85000 },
      { industry: 'Finance', growth: 8, jobCount: 25000, avgSalary: 90000 },
      { industry: 'Manufacturing', growth: 5, jobCount: 20000, avgSalary: 75000 },
    ]
  }), []);

  const emergingSkills = useMemo(() => trends.trendingSkills.slice(0, 3), [trends.trendingSkills]);
  const industryInsights = useMemo(() => trends.industryInsights.slice(0, 2), [trends.industryInsights]);
  const formattedTime = useMemo(() => new Date().toLocaleTimeString(), []);

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
        <span>Real-time market data</span>
        <span>Last updated: {formattedTime}</span>
      </div>

      {/* Market Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-2">
                    {getDemandIcon(skill.demand)}
                    <span className="font-medium">{skill.skill}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${getDemandColor(skill.demand)}`}>
                      {skill.demand}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${skill.salary.toLocaleString()}
                    </div>
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
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{industry.industry}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      +{industry.growth}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {industry.jobCount.toLocaleString()} jobs
                    </div>
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
              {trends.emergingRoles.slice(0, 2).map((role, index) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.1, 0.5) }}
                  className="p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{role.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      +{role.growth}%
                    </Badge>
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
        Auto-updating career trends every 15 minutes
      </div>
    </div>
  );
});

RealTimeJobFeed.displayName = 'RealTimeJobFeed';

export default RealTimeJobFeed;
