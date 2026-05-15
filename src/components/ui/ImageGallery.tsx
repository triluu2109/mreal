"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  const valid = images.filter(Boolean);
  if (valid.length === 0) {
    return (
      <div className="w-full h-72 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
        Chưa có hình ảnh
      </div>
    );
  }

  const prev = () => setActiveIdx((i) => (i - 1 + valid.length) % valid.length);
  const next = () => setActiveIdx((i) => (i + 1) % valid.length);

  return (
    <div className="relative w-full h-72 md:h-[420px] rounded-xl overflow-hidden bg-gray-100 group">
      <Image
        src={valid[activeIdx]}
        alt={`${alt} - ảnh ${activeIdx + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
        priority={activeIdx === 0}
      />

      {valid.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Ảnh trước"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Ảnh tiếp theo"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {activeIdx + 1} / {valid.length}
          </div>
        </>
      )}
    </div>
  );
}
