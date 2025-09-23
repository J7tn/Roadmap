import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import BottomNavigation from '@/components/BottomNavigation';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRegion, setSelectedRegion, getRegionDisplayName } = useRegion();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const { t, i18n } = useTranslation();
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

  // Helper function to get translated region name
  const getRegionName = (regionId: string) => {
    const regionKeyMap: { [key: string]: string } = {
      'north-america': 'northAmerica',
      'europe': 'europe',
      'asia-pacific': 'asiaPacific',
      'south-america': 'southAmerica',
      'africa': 'africa',
      'middle-east': 'middleEast'
    };
    const regionKey = regionKeyMap[regionId] || regionId;
    return t(`regions.${regionKey}`);
  };

  // Helper function to get translated country names
  const getCountryNames = (countryKeys: string[]) => {
    return countryKeys.map(key => t(`countries.${key}`));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-background border-b border-border safe-area-top">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.title')}</h1>
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
{t('settings.regionLocation')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
{t('settings.setRegionDescription')}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('settings.currentRegion')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRegionData.flag} {getRegionName(selectedRegionData.id)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {getCountryNames(selectedRegionData.countries).slice(0, 3).join(', ')}
                  {selectedRegionData.countries.length > 3 && ` +${selectedRegionData.countries.length - 3} ${t('common.more')}`}
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
                  <h4 className="font-medium">{t('settings.regionalPersonalizationActive')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('settings.regionalPersonalizationDescription')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Globe className="h-5 w-5 text-primary" />
              {t('settings.language')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('settings.chooseLanguageDescription')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('settings.language')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('settings.selectLanguage')}
                  </p>
                </div>
              </div>
              
              <Select value={currentLanguage} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('settings.selectLanguagePlaceholder')}>
                    {availableLanguages.find(lang => lang.code === currentLanguage)?.nativeName || 'English'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{language.nativeName}</span>
                        <span className="text-sm text-muted-foreground ml-2">{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Bell className="h-5 w-5 text-primary" />
              {t('settings.notifications')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('settings.notificationsDescription')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('settings.pushNotifications')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('settings.receiveUpdates')}
                </p>
              </div>
              <Button
                variant={notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleNotificationsToggle}
                className="min-w-[80px]"
              >
                {notificationsEnabled ? t('settings.notificationsEnabled') : t('settings.notificationsDisabled')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Palette className="h-5 w-5 text-primary" />
              {t('settings.appearance')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('settings.customizeLookFeel')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('settings.darkMode')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('settings.switchThemes')}
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
                    {t('settings.dark')}
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    {t('settings.light')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-gray-100">{t('settings.about')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('settings.appVersion')}</span>
              <Badge variant="secondary">1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('settings.dataSource')}</span>
              <span className="text-sm text-gray-900 dark:text-gray-100">{t('settings.dataSourceValue')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('settings.lastUpdated')}</span>
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
