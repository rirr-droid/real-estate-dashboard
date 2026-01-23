import { Property, PropertyType } from "@/types/property";
import { calculateDealScore } from "./deal-scoring";
import { searchRealtorProperties, convertRealtorToProperty } from "./realtor-api";
import { getMetros } from "./data";

export interface PropertyFilters {
  city?: string;
  metroId?: string;
  radius?: number;
  propertyTypes?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSqft?: number;
  maxSqft?: number;
  minDealScore?: number;
}

/**
 * Search for real properties using Realtor.com API
 */
export async function searchRealProperties(
  filters: PropertyFilters
): Promise<Property[]> {
  try {
    // Parse city and state from input
    let city: string | undefined;
    let state: string | undefined;

    if (filters.city) {
      const parts = filters.city.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        city = parts[0];
        state = parts[1];
      } else {
        city = parts[0];
      }
    }

    // Map property types to Realtor API format
    let propertyType: string | undefined;
    if (filters.propertyTypes && filters.propertyTypes.length === 1) {
      const typeMap: Record<PropertyType, string> = {
        'single-family': 'single_family',
        'townhome': 'townhomes',
        'condo': 'condo',
        'multi-family': 'multi_family'
      };
      propertyType = typeMap[filters.propertyTypes[0]];
    }

    // Call Realtor API
    const result = await searchRealtorProperties({
      city,
      state_code: state,
      price_min: filters.minPrice,
      price_max: filters.maxPrice,
      beds_min: filters.minBedrooms,
      baths_min: filters.minBathrooms,
      sqft_min: filters.minSqft,
      sqft_max: filters.maxSqft,
      type: propertyType,
      limit: 100,
      sort: 'relevance'
    });

    // Get metro data for comparison metrics
    const metros = getMetros();
    const metro = metros.find(m =>
      city?.toLowerCase().includes(m.name.toLowerCase()) ||
      m.name.toLowerCase().includes(city?.toLowerCase() || '')
    ) || metros[0]; // Fallback to first metro

    // Convert to our format and calculate deal scores
    const properties = result.properties.map(realtorProp => {
      const prop = convertRealtorToProperty(realtorProp, {
        medianPrice: metro.medianPrice,
        avgPricePerSqft: metro.pricePerSqft,
        avgDaysOnMarket: metro.daysOnMarket
      });

      const analysis = calculateDealScore(prop);
      return {
        ...prop,
        dealScore: analysis.dealScore
      };
    });

    // Apply additional filters
    let filtered = properties;

    if (filters.minDealScore !== undefined) {
      filtered = filtered.filter(p => p.dealScore >= filters.minDealScore!);
    }

    // Sort by deal score
    filtered.sort((a, b) => b.dealScore - a.dealScore);

    return filtered;

  } catch (error) {
    console.error('Error fetching real properties:', error);
    throw error;
  }
}

/**
 * Format property type for display
 */
export function formatPropertyType(type: PropertyType): string {
  switch (type) {
    case "single-family": return "Single Family";
    case "townhome": return "Townhome";
    case "condo": return "Condo";
    case "multi-family": return "Multi-Family";
  }
}
