"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppSubmissionForm } from "@/components/AppSubmissionForm";

export default function SubmitAppPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: {
    name: string;
    description: string;
    url: string;
    targetAudience: string;
    questions: string[];
    screenshots: string[];
  }) {
    setLoading(true);
    setError(null);

    try {
      // Create the app
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create app");
      }

      const app = await res.json();

      // Trigger AI review (best-effort, don't block navigation)
      fetch(`/api/apps/${app.id}/ai-review`, {
        method: "POST",
      }).catch(() => {});

      router.push(`/dashboard/apps/${app.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Submit Your App for Review
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Share your app with the Lumora community and get feedback from both AI
          and human reviewers.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <AppSubmissionForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
