"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  Title,
  Text,
  Grid,
  Metric,
  Badge,
} from "@tremor/react";
import {
  getSubmarketById,
  formatCurrency,
  formatPercent,
  formatNumber,
  getBadgeColor,
} from "@/lib/data";
import { TimePeriod } from "@/types";
import TimePeriodToggle from "@/components/TimePeriodToggle";

export default function SubmarketPage() {
  const params = useParams();
  const submarketId = params.id as string;
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1Y");

  const submarket = getSubmarketById(submarketId);

  if (!submarket) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl">
            <Title className="text-gray-900">Submarket Not Found</Title>
            <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block font-semibold">
              ← Back to Dashboard
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const priceChange = submarket.priceChangeByPeriod[timePeriod];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <Link
            href={`/metro/${submarket.metroId}`}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            ← Back to {submarket.metroName}
          </Link>
          <div className="flex items-center gap-4 mt-4">
            <Title className="text-4xl font-black text-gray-900">
              {submarket.name}
            </Title>
            <Badge color={getBadgeColor(priceChange)} size="xl" className="text-lg px-4 py-2">
              {formatPercent(priceChange)}
            </Badge>
          </div>
          <Text className="text-gray-600 mt-2">
            {submarket.metroName}, {submarket.state} • Submarket Analysis
          </Text>
        </div>

        {/* Time Period Selector */}
        <Card className="shadow-xl border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Text className="font-bold text-gray-900 text-lg mb-1">Time Period</Text>
              <Text className="text-gray-600 text-sm">Select historical timeframe for analysis</Text>
            </div>
            <TimePeriodToggle selected={timePeriod} onChange={setTimePeriod} />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-100 shadow-xl border-blue-300">
            <Text className="text-black font-semibold">Median Price</Text>
            <Metric className="text-black text-3xl">{formatCurrency(submarket.medianPrice)}</Metric>
            <Text className="text-gray-700 text-sm mt-2">${submarket.pricePerSqft}/sqft</Text>
          </Card>
          <Card className="bg-purple-100 shadow-xl border-purple-300">
            <Text className="text-black font-semibold">STR Revenue</Text>
            <Metric className="text-black text-3xl">${submarket.strMetrics.revPAR}/day</Metric>
            <Text className="text-gray-700 text-sm mt-2">
              {formatCurrency(submarket.strMetrics.annualRevenue)}/year
            </Text>
          </Card>
          <Card className="bg-green-100 shadow-xl border-green-300">
            <Text className="text-black font-semibold">Rental Yield</Text>
            <Metric className="text-black text-3xl">{submarket.rentalYield.toFixed(2)}%</Metric>
            <Text className="text-gray-700 text-sm mt-2">Annual return on investment</Text>
          </Card>
          <Card className="bg-amber-100 shadow-xl border-amber-300">
            <Text className="text-black font-semibold">Market Activity</Text>
            <Metric className="text-black text-3xl">{submarket.daysOnMarket}</Metric>
            <Text className="text-gray-700 text-sm mt-2">Days on market</Text>
          </Card>
        </div>

        {/* Additional Metrics */}
        <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
          <Card className="shadow-lg">
            <Text className="text-gray-700 font-semibold">Sales Volume</Text>
            <Metric className="text-gray-900">{formatNumber(submarket.volume)}</Metric>
          </Card>
          <Card className="shadow-lg">
            <Text className="text-gray-700 font-semibold">Inventory</Text>
            <Metric className="text-gray-900">{formatNumber(submarket.inventory)}</Metric>
          </Card>
          <Card className="shadow-lg">
            <Text className="text-gray-700 font-semibold">STR Occupancy</Text>
            <Metric className="text-gray-900">{submarket.strMetrics.occupancyRate.toFixed(1)}%</Metric>
          </Card>
          <Card className="shadow-lg">
            <Text className="text-gray-700 font-semibold">Avg Daily Rate</Text>
            <Metric className="text-gray-900">${submarket.strMetrics.averageDailyRate}</Metric>
          </Card>
        </Grid>

        {/* Redfin Listings Link */}
        <Card className="shadow-xl border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <Title className="text-2xl font-black text-gray-900 mb-2">
                View Active Listings
              </Title>
              <Text className="text-gray-700">
                Browse current homes for sale in {submarket.name} on Redfin
              </Text>
            </div>
            <a
              href={submarket.redfinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-center whitespace-nowrap"
            >
              View on Redfin →
            </a>
          </div>
        </Card>

        {/* Price History Card */}
        <Card className="shadow-xl border-gray-200">
          <Title className="text-2xl font-black text-gray-900 mb-4">Price History</Title>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <Text className="text-gray-600 text-sm font-semibold mb-1">3 Months</Text>
              <Metric className="text-gray-900">
                {formatPercent(submarket.priceChangeByPeriod["3M"])}
              </Metric>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <Text className="text-gray-600 text-sm font-semibold mb-1">1 Year</Text>
              <Metric className="text-gray-900">
                {formatPercent(submarket.priceChangeByPeriod["1Y"])}
              </Metric>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <Text className="text-gray-600 text-sm font-semibold mb-1">2 Years</Text>
              <Metric className="text-gray-900">
                {formatPercent(submarket.priceChangeByPeriod["2Y"])}
              </Metric>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <Text className="text-gray-600 text-sm font-semibold mb-1">5 Years</Text>
              <Metric className="text-gray-900">
                {formatPercent(submarket.priceChangeByPeriod["5Y"])}
              </Metric>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <Text className="text-gray-600 text-sm font-semibold mb-1">10 Years</Text>
              <Metric className="text-gray-900">
                {formatPercent(submarket.priceChangeByPeriod["10Y"])}
              </Metric>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
