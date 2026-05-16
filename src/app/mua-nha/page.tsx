import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/server/db/prisma";
import PropertyListClient from "@/components/sections/PropertyListClient";
import { buildListingTitle, formatArea, formatLayout } from "@/lib/listing-utils";
import { siteImages } from "@/config/images";
import { formatFurnishing } from "@/lib/furnishing";
import { resolveStorageUrl } from "@/server/storage/resolve-url";
import type { FurnishingStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Giỏ hàng Mua bán - M-Real Estate",
  description: "Tất cả căn hộ đang chào bán tại Q7 Saigon Riverside Complex. Lọc theo layout, giá bán và tình trạng nội thất.",
};

export const revalidate = 3600;

const typeFilters: Record<string, { bedrooms: number; bathrooms: number }> = {
  "1PN1": { bedrooms: 1, bathrooms: 1 },
  "2PN1": { bedrooms: 2, bathrooms: 1 },
  "2PN2": { bedrooms: 2, bathrooms: 2 },
  "3PN2": { bedrooms: 3, bathrooms: 2 },
};

const furnishingValues = new Set(["DEVELOPER_HANDOVER", "BASIC_FURNISHED", "FULLY_FURNISHED"]);

type SearchParams = {
  page?: string;
  pageSize?: string;
  type?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  furnishing?: string;
};

export default async function MuaNhaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = clampPageSize(Number(params.pageSize) || 12);
  const type = params.type ?? "all";
  const sort = params.sort ?? "featured";
  const minPrice = cleanNumberParam(params.minPrice);
  const maxPrice = cleanNumberParam(params.maxPrice);
  const furnishing = furnishingValues.has(params.furnishing ?? "") ? params.furnishing! : "all";

  const where: any = {
    isVisible: true,
    deletedAt: null,
    ...(typeFilters[type] ?? {}),
    ...(furnishing !== "all" ? { furnishingStatus: furnishing as FurnishingStatus } : {}),
    ...(minPrice || maxPrice
      ? {
          sellingPrice: {
            ...(minPrice ? { gte: Number(minPrice) } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
          },
        }
      : {}),
  };

  const orderBy = getOrderBy(sort, "sellingPrice");

  const [properties, total] = await Promise.all([
    prisma.saleListing.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.saleListing.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const listings = properties.map((property) => ({
    id: property.id,
    href: `/can-ho/ban/${property.id}`,
    title: buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms),
    type: formatLayout(property.bedrooms, property.bathrooms),
    price: property.displayPrice,
    priceNum: Number(property.sellingPrice),
    area: formatArea(Number(property.areaSqm)),
    beds: property.bedrooms,
    baths: property.bathrooms,
    furniture: formatFurnishing(property.furnishingNote, property.furnishingStatus),
    images: property.imagePaths,
    isFeatured: property.isFeatured,
  }));

  return (
    <>
      <Header />
      <main>
        <section className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark to-navy" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('${resolveStorageUrl(siteImages.project.q7SaigonRiverside.hero.overview)}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 container-site h-full flex flex-col justify-center">
            <h1 className="font-heading font-bold text-white text-3xl md:text-4xl mb-3">
              Giỏ hàng <span className="text-gold">Mua bán</span>
            </h1>
            <p className="text-white/70">Tất cả căn hộ đang chào bán tại Q7 Saigon Riverside Complex</p>
          </div>
        </section>

        <PropertyListClient
          properties={listings}
          mode="buy"
          filters={{ type, sort, minPrice, maxPrice, furnishing, pageSize }}
          page={safePage}
          total={total}
          totalPages={totalPages}
        />

        <section className="py-12 bg-gold text-center">
          <div className="container-site">
            <h2 className="font-heading font-bold text-white text-2xl mb-3">Không tìm được căn ưng ý?</h2>
            <p className="text-white/70 mb-6">Để lại thông tin - chuyên viên sẽ tư vấn và giới thiệu căn hộ phù hợp nhất.</p>
            <Link href="/#booking" className="inline-flex items-center gap-2 bg-white text-gold font-heading font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
              Đặt lịch tư vấn miễn phí
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function cleanNumberParam(value?: string) {
  return value?.replace(/[^\d]/g, "") ?? "";
}

function clampPageSize(value: number) {
  return [9, 12, 18, 24].includes(value) ? value : 12;
}

function getOrderBy(sort: string, priceField: "sellingPrice") {
  if (sort === "price_asc") return [{ isFeatured: "desc" as const }, { [priceField]: "asc" as const }];
  if (sort === "price_desc") return [{ isFeatured: "desc" as const }, { [priceField]: "desc" as const }];
  if (sort === "created_desc") return [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }];
  return [{ isFeatured: "desc" as const }, { [priceField]: "asc" as const }];
}
