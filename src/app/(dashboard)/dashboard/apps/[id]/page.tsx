import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewSummary } from "@/components/ReviewSummary";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { REVIEW_CATEGORIES } from "@/types";
import type {
  RatingMap,
  ReviewWithDetails,
  ReviewSummary as ReviewSummaryType,
} from "@/types";
import { RequestAIReviewButton } from "./request-ai-review-button";

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const app = await prisma.app.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          reviewer: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!app) notFound();
  if (app.userId !== session.user.id) redirect("/dashboard/apps");

  const questions = JSON.parse(app.questions) as string[];
  const screenshots = JSON.parse(app.screenshots) as string[];

  // Parse reviews
  const reviews: ReviewWithDetails[] = app.reviews.map((r) => ({
    id: r.id,
    isAI: r.isAI,
    ratings: JSON.parse(r.ratings) as RatingMap,
    overallScore: r.overallScore,
    feedback: r.feedback,
    suggestions: JSON.parse(r.suggestions) as string[],
    appId: r.appId,
    reviewerId: r.reviewerId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    reviewer: r.reviewer
      ? { name: r.reviewer.name, email: r.reviewer.email }
      : undefined,
  }));

  // Build summary
  const hasAIReview = reviews.some((r) => r.isAI);
  const totalReviews = reviews.length;
  const aiReviews = reviews.filter((r) => r.isAI).length;
  const humanReviews = totalReviews - aiReviews;

  const emptyRatings: RatingMap = {
    uiDesign: 0,
    uxFlow: 0,
    performance: 0,
    functionality: 0,
    innovation: 0,
    overall: 0,
  };

  const averageScores = { ...emptyRatings };
  let overallAverage = 0;

  if (totalReviews > 0) {
    for (const cat of REVIEW_CATEGORIES) {
      averageScores[cat.key] =
        Math.round(
          (reviews.reduce((sum, r) => sum + (r.ratings[cat.key] || 0), 0) /
            totalReviews) *
            10
        ) / 10;
    }
    overallAverage =
      Math.round(
        (reviews.reduce((sum, r) => sum + r.overallScore, 0) / totalReviews) *
          10
      ) / 10;
  }

  const summary: ReviewSummaryType = {
    totalReviews,
    aiReviews,
    humanReviews,
    averageScores,
    overallAverage,
  };

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard/apps"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Apps
      </Link>

      {/* App header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{app.name}</h2>
        <p className="mt-2 text-gray-600">{app.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {app.url && (
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-lumora-600 hover:text-lumora-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visit App
            </a>
          )}
          {app.targetAudience && <span>Audience: {app.targetAudience}</span>}
        </div>
      </div>

      {/* Questions */}
      {questions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Questions for Reviewers
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {questions.map((q, i) => (
              <li key={i} className="text-sm text-gray-600">
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Screenshots
          </h3>
          <ScreenshotGallery screenshots={screenshots} />
        </div>
      )}

      {/* Review summary */}
      {totalReviews > 0 && <ReviewSummary summary={summary} />}

      {/* Request AI review */}
      {!hasAIReview && <RequestAIReviewButton appId={app.id} />}

      {/* Reviews list */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Reviews ({totalReviews})
        </h3>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            No reviews yet. Your app will receive reviews from the community and
            AI shortly.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
