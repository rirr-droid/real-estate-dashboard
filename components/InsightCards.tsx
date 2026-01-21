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
      <Card className="bg-blue-100 border-blue-300">
        <Text className="text-black font-semibold">Market Average</Text>
        <Metric className="text-black">{formatPercent(avgPriceChange)}</Metric>
        <Text className="text-gray-700 text-sm mt-2">
          1-year price change across {metros.length} metros
        </Text>
      </Card>

      {/* Hot Markets */}
      <Card className="bg-green-100 border-green-300">
        <Text className="text-black font-semibold">Hot Markets</Text>
        <Metric className="text-black">{hotMarkets}</Metric>
        <Text className="text-gray-700 text-sm mt-2">
          Markets with 7%+ annual growth
        </Text>
      </Card>

      {/* STR Performance */}
      <Card className="bg-purple-100 border-purple-300">
        <Text className="text-black font-semibold">Avg STR RevPAR</Text>
        <Metric className="text-black">${avgRevPAR.toFixed(0)}</Metric>
        <Text className="text-gray-700 text-sm mt-2">
          Revenue per available room/day
        </Text>
      </Card>

      {/* Top Performer */}
      <Card className="bg-amber-100 border-amber-300">
        <Text className="text-black font-semibold">Top Performer</Text>
        <Link href={`/metro/${topPerformers[0].id}`}>
          <Metric className="text-black hover:underline cursor-pointer">
            {topPerformers[0].name}
          </Metric>
        </Link>
        <Text className="text-gray-700 text-sm mt-2">
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
