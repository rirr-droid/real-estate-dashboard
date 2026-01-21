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
            className={`${getPriceChangeColor(
              priceChange
            )} p-4 rounded-xl hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl`}
          >
            <div className="flex flex-col h-full">
              <div className="text-sm font-bold mb-1">
                {metro.name}
              </div>
              <div className="text-xs opacity-90 mb-3">{metro.state}</div>

              <div className="mt-auto">
                <div className="text-2xl font-black mb-2">
                  {formatPercent(priceChange)}
                </div>
                <div className="text-xs opacity-90">
                  {formatCurrency(metro.medianPrice)}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  ${metro.pricePerSqft}/sqft
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
