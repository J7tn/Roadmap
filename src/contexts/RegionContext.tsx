import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { regionalTrendService } from '@/services/regionalTrendService';

interface RegionContextType {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  getRegionDisplayName: (regionId?: string) => string;
  isRegionLoaded: boolean;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

interface RegionProviderProps {
  children: ReactNode;
}

export const RegionProvider: React.FC<RegionProviderProps> = ({ children }) => {
  const [selectedRegion, setSelectedRegionState] = useState<string>('north-america');
  const [isRegionLoaded, setIsRegionLoaded] = useState<boolean>(false);

  // Load region from localStorage on mount
  useEffect(() => {
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion && regionalTrendService.getAllRegions().find(r => r.id === savedRegion)) {
      setSelectedRegionState(savedRegion);
    }
    setIsRegionLoaded(true);
  }, []);

  const setSelectedRegion = (region: string) => {
    setSelectedRegionState(region);
    localStorage.setItem('selectedRegion', region);
  };

  const getRegionDisplayName = (regionId?: string) => {
    return regionalTrendService.getRegionDisplayName(regionId || selectedRegion);
  };

  const value: RegionContextType = {
    selectedRegion,
    setSelectedRegion,
    getRegionDisplayName,
    isRegionLoaded
  };

  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = (): RegionContextType => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
