import type { FurnishingStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { buildListingTitle, formatArea, formatLayout } from "@/lib/listing-utils";
import { formatFurnishing } from "@/lib/furnishing";
import PropertyListClient from "@/components/sections/PropertyListClient";
import CompactListingHero from "@/components/sections/CompactListingHero";


type ListingMode = "buy" | "rent";

type SearchParams = {
  page?: string;
  pageSize?: string;
  bedrooms?: string;
  bathrooms?: string;
  priceRange?: string;
  sort?: string;
  furnishing?: string;
};

const furnishingValues = new Set(["DEVELOPER_HANDOVER", "BASIC_FURNISHED", "FULLY_FURNISHED"]);

export default async function PublicListingPage({
  mode,
  searchParams,
}: {
  mode: ListingMode;
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = clampPageSize(Number(params.pageSize) || 12);
  const bedrooms = params.bedrooms && params.bedrooms !== "all" ? Number(params.bedrooms) : undefined;
  const bathrooms = params.bathrooms && params.bathrooms !== "all" ? Number(params.bathrooms) : undefined;
  const priceRange = params.priceRange ?? "all";
  const sort = params.sort ?? "featured";
  const furnishing = furnishingValues.has(params.furnishing ?? "") ? params.furnishing! : "all";
  const priceField = mode === "buy" ? "sellingPrice" : "rentPrice";

  let minPrice = 0;
  let maxPrice = 0;
  if (priceRange !== "all") {
    if (mode === "buy") {
      if (priceRange === "under_2") maxPrice = 2000000000;
      else if (priceRange === "2_3") { minPrice = 2000000000; maxPrice = 3000000000; }
      else if (priceRange === "3_5") { minPrice = 3000000000; maxPrice = 5000000000; }
      else if (priceRange === "5_10") { minPrice = 5000000000; maxPrice = 10000000000; }
      else if (priceRange === "over_10") minPrice = 10000000000;
    } else {
      if (priceRange === "under_5") maxPrice = 5000000;
      else if (priceRange === "5_10") { minPrice = 5000000; maxPrice = 10000000; }
      else if (priceRange === "10_15") { minPrice = 10000000; maxPrice = 15000000; }
      else if (priceRange === "15_20") { minPrice = 15000000; maxPrice = 20000000; }
      else if (priceRange === "over_20") minPrice = 20000000;
    }
  }

  const where = {
    isVisible: true,
    deletedAt: null,
    ...(bedrooms ? { bedrooms } : {}),
    ...(bathrooms ? { bathrooms } : {}),
    ...(furnishing !== "all" ? { furnishingStatus: furnishing as FurnishingStatus } : {}),
    ...(minPrice || maxPrice
      ? {
          [priceField]: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const orderBy = getOrderBy(sort, priceField);
  const [listings, total] = mode === "buy"
    ? await getSaleListings(where, orderBy, page, pageSize)
    : await getRentalListings(where, orderBy, page, pageSize);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  return (
    <>
      <CompactListingHero
        title={mode === "buy" ? "Giỏ hàng bán" : "Giỏ hàng thuê"}
        accent="Q7 Saigon Riverside"
      />
      <PropertyListClient
        properties={listings}
        mode={mode}
        filters={{ bedrooms: params.bedrooms ?? "all", bathrooms: params.bathrooms ?? "all", priceRange, sort, furnishing, pageSize }}
        page={safePage}
        total={total}
        totalPages={totalPages}
      />
    </>
  );
}

function cleanNumberParam(value?: string) {
  return value?.replace(/[^\d]/g, "") ?? "";
}

async function getSaleListings(where: object, orderBy: object[], page: number, pageSize: number) {
  const [properties, total] = await Promise.all([
    prisma.saleListing.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.saleListing.count({ where }),
  ]);
  return [properties.map((property) => ({
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
  })), total] as const;
}

async function getRentalListings(where: object, orderBy: object[], page: number, pageSize: number) {
  const [properties, total] = await Promise.all([
    prisma.rentalListing.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.rentalListing.count({ where }),
  ]);
  return [properties.map((property) => ({
    id: property.id,
    href: `/can-ho/thue/${property.id}`,
    title: buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms),
    type: formatLayout(property.bedrooms, property.bathrooms),
    price: property.displayPrice,
    priceNum: Number(property.rentPrice),
    area: formatArea(Number(property.areaSqm)),
    beds: property.bedrooms,
    baths: property.bathrooms,
    furniture: formatFurnishing(property.furnishingNote, property.furnishingStatus),
    images: property.imagePaths,
    isFeatured: property.isFeatured,
  })), total] as const;
}

function clampPageSize(value: number) {
  return [9, 12, 18, 24].includes(value) ? value : 12;
}

function getOrderBy(sort: string, priceField: "sellingPrice" | "rentPrice") {
  if (sort === "price_asc") return [{ isFeatured: "desc" as const }, { [priceField]: "asc" as const }];
  if (sort === "price_desc") return [{ isFeatured: "desc" as const }, { [priceField]: "desc" as const }];
  if (sort === "created_desc") return [{ isFeatured: "desc" as const }, { createdAt: "desc" as const }];
  return [{ isFeatured: "desc" as const }, { [priceField]: "asc" as const }];
}
