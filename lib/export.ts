import { Metro } from "@/types";

export function exportToCSV(metros: Metro[], filename: string = "markets.csv"): void {
  // Create CSV headers
  const headers = [
    "Market",
    "State",
    "Median Price",
    "Price per Sqft",
    "3M Change %",
    "1Y Change %",
    "2Y Change %",
    "5Y Change %",
    "10Y Change %",
    "Rental Yield %",
    "STR RevPAR",
    "STR ADR",
    "STR Occupancy %",
    "STR Annual Revenue",
    "Days on Market",
    "Sales Volume",
    "Inventory",
  ];

  // Create CSV rows
  const rows = metros.map(metro => [
    metro.name,
    metro.state,
    metro.medianPrice,
    metro.pricePerSqft,
    metro.priceChangeByPeriod["3M"],
    metro.priceChangeByPeriod["1Y"],
    metro.priceChangeByPeriod["2Y"],
    metro.priceChangeByPeriod["5Y"],
    metro.priceChangeByPeriod["10Y"],
    metro.rentalYield,
    metro.strMetrics.revPAR,
    metro.strMetrics.averageDailyRate,
    metro.strMetrics.occupancyRate,
    metro.strMetrics.annualRevenue,
    metro.daysOnMarket,
    metro.volume,
    metro.inventory,
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
