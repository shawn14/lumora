"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";
import { cn } from "@/lib/utils";
import type { ReviewWithDetails } from "@/types";

interface ReviewItem extends ReviewWithDetails {
  app: { id: string; name: string };
}

interface ReviewsClientProps {
  reviews: ReviewItem[];
  currentUserId?: string;
}

const ITEMS_PER_PAGE = 12;

export function ReviewsClient({ reviews, currentUserId }: ReviewsClientProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reviews.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
        <p className="mt-1 text-sm text-gray-500">
          Reviews you have submitted for other apps.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-gray-500">No reviews yet.</p>
          <Link
            href="/dashboard/browse"
            className="mt-4 inline-block rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-lumora-700 transition"
          >
            Browse Apps
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginated.map((review) => (
              <div key={review.id}>
                <Link
                  href={`/dashboard/browse/${review.app.id}`}
                  className="mb-2 inline-block text-sm font-medium text-lumora-600 hover:text-lumora-700"
                >
                  {review.app.name}
                </Link>
                <ReviewCard
                  review={review}
                  currentUserId={currentUserId}
                  appId={review.app.id}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                  currentPage <= 1
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                  currentPage >= totalPages
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
