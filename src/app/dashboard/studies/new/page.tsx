"use client";

import Link from "next/link";
import StudyForm from "@/components/study/StudyForm";

export default function NewStudyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
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

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Create New Study
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Set up your research study and we'll help you build a discussion guide.
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <StudyForm />
      </div>
    </div>
  );
}
