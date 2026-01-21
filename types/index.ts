export interface Submarket {
  id: string;
  name: string;
  metroId: string;
  priceChange: number;
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
