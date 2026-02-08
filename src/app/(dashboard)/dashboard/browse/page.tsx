import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BrowseClient } from "./browse-client";
import type { AppWithCounts } from "@/types";

export default async function BrowsePage() {
  const session = await auth();

  const apps = await prisma.app.findMany({
    where: { status: "published" },
    include: {
      user: { select: { name: true, email: true } },
      reviews: { select: { overallScore: true, isAI: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const appsWithCounts = apps.map((app) => {
    const reviewCount = app.reviews.length;
    const averageScore =
      reviewCount > 0
        ? Math.round(
            (app.reviews.reduce((sum, r) => sum + r.overallScore, 0) /
              reviewCount) *
              10
          ) / 10
        : 0;

    return {
      id: app.id,
      name: app.name,
      description: app.description,
      url: app.url ?? undefined,
      targetAudience: app.targetAudience ?? undefined,
      questions: JSON.parse(app.questions) as string[],
      screenshots: JSON.parse(app.screenshots) as string[],
      status: app.status as AppWithCounts["status"],
      userId: app.userId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      reviewCount,
      averageScore,
      user: app.user ? { name: app.user.name, email: app.user.email } : undefined,
      hasAIReview: app.reviews.some((r) => r.isAI),
      hasCommunityReview: app.reviews.some((r) => !r.isAI),
    };
  });

  return <BrowseClient apps={appsWithCounts} />;
}
