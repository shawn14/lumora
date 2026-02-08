import { cn } from "@/lib/utils";

interface RatingBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

export function RatingBar({ label, value, maxValue = 10 }: RatingBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm font-medium text-gray-700">
        {label}
      </span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
            "bg-gradient-to-r from-lumora-500 to-lumora-600"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-sm font-semibold text-gray-900">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
