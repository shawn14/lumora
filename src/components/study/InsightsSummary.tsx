"use client";

import { FileText } from "lucide-react";

export default function InsightsSummary({ summary }: { summary: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lumora-50">
          <FileText className="h-5 w-5 text-lumora-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          Executive Summary
        </h3>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-gray-600">
        {summary.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
