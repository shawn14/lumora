import { Star, Bot, User } from "lucide-react";
import { REVIEW_CATEGORIES } from "@/types";
import type { ReviewSummary as ReviewSummaryType } from "@/types";
import { RatingBar } from "@/components/RatingBar";

interface ReviewSummaryProps {
  summary: ReviewSummaryType;
}

export function ReviewSummary({ summary }: ReviewSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">Review Summary</h3>

      {/* Overall score + counts */}
      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 fill-lumora-500 text-lumora-500" />
          <span className="text-3xl font-bold text-gray-900">
            {summary.overallAverage.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">/ 10</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{summary.totalReviews} total</span>
          <span className="flex items-center gap-1">
            <Bot className="h-3.5 w-3.5 text-lumora-500" />
            {summary.aiReviews} AI
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-gray-400" />
            {summary.humanReviews} human
          </span>
        </div>
      </div>

      {/* Category breakdowns */}
      <div className="mt-6 space-y-2.5">
        {REVIEW_CATEGORIES.map(({ key, label }) => (
          <RatingBar
            key={key}
            label={label}
            value={summary.averageScores[key]}
          />
        ))}
      </div>
    </div>
  );
}
