"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const studyTypes = [
  { value: "exploratory", label: "Exploratory Research" },
  { value: "concept_test", label: "Concept Testing" },
  { value: "usability_test", label: "Usability Testing" },
  { value: "journey_map", label: "Customer Journey Mapping" },
];

export default function StudyForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name") as string,
      goal: form.get("goal") as string,
      targetAudience: form.get("targetAudience") as string,
      type: form.get("type") as string,
    };

    try {
      const res = await fetch("/api/studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create study");
      }

      const study = await res.json();
      router.push(`/dashboard/studies/${study.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Study Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. Onboarding Experience Research"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-lumora-500 focus:ring-2 focus:ring-lumora-500/20 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="goal"
          className="block text-sm font-medium text-gray-700"
        >
          Research Goal
        </label>
        <textarea
          id="goal"
          name="goal"
          required
          rows={3}
          placeholder="What do you want to learn?"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-lumora-500 focus:ring-2 focus:ring-lumora-500/20 focus:outline-none resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="targetAudience"
          className="block text-sm font-medium text-gray-700"
        >
          Target Audience
        </label>
        <input
          id="targetAudience"
          name="targetAudience"
          type="text"
          required
          placeholder="Who do you want to talk to?"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-lumora-500 focus:ring-2 focus:ring-lumora-500/20 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Study Type
        </label>
        <select
          id="type"
          name="type"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-lumora-500 focus:ring-2 focus:ring-lumora-500/20 focus:outline-none"
        >
          {studyTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-lumora-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-lumora-700 focus:outline-none focus:ring-2 focus:ring-lumora-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Creating..." : "Create Study"}
      </button>
    </form>
  );
}
