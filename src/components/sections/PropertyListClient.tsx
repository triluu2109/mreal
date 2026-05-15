"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export type PublicListing = {
  id: string;
  href: string;
  title: string;
  type: string | null;
  price: string;
  priceNum: number | null;
  area: string | null;
  beds: number | null;
  baths: number | null;
  furniture: string | null;
  images: string[];
};

interface Props {
  properties: PublicListing[];
  mode: "buy" | "rent";
  initialPage?: number;
  pageSize?: number;
}

const tabs = ["Tất cả", "1PN1", "2PN1", "2PN2", "3PN2"];

export default function PropertyListClient({ properties, mode, initialPage = 1, pageSize = 20 }: Props) {
  const rentPrices = properties.map((p) => p.priceNum ?? 0).filter((price) => price > 0);
  const defaultMin = Math.floor(Math.min(...rentPrices, 5));
  const defaultMax = Math.ceil(Math.max(...rentPrices, 30));
  const [activeType, setActiveType] = useState("Tất cả");
  const [minPrice, setMinPrice] = useState(defaultMin);
  const [maxPrice, setMaxPrice] = useState(defaultMax);
  const [page, setPage] = useState(initialPage);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const typeOk = activeType === "Tất cả" || p.type === activeType;
      const priceOk = mode !== "rent" || ((p.priceNum ?? 0) >= minPrice && (p.priceNum ?? 0) <= maxPrice);
      return typeOk && priceOk;
    });
  }, [activeType, maxPrice, minPrice, mode, properties]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const badge = mode === "buy" ? "[Bán]" : "[Thuê]";
  const badgeColor = mode === "buy" ? "text-gold" : "text-navy";

  function changeType(nextType: string) {
    setActiveType(nextType);
    setPage(1);
  }

  return (
    <>
      <section className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container-site py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => changeType(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeType === tab ? "bg-gold text-white" : "bg-gray-bg text-gray-text hover:text-gold border border-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {mode === "rent" && (
              <>
                <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-text">
                  <span>{minPrice}tr</span>
                  <input type="range" min={defaultMin} max={defaultMax} value={minPrice} onChange={(e) => { setMinPrice(Math.min(Number(e.target.value), maxPrice)); setPage(1); }} />
                  <input type="range" min={defaultMin} max={defaultMax} value={maxPrice} onChange={(e) => { setMaxPrice(Math.max(Number(e.target.value), minPrice)); setPage(1); }} />
                  <span>{maxPrice}tr</span>
                </div>
              </>
            )}
            <span className="ml-auto text-gray-text text-sm">{filtered.length} căn hộ</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-bg">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((p) => (
              <Link key={p.id} href={p.href} className="group bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col cursor-pointer">
                <div className="relative h-52 overflow-hidden flex-shrink-0 bg-gray-100">
                  {p.images[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading font-semibold text-[#1C1C2E] text-sm mb-1.5 leading-snug">
                    <span className={`${badgeColor} font-bold mr-1`}>{badge}</span>
                    {p.title}
                  </h3>
                  {p.furniture && <div className="text-xs text-gray-text mb-3">{p.furniture}</div>}
                  <div className="flex items-center gap-3 text-gray-text text-xs py-2.5 border-t border-gray-100 mt-auto">
                    {p.area && <span className="flex items-center gap-1"><Maximize2 size={11} className="text-gold" />{p.area}</span>}
                    {p.beds != null && <span className="flex items-center gap-1"><BedDouble size={11} className="text-gold" />{p.beds} PN</span>}
                    {p.baths != null && <span className="flex items-center gap-1"><Bath size={11} className="text-gold" />{p.baths} WC</span>}
                    <span className="ml-auto font-heading font-bold text-gold text-base">{p.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-text">
              <p className="text-lg font-semibold mb-2">Không tìm thấy căn hộ phù hợp</p>
              <p className="text-sm">Vui lòng thay đổi bộ lọc hoặc liên hệ tư vấn trực tiếp.</p>
            </div>
          )}

          {filtered.length > pageSize && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy disabled:opacity-40" aria-label="Trang trước">
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button key={pageNumber} onClick={() => setPage(pageNumber)} className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold ${pageNumber === safePage ? "bg-gold text-white" : "border border-gray-200 bg-white text-gray-text hover:text-gold"}`}>
                  {pageNumber}
                </button>
              ))}
              <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage === totalPages} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy disabled:opacity-40" aria-label="Trang sau">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
