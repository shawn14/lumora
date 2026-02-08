"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  X,
  Check,
  Archive,
  Globe,
  FileText,
} from "lucide-react";
import type { AppStatus } from "@/types";

interface AppActionsProps {
  appId: string;
  initialName: string;
  initialDescription: string;
  initialUrl: string;
  initialTargetAudience: string;
  initialStatus: AppStatus;
}

const STATUS_CONFIG: Record<
  AppStatus,
  { label: string; icon: typeof Globe; className: string }
> = {
  published: {
    label: "Published",
    icon: Globe,
    className: "bg-green-100 text-green-700",
  },
  draft: {
    label: "Draft",
    icon: FileText,
    className: "bg-yellow-100 text-yellow-700",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className: "bg-gray-100 text-gray-600",
  },
};

export function AppActions({
  appId,
  initialName,
  initialDescription,
  initialUrl,
  initialTargetAudience,
  initialStatus,
}: AppActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [url, setUrl] = useState(initialUrl);
  const [targetAudience, setTargetAudience] = useState(initialTargetAudience);
  const [status, setStatus] = useState<AppStatus>(initialStatus);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, url, targetAudience }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save changes");
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setName(initialName);
    setDescription(initialDescription);
    setUrl(initialUrl);
    setTargetAudience(initialTargetAudience);
    setEditing(false);
    setError(null);
  }

  async function handleDelete() {
    setDeleteLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/apps/${appId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete app");
      }
      router.push("/dashboard/apps");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleteLoading(false);
      setDeleting(false);
    }
  }

  async function handleStatusChange(newStatus: AppStatus) {
    setStatusLoading(true);
    setStatusMenuOpen(false);
    setError(null);
    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update status");
      }
      setStatus(newStatus);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setStatusLoading(false);
    }
  }

  const currentStatus = STATUS_CONFIG[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-4">
      {/* Action bar: status badge + edit/delete buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status badge with dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setStatusMenuOpen(!statusMenuOpen)}
            disabled={statusLoading}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${currentStatus.className} hover:opacity-80 disabled:opacity-50`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusLoading ? "Updating..." : currentStatus.label}
          </button>
          {statusMenuOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {(Object.keys(STATUS_CONFIG) as AppStatus[])
                .filter((s) => s !== status)
                .map((s) => {
                  const config = STATUS_CONFIG[s];
                  const Icon = config.icon;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatusChange(s)}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Edit button */}
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        )}

        {/* Delete button */}
        {!deleting ? (
          <button
            type="button"
            onClick={() => setDeleting(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
            <span className="text-sm font-medium text-red-700">
              Delete this app?
            </span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="inline-flex cursor-pointer items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Check className="h-3 w-3" />
              {deleteLoading ? "Deleting..." : "Yes"}
            </button>
            <button
              type="button"
              onClick={() => setDeleting(false)}
              disabled={deleteLoading}
              className="inline-flex cursor-pointer items-center gap-1 rounded border border-gray-300 bg-white px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <X className="h-3 w-3" />
              No
            </button>
          </div>
        )}
      </div>

      {/* Edit form */}
      {editing && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-gray-900">
            Edit App Details
          </h4>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="edit-name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-lumora-500 focus:outline-none focus:ring-1 focus:ring-lumora-500"
              />
            </div>
            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-lumora-500 focus:outline-none focus:ring-1 focus:ring-lumora-500"
              />
            </div>
            <div>
              <label
                htmlFor="edit-url"
                className="block text-sm font-medium text-gray-700"
              >
                URL
              </label>
              <input
                id="edit-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-lumora-500 focus:outline-none focus:ring-1 focus:ring-lumora-500"
              />
            </div>
            <div>
              <label
                htmlFor="edit-audience"
                className="block text-sm font-medium text-gray-700"
              >
                Target Audience
              </label>
              <input
                id="edit-audience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-lumora-500 focus:outline-none focus:ring-1 focus:ring-lumora-500"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-lumora-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-lumora-700 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
