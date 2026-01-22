"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  Title,
  Text,
} from "@tremor/react";
import {
  getMetros,
  formatCurrency,
  formatPercent,
  formatNumber,
} from "@/lib/data";
import { exportToCSV } from "@/lib/export";
import { getMarketSignal, getSignalColor, getSignalLabel } from "@/lib/signals";
import WatchlistButton from "@/components/WatchlistButton";

export default function ScreenerPage() {
  const metros = getMetros();

  // Filter state
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [yieldMin, setYieldMin] = useState<string>("");
  const [yieldMax, setYieldMax] = useState<string>("");
  const [changeMin, setChangeMin] = useState<string>("");
  const [changeMax, setChangeMax] = useState<string>("");
  const [revPARMin, setRevPARMin] = useState<string>("");
  const [daysOnMarketMax, setDaysOnMarketMax] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("1Y");

  // Apply filters
  const filteredMetros = useMemo(() => {
    return metros.filter((metro) => {
      const priceMinNum = priceMin ? parseFloat(priceMin) : 0;
      const priceMaxNum = priceMax ? parseFloat(priceMax) : Infinity;
      const yieldMinNum = yieldMin ? parseFloat(yieldMin) : 0;
      const yieldMaxNum = yieldMax ? parseFloat(yieldMax) : Infinity;
      const changeMinNum = changeMin ? parseFloat(changeMin) : -Infinity;
      const changeMaxNum = changeMax ? parseFloat(changeMax) : Infinity;
      const revPARMinNum = revPARMin ? parseFloat(revPARMin) : 0;
      const daysMaxNum = daysOnMarketMax ? parseFloat(daysOnMarketMax) : Infinity;

      if (metro.medianPrice < priceMinNum || metro.medianPrice > priceMaxNum) return false;
      if (metro.rentalYield < yieldMinNum || metro.rentalYield > yieldMaxNum) return false;
      if (metro.priceChangeByPeriod["1Y"] < changeMinNum || metro.priceChangeByPeriod["1Y"] > changeMaxNum) return false;
      if (metro.strMetrics.revPAR < revPARMinNum) return false;
      if (metro.daysOnMarket > daysMaxNum) return false;
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

  const applyPreset = (preset: string) => {
    switch (preset) {
      case "highYield":
        setYieldMin("10");
        setChangeMin("0");
        setSortBy("yield");
        break;
      case "hotGrowth":
        setChangeMin("3");
        setDaysOnMarketMax("35");
        setSortBy("1Y");
        break;
      case "bestSTR":
        setRevPARMin("120");
        setSortBy("revPAR");
        break;
      case "affordable":
        setPriceMax("400000");
        setYieldMin("8");
        setSortBy("yield");
        break;
    }
  };

  const resetAll = () => {
    setPriceMin("");
    setPriceMax("");
    setYieldMin("");
    setYieldMax("");
    setChangeMin("");
    setChangeMax("");
    setRevPARMin("");
    setDaysOnMarketMax("");
    setSortBy("1Y");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-bold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            ← Back to Dashboard
          </Link>
          <Title className="text-4xl font-black text-gray-900 mt-4">
            Advanced Market Screener
          </Title>
          <Text className="text-gray-700 mt-2 font-medium">
            Filter and compare markets by multiple criteria
          </Text>
        </div>

        {/* Filters */}
        <Card className="shadow-xl border-2 border-gray-300">
          <Title className="text-2xl font-black text-gray-900 mb-6">Screening Filters</Title>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Median Price Range</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min Price (e.g. 300000)"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <input
                  type="number"
                  placeholder="Max Price (e.g. 800000)"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* Rental Yield */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Rental Yield %</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min Yield (e.g. 8)"
                  value={yieldMin}
                  onChange={(e) => setYieldMin(e.target.value)}
                  step="0.5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <input
                  type="number"
                  placeholder="Max Yield (e.g. 20)"
                  value={yieldMax}
                  onChange={(e) => setYieldMax(e.target.value)}
                  step="0.5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* Price Change */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">1Y Price Change %</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min Change (e.g. -5)"
                  value={changeMin}
                  onChange={(e) => setChangeMin(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                <input
                  type="number"
                  placeholder="Max Change (e.g. 10)"
                  value={changeMax}
                  onChange={(e) => setChangeMax(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* STR RevPAR */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Min STR RevPAR</label>
              <input
                type="number"
                placeholder="Min RevPAR (e.g. 100)"
                value={revPARMin}
                onChange={(e) => setRevPARMin(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <p className="text-xs text-gray-600 mt-2 font-medium">Revenue per available room/day</p>
            </div>

            {/* Days on Market */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Max Days on Market</label>
              <input
                type="number"
                placeholder="Max DOM (e.g. 40)"
                value={daysOnMarketMax}
                onChange={(e) => setDaysOnMarketMax(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <p className="text-xs text-gray-600 mt-2 font-medium">Fast-moving markets only</p>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              >
                <option value="1Y">1Y Price Change</option>
                <option value="5Y">5Y Price Change</option>
                <option value="yield">Rental Yield</option>
                <option value="revPAR">STR RevPAR</option>
                <option value="price">Price (Low to High)</option>
                <option value="pricePerSqft">Price/Sqft</option>
              </select>
            </div>

            {/* Quick Presets - Full Width */}
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
              <label className="block text-sm font-bold text-gray-900 mb-3">Quick Presets</label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => applyPreset("highYield")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                >
                  High Yield Markets
                </button>
                <button
                  onClick={() => applyPreset("hotGrowth")}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Hot Growth Markets
                </button>
                <button
                  onClick={() => applyPreset("bestSTR")}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Best STR Markets
                </button>
                <button
                  onClick={() => applyPreset("affordable")}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Affordable High Yield
                </button>
                <button
                  onClick={resetAll}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-lg font-black text-gray-900">
                Showing <span className="text-blue-600">{sortedMetros.length}</span> of {metros.length} markets
              </p>
            </div>
            <button
              onClick={() => exportToCSV(sortedMetros, `market-screener-${new Date().toISOString().split('T')[0]}.csv`)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              📊 Export to CSV
            </button>
          </div>
        </Card>

        {/* Results Table */}
        <Card className="shadow-xl border-2 border-gray-300">
          <Title className="text-2xl font-black text-gray-900 mb-6">Screener Results</Title>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-100">
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Market</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Signal</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Median Price</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">$/Sqft</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">1Y Change</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">5Y Change</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Yield %</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">STR RevPAR</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">DOM</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Volume</th>
                  <th className="text-left py-4 px-4 text-sm font-black text-gray-900">Watch</th>
                </tr>
              </thead>
              <tbody>
                {sortedMetros.map((metro) => {
                  const signal = getMarketSignal(metro);
                  const change1Y = metro.priceChangeByPeriod["1Y"];
                  const change5Y = metro.priceChangeByPeriod["5Y"];

                  return (
                    <tr key={metro.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <Link href={`/metro/${metro.id}`} className="font-bold text-blue-600 hover:text-blue-800 hover:underline text-base">
                          {metro.name}, {metro.state}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black ${getSignalColor(signal.signal)}`}>
                          {getSignalLabel(signal.signal)}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900 text-base">
                        {formatCurrency(metro.medianPrice)}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-700 text-base">
                        ${metro.pricePerSqft}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                          change1Y >= 4 ? 'bg-green-600 text-white' :
                          change1Y >= 0 ? 'bg-green-400 text-white' :
                          change1Y >= -3 ? 'bg-orange-500 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {formatPercent(change1Y)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                          change5Y >= 25 ? 'bg-green-600 text-white' :
                          change5Y >= 15 ? 'bg-green-400 text-white' :
                          change5Y >= 5 ? 'bg-yellow-500 text-gray-900' :
                          'bg-gray-400 text-white'
                        }`}>
                          {formatPercent(change5Y)}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-purple-700 text-base">
                        {metro.rentalYield.toFixed(2)}%
                      </td>
                      <td className="py-4 px-4 font-bold text-green-700 text-base">
                        ${metro.strMetrics.revPAR}
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900 text-base">
                        {metro.daysOnMarket}
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-900 text-base">
                        {formatNumber(metro.volume)}
                      </td>
                      <td className="py-4 px-4">
                        <WatchlistButton metroId={metro.id} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sortedMetros.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-900 text-xl font-bold mb-2">
                No markets match your criteria
              </p>
              <p className="text-gray-600 font-medium">
                Try adjusting your filters or using a preset
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
