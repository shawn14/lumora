"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SettingsForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();

  // Profile state
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setProfileLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || "Failed to update profile");
      } else {
        setProfileMessage("Profile updated successfully.");
        router.refresh();
      }
    } catch {
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password");
      } else {
        setPasswordMessage("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <form
        onSubmit={handleProfileSubmit}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your name and email address.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
            />
          </div>
        </div>

        {profileError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {profileError}
          </div>
        )}

        {profileMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {profileMessage}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={profileLoading}
            className="rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-lumora-700 disabled:opacity-50"
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Password Section */}
      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your password to keep your account secure.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-lumora-500 focus:ring-1 focus:ring-lumora-500 focus:outline-none"
            />
          </div>
        </div>

        {passwordError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {passwordError}
          </div>
        )}

        {passwordMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {passwordMessage}
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-lumora-700 disabled:opacity-50"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
