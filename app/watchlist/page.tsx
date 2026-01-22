"use client";

import { useState, useEffect } from "react";
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
} from "@tremor/react";
import {
  getMetros,
  formatCurrency,
  formatPercent,
  getBadgeColor,
} from "@/lib/data";
import { getWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { getMarketSignal, getSignalColor, getSignalLabel, getMomentumColor } from "@/lib/signals";

export default function WatchlistPage() {
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const metros = getMetros();

  // Load watchlist on mount
  useEffect(() => {
    setWatchlistIds(getWatchlist());
  }, []);

  const watchedMetros = metros.filter(m => watchlistIds.includes(m.id));

  const handleRemove = (metroId: string) => {
    removeFromWatchlist(metroId);
    setWatchlistIds(getWatchlist());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            ← Back to Dashboard
          </Link>
          <Title className="text-4xl font-black text-gray-900 mt-4">
            ⭐ My Watchlist
          </Title>
          <Text className="text-gray-600 mt-2">
            Track your favorite markets and get actionable signals
          </Text>
        </div>

        {watchedMetros.length === 0 ? (
          <Card className="shadow-xl border-gray-200">
            <div className="text-center py-12">
              <Text className="text-gray-600 text-lg mb-4">
                Your watchlist is empty
              </Text>
              <Text className="text-gray-500 mb-6">
                Add markets to your watchlist from the dashboard, screener, or metro pages
              </Text>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                Browse Markets
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="shadow-xl border-gray-200">
            <Title className="text-xl font-bold text-gray-900 mb-4">
              Tracking {watchedMetros.length} Market{watchedMetros.length !== 1 ? 's' : ''}
            </Title>

            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell className="text-gray-900 font-bold">Market</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">Signal</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">Score</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">Momentum</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">1Y Change</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">Median Price</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">Yield %</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">STR RevPAR</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">Key Reasons</TableHeaderCell>
                    <TableHeaderCell className="text-gray-900 font-bold">Actions</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watchedMetros.map((metro) => {
                    const signal = getMarketSignal(metro);
                    return (
                      <TableRow key={metro.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Link href={`/metro/${metro.id}`} className="font-bold text-blue-600 hover:text-blue-800 hover:underline">
                            {metro.name}, {metro.state}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSignalColor(signal.signal)}`}>
                            {getSignalLabel(signal.signal)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  signal.score >= 60 ? 'bg-green-500' :
                                  signal.score >= 40 ? 'bg-yellow-400' : 'bg-red-500'
                                }`}
                                style={{ width: `${signal.score}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{signal.score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold uppercase text-xs ${getMomentumColor(signal.momentum)}`}>
                            {signal.momentum === 'bullish' ? '📈 Bullish' :
                             signal.momentum === 'bearish' ? '📉 Bearish' : '➡️ Neutral'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge color={getBadgeColor(metro.priceChangeByPeriod["1Y"])}>
                            {formatPercent(metro.priceChangeByPeriod["1Y"])}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {formatCurrency(metro.medianPrice)}
                        </TableCell>
                        <TableCell className="font-semibold text-purple-700">
                          {metro.rentalYield.toFixed(2)}%
                        </TableCell>
                        <TableCell className="font-semibold text-green-700">
                          ${metro.strMetrics.revPAR}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            {signal.reasons.slice(0, 3).map((reason, i) => (
                              <div key={i} className="text-gray-600">• {reason}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleRemove(metro.id)}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                          >
                            Remove
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
