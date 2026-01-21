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
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import {
  getMetroById,
  getSubmarketsByMetroId,
  formatCurrency,
  formatPercent,
  formatNumber,
  getPriceChangeColor,
  getBadgeColor,
} from "@/lib/data";
import { TimePeriod } from "@/types";
import TimePeriodToggle from "@/components/TimePeriodToggle";

export default function MetroPage() {
  const params = useParams();
  const metroId = params.id as string;
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1Y");

  const metro = getMetroById(metroId);
  const submarkets = getSubmarketsByMetroId(metroId);

  if (!metro) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl">
            <Title className="text-gray-900">Metro Not Found</Title>
            <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block font-semibold">
              ← Back to Dashboard
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const priceChange = metro.priceChangeByPeriod[timePeriod];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 mt-4">
            <Title className="text-4xl font-black text-gray-900">
              {metro.name}, {metro.state}
            </Title>
            <Badge color={getBadgeColor(priceChange)} size="xl" className="text-lg px-4 py-2">
              {formatPercent(priceChange)}
            </Badge>
          </div>
          <Text className="text-gray-600 mt-2">Complete market analysis and submarket breakdown</Text>
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

        {/* Metro Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-100 shadow-xl border-blue-300">
            <Text className="text-black font-semibold">Median Price</Text>
            <Metric className="text-black text-3xl">{formatCurrency(metro.medianPrice)}</Metric>
            <Text className="text-gray-700 text-sm mt-2">${metro.pricePerSqft}/sqft</Text>
          </Card>
          <Card className="bg-purple-100 shadow-xl border-purple-300">
            <Text className="text-black font-semibold">STR Revenue</Text>
            <Metric className="text-black text-3xl">${metro.strMetrics.revPAR}/day</Metric>
            <Text className="text-gray-700 text-sm mt-2">{formatCurrency(metro.strMetrics.annualRevenue)}/year</Text>
          </Card>
          <Card className="bg-green-100 shadow-xl border-green-300">
            <Text className="text-black font-semibold">Rental Yield</Text>
            <Metric className="text-black text-3xl">{metro.rentalYield.toFixed(2)}%</Metric>
            <Text className="text-gray-700 text-sm mt-2">Annual return on investment</Text>
          </Card>
          <Card className="bg-amber-100 shadow-xl border-amber-300">
            <Text className="text-black font-semibold">Market Activity</Text>
            <Metric className="text-black text-3xl">{metro.daysOnMarket}</Metric>
            <Text className="text-gray-700 text-sm mt-2">Days on market</Text>
          </Card>
        </div>

        {/* Additional Metrics */}
        <Grid numItemsSm={2} numItemsLg={4} className="gap-4">
          <Card className="shadow-lg">
            <Text className="text-gray-700 font-semibold">Sales Volume</Text>
            <Metric className="text-gray-900">{formatNumber(metro.volume)}</Metric>
          </Card>
          <Card className="shadow-lg">
            <Text className="text-gray-700 font-semibold">Inventory</Text>
            <Metric className="text-gray-900">{formatNumber(metro.inventory)}</Metric>
          </Card>
          <Card className="shadow-lg">
            <Text className="text-gray-700 font-semibold">STR Occupancy</Text>
            <Metric className="text-gray-900">{metro.strMetrics.occupancyRate.toFixed(1)}%</Metric>
          </Card>
          <Card className="shadow-lg">
            <Text className="text-gray-700 font-semibold">Avg Daily Rate</Text>
            <Metric className="text-gray-900">${metro.strMetrics.averageDailyRate}</Metric>
          </Card>
        </Grid>

        {/* Submarkets */}
        {submarkets.length > 0 ? (
          <Card className="shadow-xl border-gray-200">
            <Title className="text-2xl font-black text-gray-900 mb-6">Submarkets & Neighborhoods</Title>

            <TabGroup>
              <TabList className="mb-6">
                <Tab className="text-base">Heatmap View</Tab>
                <Tab className="text-base">Detailed Table</Tab>
              </TabList>
              <TabPanels>
                {/* Heatmap View */}
                <TabPanel>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-300 rounded"></div>
                        <span className="text-gray-700 font-medium">Strong Growth</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <span className="text-gray-700 font-medium">Neutral</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-200 rounded"></div>
                        <span className="text-gray-700 font-medium">Declining</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {submarkets.map((submarket) => {
                        const submarketChange = submarket.priceChangeByPeriod[timePeriod];
                        return (
                          <div
                            key={submarket.id}
                            className={`${getPriceChangeColor(
                              submarketChange
                            )} p-4 rounded-lg border-2 border-gray-300 hover:border-gray-500 transition-all`}
                          >
                            <div className="text-black">
                              <div className="text-sm font-bold mb-1">
                                {submarket.name}
                              </div>
                              <div className="text-2xl font-black mt-3 mb-2 text-black">
                                {formatPercent(submarketChange)}
                              </div>
                              <div className="text-xs text-gray-700 mb-1">
                                {formatCurrency(submarket.medianPrice)}
                              </div>
                              <div className="text-xs text-gray-700">
                                ${submarket.pricePerSqft}/sqft
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabPanel>

                {/* Table View */}
                <TabPanel>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell className="text-gray-900 font-bold">Submarket</TableHeaderCell>
                          <TableHeaderCell className="text-gray-900 font-bold">Price Change</TableHeaderCell>
                          <TableHeaderCell className="text-gray-900 font-bold">Median Price</TableHeaderCell>
                          <TableHeaderCell className="text-gray-900 font-bold">$/Sqft</TableHeaderCell>
                          <TableHeaderCell className="text-gray-900 font-bold">Yield %</TableHeaderCell>
                          <TableHeaderCell className="text-gray-900 font-bold">STR RevPAR</TableHeaderCell>
                          <TableHeaderCell className="text-gray-900 font-bold">STR Occ%</TableHeaderCell>
                          <TableHeaderCell className="text-gray-900 font-bold">Inventory</TableHeaderCell>
                          <TableHeaderCell className="text-gray-900 font-bold">DOM</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {submarkets.map((submarket) => {
                          const submarketChange = submarket.priceChangeByPeriod[timePeriod];
                          return (
                            <TableRow key={submarket.id} className="hover:bg-gray-50">
                              <TableCell className="font-bold text-gray-900">{submarket.name}</TableCell>
                              <TableCell>
                                <Badge color={getBadgeColor(submarketChange)}>
                                  {formatPercent(submarketChange)}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold text-gray-900">
                                {formatCurrency(submarket.medianPrice)}
                              </TableCell>
                              <TableCell className="text-gray-700 font-medium">${submarket.pricePerSqft}</TableCell>
                              <TableCell className="font-semibold text-purple-700">
                                {submarket.rentalYield.toFixed(2)}%
                              </TableCell>
                              <TableCell className="font-semibold text-green-700">
                                ${submarket.strMetrics.revPAR}
                              </TableCell>
                              <TableCell className="text-gray-700 font-medium">
                                {submarket.strMetrics.occupancyRate.toFixed(1)}%
                              </TableCell>
                              <TableCell className="text-gray-700">{formatNumber(submarket.inventory)}</TableCell>
                              <TableCell className="text-gray-700">{submarket.daysOnMarket}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Card>
        ) : (
          <Card className="shadow-xl">
            <Text className="text-gray-700">No submarket data available for this metro.</Text>
          </Card>
        )}
      </div>
    </div>
  );
}
