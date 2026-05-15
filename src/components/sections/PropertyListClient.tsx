import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, ChevronLeft, ChevronRight, Maximize2, Star } from "lucide-react";
import { getImageUrl } from "@/lib/image";

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
  type: string;
  sort: string;
  minPrice: string;
  maxPrice: string;
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

const tabs = ["Tất cả", "1PN1", "2PN1", "2PN2", "3PN2"];

const furnishingOptions = [
  ["all", "Tất cả nội thất"],
  ["DEVELOPER_HANDOVER", "Hoàn thiện cơ bản"],
  ["BASIC_FURNISHED", "Nội thất cơ bản"],
  ["FULLY_FURNISHED", "Full nội thất"],
];

const pageSizeOptions = [9, 12, 18, 24];

export default function PropertyListClient({ properties, mode, filters, page, total, totalPages }: Props) {
  const badge = mode === "buy" ? "[Bán]" : "[Thuê]";
  const badgeColor = mode === "buy" ? "text-gold" : "text-navy";
  const pricePlaceholder = mode === "buy" ? "VD: 3000000000" : "VD: 12000000";
  const priceUnit = mode === "buy" ? "Giá bán (VND)" : "Giá thuê (VND/tháng)";
  const basePath = mode === "buy" ? "/mua-nha" : "/thue-nha";

  const hrefForPage = (nextPage: number) => {
    const params = new URLSearchParams();
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.sort !== "featured") params.set("sort", filters.sort);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.furnishing !== "all") params.set("furnishing", filters.furnishing);
    if (filters.pageSize !== 12) params.set("pageSize", String(filters.pageSize));
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <>
      <section className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container-site py-4">
          <form className="flex flex-wrap items-end gap-3" action={basePath}>
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => {
                const value = tab === "Tất cả" ? "all" : tab;
                return (
                  <Link
                    key={tab}
                    href={`${basePath}?${new URLSearchParams({
                      ...compactFilters(filters),
                      type: value,
                    }).toString()}`}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      filters.type === value ? "bg-gold text-white" : "bg-gray-bg text-gray-text hover:text-gold border border-gray-200"
                    }`}
                  >
                    {tab}
                  </Link>
                );
              })}
            </div>

            <div className="h-8 w-px bg-gray-200 hidden lg:block" />

            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-text">{priceUnit}</span>
              <div className="flex items-center gap-2">
                <input
                  name="minPrice"
                  defaultValue={filters.minPrice}
                  inputMode="numeric"
                  placeholder="Từ"
                  className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
                <input
                  name="maxPrice"
                  defaultValue={filters.maxPrice}
                  inputMode="numeric"
                  placeholder="Đến"
                  className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
            </label>

            <FilterSelect
              label="Nội thất"
              name="furnishing"
              value={filters.furnishing}
              options={furnishingOptions}
            />
            <FilterSelect
              label="Sắp xếp"
              name="sort"
              value={filters.sort}
              options={[
                ["featured", "Nổi bật trước"],
                ["price_asc", "Giá thấp - cao"],
                ["price_desc", "Giá cao - thấp"],
                ["created_desc", "Mới nhất"],
              ]}
            />
            <FilterSelect
              label="Mỗi trang"
              name="pageSize"
              value={String(filters.pageSize)}
              options={pageSizeOptions.map((size) => [String(size), `${size} căn`])}
            />
            <input type="hidden" name="type" value={filters.type} />
            <input type="hidden" name="page" value="1" />
            <button type="submit" className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light">
              Áp dụng
            </button>
            <span className="ml-auto pb-2 text-gray-text text-sm">{total} căn hộ</span>
            <span className="sr-only">{pricePlaceholder}</span>
          </form>
        </div>
      </section>

      <section className="py-12 bg-gray-bg">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <Link key={p.id} href={p.href} className="group bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col cursor-pointer">
                <div className="relative h-52 overflow-hidden flex-shrink-0 bg-gray-100">
                  {p.images[0] && <Image src={getImageUrl(p.images[0])} alt={p.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />}
                  {p.isFeatured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-white shadow">
                      <Star size={12} fill="currentColor" />
                      Nổi bật
                    </span>
                  )}
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

          {properties.length === 0 && (
            <div className="text-center py-20 text-gray-text">
              <p className="text-lg font-semibold mb-2">Không tìm thấy căn hộ phù hợp</p>
              <p className="text-sm">Vui lòng thay đổi bộ lọc hoặc liên hệ tư vấn trực tiếp.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Link href={hrefForPage(Math.max(1, page - 1))} aria-disabled={page === 1} className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy ${page === 1 ? "pointer-events-none opacity-40" : ""}`} aria-label="Trang trước">
                <ChevronLeft size={18} />
              </Link>
              {getPageNumbers(page, totalPages).map((pageNumber) => (
                <Link key={pageNumber} href={hrefForPage(pageNumber)} className={`h-10 min-w-10 rounded-lg px-3 inline-flex items-center justify-center text-sm font-semibold ${pageNumber === page ? "bg-gold text-white" : "border border-gray-200 bg-white text-gray-text hover:text-gold"}`}>
                  {pageNumber}
                </Link>
              ))}
              <Link href={hrefForPage(Math.min(totalPages, page + 1))} aria-disabled={page === totalPages} className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-navy ${page === totalPages ? "pointer-events-none opacity-40" : ""}`} aria-label="Trang sau">
                <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterSelect({ label, name, value, options }: { label: string; name: string; value: string; options: string[][] }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-gray-text">{label}</span>
      <select name={name} defaultValue={value} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function compactFilters(filters: ListingFilters) {
  const params: Record<string, string> = {};
  if (filters.sort !== "featured") params.sort = filters.sort;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.furnishing !== "all") params.furnishing = filters.furnishing;
  if (filters.pageSize !== 12) params.pageSize = String(filters.pageSize);
  return params;
}

function getPageNumbers(page: number, totalPages: number) {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
