import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AppCard } from "@/components/AppCard";
import type { AppWithCounts } from "@/types";

export default async function BrowsePage() {
  const session = await auth();

  const apps = await prisma.app.findMany({
    where: { status: "published" },
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
      status: app.status as AppWithCounts["status"],
      userId: app.userId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      reviewCount,
      averageScore,
      user: app.user ? { name: app.user.name, email: app.user.email } : undefined,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Browse Apps</h2>
        <p className="mt-1 text-sm text-gray-500">
          {appsWithCounts.length}{" "}
          {appsWithCounts.length === 1 ? "app" : "apps"} available for review
        </p>
      </div>

      {appsWithCounts.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-gray-500">No published apps yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appsWithCounts.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              href={`/dashboard/browse/${app.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
