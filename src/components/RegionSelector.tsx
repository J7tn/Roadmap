import React, { useState, useEffect } from 'react';
import { Globe, MapPin } from 'lucide-react';

export interface Region {
  id: string;
  name: string;
  countries: string[];
  flag: string;
}

export const REGIONS: Region[] = [
  {
    id: 'north-america',
    name: 'North America',
    countries: ['United States', 'Canada', 'Mexico'],
    flag: '🇺🇸'
  },
  {
    id: 'europe',
    name: 'Europe',
    countries: ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Switzerland'],
    flag: '🇪🇺'
  },
  {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    countries: ['Japan', 'South Korea', 'Singapore', 'Australia', 'New Zealand', 'Hong Kong', 'Taiwan'],
    flag: '🌏'
  },
  {
    id: 'south-america',
    name: 'South America',
    countries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay'],
    flag: '🇧🇷'
  },
  {
    id: 'africa',
    name: 'Africa',
    countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Ghana'],
    flag: '🌍'
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Israel', 'Qatar', 'Kuwait', 'Bahrain'],
    flag: '🇦🇪'
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

  const selectedRegionData = REGIONS.find(r => r.id === selectedRegion) || REGIONS[0];

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
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {selectedRegionData.flag} {selectedRegionData.name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Select Your Region
              </div>
              
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionSelect(region.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                    selectedRegion === region.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-lg">{region.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{region.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {region.countries.slice(0, 3).join(', ')}
                      {region.countries.length > 3 && ` +${region.countries.length - 3} more`}
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
            
            <div className="border-t border-gray-100 dark:border-gray-700 p-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>Market trends will be customized for your region</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RegionSelector;
