"use client";

import { motion } from "framer-motion";
import { ClipboardList, Mic, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Define Your Research",
    description:
      "Set your research goals and let AI generate a tailored discussion guide.",
  },
  {
    number: "02",
    icon: Mic,
    title: "Run AI Interviews",
    description:
      "Launch interviews with your customers or our global panel. AI moderates 24/7.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Get Instant Insights",
    description:
      "Receive synthesized themes, recommendations, and shareable highlight reels.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Go from research question to actionable insights in three simple
            steps.
          </p>
        </motion.div>

        <div className="relative mt-20 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-lumora-200 to-transparent lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number circle */}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-lumora-600 shadow-lg shadow-lumora-600/20">
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <span className="mt-4 text-xs font-bold uppercase tracking-widest text-lumora-600">
                Step {step.number}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
