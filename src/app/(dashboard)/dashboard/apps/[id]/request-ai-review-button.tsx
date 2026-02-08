"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

export function RequestAIReviewButton({ appId }: { appId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/apps/${appId}/ai-review`, {
        method: "POST",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to request AI review");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleRequest}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-lumora-700 disabled:opacity-50 cursor-pointer"
      >
        <Bot className="h-4 w-4" />
        {loading ? "Requesting AI Review..." : "Request AI Review"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
