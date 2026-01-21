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

// Clean, modern color system for price changes - ALL TEXT DARK FOR READABILITY
export function getPriceChangeColor(priceChange: number): string {
  // Strong positive - darker backgrounds with white text
  if (priceChange >= 10) return "bg-emerald-600 text-white shadow-lg";
  if (priceChange >= 7) return "bg-emerald-500 text-white shadow-lg";
  if (priceChange >= 5) return "bg-emerald-400 text-gray-900 shadow-md";
  // Moderate positive - light backgrounds with dark text
  if (priceChange >= 3) return "bg-emerald-300 text-gray-900 shadow-md";
  if (priceChange >= 1) return "bg-green-200 text-gray-900 shadow-sm";
  if (priceChange > 0) return "bg-green-100 text-gray-900 shadow-sm";
  // Neutral
  if (priceChange === 0) return "bg-gray-200 text-gray-900 shadow-sm";
  // Slight negative
  if (priceChange > -1) return "bg-orange-100 text-gray-900 shadow-sm";
  if (priceChange > -3) return "bg-orange-200 text-gray-900 shadow-sm";
  // Moderate negative
  if (priceChange > -5) return "bg-orange-300 text-gray-900 shadow-md";
  if (priceChange > -7) return "bg-red-400 text-gray-900 shadow-md";
  // Strong negative - darker backgrounds with white text
  return "bg-red-500 text-white shadow-lg";
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
