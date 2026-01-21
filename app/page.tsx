"use client";

import { useState } from "react";
import { Card, Title, Text, TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import MetroHeatmap from "@/components/MetroHeatmap";
import MetroTable from "@/components/MetroTable";
import TimePeriodToggle from "@/components/TimePeriodToggle";
import { getMetros, getLastUpdated } from "@/lib/data";
import { TimePeriod } from "@/types";

export default function Home() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1Y");
  const metros = getMetros();
  const lastUpdated = new Date(getLastUpdated()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Title className="text-3xl font-bold">Real Estate Market Dashboard</Title>
          <Text>
            US Metro Markets • Last Updated: {lastUpdated}
          </Text>
        </div>

        {/* Time Period Selector */}
        <Card>
          <div className="space-y-2">
            <Text className="font-semibold text-gray-700">Time Period</Text>
            <TimePeriodToggle selected={timePeriod} onChange={setTimePeriod} />
          </div>
        </Card>

        {/* Main Content */}
        <Card>
          <TabGroup>
            <TabList className="mb-6">
              <Tab>Heatmap</Tab>
              <Tab>Table</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="space-y-4">
                  <div>
                    <Text className="text-sm text-gray-600 mb-4">
                      Color indicates price change:
                      <span className="ml-2 text-emerald-600 font-semibold">Teal/Green = Increasing</span>
                      <span className="ml-2 text-orange-600 font-semibold">Orange/Red = Decreasing</span>
                    </Text>
                  </div>
                  <MetroHeatmap metros={metros} timePeriod={timePeriod} />
                </div>
              </TabPanel>
              <TabPanel>
                <MetroTable metros={metros} />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </div>
    </div>
  );
}
