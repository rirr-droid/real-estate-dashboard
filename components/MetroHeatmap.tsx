"use client";

import { Metro } from "@/types";
import { getPriceChangeColor, formatPercent, formatCurrency } from "@/lib/data";
import Link from "next/link";

interface MetroHeatmapProps {
  metros: Metro[];
}

export default function MetroHeatmap({ metros }: MetroHeatmapProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
      {metros.map((metro) => (
        <Link
          key={metro.id}
          href={`/metro/${metro.id}`}
          className={`${getPriceChangeColor(
            metro.priceChange
          )} p-3 rounded-lg hover:opacity-80 transition-opacity cursor-pointer border border-gray-300 shadow-sm`}
        >
          <div className="text-xs font-semibold text-gray-900 truncate">
            {metro.name}
          </div>
          <div className="text-xs text-gray-700 mt-0.5">{metro.state}</div>
          <div className="text-sm font-bold text-gray-900 mt-2">
            {formatPercent(metro.priceChange)}
          </div>
          <div className="text-xs text-gray-700 mt-1">
            {formatCurrency(metro.medianPrice)}
          </div>
        </Link>
      ))}
    </div>
  );
}
