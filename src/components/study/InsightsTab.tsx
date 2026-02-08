"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Sparkles, CheckCircle } from "lucide-react";
import InsightsSummary from "./InsightsSummary";
import ThemeCard from "./ThemeCard";
import type { Theme } from "@/types";

interface InsightData {
  id: string;
  summary: string;
  themes: Theme[];
  recommendations: string[];
  generatedAt: string;
}

export default function InsightsTab({ studyId }: { studyId: string }) {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/studies/${studyId}/insights`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (data) setInsight(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [studyId]);

  async function handleGenerate() {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch(`/api/studies/${studyId}/synthesize`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate insights");
      }

      const data = await res.json();
      setInsight(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lumora-200 border-t-lumora-600" />
      </div>
    );
  }

  // No insights yet
  if (!insight) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 px-6 py-16 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-gray-300" />
        <h3 className="mt-4 text-sm font-medium text-gray-900">
          No insights generated yet
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
          Complete some interviews first, then generate AI-powered insights to
          discover themes and patterns.
        </p>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lumora-700 disabled:opacity-50"
        >
          {generating ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analyzing Interviews...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Insights
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <InsightsSummary summary={insight.summary} />

      {/* Themes */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Lightbulb className="h-4 w-4 text-lumora-600" />
          Key Themes
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insight.themes.map((theme, i) => (
            <ThemeCard key={i} theme={theme} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {insight.recommendations.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <CheckCircle className="h-4 w-4 text-lumora-600" />
            Recommendations
          </h3>
          <ol className="space-y-3">
            {insight.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lumora-50 text-xs font-semibold text-lumora-700">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Re-generate button */}
      <div className="text-center">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {generating ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              Regenerating...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Regenerate Insights
            </>
          )}
        </button>
      </div>
    </div>
  );
}
