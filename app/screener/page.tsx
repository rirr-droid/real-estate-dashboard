"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  Title,
  Text,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Select,
  SelectItem,
  NumberInput,
} from "@tremor/react";
import {
  getMetros,
  formatCurrency,
  formatPercent,
  formatNumber,
  getBadgeColor,
} from "@/lib/data";

export default function ScreenerPage() {
  const metros = getMetros();

  // Filter state
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(10000000);
  const [yieldMin, setYieldMin] = useState<number>(0);
  const [yieldMax, setYieldMax] = useState<number>(100);
  const [changeMin, setChangeMin] = useState<number>(-100);
  const [changeMax, setChangeMax] = useState<number>(100);
  const [revPARMin, setRevPARMin] = useState<number>(0);
  const [daysOnMarketMax, setDaysOnMarketMax] = useState<number>(365);
  const [sortBy, setSortBy] = useState<string>("1Y");

  // Apply filters
  const filteredMetros = useMemo(() => {
    return metros.filter((metro) => {
      if (metro.medianPrice < priceMin || metro.medianPrice > priceMax) return false;
      if (metro.rentalYield < yieldMin || metro.rentalYield > yieldMax) return false;
      if (metro.priceChangeByPeriod["1Y"] < changeMin || metro.priceChangeByPeriod["1Y"] > changeMax) return false;
      if (metro.strMetrics.revPAR < revPARMin) return false;
      if (metro.daysOnMarket > daysOnMarketMax) return false;
      return true;
    });
  }, [metros, priceMin, priceMax, yieldMin, yieldMax, changeMin, changeMax, revPARMin, daysOnMarketMax]);

  // Sort results
  const sortedMetros = useMemo(() => {
    const sorted = [...filteredMetros];
    switch (sortBy) {
      case "1Y":
        return sorted.sort((a, b) => b.priceChangeByPeriod["1Y"] - a.priceChangeByPeriod["1Y"]);
      case "5Y":
        return sorted.sort((a, b) => b.priceChangeByPeriod["5Y"] - a.priceChangeByPeriod["5Y"]);
      case "yield":
        return sorted.sort((a, b) => b.rentalYield - a.rentalYield);
      case "revPAR":
        return sorted.sort((a, b) => b.strMetrics.revPAR - a.strMetrics.revPAR);
      case "price":
        return sorted.sort((a, b) => a.medianPrice - b.medianPrice);
      case "pricePerSqft":
        return sorted.sort((a, b) => a.pricePerSqft - b.pricePerSqft);
      default:
        return sorted;
    }
  }, [filteredMetros, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            ← Back to Dashboard
          </Link>
          <Title className="text-4xl font-black text-gray-900 mt-4">
            Advanced Market Screener
          </Title>
          <Text className="text-gray-600 mt-2">
            Filter and compare markets by multiple criteria
          </Text>
        </div>

        {/* Filters */}
        <Card className="shadow-xl border-gray-200">
          <Title className="text-xl font-bold text-gray-900 mb-4">Screening Filters</Title>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Median Price Range</Text>
              <div className="space-y-2">
                <NumberInput
                  placeholder="Min Price"
                  value={priceMin}
                  onValueChange={(val) => setPriceMin(val || 0)}
                  min={0}
                  step={50000}
                />
                <NumberInput
                  placeholder="Max Price"
                  value={priceMax}
                  onValueChange={(val) => setPriceMax(val || 10000000)}
                  min={0}
                  step={50000}
                />
              </div>
            </div>

            {/* Rental Yield */}
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Rental Yield %</Text>
              <div className="space-y-2">
                <NumberInput
                  placeholder="Min Yield"
                  value={yieldMin}
                  onValueChange={(val) => setYieldMin(val || 0)}
                  min={0}
                  max={100}
                  step={0.5}
                />
                <NumberInput
                  placeholder="Max Yield"
                  value={yieldMax}
                  onValueChange={(val) => setYieldMax(val || 100)}
                  min={0}
                  max={100}
                  step={0.5}
                />
              </div>
            </div>

            {/* Price Change */}
            <div>
              <Text className="font-semibold text-gray-900 mb-2">1Y Price Change %</Text>
              <div className="space-y-2">
                <NumberInput
                  placeholder="Min Change"
                  value={changeMin}
                  onValueChange={(val) => setChangeMin(val || -100)}
                  min={-100}
                  max={100}
                  step={1}
                />
                <NumberInput
                  placeholder="Max Change"
                  value={changeMax}
                  onValueChange={(val) => setChangeMax(val || 100)}
                  min={-100}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            {/* STR RevPAR */}
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Min STR RevPAR</Text>
              <NumberInput
                placeholder="Min RevPAR"
                value={revPARMin}
                onValueChange={(val) => setRevPARMin(val || 0)}
                min={0}
                step={10}
              />
              <Text className="text-xs text-gray-600 mt-1">Revenue per available room/day</Text>
            </div>

            {/* Days on Market */}
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Max Days on Market</Text>
              <NumberInput
                placeholder="Max DOM"
                value={daysOnMarketMax}
                onValueChange={(val) => setDaysOnMarketMax(val || 365)}
                min={0}
                max={365}
                step={5}
              />
              <Text className="text-xs text-gray-600 mt-1">Fast-moving markets only</Text>
            </div>

            {/* Sort By */}
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Sort By</Text>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectItem value="1Y">1Y Price Change</SelectItem>
                <SelectItem value="5Y">5Y Price Change</SelectItem>
                <SelectItem value="yield">Rental Yield</SelectItem>
                <SelectItem value="revPAR">STR RevPAR</SelectItem>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="pricePerSqft">Price/Sqft</SelectItem>
              </Select>
            </div>

            {/* Quick Presets */}
            <div className="md:col-span-2">
              <Text className="font-semibold text-gray-900 mb-2">Quick Presets</Text>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setYieldMin(10);
                    setChangeMin(0);
                    setSortBy("yield");
                  }}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-sm font-medium transition"
                >
                  High Yield Markets
                </button>
                <button
                  onClick={() => {
                    setChangeMin(3);
                    setDaysOnMarketMax(35);
                    setSortBy("1Y");
                  }}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-900 rounded-lg text-sm font-medium transition"
                >
                  Hot Growth Markets
                </button>
                <button
                  onClick={() => {
                    setRevPARMin(120);
                    setSortBy("revPAR");
                  }}
                  className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-sm font-medium transition"
                >
                  Best STR Markets
                </button>
                <button
                  onClick={() => {
                    setPriceMax(400000);
                    setYieldMin(8);
                    setSortBy("yield");
                  }}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-sm font-medium transition"
                >
                  Affordable High Yield
                </button>
                <button
                  onClick={() => {
                    setPriceMin(0);
                    setPriceMax(10000000);
                    setYieldMin(0);
                    setYieldMax(100);
                    setChangeMin(-100);
                    setChangeMax(100);
                    setRevPARMin(0);
                    setDaysOnMarketMax(365);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg text-sm font-medium transition"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-gray-700 font-semibold">
              Showing {sortedMetros.length} of {metros.length} markets
            </Text>
          </div>
        </Card>

        {/* Results Table */}
        <Card className="shadow-xl border-gray-200">
          <Title className="text-xl font-bold text-gray-900 mb-4">Screener Results</Title>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="text-gray-900 font-bold">Market</TableHeaderCell>
                  <TableHeaderCell className="text-gray-900 font-bold">Median Price</TableHeaderCell>
                  <TableHeaderCell className="text-gray-900 font-bold">$/Sqft</TableHeaderCell>
                  <TableHeaderCell className="text-gray-900 font-bold">1Y Change</TableHeaderCell>
                  <TableHeaderCell className="text-gray-900 font-bold">5Y Change</TableHeaderCell>
                  <TableHeaderCell className="text-gray-900 font-bold">Yield %</TableHeaderCell>
                  <TableHeaderCell className="text-gray-900 font-bold">STR RevPAR</TableHeaderCell>
                  <TableHeaderCell className="text-gray-900 font-bold">DOM</TableHeaderCell>
                  <TableHeaderCell className="text-gray-900 font-bold">Volume</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedMetros.map((metro) => (
                  <TableRow key={metro.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Link href={`/metro/${metro.id}`} className="font-bold text-blue-600 hover:text-blue-800 hover:underline">
                        {metro.name}, {metro.state}
                      </Link>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {formatCurrency(metro.medianPrice)}
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      ${metro.pricePerSqft}
                    </TableCell>
                    <TableCell>
                      <Badge color={getBadgeColor(metro.priceChangeByPeriod["1Y"])}>
                        {formatPercent(metro.priceChangeByPeriod["1Y"])}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={getBadgeColor(metro.priceChangeByPeriod["5Y"] / 5)}>
                        {formatPercent(metro.priceChangeByPeriod["5Y"])}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-purple-700">
                      {metro.rentalYield.toFixed(2)}%
                    </TableCell>
                    <TableCell className="font-semibold text-green-700">
                      ${metro.strMetrics.revPAR}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {metro.daysOnMarket}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatNumber(metro.volume)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {sortedMetros.length === 0 && (
            <div className="text-center py-12">
              <Text className="text-gray-600 text-lg">
                No markets match your criteria. Try adjusting your filters.
              </Text>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
