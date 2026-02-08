"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewForm } from "@/components/ReviewForm";
import type { RatingMap } from "@/types";

interface ReviewFormWrapperProps {
  appId: string;
}

export function ReviewFormWrapper({ appId }: ReviewFormWrapperProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: {
    ratings: RatingMap;
    feedback: string;
    suggestions: string[];
  }) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/apps/${appId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to submit review");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <ReviewForm onSubmit={handleSubmit} loading={loading} />
    </>
  );
}
