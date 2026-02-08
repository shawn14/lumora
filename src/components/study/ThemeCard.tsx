"use client";

import { MessageCircle, TrendingUp } from "lucide-react";
import type { Theme } from "@/types";

const sentimentColors: Record<string, string> = {
  positive: "bg-green-100 text-green-700",
  negative: "bg-red-100 text-red-700",
  neutral: "bg-gray-100 text-gray-700",
  mixed: "bg-yellow-100 text-yellow-700",
};

export default function ThemeCard({ theme }: { theme: Theme }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-start justify-between">
        <h4 className="text-sm font-semibold text-gray-900">{theme.name}</h4>
        <span
          className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
            sentimentColors[theme.sentiment] ?? sentimentColors.neutral
          }`}
        >
          {theme.sentiment}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        {theme.description}
      </p>

      {/* Frequency indicator */}
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-3 rounded-full ${
                i < theme.frequency ? "bg-lumora-500" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">{theme.frequency}/10</span>
      </div>

      {/* Quotes */}
      {theme.quotes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <MessageCircle className="h-3 w-3" />
            Key Quotes
          </div>
          {theme.quotes.map((quote, i) => (
            <blockquote
              key={i}
              className="border-l-2 border-lumora-200 pl-3 text-xs italic leading-relaxed text-gray-500"
            >
              &ldquo;{quote}&rdquo;
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
}
