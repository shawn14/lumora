"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, User } from "lucide-react";
import InterviewChat from "@/components/interview/InterviewChat";
import type { Message, GuideSection } from "@/types";

interface InterviewState {
  id: string;
  participantName: string;
  messages: Message[];
  sections: GuideSection[];
}

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const studyId = params.id as string;

  const [participantName, setParticipantName] = useState("");
  const [interview, setInterview] = useState<InterviewState | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  async function handleBegin() {
    if (!participantName.trim()) {
      setError("Please enter a participant name");
      return;
    }

    setStarting(true);
    setError("");

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyId, participantName: participantName.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to start interview");
      }

      const data = await res.json();

      // Fetch the study's discussion guide sections for progress tracking
      let sections: GuideSection[] = [];
      try {
        const guideRes = await fetch(`/api/studies/${studyId}`);
        if (guideRes.ok) {
          const studyData = await guideRes.json();
          sections = studyData.guide?.sections
            ? JSON.parse(studyData.guide.sections)
            : [];
        }
      } catch {
        // Proceed without sections
      }

      setInterview({
        id: data.id,
        participantName: data.participantName,
        messages: data.messages,
        sections,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStarting(false);
    }
  }

  function handleEnd() {
    router.push(`/studies/${studyId}`);
  }

  // Active interview chat
  if (interview) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <InterviewChat
          interviewId={interview.id}
          participantName={interview.participantName}
          initialMessages={interview.messages}
          sections={interview.sections}
          onEnd={handleEnd}
        />
      </div>
    );
  }

  // Pre-interview screen
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <button
        onClick={() => router.push(`/studies/${studyId}`)}
        className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Study
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-lumora-50">
          <MessageSquare className="h-6 w-6 text-lumora-600" />
        </div>

        <h1 className="text-xl font-semibold text-gray-900">
          Start New Interview
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          The AI interviewer will guide the conversation based on your discussion
          guide. Enter the participant&apos;s name to begin.
        </p>

        <div className="mt-6">
          <label
            htmlFor="participantName"
            className="block text-sm font-medium text-gray-700"
          >
            Participant Name
          </label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="participantName"
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBegin()}
              placeholder="e.g. Sarah Johnson"
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-lumora-400 focus:ring-2 focus:ring-lumora-100"
            />
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>

        <button
          onClick={handleBegin}
          disabled={starting}
          className="mt-6 w-full rounded-lg bg-lumora-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lumora-700 disabled:opacity-50"
        >
          {starting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Starting...
            </span>
          ) : (
            "Begin Interview"
          )}
        </button>
      </div>
    </div>
  );
}
