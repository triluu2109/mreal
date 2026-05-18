"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, ChevronLeft, ChevronRight, Maximize2, SlidersHorizontal, Star, X, Search } from "lucide-react";
import { getImageUrl } from "@/lib/image";
import { useI18n } from "@/components/i18n/I18nProvider";

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
  isFeatured: boolean;
};

type ListingMode = "buy" | "rent";

type ListingFilters = {
  bedrooms: string;
  bathrooms: string;
  priceRange: string;
  sort: string;
  furnishing: string;
  pageSize: number;
};

interface Props {
  properties: PublicListing[];
  mode: ListingMode;
  filters: ListingFilters;
  page: number;
  total: number;
  totalPages: number;
}

export default function PropertyListClient({ properties, mode, filters, page, total, totalPages }: Props) {
  const { dict: vi } = useI18n();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const bedroomOptions = [
    ["all", vi.filters.all],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4+"],
  ];
  const bathroomOptions = [
    ["all", vi.filters.all],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4+"],
  ];
  const furnishingOptions = [
    ["all", vi.filters.all],
    ["DEVELOPER_HANDOVER", vi.filters.furnishing_options.developer_handover],
    ["BASIC_FURNISHED", vi.filters.furnishing_options.basic_furnished],
    ["FULLY_FURNISHED", vi.filters.furnishing_options.fully_furnished],
  ];
  const sortOptions = [
    ["featured", vi.filters.sort_options.featured],
    ["price_asc", vi.filters.sort_options.price_asc],
    ["price_desc", vi.filters.sort_options.price_desc],
    ["created_desc", vi.filters.sort_options.created_desc],
  ];
  const badge = mode === "buy" ? vi.common.sale_badge : vi.common.rent_badge;
  const badgeColor = mode === "buy" ? "text-gold" : "text-navy";
  const basePath = mode === "buy" ? "/gio-hang-ban" : "/gio-hang-thue";

  const priceOptions = mode === "buy" 
    ? Object.entries(vi.filters.price_ranges.buy) 
    : Object.entries(vi.filters.price_ranges.rent);

  const hrefForPage = (nextPage: number) => {
    const params = new URLSearchParams();
    if (filters.bedrooms !== "all") params.set("bedrooms", filters.bedrooms);
    if (filters.bathrooms !== "all") params.set("bathrooms", filters.bathrooms);
    if (filters.priceRange !== "all") params.set("priceRange", filters.priceRange);
    if (filters.sort !== "featured") params.set("sort", filters.sort);
    if (filters.furnishing !== "all") params.set("furnishing", filters.furnishing);
    if (filters.pageSize !== 12) params.set("pageSize", String(filters.pageSize));
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <>
      <section className="bg-white shadow-sm border-b border-gray-100 sticky top-16 z-40 lg:static">
        <div className="container-site py-3">
          <form action={basePath} className="flex flex-wrap items-center gap-3">
            <div className="hidden lg:flex flex-wrap items-center gap-3 flex-1">
              <FilterSelect label={vi.filters.bedrooms} name="bedrooms" value={filters.bedrooms} options={bedroomOptions} />
              <FilterSelect label={vi.filters.bathrooms} name="bathrooms" value={filters.bathrooms} options={bathroomOptions} />
              <FilterSelect label={vi.filters.price} name="priceRange" value={filters.priceRange} options={priceOptions} />
              <FilterSelect label={vi.filters.furnishing} name="furnishing" value={filters.furnishing} options={furnishingOptions} />
              <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
              <FilterSelect label={vi.filters.sort} name="sort" value={filters.sort} options={sortOptions} />
              <input type="hidden" name="page" value="1" />
              <button type="submit" className="ml-auto flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors">
                <Search size={16} />
                {vi.filters.apply}
              </button>
            </div>

            <div className="flex w-full lg:hidden items-center justify-between">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-gold"
              >
                <SlidersHorizontal size={16} />
                {vi.filters.label}
              </button>
              <div className="text-sm font-semibold text-navy">
                <span className="font-bold">{total}</span> {vi.common.results}</div>
            </div>
          </form>
        </div>
      </section>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/45 backdrop-blur-sm transition-opacity"
            aria-label={vi.filters.close_filters}
            onClick={() => setMobileFiltersOpen(false)}
          />
          <form action={basePath} className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-5 shadow-2xl transition-transform animate-in slide-in-from-bottom-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-navy">{vi.filters.label}</h2>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="rounded-lg p-2 text-gray-text hover:bg-gray-bg" aria-label={vi.common.close}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pb-4">
              <FilterSelect label={vi.filters.bedrooms} name="bedrooms" value={filters.bedrooms} options={bedroomOptions} fullWidth />
              <FilterSelect label={vi.filters.bathrooms} name="bathrooms" value={filters.bathrooms} options={bathroomOptions} fullWidth />
              <FilterSelect label={vi.filters.price} name="priceRange" value={filters.priceRange} options={priceOptions} fullWidth />
              <FilterSelect label={vi.filters.furnishing} name="furnishing" value={filters.furnishing} options={furnishingOptions} fullWidth />
              <FilterSelect label={vi.filters.sort} name="sort" value={filters.sort} options={sortOptions} fullWidth />
              <input type="hidden" name="page" value="1" />
              <button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-navy-light shadow-md">
                <Search size={18} />
                {vi.filters.apply}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <section className="bg-gray-bg py-8 sm:py-10">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p, idx) => (
              <Link key={p.id} href={p.href} className="group flex cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover">
                <div className="relative h-52 flex-shrink-0 overflow-hidden bg-gray-100">
                  {p.images[0] && <Image src={getImageUrl(p.images[0])} alt={p.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" priority={idx < 3} />}
                  {p.isFeatured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-white shadow">
                      <Star size={12} fill="currentColor" />
                      {vi.common.featured}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-1.5 font-heading text-sm font-semibold leading-snug text-[#1C1C2E]">
                    <span className={`${badgeColor} mr-1 font-bold`}>{badge}</span>
                    {p.title}
                  </h3>
                  {p.furniture && <div className="mb-3 text-xs text-gray-text">{p.furniture}</div>}
                  <div className="mt-auto flex items-center gap-3 border-t border-gray-100 py-2.5 text-xs text-gray-text">
                    {p.area && <span className="flex items-center gap-1"><Maximize2 size={11} className="text-gold" />{p.area}</span>}
                    {p.beds != null && <span className="flex items-center gap-1"><BedDouble size={11} className="text-gold" />{p.beds} {vi.common.bed_short}</span>}
                    {p.baths != null && <span className="flex items-center gap-1"><Bath size={11} className="text-gold" />{p.baths} {vi.common.bath_short}</span>}
                    <span className="ml-auto font-heading text-base font-bold text-gold">{p.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="py-20 text-center text-gray-text">
              <p className="mb-2 text-lg font-semibold">{vi.filters.no_results_title}</p>
              <p className="text-sm">{vi.filters.no_results_desc}</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Link href={hrefForPage(Math.max(1, page - 1))} aria-disabled={page === 1} className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy ${page === 1 ? "pointer-events-none opacity-40" : ""}`} aria-label={vi.filters.previous_page}>
                <ChevronLeft size={18} />
              </Link>
              {getPageNumbers(page, totalPages).map((pageNumber) => (
                <Link key={pageNumber} href={hrefForPage(pageNumber)} className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold ${pageNumber === page ? "bg-gold text-white" : "border border-gray-200 bg-white text-gray-text hover:text-gold"}`}>
                  {pageNumber}
                </Link>
              ))}
              <Link href={hrefForPage(Math.min(totalPages, page + 1))} aria-disabled={page === totalPages} className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy ${page === totalPages ? "pointer-events-none opacity-40" : ""}`} aria-label={vi.filters.next_page}>
                <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterSelect({ label, name, value, options, fullWidth = false }: { label: string; name: string; value: string; options: string[][]; fullWidth?: boolean }) {
  return (
    <label className={`flex flex-col gap-1 ${fullWidth ? "w-full" : ""}`}>
      <span className="text-xs font-medium text-gray-text pl-1">{label}</span>
      <select name={name} defaultValue={value} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all cursor-pointer hover:border-gray-300">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function getPageNumbers(page: number, totalPages: number) {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
