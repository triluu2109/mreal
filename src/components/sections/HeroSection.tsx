"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";
import { getImageUrl } from "@/lib/image";

const q7Images = siteImages.project.q7SaigonRiverside;

const slides = [
  {
    src: q7Images.gallery[3],
    title: "Bất động sản cao cấp",
    subtitle: "tại TP.HCM & Bình Dương",
    desc: "Đức Hưng Group — Đồng hành cùng bạn trên mọi hành trình bất động sản với đội ngũ chuyên nghiệp và tận tâm.",
    cta1: { label: "Xem giỏ hàng", href: "#listings" },
    cta2: { label: "Liên hệ ngay", href: `tel:${siteConfig.phone}` },
  },
  {
    src: q7Images.gallery[4],
    title: "Dự án bất động sản",
    subtitle: "Chất lượng – Uy tín – Bền vững",
    desc: "Chúng tôi mang đến những dự án đẳng cấp, phù hợp với mọi nhu cầu và khả năng tài chính của khách hàng.",
    cta1: { label: "Xem dự án", href: "#projects" },
    cta2: { label: "Tư vấn miễn phí", href: "#booking" },
  },
  {
    src: q7Images.gallery[2],
    title: "Cho thuê bất động sản",
    subtitle: "Đa dạng – Tiện ích – Giá tốt",
    desc: "Hàng trăm tin đăng cho thuê căn hộ, nhà phố, văn phòng được cập nhật liên tục theo ngày.",
    cta1: { label: "Xem cho thuê", href: "#rental" },
    cta2: { label: "Đăng tin ngay", href: "/ky-gui" },
  },
  {
    src: q7Images.gallery[5],
    title: "Đầu tư sinh lời",
    subtitle: "An toàn – Hiệu quả – Minh bạch",
    desc: "Với kinh nghiệm hơn 7 năm trong ngành, chúng tôi tư vấn chiến lược đầu tư BĐS sinh lời bền vững.",
    cta1: { label: "Xem tư vấn", href: "/contact" },
    cta2: { label: "Gặp chuyên gia", href: "#booking" },
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const go = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const next = useCallback(() => go((current + 1) % slides.length), [current, go]);
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, go]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5500);
  };

  const handlePrev = () => { prev(); resetTimer(); };
  const handleNext = () => { next(); resetTimer(); };
  const handleDot = (i: number) => { go(i); resetTimer(); };

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "calc(100vh - 120px)", minHeight: "520px", maxHeight: "760px" }}>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={getImageUrl(slide.src)}
            alt={slide.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-site">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Category badge */}
              <div className="inline-flex items-center gap-2 bg-navy/90 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                M-Real Estate
              </div>

              <h1 className="font-heading font-extrabold text-white leading-tight mb-2" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>
                {slides[current].title}
              </h1>
              <h2 className="font-heading font-semibold text-gold mb-5" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)" }}>
                {slides[current].subtitle}
              </h2>
              <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                {slides[current].desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={slides[current].cta1.href}
                  className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-heading font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-sm shadow-gold"
                >
                  {slides[current].cta1.label}
                </Link>
                <a
                  href={slides[current].cta2.href}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/40 text-white font-heading font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 text-sm backdrop-blur-sm"
                >
                  <Phone size={15} />
                  {slides[current].cta2.label}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 hover:bg-white/40 border border-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-110"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 hover:bg-white/40 border border-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all hover:scale-110"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? "bg-orange w-8 h-2.5" : "bg-white/50 w-2.5 h-2.5"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20 text-white/60 text-sm font-medium">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
