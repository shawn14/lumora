import type { ReviewWithDetails } from "@/types";
import { REVIEW_CATEGORIES } from "@/types";
import { AIReviewBadge } from "@/components/AIReviewBadge";
import { RatingBar } from "@/components/RatingBar";

interface ReviewCardProps {
  review: ReviewWithDetails;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const reviewerName = review.reviewer?.name ?? "Anonymous";
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AIReviewBadge isAI={review.isAI} />
          <span className="text-sm font-medium text-gray-900">{reviewerName}</span>
        </div>
        <time className="text-xs text-gray-500">{date}</time>
      </div>

      {/* Ratings */}
      <div className="mt-5 space-y-2.5">
        {REVIEW_CATEGORIES.map(({ key, label }) => (
          <RatingBar
            key={key}
            label={label}
            value={review.ratings[key]}
          />
        ))}
      </div>

      {/* Feedback */}
      {review.feedback && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-gray-900">Feedback</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            {review.feedback}
          </p>
        </div>
      )}

      {/* Suggestions */}
      {review.suggestions.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-gray-900">Suggestions</h4>
          <ul className="mt-1.5 list-disc space-y-1 pl-5">
            {review.suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-gray-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
