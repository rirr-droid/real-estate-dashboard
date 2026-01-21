"use client";

import { Metro, TimePeriod } from "@/types";
import { getPriceChangeColor, formatPercent, formatCurrency } from "@/lib/data";
import Link from "next/link";

interface MetroHeatmapProps {
  metros: Metro[];
  timePeriod: TimePeriod;
}

export default function MetroHeatmap({ metros, timePeriod }: MetroHeatmapProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
      {metros.map((metro) => {
        const priceChange = metro.priceChangeByPeriod[timePeriod];
        return (
          <Link
            key={metro.id}
            href={`/metro/${metro.id}`}
            className={`${getPriceChangeColor(
              priceChange
            )} p-3 rounded-lg hover:opacity-80 transition-opacity cursor-pointer border border-gray-300 shadow-sm`}
          >
            <div className="text-xs font-semibold truncate">
              {metro.name}
            </div>
            <div className="text-xs opacity-75 mt-0.5">{metro.state}</div>
            <div className="text-sm font-bold mt-2">
              {formatPercent(priceChange)}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {formatCurrency(metro.medianPrice)}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
