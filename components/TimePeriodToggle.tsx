"use client";

import { TimePeriod } from "@/types";

interface TimePeriodToggleProps {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: "3M", label: "3 Months" },
  { value: "1Y", label: "1 Year" },
  { value: "2Y", label: "2 Years" },
  { value: "5Y", label: "5 Years" },
  { value: "10Y", label: "10 Years" },
];

export default function TimePeriodToggle({ selected, onChange }: TimePeriodToggleProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selected === period.value
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
