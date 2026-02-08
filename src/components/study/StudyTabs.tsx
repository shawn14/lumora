"use client";

import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "guide", label: "Discussion Guide" },
  { id: "interviews", label: "Interviews" },
  { id: "insights", label: "Insights" },
] as const;

export type TabId = (typeof tabs)[number]["id"];

export default function StudyTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "whitespace-nowrap border-b-2 py-3 text-sm font-medium transition",
              activeTab === tab.id
                ? "border-lumora-600 text-lumora-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
