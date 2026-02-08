"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ScreenshotGalleryProps {
  screenshots: string[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (screenshots.length === 0) return null;

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {screenshots.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(src)}
            className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-50 cursor-pointer"
          >
            <img
              src={src}
              alt={`Screenshot ${i + 1}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={selected}
            alt="Full screenshot"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
