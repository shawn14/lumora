"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { AppCard } from "@/components/AppCard";
import { AppCardDeleteButton } from "@/components/AppCardDeleteButton";
import { cn } from "@/lib/utils";
import type { AppWithCounts } from "@/types";

interface AppsClientProps {
  apps: AppWithCounts[];
}

const ITEMS_PER_PAGE = 12;

export function AppsClient({ apps }: AppsClientProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(apps.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = apps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

      {apps.length === 0 ? (
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
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                href={`/dashboard/apps/${app.id}`}
                actions={<AppCardDeleteButton appId={app.id} />}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                  currentPage <= 1
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                  currentPage >= totalPages
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
