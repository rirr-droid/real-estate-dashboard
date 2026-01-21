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
import { formatCurrency, formatPercent, formatNumber } from "@/lib/data";
import Link from "next/link";

interface MetroTableProps {
  metros: Metro[];
}

type SortField = keyof Metro;
type SortDirection = "asc" | "desc";

export default function MetroTable({ metros }: MetroTableProps) {
  const [sortField, setSortField] = useState<SortField>("priceChange");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filter, setFilter] = useState("");

  const handleSort = (field: SortField) => {
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
      const aVal = a[sortField];
      const bVal = b[sortField];

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

  const getPriceChangeBadgeColor = (priceChange: number) => {
    if (priceChange >= 5) return "green";
    if (priceChange >= 0) return "emerald";
    if (priceChange >= -3) return "orange";
    return "red";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <TextInput
          placeholder="Search metros..."
          value={filter}
          onValueChange={setFilter}
          className="max-w-sm"
        />
        <div className="text-sm text-gray-500">
          {filteredAndSortedMetros.length} metros
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("name")}
              >
                Metro {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("state")}
              >
                State {sortField === "state" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("priceChange")}
              >
                Price Change {sortField === "priceChange" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("medianPrice")}
              >
                Median Price {sortField === "medianPrice" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("volume")}
              >
                Volume {sortField === "volume" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("inventory")}
              >
                Inventory {sortField === "inventory" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHeaderCell>
              <TableHeaderCell
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("daysOnMarket")}
              >
                Days on Market {sortField === "daysOnMarket" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedMetros.map((metro) => (
              <TableRow key={metro.id} className="hover:bg-gray-50">
                <TableCell>
                  <Link
                    href={`/metro/${metro.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {metro.name}
                  </Link>
                </TableCell>
                <TableCell>{metro.state}</TableCell>
                <TableCell>
                  <Badge color={getPriceChangeBadgeColor(metro.priceChange)}>
                    {formatPercent(metro.priceChange)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(metro.medianPrice)}
                </TableCell>
                <TableCell>{formatNumber(metro.volume)}</TableCell>
                <TableCell>{formatNumber(metro.inventory)}</TableCell>
                <TableCell>{metro.daysOnMarket}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
