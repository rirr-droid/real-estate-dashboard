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

// Color scale for price changes (Finviz-style)
export function getPriceChangeColor(priceChange: number): string {
  if (priceChange >= 10) return "bg-green-700";
  if (priceChange >= 7) return "bg-green-600";
  if (priceChange >= 5) return "bg-green-500";
  if (priceChange >= 3) return "bg-green-400";
  if (priceChange >= 1) return "bg-green-300";
  if (priceChange >= 0) return "bg-green-200";
  if (priceChange >= -1) return "bg-red-200";
  if (priceChange >= -3) return "bg-red-300";
  if (priceChange >= -5) return "bg-red-400";
  return "bg-red-500";
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
