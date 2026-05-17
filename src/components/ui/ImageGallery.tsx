"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/image";
import { useI18n } from "@/components/i18n/I18nProvider";

interface Props {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
  const { dict: vi } = useI18n();
  const [activeIdx, setActiveIdx] = useState(0);

  const valid = images.filter(Boolean);
  if (valid.length === 0) {
    return (
      <div className="w-full h-72 md:h-[520px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        {vi.common.no_image}
      </div>
    );
  }

  const prev = () => setActiveIdx((i) => (i - 1 + valid.length) % valid.length);
  const next = () => setActiveIdx((i) => (i + 1) % valid.length);

  return (
    <div className="relative w-full h-72 md:h-[520px] rounded-xl overflow-hidden bg-gray-100 group">
      <Image
        src={getImageUrl(valid[activeIdx])}
        alt={`${alt} - ${activeIdx + 1}`}
        fill
        className="object-contain transition-opacity duration-300"
        sizes="(min-width: 1024px) 66vw, 100vw"
        priority={activeIdx === 0}
      />

      {valid.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label={vi.filters.previous_page}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label={vi.filters.previous_page}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity"
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
