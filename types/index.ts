export type TimePeriod = "3M" | "1Y" | "2Y" | "5Y" | "10Y";

export interface PriceChangeByPeriod {
  "3M": number;
  "1Y": number;
  "2Y": number;
  "5Y": number;
  "10Y": number;
}

export interface Submarket {
  id: string;
  name: string;
  metroId: string;
  priceChange: number;
  priceChangeByPeriod: PriceChangeByPeriod;
  medianPrice: number;
  volume: number;
  inventory: number;
  daysOnMarket: number;
}

export interface Metro {
  id: string;
  name: string;
  state: string;
  priceChange: number;
  priceChangeByPeriod: PriceChangeByPeriod;
  medianPrice: number;
  volume: number;
  inventory: number;
  daysOnMarket: number;
  submarkets?: Submarket[];
}

export interface DashboardData {
  metros: Metro[];
  lastUpdated: string;
}
