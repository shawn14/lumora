import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ReviewCard } from "@/components/ReviewCard";
import type { ReviewWithDetails, RatingMap } from "@/types";

export default async function MyReviewsPage() {
  const session = await auth();

  const rawReviews = await prisma.review.findMany({
    where: { reviewerId: session!.user!.id },
    include: {
      reviewer: { select: { name: true, email: true } },
      app: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const reviews: (ReviewWithDetails & { app: { id: string; name: string } })[] =
    rawReviews.map((r) => ({
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
      app: { id: r.app.id, name: r.app.name },
    }));

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
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id}>
              <Link
                href={`/dashboard/browse/${review.app.id}`}
                className="mb-2 inline-block text-sm font-medium text-lumora-600 hover:text-lumora-700"
              >
                {review.app.name}
              </Link>
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
