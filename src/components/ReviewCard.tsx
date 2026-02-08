"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReviewWithDetails } from "@/types";
import { REVIEW_CATEGORIES } from "@/types";
import { AIReviewBadge } from "@/components/AIReviewBadge";
import { RatingBar } from "@/components/RatingBar";
import { Trash2, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: ReviewWithDetails;
  currentUserId?: string;
  isAppOwner?: boolean;
  appId: string;
}

export function ReviewCard({
  review,
  currentUserId,
  isAppOwner,
  appId,
}: ReviewCardProps) {
  const router = useRouter();
  const reviewerName = review.reviewer?.name ?? "Anonymous";
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isAuthor = currentUserId === review.reviewerId;

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Vote state
  const [voteCounts, setVoteCounts] = useState({
    helpful: review.voteCounts?.helpful ?? 0,
    unhelpful: review.voteCounts?.unhelpful ?? 0,
  });
  const [currentVote, setCurrentVote] = useState<boolean | null>(
    review.currentUserVote ?? null
  );
  const [voting, setVoting] = useState(false);

  // Response state
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [responding, setResponding] = useState(false);
  const [ownerResponse, setOwnerResponse] = useState(
    review.ownerResponse ?? null
  );
  const [ownerRespondedAt, setOwnerRespondedAt] = useState(
    review.ownerRespondedAt ?? null
  );

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/apps/${appId}/reviews/${review.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleVote(helpful: boolean) {
    if (!currentUserId || isAuthor) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/apps/${appId}/reviews/${review.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful }),
      });
      if (res.ok) {
        // Update counts locally
        setVoteCounts((prev) => {
          const counts = { ...prev };
          // Remove previous vote from counts
          if (currentVote === true) counts.helpful--;
          if (currentVote === false) counts.unhelpful--;
          // Add new vote
          if (helpful) counts.helpful++;
          else counts.unhelpful++;
          return counts;
        });
        setCurrentVote(helpful);
      }
    } finally {
      setVoting(false);
    }
  }

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (!responseText.trim()) return;
    setResponding(true);
    try {
      const res = await fetch(
        `/api/apps/${appId}/reviews/${review.id}/respond`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ response: responseText }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setOwnerResponse(data.ownerResponse);
        setOwnerRespondedAt(data.ownerRespondedAt);
        setShowResponseForm(false);
        setResponseText("");
      }
    } finally {
      setResponding(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AIReviewBadge isAI={review.isAI} />
          <span className="text-sm font-medium text-gray-900">
            {reviewerName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <time className="text-xs text-gray-500">{date}</time>
          {isAuthor && !review.isAI && (
            <>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                  >
                    {deleting ? "Deleting..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                  title="Delete review"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Ratings */}
      <div className="mt-5 space-y-2.5">
        {REVIEW_CATEGORIES.map(({ key, label }) => (
          <RatingBar key={key} label={label} value={review.ratings[key]} />
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

      {/* Voting */}
      {currentUserId && (
        <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
          <span className="text-xs text-gray-500">Helpful?</span>
          <button
            onClick={() => handleVote(true)}
            disabled={voting || isAuthor}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition cursor-pointer",
              currentVote === true
                ? "bg-green-100 text-green-700"
                : "bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600",
              (voting || isAuthor) && "opacity-50 cursor-not-allowed"
            )}
            title={isAuthor ? "Cannot vote on your own review" : "Helpful"}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {voteCounts.helpful > 0 && voteCounts.helpful}
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={voting || isAuthor}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition cursor-pointer",
              currentVote === false
                ? "bg-red-100 text-red-700"
                : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600",
              (voting || isAuthor) && "opacity-50 cursor-not-allowed"
            )}
            title={isAuthor ? "Cannot vote on your own review" : "Not helpful"}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {voteCounts.unhelpful > 0 && voteCounts.unhelpful}
          </button>
        </div>
      )}

      {/* Owner Response */}
      {ownerResponse && (
        <div className="mt-5 rounded-lg border border-lumora-100 bg-lumora-50 p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-lumora-600" />
            <span className="text-xs font-semibold text-lumora-700">
              Developer Response
            </span>
            {ownerRespondedAt && (
              <time className="text-xs text-lumora-500">
                {new Date(ownerRespondedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-lumora-800">
            {ownerResponse}
          </p>
        </div>
      )}

      {/* Reply button for app owner */}
      {isAppOwner && !ownerResponse && (
        <div className="mt-4">
          {showResponseForm ? (
            <form onSubmit={handleRespond} className="space-y-3">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={3}
                placeholder="Write your response to this review..."
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={responding || !responseText.trim()}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition cursor-pointer",
                    responseText.trim() && !responding
                      ? "bg-lumora-600 text-white hover:bg-lumora-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {responding ? "Sending..." : "Submit Response"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResponseForm(false);
                    setResponseText("");
                  }}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowResponseForm(true)}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-lumora-600 hover:bg-lumora-50 transition cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Reply
            </button>
          )}
        </div>
      )}
    </div>
  );
}
