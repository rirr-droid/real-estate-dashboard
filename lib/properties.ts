import propertiesData from "@/data/properties.json";
import { Property, PropertyType } from "@/types/property";
import { calculateDealScore } from "./deal-scoring";

export interface PropertyFilters {
  city?: string;
  metroId?: string;
  radius?: number; // miles
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

// Cache for scored properties
let scoredProperties: Property[] | null = null;

export function getAllProperties(): Property[] {
  if (scoredProperties) return scoredProperties;

  // Calculate deal scores for all properties
  scoredProperties = propertiesData.properties.map(prop => {
    const analysis = calculateDealScore(prop as Property);
    return {
      ...prop,
      dealScore: analysis.dealScore
    } as Property;
  });

  return scoredProperties;
}

export function filterProperties(filters: PropertyFilters): Property[] {
  let properties = getAllProperties();

  // Filter by metro/city
  if (filters.metroId) {
    properties = properties.filter(p => p.metroId === filters.metroId);
  } else if (filters.city) {
    const cityLower = filters.city.toLowerCase();
    properties = properties.filter(p =>
      p.city.toLowerCase().includes(cityLower) ||
      p.metroName.toLowerCase().includes(cityLower)
    );
  }

  // Filter by property types
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    properties = properties.filter(p => filters.propertyTypes!.includes(p.propertyType));
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    properties = properties.filter(p => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    properties = properties.filter(p => p.price <= filters.maxPrice!);
  }

  // Filter by bedrooms
  if (filters.minBedrooms !== undefined) {
    properties = properties.filter(p => p.bedrooms >= filters.minBedrooms!);
  }
  if (filters.maxBedrooms !== undefined) {
    properties = properties.filter(p => p.bedrooms <= filters.maxBedrooms!);
  }

  // Filter by bathrooms
  if (filters.minBathrooms !== undefined) {
    properties = properties.filter(p => p.bathrooms >= filters.minBathrooms!);
  }
  if (filters.maxBathrooms !== undefined) {
    properties = properties.filter(p => p.bathrooms <= filters.maxBathrooms!);
  }

  // Filter by square footage
  if (filters.minSqft !== undefined) {
    properties = properties.filter(p => p.sqft >= filters.minSqft!);
  }
  if (filters.maxSqft !== undefined) {
    properties = properties.filter(p => p.sqft <= filters.maxSqft!);
  }

  // Filter by deal score
  if (filters.minDealScore !== undefined) {
    properties = properties.filter(p => p.dealScore >= filters.minDealScore!);
  }

  return properties;
}

export function getTopDeals(filters: PropertyFilters, limit: number = 50): Property[] {
  const filtered = filterProperties(filters);

  // Sort by deal score (highest first)
  return filtered
    .sort((a, b) => b.dealScore - a.dealScore)
    .slice(0, limit);
}

export function formatPropertyType(type: PropertyType): string {
  switch (type) {
    case "single-family": return "Single Family";
    case "townhome": return "Townhome";
    case "condo": return "Condo";
    case "multi-family": return "Multi-Family";
  }
}
