"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Globe, Loader2, Check, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "analyzing" | "complete" | "error";

const PROGRESS_STEPS = [
  { label: "Fetching your app...", delay: 0 },
  { label: "AI is analyzing your app...", delay: 2500 },
  { label: "Generating expert review...", delay: 5500 },
  { label: "Finalizing...", delay: 9000 },
];

export default function SubmitAppPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  function startProgressAnimation() {
    setActiveStep(0);
    clearTimers();
    for (let i = 1; i < PROGRESS_STEPS.length; i++) {
      const timer = setTimeout(() => setActiveStep(i), PROGRESS_STEPS[i].delay);
      timersRef.current.push(timer);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) return;

    // Basic URL validation on client
    try {
      const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      setError("Please enter a valid URL (e.g. https://myapp.com)");
      return;
    }

    setPhase("analyzing");
    setError(null);
    startProgressAnimation();

    try {
      const finalUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const res = await fetch("/api/apps/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }

      const { appId } = await res.json();
      clearTimers();
      setPhase("complete");

      // Brief pause to show completion state, then redirect
      setTimeout(() => {
        router.push(`/dashboard/apps/${appId}`);
      }, 600);
    } catch (err) {
      clearTimers();
      setPhase("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function handleRetry() {
    setPhase("idle");
    setError(null);
    setActiveStep(0);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Submit Your App for Review
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Paste your app URL and our AI Product Manager will analyze it,
          generate metadata, and create an expert review — automatically.
        </p>
      </div>

      {phase === "idle" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              className="block w-full rounded-xl border border-gray-300 py-3.5 pl-11 pr-4 text-base shadow-sm focus:border-lumora-500 focus:ring-2 focus:ring-lumora-500/20 focus:outline-none"
              placeholder="https://myapp.com"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!url.trim()}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-medium transition cursor-pointer",
              url.trim()
                ? "bg-lumora-600 text-white hover:bg-lumora-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Analyze & Review
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {(phase === "analyzing" || phase === "complete") && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {PROGRESS_STEPS.map((step, i) => {
              const isDone = phase === "complete" || i < activeStep;
              const isActive = phase === "analyzing" && i === activeStep;

              return (
                <div
                  key={step.label}
                  className={cn(
                    "flex items-center gap-3 transition-opacity duration-300",
                    i > activeStep && phase !== "complete"
                      ? "opacity-30"
                      : "opacity-100"
                  )}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                    {isDone ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 animate-spin text-lumora-600" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isDone
                        ? "text-green-700"
                        : isActive
                          ? "text-gray-900"
                          : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {phase === "complete" && (
            <p className="mt-5 text-center text-sm font-medium text-green-700">
              Done! Redirecting to your app...
            </p>
          )}
        </div>
      )}

      {phase === "error" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="w-full rounded-xl bg-lumora-600 px-5 py-3.5 text-base font-medium text-white transition hover:bg-lumora-700 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
