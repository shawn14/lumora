"use client";

import { useState } from "react";
import { REVIEW_CATEGORIES } from "@/types";
import type { RatingMap } from "@/types";
import { cn } from "@/lib/utils";

interface ReviewFormData {
  ratings: RatingMap;
  feedback: string;
  suggestions: string[];
}

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>;
  loading?: boolean;
}

const DEFAULT_RATINGS: RatingMap = {
  uiDesign: 5,
  uxFlow: 5,
  performance: 5,
  functionality: 5,
  innovation: 5,
  overall: 5,
};

export function ReviewForm({ onSubmit, loading }: ReviewFormProps) {
  const [ratings, setRatings] = useState<RatingMap>({ ...DEFAULT_RATINGS });
  const [feedback, setFeedback] = useState("");
  const [suggestionsText, setSuggestionsText] = useState("");

  function updateRating(key: keyof RatingMap, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const suggestions = suggestionsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    await onSubmit({ ratings, feedback, suggestions });
  }

  const isValid = feedback.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating sliders */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Ratings</h3>
        {REVIEW_CATEGORIES.map(({ key, label }) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={key} className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <span className="text-sm font-semibold text-lumora-700">
                {ratings[key]}
              </span>
            </div>
            <input
              id={key}
              type="range"
              min={1}
              max={10}
              step={1}
              value={ratings[key]}
              onChange={(e) => updateRating(key, Number(e.target.value))}
              className="w-full accent-lumora-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      <div>
        <label htmlFor="feedback" className="block text-sm font-semibold text-gray-900">
          Feedback <span className="text-red-500">*</span>
        </label>
        <textarea
          id="feedback"
          rows={5}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
          placeholder="Share your detailed thoughts on this app..."
        />
      </div>

      {/* Suggestions */}
      <div>
        <label htmlFor="suggestions" className="block text-sm font-semibold text-gray-900">
          Suggestions
        </label>
        <p className="mt-0.5 text-xs text-gray-500">One suggestion per line</p>
        <textarea
          id="suggestions"
          rows={4}
          value={suggestionsText}
          onChange={(e) => setSuggestionsText(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
          placeholder={"Improve onboarding flow\nAdd dark mode support\nOptimize loading speed"}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className={cn(
          "w-full rounded-lg px-4 py-2.5 text-sm font-medium transition cursor-pointer",
          isValid && !loading
            ? "bg-lumora-600 text-white hover:bg-lumora-700"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        )}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
