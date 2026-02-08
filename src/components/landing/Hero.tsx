"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "500+", label: "Apps Reviewed" },
  { value: "4.8", label: "Avg Rating" },
  { value: "2min", label: "AI Review Time" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lumora-50 via-white to-lumora-50/30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-lumora-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 sm:pt-32 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Get Expert Feedback on Your App in{" "}
            <span className="bg-gradient-to-r from-lumora-600 to-lumora-400 bg-clip-text text-transparent">
              Minutes, Not Weeks
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Submit your app and get instant AI-powered reviews plus detailed
            community feedback with structured ratings across 6 key categories.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-lumora-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-lumora-600/25 transition-all hover:bg-lumora-700 hover:shadow-xl hover:shadow-lumora-600/30"
            >
              Submit Your App
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-20 flex max-w-xl flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4">
              {i > 0 && (
                <div className="hidden h-10 w-px bg-gray-200 sm:block" />
              )}
              <div className="text-center">
                <p className="text-3xl font-bold text-lumora-600">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
