"use client";

import { useState } from "react";
import type { GuideSection } from "@/types";

export default function DiscussionGuideTab({
  studyId,
  initialSections,
}: {
  studyId: string;
  initialSections: GuideSection[] | null;
}) {
  const [sections, setSections] = useState<GuideSection[] | null>(
    initialSections
  );
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    sectionIdx: number;
    questionIdx: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dirty, setDirty] = useState(false);

  async function generateGuide() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/studies/${studyId}/generate-guide`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate guide");
      const data = await res.json();
      setSections(data.sections);
      setDirty(false);
    } catch {
      alert("Failed to generate discussion guide. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function startEditQuestion(sectionIdx: number, questionIdx: number) {
    setEditingQuestion({ sectionIdx, questionIdx });
    setEditValue(sections![sectionIdx].questions[questionIdx]);
  }

  function saveEditQuestion() {
    if (!editingQuestion || !sections) return;
    const updated = [...sections];
    updated[editingQuestion.sectionIdx] = {
      ...updated[editingQuestion.sectionIdx],
      questions: [...updated[editingQuestion.sectionIdx].questions],
    };
    updated[editingQuestion.sectionIdx].questions[
      editingQuestion.questionIdx
    ] = editValue;
    setSections(updated);
    setEditingQuestion(null);
    setDirty(true);
  }

  function addQuestion(sectionIdx: number) {
    if (!sections) return;
    const updated = [...sections];
    updated[sectionIdx] = {
      ...updated[sectionIdx],
      questions: [...updated[sectionIdx].questions, "New question"],
    };
    setSections(updated);
    setDirty(true);
    startEditQuestion(sectionIdx, updated[sectionIdx].questions.length - 1);
  }

  async function saveChanges() {
    if (!sections) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/studies/${studyId}/generate-guide`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setDirty(false);
    } catch {
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!sections) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {generating ? (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-lumora-200 border-t-lumora-600" />
            <p className="text-sm text-gray-500">
              Generating your discussion guide...
            </p>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No Discussion Guide Yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Generate an AI-powered discussion guide based on your study goals.
            </p>
            <button
              onClick={generateGuide}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-lumora-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                />
              </svg>
              Generate Discussion Guide
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Discussion Guide
        </h3>
        <div className="flex gap-3">
          <button
            onClick={generateGuide}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            {generating ? "Regenerating..." : "Regenerate Guide"}
          </button>
          {dirty && (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="inline-flex items-center rounded-lg bg-lumora-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-lumora-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {sections.map((section, sIdx) => (
        <div
          key={sIdx}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <h4 className="text-base font-semibold text-gray-900">
            {section.title}
          </h4>
          <p className="mt-1 text-sm text-gray-500">{section.objective}</p>

          <ul className="mt-4 space-y-2">
            {section.questions.map((question, qIdx) => (
              <li key={qIdx} className="group flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-sm font-medium text-lumora-500">
                  {qIdx + 1}.
                </span>
                {editingQuestion?.sectionIdx === sIdx &&
                editingQuestion?.questionIdx === qIdx ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditQuestion();
                        if (e.key === "Escape") setEditingQuestion(null);
                      }}
                      className="flex-1 rounded-md border border-lumora-300 px-3 py-1 text-sm focus:border-lumora-500 focus:ring-2 focus:ring-lumora-500/20 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={saveEditQuestion}
                      className="text-sm text-lumora-600 hover:text-lumora-700 font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => startEditQuestion(sIdx, qIdx)}
                    className="flex-1 text-sm text-gray-700 cursor-pointer rounded px-1 -mx-1 hover:bg-lumora-50 transition"
                  >
                    {question}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() => addQuestion(sIdx)}
            className="mt-3 text-sm text-lumora-600 hover:text-lumora-700 font-medium"
          >
            + Add Question
          </button>
        </div>
      ))}
    </div>
  );
}
