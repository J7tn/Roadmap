import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { EditableCareerService, EditableCareerData } from '@/services/editableCareerService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
  Target, 
  BookOpen,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface CareerEditorProps {
  careerId: string;
  onSave?: (career: EditableCareerData) => void;
  onCancel?: () => void;
}

export const CareerEditor: React.FC<CareerEditorProps> = ({ 
  careerId, 
  onSave, 
  onCancel 
}) => {
  const { t } = useTranslation();
  const [career, setCareer] = useState<EditableCareerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load career data
  useEffect(() => {
    loadCareerData();
  }, [careerId]);

  const loadCareerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EditableCareerService.getCareerData(careerId);
      setCareer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load career data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!career) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updatedCareer = await EditableCareerService.updateCareerData({
        careerId: career.id,
        updates: career
      });

      setCareer(updatedCareer);
      setSuccess('Career data updated successfully!');
      onSave?.(updatedCareer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save career data');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    if (!career) return;

    try {
      setRefreshing(true);
      setError(null);
      setSuccess(null);

      const refreshedCareer = await EditableCareerService.refreshCareerData(career.id);
      setCareer(refreshedCareer);
      setSuccess('Career data refreshed with latest market information!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh career data');
    } finally {
      setRefreshing(false);
    }
  };

  const updateField = (field: string, value: any) => {
    if (!career) return;
    setCareer(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateSalary = (field: 'min' | 'max', value: number) => {
    if (!career) return;
    setCareer(prev => prev ? {
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value
      }
    } : null);
  };

  const updateGrowthPotential = (field: 'percentage' | 'description', value: any) => {
    if (!career) return;
    setCareer(prev => prev ? {
      ...prev,
      growthPotential: {
        ...prev.growthPotential,
        [field]: value
      }
    } : null);
  };

  const updateRoadmap = (period: 'shortTerm' | 'mediumTerm' | 'longTerm', value: string[]) => {
    if (!career) return;
    setCareer(prev => prev ? {
      ...prev,
      roadmap: {
        ...prev.roadmap,
        [period]: value
      }
    } : null);
  };

  const addRoadmapItem = (period: 'shortTerm' | 'mediumTerm' | 'longTerm', item: string) => {
    if (!career || !item.trim()) return;
    const currentItems = career.roadmap[period];
    updateRoadmap(period, [...currentItems, item.trim()]);
  };

  const removeRoadmapItem = (period: 'shortTerm' | 'mediumTerm' | 'longTerm', index: number) => {
    if (!career) return;
    const currentItems = career.roadmap[period];
    updateRoadmap(period, currentItems.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading career data...</span>
      </div>
    );
  }

  if (error && !career) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to Load Career Data</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadCareerData}>{t('buttons.tryAgain')}</Button>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Career Not Found</h3>
        <p className="text-muted-foreground">The requested career data could not be found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{career.title}</h2>
          <p className="text-muted-foreground">
            Last updated: {new Date(career.lastUpdated).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Data
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Editor Tabs */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="salary">Salary & Growth</TabsTrigger>
          <TabsTrigger value="skills">Skills & Requirements</TabsTrigger>
          <TabsTrigger value="roadmap">Career Roadmap</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={career.title}
                    onChange={(e) => updateField('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={career.category}
                    onChange={(e) => updateField('category', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={career.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Input
                  id="experience"
                  value={career.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary & Growth */}
        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Salary Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="salary-min">Minimum Salary</Label>
                  <Input
                    id="salary-min"
                    type="number"
                    value={career.salary.min}
                    onChange={(e) => updateSalary('min', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="salary-max">Maximum Salary</Label>
                  <Input
                    id="salary-max"
                    type="number"
                    value={career.salary.max}
                    onChange={(e) => updateSalary('max', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="salary-currency">Currency</Label>
                  <Input
                    id="salary-currency"
                    value={career.salary.currency}
                    onChange={(e) => updateField('salary', { ...career.salary, currency: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Growth Potential
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="growth-percentage">Growth Percentage</Label>
                  <Input
                    id="growth-percentage"
                    type="number"
                    value={career.growthPotential.percentage}
                    onChange={(e) => updateGrowthPotential('percentage', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="growth-description">Growth Description</Label>
                  <Input
                    id="growth-description"
                    value={career.growthPotential.description}
                    onChange={(e) => updateGrowthPotential('description', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills & Requirements */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {career.requiredSkills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="secondary">{skill}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSkills = career.requiredSkills.filter((_, i) => i !== index);
                        updateField('requiredSkills', newSkills);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    placeholder={t('assessment.placeholders.addNewSkill')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const newSkill = e.currentTarget.value.trim();
                        if (newSkill) {
                          updateField('requiredSkills', [...career.requiredSkills, newSkill]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {career.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm">{step}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSteps = career.nextSteps.filter((_, i) => i !== index);
                        updateField('nextSteps', newSteps);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    placeholder={t('assessment.placeholders.addNextStep')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const newStep = e.currentTarget.value.trim();
                        if (newStep) {
                          updateField('nextSteps', [...career.nextSteps, newStep]);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Career Roadmap */}
        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Career Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Short Term */}
              <div>
                <h4 className="font-semibold mb-2">Short Term (3-6 months)</h4>
                <div className="space-y-2">
                  {career.roadmap.shortTerm.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm">{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoadmapItem('shortTerm', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      placeholder={t('assessment.placeholders.addShortTermGoal')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addRoadmapItem('shortTerm', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Medium Term */}
              <div>
                <h4 className="font-semibold mb-2">Medium Term (6-12 months)</h4>
                <div className="space-y-2">
                  {career.roadmap.mediumTerm.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm">{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoadmapItem('mediumTerm', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      placeholder={t('assessment.placeholders.addMediumTermGoal')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addRoadmapItem('mediumTerm', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Long Term */}
              <div>
                <h4 className="font-semibold mb-2">Long Term (1+ years)</h4>
                <div className="space-y-2">
                  {career.roadmap.longTerm.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm">{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoadmapItem('longTerm', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      placeholder={t('assessment.placeholders.addLongTermGoal')}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addRoadmapItem('longTerm', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
