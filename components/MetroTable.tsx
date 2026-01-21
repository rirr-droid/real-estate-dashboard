"use client";

import { useState, useMemo } from "react";
import { Metro } from "@/types";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  TextInput,
} from "@tremor/react";
import { formatCurrency, formatPercent, formatNumber, getBadgeColor } from "@/lib/data";
import Link from "next/link";

interface MetroTableProps {
  metros: Metro[];
}

export default function MetroTable({ metros }: MetroTableProps) {
  const [sortField, setSortField] = useState<string>("priceChange");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedMetros = useMemo(() => {
    let filtered = metros;

    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = metros.filter(
        (metro) =>
          metro.name.toLowerCase().includes(lowerFilter) ||
          metro.state.toLowerCase().includes(lowerFilter)
      );
    }

    return [...filtered].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      // Handle nested properties
      if (sortField === "rentalYield") {
        aVal = a.rentalYield;
        bVal = b.rentalYield;
      } else if (sortField === "pricePerSqft") {
        aVal = a.pricePerSqft;
        bVal = b.pricePerSqft;
      } else if (sortField === "revPAR") {
        aVal = a.strMetrics.revPAR;
        bVal = b.strMetrics.revPAR;
      } else if (sortField === "occupancy") {
        aVal = a.strMetrics.occupancyRate;
        bVal = b.strMetrics.occupancyRate;
      } else {
        const val = a[sortField as keyof Metro];
        aVal = typeof val === 'number' || typeof val === 'string' ? val : 0;
        const val2 = b[sortField as keyof Metro];
        bVal = typeof val2 === 'number' || typeof val2 === 'string' ? val2 : 0;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }, [metros, sortField, sortDirection, filter]);

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <TableHeaderCell
      className="cursor-pointer hover:bg-gray-50 font-semibold"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && (
          <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
        )}
      </div>
    </TableHeaderCell>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <TextInput
          placeholder="Search metros..."
          value={filter}
          onValueChange={setFilter}
          className="max-w-sm"
        />
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedMetros.length} of {metros.length} markets
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <SortHeader field="name" label="Metro" />
              <SortHeader field="state" label="State" />
              <SortHeader field="priceChange" label="1Y Change" />
              <SortHeader field="medianPrice" label="Median Price" />
              <SortHeader field="pricePerSqft" label="$/Sqft" />
              <SortHeader field="rentalYield" label="Yield %" />
              <SortHeader field="revPAR" label="STR RevPAR" />
              <SortHeader field="occupancy" label="STR Occ%" />
              <SortHeader field="inventory" label="Inventory" />
              <SortHeader field="daysOnMarket" label="DOM" />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedMetros.map((metro) => (
              <TableRow key={metro.id} className="hover:bg-gray-50">
                <TableCell>
                  <Link
                    href={`/metro/${metro.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                  >
                    {metro.name}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600">{metro.state}</TableCell>
                <TableCell>
                  <Badge color={getBadgeColor(metro.priceChangeByPeriod["1Y"])}>
                    {formatPercent(metro.priceChangeByPeriod["1Y"])}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(metro.medianPrice)}
                </TableCell>
                <TableCell className="text-gray-700">${metro.pricePerSqft}</TableCell>
                <TableCell className="font-medium text-purple-700">
                  {metro.rentalYield.toFixed(2)}%
                </TableCell>
                <TableCell className="font-semibold text-green-700">
                  ${metro.strMetrics.revPAR}
                </TableCell>
                <TableCell className="text-gray-700">
                  {metro.strMetrics.occupancyRate.toFixed(1)}%
                </TableCell>
                <TableCell className="text-gray-600">{formatNumber(metro.inventory)}</TableCell>
                <TableCell className="text-gray-600">{metro.daysOnMarket}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
