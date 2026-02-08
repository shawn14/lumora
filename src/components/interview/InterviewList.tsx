"use client";

import { useEffect, useState } from "react";
import { Clock, MessageSquare, Plus, User } from "lucide-react";
import type { Interview } from "@/types";

const statusColors: Record<string, string> = {
  scheduled: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
};

function formatDuration(start?: Date, end?: Date): string {
  if (!start) return "--";
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const mins = Math.round((e - s) / 60000);
  if (mins < 1) return "<1 min";
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function InterviewList({
  studyId,
  onStartNew,
}: {
  studyId: string;
  onStartNew: () => void;
}) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/interview?studyId=${studyId}`)
      .then((r) => r.json())
      .then((data) => {
        setInterviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [studyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lumora-200 border-t-lumora-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Interviews</h2>
        <button
          onClick={onStartNew}
          className="inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lumora-700"
        >
          <Plus className="h-4 w-4" />
          Start New Interview
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 px-6 py-16 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            No interviews yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Start your first interview to begin collecting insights.
          </p>
          <button
            onClick={onStartNew}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-lumora-700"
          >
            <Plus className="h-4 w-4" />
            Start New Interview
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lumora-50">
                  <User className="h-5 w-5 text-lumora-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {interview.participantName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(
                      interview.startedAt ?? interview.id
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(interview.startedAt, interview.completedAt)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {interview.messages.length}
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[interview.status] ?? "bg-gray-100 text-gray-800"}`}
                >
                  {statusLabels[interview.status] ?? interview.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
