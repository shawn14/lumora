"use client";

import type { Study } from "@/types";

const typeLabels: Record<string, string> = {
  exploratory: "Exploratory Research",
  concept_test: "Concept Testing",
  usability_test: "Usability Testing",
  journey_map: "Customer Journey Mapping",
};

export default function StudyOverview({
  study,
  interviewCount,
  insightCount,
  hasGuide,
  onGenerateGuide,
  generatingGuide,
}: {
  study: Study;
  interviewCount: number;
  insightCount: number;
  hasGuide: boolean;
  onGenerateGuide: () => void;
  generatingGuide: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Study Details</h3>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Goal</dt>
            <dd className="mt-1 text-sm text-gray-900">{study.goal}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Target Audience
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {study.targetAudience}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {typeLabels[study.type] ?? study.type}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {study.status}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(study.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(study.updatedAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-3xl font-bold text-lumora-600">{interviewCount}</p>
          <p className="mt-1 text-sm text-gray-500">Interviews Completed</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-3xl font-bold text-lumora-600">{insightCount}</p>
          <p className="mt-1 text-sm text-gray-500">Insights Generated</p>
        </div>
      </div>

      <div className="flex gap-3">
        {!hasGuide && (
          <button
            onClick={onGenerateGuide}
            disabled={generatingGuide}
            className="inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-lumora-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
              />
            </svg>
            {generatingGuide ? "Generating..." : "Generate Discussion Guide"}
          </button>
        )}
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
          Start Interview
        </button>
      </div>
    </div>
  );
}
