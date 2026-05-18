"use client";

import Image from "next/image";
import { siteImages } from "@/config/images";
import { getImageUrl } from "@/lib/image";

const q7Images = siteImages.project.q7SaigonRiverside;
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function AboutSection() {
  const { dict: vi } = useI18n();

  return (
    <section className="section-padding bg-white" id="about">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src={getImageUrl(q7Images.gallery[0])}
                alt="M-Real Estate - Van phong"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Small accent image */}
            <div className="absolute -top-4 -left-4 w-28 h-28 rounded-xl overflow-hidden border-4 border-white shadow-lg hidden md:block">
              <Image
                src={getImageUrl(q7Images.gallery[1])}
                alt="Du an"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="section-label mb-3 block">{vi.home.about.label}</span>
            <h2
              className="font-heading font-bold text-navy mb-5 leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              {vi.home.about.title} <span className="text-navy">{vi.home.about.title_highlight}</span>{" "}
              <span className="text-gold">{vi.home.about.title_highlight_gold}</span>
            </h2>

            <div className="w-12 h-1 bg-gold rounded mb-6" />

            <div className="space-y-4 text-gray-text leading-relaxed text-[15px]">
              <p>{vi.home.about.p1}</p>
              <p>{vi.home.about.p2}</p>
              <p>{vi.home.about.p3}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 py-6 border-t border-b border-gray-100">
              {vi.home.about.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-heading font-extrabold text-2xl text-gold">{stat.value}</div>
                  <div className="text-gray-text text-xs mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <Link
                href="/gioi-thieu"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-heading font-semibold px-7 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-sm shadow-gold"
              >
                {vi.common.view_more}
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
