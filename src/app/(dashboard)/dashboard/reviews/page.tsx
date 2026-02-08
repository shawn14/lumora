import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ReviewsClient } from "./reviews-client";
import type { ReviewWithDetails, RatingMap } from "@/types";

export default async function MyReviewsPage() {
  const session = await auth();

  const currentUserId = session!.user!.id;

  const rawReviews = await prisma.review.findMany({
    where: { reviewerId: currentUserId },
    include: {
      reviewer: { select: { name: true, email: true } },
      app: { select: { id: true, name: true } },
      votes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const reviews = rawReviews.map((r) => {
    const helpfulVotes = r.votes.filter((v) => v.helpful).length;
    const unhelpfulVotes = r.votes.filter((v) => !v.helpful).length;
    const userVote = r.votes.find((v) => v.voterId === currentUserId);

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
      app: { id: r.app.id, name: r.app.name },
      voteCounts: { helpful: helpfulVotes, unhelpful: unhelpfulVotes },
      currentUserVote: userVote ? userVote.helpful : null,
    };
  });

  return <ReviewsClient reviews={reviews} currentUserId={currentUserId} />;
}
