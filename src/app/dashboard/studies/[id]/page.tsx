"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudyTabs, { type TabId } from "@/components/study/StudyTabs";
import StudyOverview from "@/components/study/StudyOverview";
import DiscussionGuideTab from "@/components/study/DiscussionGuideTab";
import InterviewList from "@/components/interview/InterviewList";
import InsightsTab from "@/components/study/InsightsTab";
import type { Study, GuideSection } from "@/types";

interface StudyDetail {
  study: Study;
  guide: { sections: GuideSection[] } | null;
  interviewCount: number;
  insightCount: number;
}

export default function StudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<StudyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [generatingGuide, setGeneratingGuide] = useState(false);

  const loadStudy = useCallback(async () => {
    try {
      const res = await fetch(`/api/studies/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudy();
  }, [loadStudy]);

  async function handleGenerateGuide() {
    setGeneratingGuide(true);
    try {
      const res = await fetch(`/api/studies/${id}/generate-guide`, {
        method: "POST",
      });
      if (res.ok) {
        await loadStudy();
        setActiveTab("guide");
      }
    } finally {
      setGeneratingGuide(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lumora-200 border-t-lumora-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-center">
        <h2 className="text-lg font-medium text-gray-900">Study not found</h2>
        <Link
          href="/dashboard/studies"
          className="mt-4 inline-block text-sm text-lumora-600 hover:text-lumora-700"
        >
          Back to Studies
        </Link>
      </div>
    );
  }

  const { study, guide, interviewCount, insightCount } = data;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/dashboard/studies"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
        Back to Studies
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">{study.name}</h1>

      <div className="mt-6">
        <StudyTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <StudyOverview
            study={study}
            interviewCount={interviewCount}
            insightCount={insightCount}
            hasGuide={!!guide}
            onGenerateGuide={handleGenerateGuide}
            generatingGuide={generatingGuide}
          />
        )}
        {activeTab === "guide" && (
          <DiscussionGuideTab
            studyId={study.id}
            initialSections={guide?.sections ?? null}
          />
        )}
        {activeTab === "interviews" && (
          <InterviewList
            studyId={study.id}
            onStartNew={() => router.push(`/studies/${study.id}/interview`)}
          />
        )}
        {activeTab === "insights" && (
          <InsightsTab studyId={study.id} />
        )}
      </div>
    </div>
  );
}
