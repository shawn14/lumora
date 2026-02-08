import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppWithCounts } from "@/types";

interface AppCardProps {
  app: AppWithCounts;
  href?: string;
}

export function AppCard({ app, href }: AppCardProps) {
  const content = (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow",
        href && "hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {app.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {app.description}
          </p>
        </div>
        {app.averageScore > 0 && (
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-lumora-50 px-2.5 py-1">
            <Star className="h-4 w-4 fill-lumora-500 text-lumora-500" />
            <span className="text-sm font-semibold text-lumora-700">
              {app.averageScore.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <span>
          {app.reviewCount} {app.reviewCount === 1 ? "review" : "reviews"}
        </span>
        {app.user?.name && <span>by {app.user.name}</span>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
