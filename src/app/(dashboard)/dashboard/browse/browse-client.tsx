"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { AppCard } from "@/components/AppCard";
import { cn } from "@/lib/utils";
import type { AppWithCounts } from "@/types";

type SortOption = "newest" | "rating" | "most-reviewed";

interface BrowseAppData extends AppWithCounts {
  hasAIReview: boolean;
  hasCommunityReview: boolean;
}

interface BrowseClientProps {
  apps: BrowseAppData[];
}

const ITEMS_PER_PAGE = 12;

export function BrowseClient({ apps }: BrowseClientProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [minRating, setMinRating] = useState(0);
  const [filterAI, setFilterAI] = useState(false);
  const [filterCommunity, setFilterCommunity] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = apps;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q)
      );
    }

    // Filter by minimum rating
    if (minRating > 0) {
      result = result.filter((app) => app.averageScore >= minRating);
    }

    // Filter by AI review
    if (filterAI) {
      result = result.filter((app) => app.hasAIReview);
    }

    // Filter by community review
    if (filterCommunity) {
      result = result.filter((app) => app.hasCommunityReview);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.averageScore - a.averageScore;
        case "most-reviewed":
          return b.reviewCount - a.reviewCount;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [apps, search, sort, minRating, filterAI, filterCommunity]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const updateFilter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Browse Apps</h2>
        <p className="mt-1 text-sm text-gray-500">
          {filtered.length} {filtered.length === 1 ? "app" : "apps"} available
          for review
        </p>
      </div>

      {/* Search + Controls */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search apps by name or description..."
            value={search}
            onChange={(e) => updateFilter(setSearch)(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateFilter(setSort)(e.target.value as SortOption)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="rating">Highest rated</option>
            <option value="most-reviewed">Most reviewed</option>
          </select>

          {/* Min rating */}
          <select
            value={minRating}
            onChange={(e) =>
              updateFilter(setMinRating)(Number(e.target.value))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
          >
            <option value={0}>Any rating</option>
            <option value={3}>3+ rating</option>
            <option value={5}>5+ rating</option>
            <option value={7}>7+ rating</option>
            <option value={9}>9+ rating</option>
          </select>

          {/* Toggle filters */}
          <button
            type="button"
            onClick={() => updateFilter(setFilterAI)(!filterAI)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition",
              filterAI
                ? "border-lumora-500 bg-lumora-50 text-lumora-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            )}
          >
            Has AI review
          </button>
          <button
            type="button"
            onClick={() => updateFilter(setFilterCommunity)(!filterCommunity)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition",
              filterCommunity
                ? "border-lumora-500 bg-lumora-50 text-lumora-700"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            )}
          >
            Has community reviews
          </button>
        </div>
      </div>

      {/* App grid */}
      {paginated.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-gray-500">
            {apps.length === 0
              ? "No published apps yet."
              : "No apps match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              href={`/dashboard/browse/${app.id}`}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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
    </div>
  );
}
