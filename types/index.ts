export type TimePeriod = "3M" | "1Y" | "2Y" | "5Y" | "10Y";

export interface PriceChangeByPeriod {
  "3M": number;
  "1Y": number;
  "2Y": number;
  "5Y": number;
  "10Y": number;
}

export interface STRMetrics {
  averageDailyRate: number;
  occupancyRate: number;
  revPAR: number; // Revenue per available room
  annualRevenue: number;
  seasonalityScore: number; // 1-10, higher = more seasonal
}

export interface Submarket {
  id: string;
  name: string;
  slug: string;
  metroId: string;
  metroName: string;
  state: string;
  priceChange: number;
  priceChangeByPeriod: PriceChangeByPeriod;
  medianPrice: number;
  pricePerSqft: number;
  volume: number;
  inventory: number;
  daysOnMarket: number;
  rentalYield: number;
  strMetrics: STRMetrics;
  listingsUrl: string;
}

export interface Metro {
  id: string;
  name: string;
  state: string;
  priceChange: number;
  priceChangeByPeriod: PriceChangeByPeriod;
  medianPrice: number;
  pricePerSqft: number;
  volume: number;
  inventory: number;
  daysOnMarket: number;
  rentalYield: number;
  strMetrics: STRMetrics;
  submarkets?: Submarket[];
}

export interface DashboardData {
  metros: Metro[];
  lastUpdated: string;
}
