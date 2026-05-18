"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize2, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/image";
import { useI18n } from "@/components/i18n/I18nProvider";

// Type khớp với Prisma Property model
type Property = {
  id: string;
  href: string;
  title: string;
  type: string | null;
  price: string;
  area: string | null;
  beds: number | null;
  baths: number | null;
  furniture: string | null;
  images: string[];
  isFeatured?: boolean;
};

interface Props {
  saleProps: Property[];
  rentProps: Property[];
}

export default function CombinedListingsSection({ saleProps, rentProps }: Props) {
  const { dict: vi } = useI18n();

  return (
    <section className="section-padding bg-gray-bg" id="listings">
      <div className="container-site">

        {/* ── BÁN ── */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="section-label mb-2 block">{vi.home.listings.sale_label}</span>
              <h2 className="font-heading font-bold text-navy leading-tight" style={{ fontSize: "clamp(1.4rem,2vw,2rem)" }}>
                {vi.home.listings.sale_title} <span className="text-gold">{vi.home.listings.sale_title_highlight}</span>
              </h2>
            </div>
            <Link href="/gio-hang-ban" className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:gap-2 transition-all whitespace-nowrap">
              {vi.common.view_all} <ChevronRight size={16} />
            </Link>
          </div>

          {/* Grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saleProps.map((p, idx) => (
              <Link
                key={p.id}
                href={p.href}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-border bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] flex-shrink-0 overflow-hidden bg-gray-bg">
                  {p.images[0] && (
                    <Image src={getImageUrl(p.images[0])} alt={p.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" priority={idx < 3} />
                  )}
                  {p.isFeatured ? <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white shadow-sm">{vi.home.listings.hot}</span> : null}
                </div>
                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-heading font-semibold text-[#1C1C2E] text-sm mb-1.5 line-clamp-2 leading-snug">
                    <span className="text-gold font-bold mr-1">{vi.common.sale_badge}</span>{p.title}
                  </h3>
                  {p.furniture && (
                    <div className="text-xs text-gray-text mb-3">{p.furniture}</div>
                  )}
                  <div className="flex items-center gap-3 text-gray-text text-xs mt-auto pt-2 border-t border-gray-100">
                    {p.area && <span className="flex items-center gap-1"><Maximize2 size={11} className="text-gold" />{p.area}</span>}
                    {p.beds != null && <span className="flex items-center gap-1"><BedDouble size={11} className="text-gold" />{p.beds} {vi.common.bed_short}</span>}
                    {p.baths != null && <span className="flex items-center gap-1"><Bath size={11} className="text-gold" />{p.baths} {vi.common.bath_short}</span>}
                    <span className="ml-auto font-heading font-bold text-gold text-lg">{p.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-6 text-center">
            <Link href="/gio-hang-ban" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-heading font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5">
              {vi.home.listings.sale_view_all} <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t-2 border-gold/20 mb-16" />

        {/* ── THUÊ ── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="section-label mb-2 block">{vi.home.listings.rent_label}</span>
              <h2 className="font-heading font-bold text-navy leading-tight" style={{ fontSize: "clamp(1.4rem,2vw,2rem)" }}>
                {vi.home.listings.rent_title} <span className="text-gold">{vi.home.listings.rent_title_highlight}</span>
              </h2>
            </div>
            <Link href="/gio-hang-thue" className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:gap-2 transition-all whitespace-nowrap">
              {vi.common.view_all} <ChevronRight size={16} />
            </Link>
          </div>

          {/* Grid cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rentProps.map((p, idx) => (
              <Link
                key={p.id}
                href={p.href}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-border bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover"
              >
                <div className="relative aspect-[4/3] flex-shrink-0 overflow-hidden bg-gray-bg">
                  {p.images[0] && (
                    <Image src={getImageUrl(p.images[0])} alt={p.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" priority={idx < 3} />
                  )}
                  {p.isFeatured ? <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white shadow-sm">{vi.common.featured}</span> : null}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="mb-2 line-clamp-2 min-h-[40px] font-heading text-sm font-semibold leading-snug text-[#1C1C2E]">
                    <span className="text-navy font-bold mr-1">{vi.common.rent_badge}</span>{p.title}
                  </h3>
                  {p.furniture && (
                    <div className="mb-3 line-clamp-1 text-xs text-gray-text">{p.furniture}</div>
                  )}
                  <div className="mt-auto border-t border-gray-100 pt-3">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-text">
                      {p.area && <span className="flex items-center gap-1"><Maximize2 size={11} className="text-gold" />{p.area}</span>}
                      {p.beds != null && <span className="flex items-center gap-1"><BedDouble size={11} className="text-gold" />{p.beds} {vi.common.bed_short}</span>}
                      {p.baths != null && <span className="flex items-center gap-1"><Bath size={11} className="text-gold" />{p.baths} {vi.common.bath_short}</span>}
                    </div>
                    <span className="block font-heading text-xl font-extrabold text-gold">{p.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-6 text-center">
            <Link href="/gio-hang-thue" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-heading font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5">
              {vi.home.listings.rent_view_all} <ChevronRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
