"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  Title,
  Text,
  Select,
  SelectItem,
} from "@tremor/react";
import { getMetros, formatPercent, formatCurrency } from "@/lib/data";

export default function BubbleMapPage() {
  const metros = getMetros();
  const [xAxis, setXAxis] = useState<string>("yield");
  const [yAxis, setYAxis] = useState<string>("1Y");
  const [sizeBy, setSizeBy] = useState<string>("volume");

  // Calculate min/max for scaling
  const getMinMax = (key: string) => {
    let values: number[] = [];
    switch (key) {
      case "yield":
        values = metros.map(m => m.rentalYield);
        break;
      case "1Y":
        values = metros.map(m => m.priceChangeByPeriod["1Y"]);
        break;
      case "5Y":
        values = metros.map(m => m.priceChangeByPeriod["5Y"]);
        break;
      case "revPAR":
        values = metros.map(m => m.strMetrics.revPAR);
        break;
      case "price":
        values = metros.map(m => m.medianPrice);
        break;
      case "volume":
        values = metros.map(m => m.volume);
        break;
    }
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const getValue = (metro: typeof metros[0], key: string): number => {
    switch (key) {
      case "yield": return metro.rentalYield;
      case "1Y": return metro.priceChangeByPeriod["1Y"];
      case "5Y": return metro.priceChangeByPeriod["5Y"];
      case "revPAR": return metro.strMetrics.revPAR;
      case "price": return metro.medianPrice;
      case "volume": return metro.volume;
      default: return 0;
    }
  };

  const getLabel = (key: string): string => {
    switch (key) {
      case "yield": return "Rental Yield %";
      case "1Y": return "1Y Price Change %";
      case "5Y": return "5Y Price Change %";
      case "revPAR": return "STR RevPAR ($)";
      case "price": return "Median Price ($)";
      case "volume": return "Sales Volume";
      default: return "";
    }
  };

  const xRange = getMinMax(xAxis);
  const yRange = getMinMax(yAxis);
  const sizeRange = getMinMax(sizeBy);

  // Chart dimensions
  const chartWidth = 900;
  const chartHeight = 600;
  const padding = 60;

  const scaleX = (value: number) => {
    return padding + ((value - xRange.min) / (xRange.max - xRange.min)) * (chartWidth - 2 * padding);
  };

  const scaleY = (value: number) => {
    return chartHeight - padding - ((value - yRange.min) / (yRange.max - yRange.min)) * (chartHeight - 2 * padding);
  };

  const scaleSize = (value: number) => {
    const minSize = 20;
    const maxSize = 80;
    return minSize + ((value - sizeRange.min) / (sizeRange.max - sizeRange.min)) * (maxSize - minSize);
  };

  const getColor = (metro: typeof metros[0]) => {
    const change = metro.priceChangeByPeriod["1Y"];
    if (change >= 4) return "#22c55e"; // green
    if (change >= 0) return "#86efac"; // light green
    if (change >= -3) return "#fbbf24"; // yellow
    return "#ef4444"; // red
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
            Market Bubble Chart
          </Title>
          <Text className="text-gray-600 mt-2">
            Visualize markets across multiple dimensions
          </Text>
        </div>

        {/* Controls */}
        <Card className="shadow-xl border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Text className="font-semibold text-gray-900 mb-2">X-Axis (Horizontal)</Text>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectItem value="yield">Rental Yield %</SelectItem>
                <SelectItem value="1Y">1Y Price Change</SelectItem>
                <SelectItem value="5Y">5Y Price Change</SelectItem>
                <SelectItem value="revPAR">STR RevPAR</SelectItem>
                <SelectItem value="price">Median Price</SelectItem>
              </Select>
            </div>
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Y-Axis (Vertical)</Text>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectItem value="1Y">1Y Price Change</SelectItem>
                <SelectItem value="5Y">5Y Price Change</SelectItem>
                <SelectItem value="yield">Rental Yield %</SelectItem>
                <SelectItem value="revPAR">STR RevPAR</SelectItem>
                <SelectItem value="price">Median Price</SelectItem>
              </Select>
            </div>
            <div>
              <Text className="font-semibold text-gray-900 mb-2">Bubble Size</Text>
              <Select value={sizeBy} onValueChange={setSizeBy}>
                <SelectItem value="volume">Sales Volume</SelectItem>
                <SelectItem value="price">Median Price</SelectItem>
                <SelectItem value="revPAR">STR RevPAR</SelectItem>
              </Select>
            </div>
          </div>
        </Card>

        {/* Chart */}
        <Card className="shadow-xl border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Title className="text-xl font-bold text-gray-900">Visualization</Title>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Strong Growth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                <span>Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Declining</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <svg width={chartWidth} height={chartHeight} className="mx-auto">
              {/* Grid lines */}
              <g>
                {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
                  const x = padding + factor * (chartWidth - 2 * padding);
                  return (
                    <line
                      key={`vgrid-${i}`}
                      x1={x}
                      y1={padding}
                      x2={x}
                      y2={chartHeight - padding}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  );
                })}
                {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
                  const y = padding + factor * (chartHeight - 2 * padding);
                  return (
                    <line
                      key={`hgrid-${i}`}
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  );
                })}
              </g>

              {/* Axes */}
              <g>
                <line
                  x1={padding}
                  y1={chartHeight - padding}
                  x2={chartWidth - padding}
                  y2={chartHeight - padding}
                  stroke="#000"
                  strokeWidth="2"
                />
                <line
                  x1={padding}
                  y1={padding}
                  x2={padding}
                  y2={chartHeight - padding}
                  stroke="#000"
                  strokeWidth="2"
                />
              </g>

              {/* Axis labels */}
              <text
                x={chartWidth / 2}
                y={chartHeight - 20}
                textAnchor="middle"
                className="text-sm font-semibold fill-gray-900"
              >
                {getLabel(xAxis)}
              </text>
              <text
                x={20}
                y={chartHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90, 20, ${chartHeight / 2})`}
                className="text-sm font-semibold fill-gray-900"
              >
                {getLabel(yAxis)}
              </text>

              {/* Axis tick labels */}
              <g>
                {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
                  const value = xRange.min + factor * (xRange.max - xRange.min);
                  const x = padding + factor * (chartWidth - 2 * padding);
                  return (
                    <text
                      key={`xlabel-${i}`}
                      x={x}
                      y={chartHeight - padding + 20}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {xAxis === "price" ? `$${Math.round(value / 1000)}k` : value.toFixed(1)}
                    </text>
                  );
                })}
                {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
                  const value = yRange.min + factor * (yRange.max - yRange.min);
                  const y = chartHeight - padding - factor * (chartHeight - 2 * padding);
                  return (
                    <text
                      key={`ylabel-${i}`}
                      x={padding - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-xs fill-gray-600"
                    >
                      {yAxis === "price" ? `$${Math.round(value / 1000)}k` : value.toFixed(1)}
                    </text>
                  );
                })}
              </g>

              {/* Bubbles */}
              {metros.map((metro) => {
                const x = scaleX(getValue(metro, xAxis));
                const y = scaleY(getValue(metro, yAxis));
                const size = scaleSize(getValue(metro, sizeBy));
                const color = getColor(metro);

                return (
                  <g key={metro.id}>
                    <Link href={`/metro/${metro.id}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r={size / 2}
                        fill={color}
                        opacity={0.7}
                        stroke="#374151"
                        strokeWidth="1"
                        className="cursor-pointer hover:opacity-100 transition-opacity"
                      >
                        <title>
                          {metro.name}, {metro.state}
                          {'\n'}Median: {formatCurrency(metro.medianPrice)}
                          {'\n'}1Y: {formatPercent(metro.priceChangeByPeriod["1Y"])}
                          {'\n'}Yield: {metro.rentalYield.toFixed(2)}%
                        </title>
                      </circle>
                    </Link>
                    {size > 40 && (
                      <text
                        x={x}
                        y={y + 4}
                        textAnchor="middle"
                        className="text-xs font-bold fill-white pointer-events-none"
                      >
                        {metro.name.split(',')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Text className="text-xs text-gray-600">
              Hover over bubbles for details. Click to view full market analysis. Bubble size represents {getLabel(sizeBy).toLowerCase()}.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
