"use client";

import { motion } from "framer-motion";
import {
  BotMessageSquare,
  FileText,
  Sparkles,
  Video,
  Globe,
  Settings2,
} from "lucide-react";

const features = [
  {
    icon: BotMessageSquare,
    title: "AI-Moderated Interviews",
    description:
      "Intelligent interviews that adapt in real-time, probing deeper based on participant responses.",
  },
  {
    icon: FileText,
    title: "Smart Discussion Guides",
    description:
      "AI generates unbiased, structured discussion guides from your research goals.",
  },
  {
    icon: Sparkles,
    title: "Instant Synthesis",
    description:
      "Real-time analysis across all interviews. Themes, sentiments, and key findings — automatically.",
  },
  {
    icon: Video,
    title: "Highlight Reels",
    description:
      "Auto-generated video highlight reels that bring customer stories to life for stakeholders.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Access 8M+ participants across 17+ languages. B2B, B2C, anywhere in the world.",
  },
  {
    icon: Settings2,
    title: "Flexible Moderation",
    description:
      "Run interviews yourself or let AI handle it. Your research, your way.",
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
            Everything you need for world-class customer research
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From recruiting participants to synthesizing insights, Lumora
            handles every step of the research process.
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
