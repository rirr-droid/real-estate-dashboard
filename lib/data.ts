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

// SIMPLE color system - ALL TEXT IS BLACK
export function getPriceChangeColor(priceChange: number): string {
  if (priceChange >= 7) return "bg-green-300";
  if (priceChange >= 4) return "bg-green-200";
  if (priceChange >= 1) return "bg-green-100";
  if (priceChange > 0) return "bg-green-50";
  if (priceChange === 0) return "bg-gray-100";
  if (priceChange > -1) return "bg-red-50";
  if (priceChange > -4) return "bg-red-100";
  return "bg-red-200";
}

// Badge colors for Tremor
export function getBadgeColor(priceChange: number): "green" | "emerald" | "gray" | "orange" | "red" {
  if (priceChange >= 5) return "green";
  if (priceChange >= 0) return "emerald";
  if (priceChange >= -3) return "orange";
  return "red";
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

// Get top performing metros
export function getTopPerformers(metros: Metro[], count: number = 5): Metro[] {
  return [...metros].sort((a, b) => b.priceChangeByPeriod["1Y"] - a.priceChangeByPeriod["1Y"]).slice(0, count);
}

// Get bottom performing metros
export function getBottomPerformers(metros: Metro[], count: number = 5): Metro[] {
  return [...metros].sort((a, b) => a.priceChangeByPeriod["1Y"] - b.priceChangeByPeriod["1Y"]).slice(0, count);
}

// Get best STR markets by RevPAR
export function getBestSTRMarkets(metros: Metro[], count: number = 5): Metro[] {
  return [...metros].sort((a, b) => b.strMetrics.revPAR - a.strMetrics.revPAR).slice(0, count);
}

// Get best rental yield markets
export function getBestRentalYields(metros: Metro[], count: number = 5): Metro[] {
  return [...metros].sort((a, b) => b.rentalYield - a.rentalYield).slice(0, count);
}
