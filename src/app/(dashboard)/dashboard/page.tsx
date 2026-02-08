import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  AppWindow,
  MessageSquare,
  Star,
  PlusCircle,
  Search,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const firstName = session.user.name?.split(" ")[0] || "there";

  const [appsCount, reviewsReceived, reviewsGiven, apps] = await Promise.all([
    prisma.app.count({ where: { userId } }),
    prisma.review.count({
      where: { app: { userId } },
    }),
    prisma.review.count({ where: { reviewerId: userId } }),
    prisma.app.findMany({
      where: { userId },
      include: {
        reviews: { select: { overallScore: true } },
      },
    }),
  ]);

  // Compute average score across all user's apps
  const allScores = apps.flatMap((app) =>
    app.reviews.map((r) => r.overallScore)
  );
  const avgScore =
    allScores.length > 0
      ? Math.round(
          (allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10
        ) / 10
      : 0;

  // Recent reviews on user's apps
  const recentReviews = await prisma.review.findMany({
    where: { app: { userId } },
    include: {
      reviewer: { select: { name: true, email: true } },
      app: { select: { name: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    {
      label: "Apps Submitted",
      value: appsCount,
      icon: AppWindow,
      color: "text-lumora-600",
      bg: "bg-lumora-50",
    },
    {
      label: "Reviews Received",
      value: reviewsReceived,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Reviews Given",
      value: reviewsGiven,
      icon: MessageSquare,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg Score",
      value: avgScore > 0 ? avgScore.toFixed(1) : "--",
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {firstName}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s an overview of your app feedback activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/submit"
          className="inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lumora-700"
        >
          <PlusCircle className="h-4 w-4" />
          Submit New App
        </Link>
        <Link
          href="/dashboard/browse"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Search className="h-4 w-4" />
          Browse Apps
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          Recent Reviews on Your Apps
        </h3>
        {recentReviews.length === 0 ? (
          <div className="mt-3 flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white py-10 px-6 text-center">
            <p className="text-sm font-medium text-gray-900">
              No reviews on your apps yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Submit an app to start collecting AI and community feedback.
            </p>
            <Link
              href="/dashboard/submit"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lumora-700"
            >
              <PlusCircle className="h-4 w-4" />
              Submit Your First App
            </Link>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {recentReviews.map((review) => (
              <Link
                key={review.id}
                href={`/dashboard/apps/${review.appId}`}
                className="block rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {review.app?.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {review.isAI
                        ? "AI Reviewer"
                        : (review.reviewer?.name ?? "Anonymous")}{" "}
                      &middot;{" "}
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-lumora-50 px-2.5 py-1">
                    <Star className="h-3.5 w-3.5 fill-lumora-500 text-lumora-500" />
                    <span className="text-sm font-semibold text-lumora-700">
                      {review.overallScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                {review.feedback && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {review.feedback}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
