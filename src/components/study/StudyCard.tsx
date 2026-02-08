"use client";

import Link from "next/link";
import type { Study } from "@/types";

const typeLabels: Record<string, string> = {
  exploratory: "Exploratory",
  concept_test: "Concept Test",
  usability_test: "Usability Test",
  journey_map: "Journey Map",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-lumora-100 text-lumora-700",
  archived: "bg-yellow-100 text-yellow-700",
};

export default function StudyCard({
  study,
  interviewCount = 0,
  insightCount = 0,
}: {
  study: Study;
  interviewCount?: number;
  insightCount?: number;
}) {
  return (
    <Link
      href={`/dashboard/studies/${study.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-lumora-300"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {study.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[study.status] ?? statusColors.draft}`}
        >
          {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
        </span>
      </div>

      <span className="mt-2 inline-block rounded-full bg-lumora-50 px-2.5 py-0.5 text-xs font-medium text-lumora-600">
        {typeLabels[study.type] ?? study.type}
      </span>

      <p className="mt-3 text-sm text-gray-500 line-clamp-2">{study.goal}</p>

      <p className="mt-2 text-sm text-gray-600">
        <span className="font-medium">Audience:</span> {study.targetAudience}
      </p>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
        <span>{interviewCount} interviews</span>
        <span>{insightCount} insights</span>
        <span className="ml-auto">
          {new Date(study.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
