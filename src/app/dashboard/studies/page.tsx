"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StudyCard from "@/components/study/StudyCard";
import type { Study } from "@/types";

export default function StudiesPage() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/studies");
        if (res.ok) {
          const data = await res.json();
          setStudies(data);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Studies</h1>
        <Link
          href="/dashboard/studies/new"
          className="inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-lumora-700"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Study
        </Link>
      </div>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-lumora-200 border-t-lumora-600" />
        </div>
      ) : studies.length === 0 ? (
        <div className="mt-16 text-center">
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No studies yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first study to get started.
          </p>
          <Link
            href="/dashboard/studies/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-lumora-700"
          >
            Create Your First Study
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
}
