"use client";

import { useState } from "react";
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
  Select,
  SelectItem,
} from "@tremor/react";
import { getMetros, formatCurrency, formatPercent, formatNumber } from "@/lib/data";

export default function ComparePage() {
  const metros = getMetros();
  const [selected1, setSelected1] = useState<string>("nyc");
  const [selected2, setSelected2] = useState<string>("la");
  const [selected3, setSelected3] = useState<string>("chicago");
  const [selected4, setSelected4] = useState<string>("dallas");

  const selectedMetros = [
    metros.find(m => m.id === selected1),
    metros.find(m => m.id === selected2),
    metros.find(m => m.id === selected3),
    metros.find(m => m.id === selected4),
  ].filter(Boolean);

  const getBest = (key: string) => {
    const values = selectedMetros.map(m => {
      switch (key) {
        case "medianPrice": return m!.medianPrice;
        case "1Y": return m!.priceChangeByPeriod["1Y"];
        case "5Y": return m!.priceChangeByPeriod["5Y"];
        case "yield": return m!.rentalYield;
        case "revPAR": return m!.strMetrics.revPAR;
        case "pricePerSqft": return m!.pricePerSqft;
        case "daysOnMarket": return -m!.daysOnMarket; // Lower is better
        default: return 0;
      }
    });
    const maxValue = Math.max(...values);
    return selectedMetros.find((m, i) => values[i] === maxValue);
  };

  const isBest = (metro: typeof selectedMetros[0], key: string) => {
    return getBest(key)?.id === metro?.id;
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
            Side-by-Side Comparison
          </Title>
          <Text className="text-gray-600 mt-2">
            Compare up to 4 markets across all metrics
          </Text>
        </div>

        {/* Selection */}
        <Card className="shadow-xl border-gray-200">
          <Title className="text-xl font-bold text-gray-900 mb-4">Select Markets</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Market 1</Text>
              <Select value={selected1} onValueChange={setSelected1}>
                {metros.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}, {m.state}</SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Market 2</Text>
              <Select value={selected2} onValueChange={setSelected2}>
                {metros.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}, {m.state}</SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Market 3</Text>
              <Select value={selected3} onValueChange={setSelected3}>
                {metros.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}, {m.state}</SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Market 4</Text>
              <Select value={selected4} onValueChange={setSelected4}>
                {metros.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}, {m.state}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Comparison Table */}
        <Card className="shadow-xl border-gray-200">
          <Title className="text-xl font-bold text-gray-900 mb-4">Comparison Results</Title>
          <Text className="text-sm text-gray-600 mb-4">
            ⭐ = Best in category
          </Text>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="text-gray-900 font-bold">Metric</TableHeaderCell>
                  {selectedMetros.map(metro => (
                    <TableHeaderCell key={metro!.id} className="text-gray-900 font-bold text-center">
                      <Link href={`/metro/${metro!.id}`} className="text-blue-600 hover:underline">
                        {metro!.name}
                      </Link>
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Price Metrics */}
                <TableRow className="bg-blue-50">
                  <TableCell className="font-bold text-gray-900" colSpan={5}>
                    PRICING
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Median Price</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className={`text-center ${isBest(metro, "medianPrice") ? "bg-yellow-100" : ""}`}>
                      {isBest(metro, "medianPrice") && "⭐ "}
                      {formatCurrency(metro!.medianPrice)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Price per Sqft</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className={`text-center ${isBest(metro, "pricePerSqft") ? "bg-yellow-100" : ""}`}>
                      {isBest(metro, "pricePerSqft") && "⭐ "}
                      ${metro!.pricePerSqft}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Appreciation */}
                <TableRow className="bg-green-50">
                  <TableCell className="font-bold text-gray-900" colSpan={5}>
                    APPRECIATION
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">3 Month Change</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className="text-center">
                      {formatPercent(metro!.priceChangeByPeriod["3M"])}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">1 Year Change</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className={`text-center ${isBest(metro, "1Y") ? "bg-yellow-100" : ""}`}>
                      {isBest(metro, "1Y") && "⭐ "}
                      {formatPercent(metro!.priceChangeByPeriod["1Y"])}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">5 Year Change</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className={`text-center ${isBest(metro, "5Y") ? "bg-yellow-100" : ""}`}>
                      {isBest(metro, "5Y") && "⭐ "}
                      {formatPercent(metro!.priceChangeByPeriod["5Y"])}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">10 Year Change</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className="text-center">
                      {formatPercent(metro!.priceChangeByPeriod["10Y"])}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Rental Metrics */}
                <TableRow className="bg-purple-50">
                  <TableCell className="font-bold text-gray-900" colSpan={5}>
                    RENTAL & STR
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Rental Yield</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className={`text-center ${isBest(metro, "yield") ? "bg-yellow-100" : ""}`}>
                      {isBest(metro, "yield") && "⭐ "}
                      {metro!.rentalYield.toFixed(2)}%
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">STR RevPAR</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className={`text-center ${isBest(metro, "revPAR") ? "bg-yellow-100" : ""}`}>
                      {isBest(metro, "revPAR") && "⭐ "}
                      ${metro!.strMetrics.revPAR}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">STR Avg Daily Rate</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className="text-center">
                      ${metro!.strMetrics.averageDailyRate}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">STR Occupancy</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className="text-center">
                      {metro!.strMetrics.occupancyRate.toFixed(1)}%
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">STR Annual Revenue</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className="text-center">
                      {formatCurrency(metro!.strMetrics.annualRevenue)}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Market Activity */}
                <TableRow className="bg-amber-50">
                  <TableCell className="font-bold text-gray-900" colSpan={5}>
                    MARKET ACTIVITY
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Days on Market</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className={`text-center ${isBest(metro, "daysOnMarket") ? "bg-yellow-100" : ""}`}>
                      {isBest(metro, "daysOnMarket") && "⭐ "}
                      {metro!.daysOnMarket}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Sales Volume</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className="text-center">
                      {formatNumber(metro!.volume)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Inventory</TableCell>
                  {selectedMetros.map(metro => (
                    <TableCell key={metro!.id} className="text-center">
                      {formatNumber(metro!.inventory)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
