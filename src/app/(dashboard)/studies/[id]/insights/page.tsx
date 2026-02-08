"use client";

import { useParams } from "next/navigation";
import InsightsTab from "@/components/study/InsightsTab";

export default function InsightsPage() {
  const params = useParams();
  const studyId = params.id as string;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900">
          Research Insights
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          AI-synthesized themes, patterns, and recommendations from your
          interviews.
        </p>
      </div>
      <InsightsTab studyId={studyId} />
    </div>
  );
}
