"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppFormData {
  name: string;
  description: string;
  url: string;
  targetAudience: string;
  questions: string[];
  screenshots: string[];
}

interface AppSubmissionFormProps {
  onSubmit: (data: AppFormData) => Promise<void>;
  loading?: boolean;
}

const STEPS = ["App Details", "Questions", "Screenshots"];

export function AppSubmissionForm({ onSubmit, loading }: AppSubmissionFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<AppFormData>({
    name: "",
    description: "",
    url: "",
    targetAudience: "",
    questions: [""],
    screenshots: [""],
  });

  function updateField<K extends keyof AppFormData>(key: K, value: AppFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateListItem(key: "questions" | "screenshots", index: number, value: string) {
    setForm((prev) => {
      const list = [...prev[key]];
      list[index] = value;
      return { ...prev, [key]: list };
    });
  }

  function addListItem(key: "questions" | "screenshots") {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  }

  function removeListItem(key: "questions" | "screenshots", index: number) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  }

  const canAdvance =
    step === 0 ? form.name.trim() !== "" && form.description.trim() !== "" : true;

  async function handleSubmit() {
    const cleaned: AppFormData = {
      ...form,
      questions: form.questions.filter((q) => q.trim() !== ""),
      screenshots: form.screenshots.filter((s) => s.trim() !== ""),
    };
    await onSubmit(cleaned);
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicators */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                i <= step
                  ? "bg-lumora-600 text-white"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "hidden text-sm font-medium sm:inline",
                i <= step ? "text-gray-900" : "text-gray-400"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px w-8",
                  i < step ? "bg-lumora-400" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: App Details */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              App Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
              placeholder="My Awesome App"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
              placeholder="Describe what your app does and what kind of feedback you're looking for..."
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              App URL
            </label>
            <input
              id="url"
              type="url"
              value={form.url}
              onChange={(e) => updateField("url", e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
              placeholder="https://myapp.com"
            />
          </div>
          <div>
            <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
              Target Audience
            </label>
            <input
              id="audience"
              type="text"
              value={form.targetAudience}
              onChange={(e) => updateField("targetAudience", e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
              placeholder="e.g. Indie developers, small business owners"
            />
          </div>
        </div>
      )}

      {/* Step 2: Questions */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Add specific questions you want reviewers to address. These are optional
            but help get more targeted feedback.
          </p>
          {form.questions.map((q, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={q}
                onChange={(e) => updateListItem("questions", i, e.target.value)}
                className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
                placeholder={`Question ${i + 1}`}
              />
              {form.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem("questions", i)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem("questions")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-lumora-600 hover:text-lumora-700 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add question
          </button>
        </div>
      )}

      {/* Step 3: Screenshots */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Add URLs to screenshots of your app. These help reviewers evaluate design
            and UX.
          </p>
          {form.screenshots.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="url"
                value={s}
                onChange={(e) => updateListItem("screenshots", i, e.target.value)}
                className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
                placeholder="https://example.com/screenshot.png"
              />
              {form.screenshots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem("screenshots", i)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem("screenshots")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-lumora-600 hover:text-lumora-700 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add screenshot
          </button>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer",
            step === 0
              ? "invisible"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition cursor-pointer",
              canAdvance
                ? "bg-lumora-600 text-white hover:bg-lumora-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-lumora-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-lumora-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit App"}
          </button>
        )}
      </div>
    </div>
  );
}
