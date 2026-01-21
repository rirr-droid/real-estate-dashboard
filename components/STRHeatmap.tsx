"use client";

import { Metro } from "@/types";
import { formatCurrency } from "@/lib/data";
import Link from "next/link";

interface STRHeatmapProps {
  metros: Metro[];
  sortBy: "revPAR" | "occupancy" | "adr";
}

function getOccupancyColor(occupancy: number): string {
  if (occupancy >= 75) return "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg";
  if (occupancy >= 70) return "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg";
  if (occupancy >= 65) return "bg-gradient-to-br from-green-300 to-green-400 text-gray-900 shadow-md";
  if (occupancy >= 60) return "bg-gradient-to-br from-yellow-300 to-yellow-400 text-gray-900 shadow-md";
  if (occupancy >= 55) return "bg-gradient-to-br from-orange-300 to-orange-400 text-gray-900 shadow-md";
  return "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-lg";
}

function getRevPARColor(revPAR: number): string {
  if (revPAR >= 150) return "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg";
  if (revPAR >= 120) return "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg";
  if (revPAR >= 100) return "bg-gradient-to-br from-green-300 to-green-400 text-gray-900 shadow-md";
  if (revPAR >= 80) return "bg-gradient-to-br from-yellow-300 to-yellow-400 text-gray-900 shadow-md";
  if (revPAR >= 60) return "bg-gradient-to-br from-orange-300 to-orange-400 text-gray-900 shadow-md";
  return "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-lg";
}

export default function STRHeatmap({ metros, sortBy }: STRHeatmapProps) {
  // Sort metros based on selected metric
  const sortedMetros = [...metros].sort((a, b) => {
    if (sortBy === "revPAR") return b.strMetrics.revPAR - a.strMetrics.revPAR;
    if (sortBy === "occupancy") return b.strMetrics.occupancyRate - a.strMetrics.occupancyRate;
    return b.strMetrics.averageDailyRate - a.strMetrics.averageDailyRate;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {sortedMetros.map((metro) => {
        const colorClass = sortBy === "occupancy"
          ? getOccupancyColor(metro.strMetrics.occupancyRate)
          : getRevPARColor(metro.strMetrics.revPAR);

        return (
          <Link
            key={metro.id}
            href={`/metro/${metro.id}`}
            className={`${colorClass} p-4 rounded-xl hover:scale-105 transition-all duration-200 cursor-pointer hover:shadow-xl`}
          >
            <div className="flex flex-col h-full">
              <div className="text-sm font-bold mb-1">
                {metro.name}
              </div>
              <div className="text-xs opacity-90 mb-3">{metro.state}</div>

              <div className="mt-auto space-y-2">
                <div>
                  <div className="text-xs opacity-75 uppercase tracking-wide">ADR</div>
                  <div className="text-lg font-black">
                    ${metro.strMetrics.averageDailyRate}
                  </div>
                </div>

                <div>
                  <div className="text-xs opacity-75 uppercase tracking-wide">Occupancy</div>
                  <div className="text-lg font-black">
                    {metro.strMetrics.occupancyRate.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="text-xs opacity-75 uppercase tracking-wide">RevPAR</div>
                  <div className="text-lg font-black">
                    ${metro.strMetrics.revPAR}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20">
                  <div className="text-xs opacity-75">Annual Revenue</div>
                  <div className="text-sm font-bold">
                    {formatCurrency(metro.strMetrics.annualRevenue)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
