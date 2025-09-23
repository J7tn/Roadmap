import { REGIONS, Region } from '@/components/RegionSelector';

/**
 * Get the currency information for a given region
 */
export function getRegionCurrency(regionId: string): Region['currency'] | null {
  const region = REGIONS.find(r => r.id === regionId);
  return region?.currency || null;
}

/**
 * Get the current region's currency from localStorage
 */
export function getCurrentRegionCurrency(): Region['currency'] | null {
  const selectedRegion = localStorage.getItem('selectedRegion') || 'north-america';
  return getRegionCurrency(selectedRegion);
}

/**
 * Format a salary amount with the appropriate currency symbol
 */
export function formatSalary(amount: number, regionId?: string): string {
  const region = regionId ? getRegionCurrency(regionId) : getCurrentRegionCurrency();
  
  if (!region) {
    return `$${amount.toLocaleString()}`;
  }

  // Format the number with appropriate locale
  const formattedAmount = amount.toLocaleString();
  
  // Return with currency symbol
  return `${region.symbol}${formattedAmount}`;
}

/**
 * Get currency code for a region
 */
export function getCurrencyCode(regionId?: string): string {
  const region = regionId ? getRegionCurrency(regionId) : getCurrentRegionCurrency();
  return region?.code || 'USD';
}

/**
 * Get currency symbol for a region
 */
export function getCurrencySymbol(regionId?: string): string {
  const region = regionId ? getRegionCurrency(regionId) : getCurrentRegionCurrency();
  return region?.symbol || '$';
}
