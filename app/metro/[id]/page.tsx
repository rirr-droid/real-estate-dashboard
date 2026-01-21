"use client";

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
} from "@tremor/react";
import {
  getMetroById,
  getSubmarketsByMetroId,
  formatCurrency,
  formatPercent,
  formatNumber,
  getPriceChangeColor,
} from "@/lib/data";

export default function MetroPage() {
  const params = useParams();
  const metroId = params.id as string;

  const metro = getMetroById(metroId);
  const submarkets = getSubmarketsByMetroId(metroId);

  if (!metro) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <Title>Metro Not Found</Title>
            <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
              ← Back to Dashboard
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const getPriceChangeBadgeColor = (priceChange: number) => {
    if (priceChange >= 5) return "green";
    if (priceChange >= 0) return "emerald";
    if (priceChange >= -3) return "orange";
    return "red";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link href="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Title className="text-3xl font-bold">
              {metro.name}, {metro.state}
            </Title>
            <Badge color={getPriceChangeBadgeColor(metro.priceChange)} size="xl">
              {formatPercent(metro.priceChange)}
            </Badge>
          </div>
        </div>

        {/* Metro Stats */}
        <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
          <Card>
            <Text>Median Price</Text>
            <Metric>{formatCurrency(metro.medianPrice)}</Metric>
          </Card>
          <Card>
            <Text>Sales Volume</Text>
            <Metric>{formatNumber(metro.volume)}</Metric>
          </Card>
          <Card>
            <Text>Inventory</Text>
            <Metric>{formatNumber(metro.inventory)}</Metric>
          </Card>
          <Card>
            <Text>Days on Market</Text>
            <Metric>{metro.daysOnMarket}</Metric>
          </Card>
        </Grid>

        {/* Submarkets */}
        {submarkets.length > 0 ? (
          <Card>
            <Title className="mb-4">Submarkets</Title>

            {/* Submarket Heatmap */}
            <div className="mb-6">
              <Text className="text-sm text-gray-600 mb-4">
                Color indicates price change:
                <span className="ml-2 text-emerald-600 font-semibold">Teal/Green = Increasing</span>
                <span className="ml-2 text-orange-600 font-semibold">Orange/Red = Decreasing</span>
              </Text>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {submarkets.map((submarket) => (
                  <div
                    key={submarket.id}
                    className={`${getPriceChangeColor(
                      submarket.priceChange
                    )} p-3 rounded-lg border border-gray-300 shadow-sm`}
                  >
                    <div className="text-xs font-semibold truncate">
                      {submarket.name}
                    </div>
                    <div className="text-sm font-bold mt-2">
                      {formatPercent(submarket.priceChange)}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {formatCurrency(submarket.medianPrice)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submarket Table */}
            <div className="mt-6">
              <Title className="text-lg mb-4">Detailed View</Title>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Submarket</TableHeaderCell>
                    <TableHeaderCell>Price Change</TableHeaderCell>
                    <TableHeaderCell>Median Price</TableHeaderCell>
                    <TableHeaderCell>Volume</TableHeaderCell>
                    <TableHeaderCell>Inventory</TableHeaderCell>
                    <TableHeaderCell>Days on Market</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submarkets.map((submarket) => (
                    <TableRow key={submarket.id}>
                      <TableCell className="font-medium">{submarket.name}</TableCell>
                      <TableCell>
                        <Badge color={getPriceChangeBadgeColor(submarket.priceChange)}>
                          {formatPercent(submarket.priceChange)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(submarket.medianPrice)}
                      </TableCell>
                      <TableCell>{formatNumber(submarket.volume)}</TableCell>
                      <TableCell>{formatNumber(submarket.inventory)}</TableCell>
                      <TableCell>{submarket.daysOnMarket}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card>
            <Text>No submarket data available for this metro.</Text>
          </Card>
        )}
      </div>
    </div>
  );
}
