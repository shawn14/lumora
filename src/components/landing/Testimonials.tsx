"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Lumora cut our research timeline from six weeks to three days. The AI-moderated interviews uncovered insights our team never would have found on our own.",
    name: "Sarah Chen",
    title: "VP of Product",
    company: "Rivian Labs",
  },
  {
    quote:
      "We used to spend $50K per research study. With Lumora, we run continuous research for a fraction of the cost and get richer, more nuanced data.",
    name: "Marcus Johnson",
    title: "Head of UX Research",
    company: "Canopy Health",
  },
  {
    quote:
      "The highlight reels are a game-changer. Stakeholders actually watch them, and it's transformed how our leadership team makes product decisions.",
    name: "Emily Nakamura",
    title: "Director of Insights",
    company: "Beacon Commerce",
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
            Trusted by research teams everywhere
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
