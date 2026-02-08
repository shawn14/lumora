"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Check, X } from "lucide-react";

export function AppCardDeleteButton({ appId }: { appId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch(`/api/apps/${appId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete");
      }
      router.refresh();
    } catch {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div
        className="flex items-center gap-1.5"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="text-xs font-medium text-red-700">Delete?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="inline-flex cursor-pointer items-center rounded bg-red-600 p-1 text-white hover:bg-red-700 disabled:opacity-50"
        >
          <Check className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setConfirming(false);
          }}
          disabled={loading}
          className="inline-flex cursor-pointer items-center rounded border border-gray-300 bg-white p-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirming(true);
      }}
      className="inline-flex cursor-pointer items-center rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
      title="Delete app"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
