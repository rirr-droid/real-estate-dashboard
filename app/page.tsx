"use client";

import { useState } from "react";
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
  const metros = getMetros();
  const lastUpdated = new Date(getLastUpdated()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <Title className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Real Estate Market Intelligence
          </Title>
          <Text className="text-gray-600 text-lg">
            {metros.length} US Metro Markets • Updated {lastUpdated}
          </Text>
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
                  <div className="flex items-center justify-between">
                    <Text className="text-gray-600">
                      Click any market to explore submarkets and detailed metrics
                    </Text>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded"></div>
                        <span className="text-gray-700">Strong Growth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded"></div>
                        <span className="text-gray-700">Neutral</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded"></div>
                        <span className="text-gray-700">Declining</span>
                      </div>
                    </div>
                  </div>
                  <MetroHeatmap metros={metros} timePeriod={timePeriod} />
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
