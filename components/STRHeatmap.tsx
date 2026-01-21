"use client";

import { Metro } from "@/types";
import { formatCurrency } from "@/lib/data";
import Link from "next/link";

interface STRHeatmapProps {
  metros: Metro[];
  sortBy: "revPAR" | "occupancy" | "adr";
}

// SIMPLE color system - ALL TEXT IS BLACK
function getOccupancyColor(occupancy: number): string {
  if (occupancy >= 75) return "bg-green-300";
  if (occupancy >= 70) return "bg-green-200";
  if (occupancy >= 65) return "bg-green-100";
  if (occupancy >= 60) return "bg-yellow-100";
  if (occupancy >= 55) return "bg-orange-100";
  return "bg-red-100";
}

function getRevPARColor(revPAR: number): string {
  if (revPAR >= 150) return "bg-green-300";
  if (revPAR >= 120) return "bg-green-200";
  if (revPAR >= 100) return "bg-green-100";
  if (revPAR >= 80) return "bg-yellow-100";
  if (revPAR >= 60) return "bg-orange-100";
  return "bg-red-100";
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
            className={`${colorClass} p-4 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-all cursor-pointer`}
          >
            <div className="flex flex-col h-full text-black">
              <div className="text-sm font-bold mb-1">
                {metro.name}
              </div>
              <div className="text-xs text-gray-700 mb-3">{metro.state}</div>

              <div className="mt-auto space-y-2">
                <div>
                  <div className="text-xs text-gray-700 uppercase tracking-wide">ADR</div>
                  <div className="text-lg font-black text-black">
                    ${metro.strMetrics.averageDailyRate}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-700 uppercase tracking-wide">Occupancy</div>
                  <div className="text-lg font-black text-black">
                    {metro.strMetrics.occupancyRate.toFixed(1)}%
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-700 uppercase tracking-wide">RevPAR</div>
                  <div className="text-lg font-black text-black">
                    ${metro.strMetrics.revPAR}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-400">
                  <div className="text-xs text-gray-700">Annual Revenue</div>
                  <div className="text-sm font-bold text-black">
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
