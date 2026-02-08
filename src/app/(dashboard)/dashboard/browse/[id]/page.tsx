import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { ReviewSummary } from "@/components/ReviewSummary";
import { ReviewCard } from "@/components/ReviewCard";
import { REVIEW_CATEGORIES } from "@/types";
import type { ReviewWithDetails, ReviewSummary as ReviewSummaryType, RatingMap } from "@/types";
import { ExternalLink } from "lucide-react";
import { ReviewFormWrapper } from "./ReviewFormWrapper";

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const currentUserId = session?.user?.id;

  const app = await prisma.app.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      reviews: {
        include: {
          reviewer: { select: { name: true, email: true } },
          votes: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!app || app.status !== "published") {
    notFound();
  }

  const screenshots = JSON.parse(app.screenshots) as string[];
  const questions = JSON.parse(app.questions) as string[];

  // Parse reviews
  const reviews: ReviewWithDetails[] = app.reviews.map((r) => {
    const helpfulVotes = r.votes.filter((v) => v.helpful).length;
    const unhelpfulVotes = r.votes.filter((v) => !v.helpful).length;
    const userVote = currentUserId
      ? r.votes.find((v) => v.voterId === currentUserId)
      : undefined;

    return {
      id: r.id,
      isAI: r.isAI,
      ratings: JSON.parse(r.ratings) as RatingMap,
      overallScore: r.overallScore,
      feedback: r.feedback,
      suggestions: JSON.parse(r.suggestions) as string[],
      ownerResponse: r.ownerResponse,
      ownerRespondedAt: r.ownerRespondedAt,
      appId: r.appId,
      reviewerId: r.reviewerId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      reviewer: r.reviewer
        ? { name: r.reviewer.name, email: r.reviewer.email }
        : undefined,
      voteCounts: { helpful: helpfulVotes, unhelpful: unhelpfulVotes },
      currentUserVote: userVote ? userVote.helpful : null,
    };
  });

  // Compute summary
  const totalReviews = reviews.length;
  const aiReviews = reviews.filter((r) => r.isAI).length;
  const humanReviews = totalReviews - aiReviews;

  const averageScores: RatingMap = {
    uiDesign: 0,
    uxFlow: 0,
    performance: 0,
    functionality: 0,
    innovation: 0,
    overall: 0,
  };

  if (totalReviews > 0) {
    for (const review of reviews) {
      for (const { key } of REVIEW_CATEGORIES) {
        averageScores[key] += review.ratings[key] || 0;
      }
    }
    for (const { key } of REVIEW_CATEGORIES) {
      averageScores[key] =
        Math.round((averageScores[key] / totalReviews) * 10) / 10;
    }
  }

  const overallAverage =
    totalReviews > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.overallScore, 0) / totalReviews) *
            10
        ) / 10
      : 0;

  const summary: ReviewSummaryType = {
    totalReviews,
    aiReviews,
    humanReviews,
    averageScores,
    overallAverage,
  };

  // Check if user already reviewed
  const hasReviewed = reviews.some(
    (r) => r.reviewerId === currentUserId
  );
  const isOwner = app.userId === currentUserId;

  return (
    <div className="space-y-8">
      {/* App header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{app.name}</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {app.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {app.url && (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-lumora-600 hover:text-lumora-700"
            >
              <ExternalLink className="h-4 w-4" />
              Visit App
            </a>
          )}
          {app.targetAudience && (
            <span>Target: {app.targetAudience}</span>
          )}
          {app.user?.name && <span>by {app.user.name}</span>}
        </div>
      </div>

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Screenshots
          </h3>
          <ScreenshotGallery screenshots={screenshots} />
        </div>
      )}

      {/* Questions the owner wants feedback on */}
      {questions.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">
            Questions from the developer
          </h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            {questions.map((q, i) => (
              <li key={i} className="text-sm text-gray-600">
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Review Summary */}
      {totalReviews > 0 && <ReviewSummary summary={summary} />}

      {/* Review Form or status message */}
      {isOwner ? (
        <div className="rounded-2xl border border-lumora-100 bg-lumora-50 p-6 text-center">
          <p className="text-sm text-lumora-700">
            This is your app. You cannot review your own app.
          </p>
        </div>
      ) : hasReviewed ? (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-6 text-center">
          <p className="text-sm text-green-700">
            You have already reviewed this app.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Write a Review
          </h3>
          <ReviewFormWrapper appId={id} />
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Reviews ({reviews.length})
          </h3>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              isAppOwner={isOwner}
              appId={id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
