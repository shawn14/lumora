"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-lumora-700 via-lumora-600 to-lumora-500 py-24">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to get real feedback on your app?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-lumora-100">
          Join hundreds of developers getting better feedback and building better apps with Lumora.
        </p>
        <a
          href="/signup"
          className="mt-10 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-lumora-700 shadow-lg transition-all hover:bg-lumora-50 hover:shadow-xl"
        >
          Submit Your App
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  );
}
