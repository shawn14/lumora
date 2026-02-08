"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Users,
  BarChart3,
  Lightbulb,
  Image,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI Reviews",
    description:
      "Get instant, detailed AI analysis of your app across 6 key categories with actionable suggestions.",
  },
  {
    icon: Users,
    title: "Community Feedback",
    description:
      "Real developers and designers review your app and provide honest, constructive feedback.",
  },
  {
    icon: BarChart3,
    title: "Structured Ratings",
    description:
      "Every review rates your app on UI Design, UX Flow, Performance, Functionality, Innovation, and Overall Polish.",
  },
  {
    icon: Lightbulb,
    title: "Actionable Suggestions",
    description:
      "Receive specific, actionable suggestions to improve your app from both AI and human reviewers.",
  },
  {
    icon: Image,
    title: "Screenshot Analysis",
    description:
      "Share screenshots of your app for visual feedback on design and user experience.",
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description:
      "Get comprehensive review summaries with aggregate scores across all categories.",
  },
];

export default function Features() {
  return (
    <section id="product" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to improve your app
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From instant AI analysis to detailed community reviews, Lumora gives
            you the feedback you need to build better apps.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-lumora-100">
                <feature.icon className="h-5 w-5 text-lumora-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
