"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/image";
import { useI18n } from "@/components/i18n/I18nProvider";
import { normalizeListingImagePaths } from "@/lib/listing-media";

interface Props {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
  const { dict: vi } = useI18n();
  const [activeIdx, setActiveIdx] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const preloadedUrls = useRef<Set<string>>(new Set());

  const valid = useMemo(() => normalizeListingImagePaths(images), [images]);
  const visibleImages = useMemo(
    () => valid.filter((image) => !failedImages.has(image) && getImageUrl(image)),
    [failedImages, valid],
  );

  useEffect(() => {
    setActiveIdx(0);
    setFailedImages(new Set());
    preloadedUrls.current.clear();
  }, [images]);

  useEffect(() => {
    if (activeIdx <= visibleImages.length - 1) return;
    setActiveIdx(Math.max(0, visibleImages.length - 1));
  }, [activeIdx, visibleImages.length]);

  useEffect(() => {
    const urls = valid.slice(1).map(getImageUrl).filter(Boolean);
    if (urls.length === 0) return;

    const preload = () => {
      for (const url of urls) {
        if (preloadedUrls.current.has(url)) continue;
        preloadedUrls.current.add(url);
        const image = new window.Image();
        image.decoding = "async";
        image.src = url;
      }
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 2000 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(preload, 300);
    return () => globalThis.clearTimeout(timeoutId);
  }, [valid]);

  const markFailed = (image: string) => {
    setFailedImages((current) => {
      if (current.has(image)) return current;
      const next = new Set(current);
      next.add(image);
      return next;
    });
  };

  if (visibleImages.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400 md:h-[520px]">
        {vi.common.no_image}
      </div>
    );
  }

  const activeImage = visibleImages[activeIdx] ?? visibleImages[0];
  const activeSrc = getImageUrl(activeImage);
  const prev = () => setActiveIdx((i) => (i - 1 + visibleImages.length) % visibleImages.length);
  const next = () => setActiveIdx((i) => (i + 1) % visibleImages.length);

  return (
    <div className="w-full space-y-3">
      <div className="group relative h-72 w-full overflow-hidden rounded-lg bg-gray-100 md:h-[520px]">
        <Image
          src={activeSrc}
          alt={`${alt} - ${activeIdx + 1}`}
          fill
          className="object-contain transition-opacity duration-300"
          sizes="(min-width: 1024px) 66vw, 100vw"
          priority={activeIdx === 0}
          onError={() => markFailed(activeImage)}
        />

        {visibleImages.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label={vi.filters.previous_page}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label={vi.filters.next_page}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
              {activeIdx + 1} / {visibleImages.length}
            </div>
          </>
        )}
      </div>

      {visibleImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {visibleImages.map((image, index) => {
            const selected = index === activeIdx;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIdx(index)}
                aria-label={`${alt} - ${index + 1}`}
                aria-current={selected}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border bg-gray-100 transition ${
                  selected ? "border-gold ring-2 ring-gold/35" : "border-gray-200 hover:border-gold/70"
                }`}
              >
                <Image
                  src={getImageUrl(image)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                  onError={() => markFailed(image)}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
