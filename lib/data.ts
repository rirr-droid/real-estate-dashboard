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

// Clean, modern color system for price changes
export function getPriceChangeColor(priceChange: number): string {
  if (priceChange >= 10) return "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-200";
  if (priceChange >= 7) return "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-emerald-100";
  if (priceChange >= 5) return "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-green-100";
  if (priceChange >= 3) return "bg-gradient-to-br from-green-300 to-green-400 text-gray-900";
  if (priceChange >= 1) return "bg-gradient-to-br from-green-200 to-green-300 text-gray-900";
  if (priceChange > 0) return "bg-gradient-to-br from-green-100 to-green-200 text-gray-900";
  if (priceChange === 0) return "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900";
  if (priceChange > -1) return "bg-gradient-to-br from-yellow-100 to-yellow-200 text-gray-900";
  if (priceChange > -3) return "bg-gradient-to-br from-orange-200 to-orange-300 text-gray-900";
  if (priceChange > -5) return "bg-gradient-to-br from-orange-300 to-orange-400 text-gray-900";
  if (priceChange > -7) return "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-red-100";
  return "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200";
}

// Simpler color for badges
export function getBadgeColor(priceChange: number): "green" | "emerald" | "yellow" | "orange" | "red" {
  if (priceChange >= 5) return "green";
  if (priceChange >= 0) return "emerald";
  if (priceChange >= -3) return "yellow";
  if (priceChange >= -7) return "orange";
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
