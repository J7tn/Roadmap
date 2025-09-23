import React, { useState, useEffect } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface Region {
  id: string;
  name: string;
  countries: string[];
  flag: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
}

export const REGIONS: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    countries: ['unitedStates', 'canada', 'mexico'],
    flag: '🇺🇸',
    currency: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar'
    }
  },
  {
    id: 'europe',
    name: 'Europe',
    countries: ['unitedKingdom', 'germany', 'france', 'netherlands', 'sweden', 'norway', 'denmark', 'switzerland'],
    flag: '🇪🇺',
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro'
    }
  },
  {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    countries: ['japan', 'southKorea', 'singapore', 'australia', 'newZealand', 'hongKong', 'taiwan'],
    flag: '🌏',
    currency: {
      code: 'JPY',
      symbol: '¥',
      name: 'Japanese Yen'
    }
  },
  {
    id: 'south-america',
    name: 'South America',
    countries: ['brazil', 'argentina', 'chile', 'colombia', 'peru', 'uruguay'],
    flag: '🇧🇷',
    currency: {
      code: 'BRL',
      symbol: 'R$',
      name: 'Brazilian Real'
    }
  },
  {
    id: 'africa',
    name: 'Africa',
    countries: ['southAfrica', 'nigeria', 'kenya', 'egypt', 'morocco', 'ghana'],
    flag: '🌍',
    currency: {
      code: 'ZAR',
      symbol: 'R',
      name: 'South African Rand'
    }
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    countries: ['unitedArabEmirates', 'saudiArabia', 'israel', 'qatar', 'kuwait', 'bahrain'],
    flag: '🇦🇪',
    currency: {
      code: 'AED',
      symbol: 'د.إ',
      name: 'UAE Dirham'
    }
  }
];

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (regionId: string) => void;
  className?: string;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onRegionChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

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

  const handleRegionSelect = (regionId: string) => {
    onRegionChange(regionId);
    setIsOpen(false);
    
    // Save to localStorage
    localStorage.setItem('selectedRegion', regionId);
  };

  useEffect(() => {
    // Load saved region from localStorage
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion && REGIONS.find(r => r.id === savedRegion)) {
      onRegionChange(savedRegion);
    }
  }, [onRegionChange]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-primary/10 transition-colors"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {selectedRegionData.flag} {getRegionName(selectedRegionData.id)}
        </span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop - invisible, just for click handling */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            style={{ backgroundColor: 'transparent', pointerEvents: 'auto' }}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] sm:w-64 bg-background border border-border rounded-lg shadow-lg z-30">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {t('settings.selectRegion')}
              </div>
              
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionSelect(region.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                    selectedRegion === region.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-primary/5 text-foreground'
                  }`}
                >
                  <span className="text-lg">{region.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{getRegionName(region.id)}</div>
                    <div className="text-xs text-muted-foreground">
                      {getCountryNames(region.countries).slice(0, 3).join(', ')}
                      {region.countries.length > 3 && ` +${region.countries.length - 3} ${t('common.more')}`}
                    </div>
                  </div>
                  {selectedRegion === region.id && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            <div className="border-t border-border p-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{t('settings.regionCustomizationNote')}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RegionSelector;
