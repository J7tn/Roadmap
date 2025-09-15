import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Globe, 
  Bell, 
  Moon, 
  Sun, 
  Palette,
  Check
} from 'lucide-react';
import RegionSelector, { REGIONS } from '@/components/RegionSelector';
import { useNavigate } from 'react-router-dom';
import { useRegion } from '@/contexts/RegionContext';
import { useTheme } from '@/contexts/ThemeContext';
import BottomNavigation from '@/components/BottomNavigation';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRegion, setSelectedRegion, getRegionDisplayName } = useRegion();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedNotifications = localStorage.getItem('notificationsEnabled');
    if (savedNotifications !== null) setNotificationsEnabled(savedNotifications === 'true');
  }, []);

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notificationsEnabled', newValue.toString());
  };

  const selectedRegionData = REGIONS.find(r => r.id === selectedRegion) || REGIONS[0];

  return (
    <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-background border-b border-border safe-area-top">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Region Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Globe className="h-5 w-5 text-primary" />
              Region & Location
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set your region to see personalized career trends and market data
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Current Region</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRegionData.flag} {selectedRegionData.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {selectedRegionData.countries.slice(0, 3).join(', ')}
                  {selectedRegionData.countries.length > 3 && ` +${selectedRegionData.countries.length - 3} more`}
                </p>
              </div>
              <RegionSelector
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
              />
            </div>
            
            <div className="bg-muted/50 dark:bg-muted/30 border border-muted rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-primary mt-0.5" />
                </div>
                <div>
                  <h4 className="font-medium">Regional Personalization Active</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    All career trends, market data, and insights are now customized for {selectedRegionData.name}. 
                    This affects job availability, salary trends, and growth opportunities throughout the app.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage how you receive updates and alerts
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive updates about new career opportunities and market trends
                </p>
              </div>
              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleNotificationsToggle}
                className="min-w-[80px]"
              >
                {notificationsEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize the look and feel of the app
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Switch between light and dark themes
                </p>
              </div>
              <Button
                variant={isDarkMode ? "default" : "outline"}
                size="sm"
                onClick={toggleDarkMode}
                className="min-w-[80px]"
              >
                {isDarkMode ? (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-gray-100">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">App Version</span>
              <Badge variant="secondary">1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Data Source</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">Supabase + Regional Analytics</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
        </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
