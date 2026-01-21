"use client";

import { Metro } from "@/types";
import { Card, Metric, Text } from "@tremor/react";
import { formatPercent, formatCurrency, getTopPerformers, getBestSTRMarkets } from "@/lib/data";
import Link from "next/link";

interface InsightCardsProps {
  metros: Metro[];
}

export default function InsightCards({ metros }: InsightCardsProps) {
  const topPerformers = getTopPerformers(metros, 3);
  const bestSTR = getBestSTRMarkets(metros, 3);

  const avgPriceChange = metros.reduce((sum, m) => sum + m.priceChangeByPeriod["1Y"], 0) / metros.length;
  const avgRevPAR = metros.reduce((sum, m) => sum + m.strMetrics.revPAR, 0) / metros.length;
  const hotMarkets = metros.filter(m => m.priceChangeByPeriod["1Y"] >= 7).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Market Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <Text className="text-blue-900 font-semibold">Market Average</Text>
        <Metric className="text-blue-900">{formatPercent(avgPriceChange)}</Metric>
        <Text className="text-blue-700 text-sm mt-2">
          1-year price change across {metros.length} metros
        </Text>
      </Card>

      {/* Hot Markets */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <Text className="text-emerald-900 font-semibold">Hot Markets</Text>
        <Metric className="text-emerald-900">{hotMarkets}</Metric>
        <Text className="text-emerald-700 text-sm mt-2">
          Markets with 7%+ annual growth
        </Text>
      </Card>

      {/* STR Performance */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <Text className="text-purple-900 font-semibold">Avg STR RevPAR</Text>
        <Metric className="text-purple-900">${avgRevPAR.toFixed(0)}</Metric>
        <Text className="text-purple-700 text-sm mt-2">
          Revenue per available room/day
        </Text>
      </Card>

      {/* Top Performer */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <Text className="text-amber-900 font-semibold">Top Performer</Text>
        <Link href={`/metro/${topPerformers[0].id}`}>
          <Metric className="text-amber-900 hover:underline cursor-pointer">
            {topPerformers[0].name}
          </Metric>
        </Link>
        <Text className="text-amber-700 text-sm mt-2">
          {formatPercent(topPerformers[0].priceChangeByPeriod["1Y"])} growth
        </Text>
      </Card>

      {/* Top 3 Performers Detail */}
      <Card className="md:col-span-2 lg:col-span-2">
        <Text className="font-bold text-gray-900 mb-3">🔥 Top Performing Markets</Text>
        <div className="space-y-2">
          {topPerformers.map((metro, index) => (
            <Link key={metro.id} href={`/metro/${metro.id}`}>
              <div className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black text-green-700">#{index + 1}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{metro.name}, {metro.state}</div>
                    <div className="text-sm text-gray-600">{formatCurrency(metro.medianPrice)} • ${metro.pricePerSqft}/sqft</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-700">{formatPercent(metro.priceChangeByPeriod["1Y"])}</div>
                  <div className="text-xs text-gray-600">{metro.rentalYield.toFixed(2)}% yield</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Best STR Markets */}
      <Card className="md:col-span-2 lg:col-span-2">
        <Text className="font-bold text-gray-900 mb-3">💰 Best STR Markets (RevPAR)</Text>
        <div className="space-y-2">
          {bestSTR.map((metro, index) => (
            <Link key={metro.id} href={`/metro/${metro.id}`}>
              <div className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-black text-purple-700">#{index + 1}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{metro.name}, {metro.state}</div>
                    <div className="text-sm text-gray-600">
                      ${metro.strMetrics.averageDailyRate} ADR • {metro.strMetrics.occupancyRate.toFixed(1)}% Occ
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-700">${metro.strMetrics.revPAR}/day</div>
                  <div className="text-xs text-gray-600">{formatCurrency(metro.strMetrics.annualRevenue)}/yr</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
