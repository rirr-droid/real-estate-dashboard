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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {metros.map((metro) => {
        const priceChange = metro.priceChangeByPeriod[timePeriod];
        return (
          <Link
            key={metro.id}
            href={`/metro/${metro.id}`}
            className={`${getPriceChangeColor(priceChange)} p-4 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-all cursor-pointer`}
          >
            <div className="text-black">
              <div className="text-sm font-bold mb-1">
                {metro.name}
              </div>
              <div className="text-xs text-gray-700 mb-3">{metro.state}</div>

              <div className="text-2xl font-black mb-2 text-black">
                {formatPercent(priceChange)}
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
