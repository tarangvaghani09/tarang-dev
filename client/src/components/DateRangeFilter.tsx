import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

type DateRangeFilterProps = {
  range?: DateRange;
  onRangeChange: (range?: DateRange) => void;
};

export function DateRangeFilter({
  range,
  onRangeChange,
}: DateRangeFilterProps) {
  return (
    <div className="rounded-xl border p-4 bg-card">
      <p className="text-sm font-semibold mb-2">Date Range</p>
      <Calendar
        mode="range"
        selected={range}
        onSelect={onRangeChange}
        numberOfMonths={2}
      />
    </div>
  );
}
