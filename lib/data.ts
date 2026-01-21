import { Metro, Submarket } from "@/types";
import metrosData from "@/data/metros.json";
import submarketData from "@/data/submarkets.json";

export function getMetros(): Metro[] {
  return metrosData.metros;
}

export function getMetroById(id: string): Metro | undefined {
  return metrosData.metros.find((m) => m.id === id);
}

export function getSubmarketsByMetroId(metroId: string): Submarket[] {
  return submarketData.submarkets.filter((s) => s.metroId === metroId);
}

export function getLastUpdated(): string {
  return metrosData.lastUpdated;
}

// Color scale for price changes (Finviz-style with subtle gradients)
export function getPriceChangeColor(priceChange: number): string {
  // Strong positive
  if (priceChange >= 10) return "bg-emerald-600 text-white";
  if (priceChange >= 7) return "bg-emerald-500 text-white";
  if (priceChange >= 5) return "bg-emerald-400 text-gray-900";
  // Moderate positive
  if (priceChange >= 3) return "bg-teal-300 text-gray-900";
  if (priceChange >= 1) return "bg-teal-200 text-gray-900";
  // Slight positive
  if (priceChange > 0) return "bg-teal-100 text-gray-900";
  // Neutral
  if (priceChange === 0) return "bg-gray-200 text-gray-900";
  // Slight negative
  if (priceChange > -1) return "bg-orange-100 text-gray-900";
  if (priceChange > -3) return "bg-orange-200 text-gray-900";
  // Moderate negative
  if (priceChange > -5) return "bg-orange-300 text-gray-900";
  // Strong negative
  if (priceChange > -7) return "bg-red-400 text-gray-900";
  return "bg-red-500 text-white";
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
