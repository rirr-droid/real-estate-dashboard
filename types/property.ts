export type PropertyType = "single-family" | "townhome" | "condo" | "multi-family";

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  metroId: string;
  metroName: string;

  // Property details
  propertyType: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number; // in sqft, optional for condos
  yearBuilt: number;

  // Market metrics
  pricePerSqft: number;
  daysOnMarket: number;
  priceReductions: number; // number of times price has been reduced
  lastPriceReduction?: number; // percentage of last reduction

  // Comparables
  avgPricePerSqftInArea: number;
  avgDaysOnMarketInArea: number;
  medianPriceInArea: number;

  // Deal score (1-10)
  dealScore: number;

  // Listing details
  listingUrl: string;
  imageUrl?: string;
  description: string;

  // Location
  latitude: number;
  longitude: number;
}

export interface DealAnalysis {
  dealScore: number; // 1-10
  dealRating: "Exceptional" | "Great" | "Good" | "Fair" | "Poor";
  factors: DealFactor[];
  negotiationStrategy: NegotiationStrategy;
}

export interface DealFactor {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  points: number; // contribution to score
}

export interface NegotiationStrategy {
  suggestedOffer: number;
  suggestedOfferPercentage: number; // % below asking
  strategy: string;
  leverage: string[];
  risks: string[];
}
