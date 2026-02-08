import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { AppCard } from "@/components/AppCard";
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Apps</h2>
        <Link
          href="/dashboard/submit"
          className="inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lumora-700"
        >
          <PlusCircle className="h-4 w-4" />
          Submit App
        </Link>
      </div>

      {appsWithCounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 px-6 text-center">
          <p className="text-lg font-medium text-gray-900">No apps yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Submit your first app to start getting feedback.
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appsWithCounts.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              href={`/dashboard/apps/${app.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
