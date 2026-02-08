import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AppsClient } from "./apps-client";
import type { AppWithCounts } from "@/types";

export default async function MyAppsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const apps = await prisma.app.findMany({
    where: { userId: session.user.id },
    include: {
      user: { select: { name: true, email: true } },
      reviews: { select: { overallScore: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const appsWithCounts: AppWithCounts[] = apps.map((app) => {
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
      status: app.status as "draft" | "published" | "archived",
      userId: app.userId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      user: app.user
        ? { name: app.user.name, email: app.user.email }
        : undefined,
      reviewCount,
      averageScore,
    };
  });

  return <AppsClient apps={appsWithCounts} />;
}
