"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The AI review caught UX issues we'd been blind to for months. Within a week of fixing them, our retention improved by 23%.",
    name: "Alex Rivera",
    title: "Founder",
    company: "TaskFlow",
  },
  {
    quote:
      "Getting structured feedback across 6 categories made it so clear where to focus. Way better than vague App Store reviews.",
    name: "Priya Sharma",
    title: "Product Lead",
    company: "HealthKit Pro",
  },
  {
    quote:
      "We used to spend weeks hunting for beta testers. Now we get detailed, actionable feedback from the Lumora community in hours.",
    name: "James Park",
    title: "CTO",
    company: "DevSync",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by developers everywhere
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
            >
              <Quote className="h-8 w-8 text-lumora-200" />
              <p className="mt-4 flex-1 text-sm leading-7 text-gray-700">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-gray-100 pt-6">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">
                  {t.title}, {t.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
