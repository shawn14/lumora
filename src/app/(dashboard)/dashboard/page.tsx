import { auth } from "@/lib/auth";
import { BookOpen, MessageSquare, Lightbulb, Users, Plus } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Active Studies", value: "3", icon: BookOpen, color: "text-lumora-600 bg-lumora-50" },
  { label: "Total Interviews", value: "47", icon: MessageSquare, color: "text-blue-600 bg-blue-50" },
  { label: "Insights Generated", value: "12", icon: Lightbulb, color: "text-amber-600 bg-amber-50" },
  { label: "Participants Reached", value: "156", icon: Users, color: "text-emerald-600 bg-emerald-50" },
];

const recentStudies = [
  { name: "E-commerce Checkout Flow", type: "Usability Test", status: "active", participants: 12, date: "Feb 5, 2026" },
  { name: "New Feature Discovery", type: "Exploratory", status: "active", participants: 8, date: "Feb 3, 2026" },
  { name: "Onboarding Experience", type: "Journey Map", status: "completed", participants: 15, date: "Jan 28, 2026" },
  { name: "Pricing Page Feedback", type: "Concept Test", status: "active", participants: 12, date: "Jan 25, 2026" },
];

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s an overview of your research activity.
          </p>
        </div>
        <Link
          href="/dashboard/studies/new"
          className="inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-lumora-700 transition"
        >
          <Plus className="h-4 w-4" />
          Create New Study
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Studies */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Studies
        </h3>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left font-medium text-gray-500">
                  Name
                </th>
                <th className="px-5 py-3 text-left font-medium text-gray-500 hidden sm:table-cell">
                  Type
                </th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left font-medium text-gray-500 hidden md:table-cell">
                  Participants
                </th>
                <th className="px-5 py-3 text-left font-medium text-gray-500 hidden lg:table-cell">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentStudies.map((study) => (
                <tr key={study.name} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-3.5 font-medium text-gray-900">
                    {study.name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden sm:table-cell">
                    {study.type}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        study.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {study.status.charAt(0).toUpperCase() + study.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                    {study.participants}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 hidden lg:table-cell">
                    {study.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
