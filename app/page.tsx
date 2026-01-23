"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Title, Text, TabGroup, TabList, Tab, TabPanels, TabPanel, Select, SelectItem } from "@tremor/react";
import MetroHeatmap from "@/components/MetroHeatmap";
import STRHeatmap from "@/components/STRHeatmap";
import MetroTable from "@/components/MetroTable";
import TimePeriodToggle from "@/components/TimePeriodToggle";
import InsightCards from "@/components/InsightCards";
import { getMetros, getLastUpdated } from "@/lib/data";
import { TimePeriod } from "@/types";

export default function Home() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1Y");
  const [strSortBy, setSTRSortBy] = useState<"revPAR" | "occupancy" | "adr">("revPAR");
  const [heatmapMetric, setHeatmapMetric] = useState<string>("priceChange");
  const metros = getMetros();
  const lastUpdated = new Date(getLastUpdated()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <Title className="text-4xl md:text-5xl font-black text-gray-900">
            Real Estate Market Intelligence
          </Title>
          <Text className="text-gray-600 text-lg">
            {metros.length} US Metro Markets • Updated {lastUpdated}
          </Text>

          {/* Quick Navigation */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            <Link
              href="/deal-hunter-api"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors relative"
            >
              🎯 Deal Hunter (Real Listings)
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                NEW
              </span>
            </Link>
            <Link
              href="/screener"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              🔍 Advanced Screener
            </Link>
            <Link
              href="/map"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
            >
              📊 Bubble Chart
            </Link>
            <Link
              href="/compare"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
            >
              ⚖️ Compare Markets
            </Link>
            <Link
              href="/watchlist"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
            >
              ⭐ My Watchlist
            </Link>
          </div>
        </div>

        {/* Key Insights */}
        <InsightCards metros={metros} />

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

        {/* Main Content Tabs */}
        <Card className="shadow-xl border-gray-200">
          <TabGroup>
            <TabList className="mb-6">
              <Tab className="text-base">Market Heatmap</Tab>
              <Tab className="text-base">STR Investor View</Tab>
              <Tab className="text-base">Detailed Table</Tab>
            </TabList>
            <TabPanels>
              {/* Market Heatmap Tab */}
              <TabPanel>
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <Text className="text-gray-700 font-semibold">View By:</Text>
                      <Select value={heatmapMetric} onValueChange={setHeatmapMetric} className="w-48">
                        <SelectItem value="priceChange">Price Change</SelectItem>
                        <SelectItem value="yield">Rental Yield</SelectItem>
                        <SelectItem value="revPAR">STR RevPAR</SelectItem>
                        <SelectItem value="price">Median Price</SelectItem>
                      </Select>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-300 rounded"></div>
                        <span className="text-gray-700">High</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <span className="text-gray-700">Average</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-200 rounded"></div>
                        <span className="text-gray-700">Low</span>
                      </div>
                    </div>
                  </div>
                  <Text className="text-gray-600 text-sm">
                    Click any market to explore submarkets and detailed metrics
                  </Text>
                  <MetroHeatmap metros={metros} timePeriod={timePeriod} metric={heatmapMetric} />
                </div>
              </TabPanel>

              {/* STR Investor Tab */}
              <TabPanel>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <Title className="text-xl">Short-Term Rental Performance</Title>
                      <Text className="text-gray-600 mt-1">
                        Analyze markets by occupancy rates, daily rates, and revenue potential
                      </Text>
                    </div>
                    <div className="w-full sm:w-64">
                      <Text className="text-sm font-medium text-gray-700 mb-2">Sort By</Text>
                      <Select value={strSortBy} onValueChange={(value) => setSTRSortBy(value as "revPAR" | "occupancy" | "adr")}>
                        <SelectItem value="revPAR">Revenue per Room (RevPAR)</SelectItem>
                        <SelectItem value="occupancy">Occupancy Rate</SelectItem>
                        <SelectItem value="adr">Average Daily Rate</SelectItem>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💡</div>
                      <div>
                        <Text className="font-semibold text-blue-900 mb-1">Investor Insight</Text>
                        <Text className="text-blue-800 text-sm">
                          <strong>RevPAR</strong> (Revenue per Available Room) is the gold standard metric for STR investors.
                          It combines occupancy rate × average daily rate to show true earning potential.
                          Look for markets with RevPAR above $100 and occupancy rates above 65% for strong returns.
                        </Text>
                      </div>
                    </div>
                  </div>

                  <STRHeatmap metros={metros} sortBy={strSortBy} />
                </div>
              </TabPanel>

              {/* Table Tab */}
              <TabPanel>
                <MetroTable metros={metros} />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-gray-500 text-sm">
          <Text>Data updated daily • Powered by real-time market analysis</Text>
        </div>
      </div>
    </div>
  );
}
