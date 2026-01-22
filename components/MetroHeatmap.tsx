"use client";

import { Metro, TimePeriod } from "@/types";
import { getPriceChangeColor, formatPercent, formatCurrency } from "@/lib/data";
import Link from "next/link";

interface MetroHeatmapProps {
  metros: Metro[];
  timePeriod: TimePeriod;
  metric?: string;
}

export default function MetroHeatmap({ metros, timePeriod, metric = "priceChange" }: MetroHeatmapProps) {
  // Get color based on metric
  const getMetricColor = (metro: Metro): string => {
    let value: number;

    switch (metric) {
      case "yield":
        value = metro.rentalYield;
        if (value >= 12) return "bg-green-300";
        if (value >= 10) return "bg-green-200";
        if (value >= 8) return "bg-green-100";
        if (value >= 6) return "bg-gray-100";
        if (value >= 4) return "bg-red-100";
        return "bg-red-200";

      case "revPAR":
        value = metro.strMetrics.revPAR;
        if (value >= 150) return "bg-green-300";
        if (value >= 120) return "bg-green-200";
        if (value >= 100) return "bg-green-100";
        if (value >= 80) return "bg-gray-100";
        if (value >= 60) return "bg-red-100";
        return "bg-red-200";

      case "price":
        value = metro.medianPrice;
        if (value >= 800000) return "bg-red-300";
        if (value >= 600000) return "bg-red-200";
        if (value >= 450000) return "bg-red-100";
        if (value >= 350000) return "bg-gray-100";
        if (value >= 300000) return "bg-green-100";
        return "bg-green-200";

      default: // priceChange
        return getPriceChangeColor(metro.priceChangeByPeriod[timePeriod]);
    }
  };

  const getMetricValue = (metro: Metro): string => {
    switch (metric) {
      case "yield":
        return `${metro.rentalYield.toFixed(2)}%`;
      case "revPAR":
        return `$${metro.strMetrics.revPAR}`;
      case "price":
        return formatCurrency(metro.medianPrice);
      default:
        return formatPercent(metro.priceChangeByPeriod[timePeriod]);
    }
  };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {metros.map((metro) => {
        return (
          <Link
            key={metro.id}
            href={`/metro/${metro.id}`}
            className={`${getMetricColor(metro)} p-4 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-all cursor-pointer`}
          >
            <div className="text-black">
              <div className="text-sm font-bold mb-1">
                {metro.name}
              </div>
              <div className="text-xs text-gray-700 mb-3">{metro.state}</div>

              <div className="text-2xl font-black mb-2 text-black">
                {getMetricValue(metro)}
              </div>
              <div className="text-xs text-black mb-1">
                {formatCurrency(metro.medianPrice)}
              </div>
              <div className="text-xs text-gray-700">
                ${metro.pricePerSqft}/sqft
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
