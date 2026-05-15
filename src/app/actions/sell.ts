"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { normalizeStoragePath } from "@/server/storage/resolve-url";
import type { FurnishingStatus } from "@/generated/client/client";

type SaleListingInput = {
  id?: string;
  projectCode: string;
  unitCode: string;
  areaSqm: number | string;
  bedrooms: number | string;
  bathrooms: number | string;
  furnishingStatus?: FurnishingStatus;
  furnishingNote?: string | null;
  view?: string | null;
  contractPrice?: number | string | null;
  sellingPrice: number | string;
  displayPrice?: string | null;
  availability?: string | null;
  sourceName?: string | null;
  note?: string | null;
  imagePaths?: string[];
  imageUrls?: string[];
  isVisible?: boolean;
  isFeatured?: boolean;
};

export async function createSaleListing(data: SaleListingInput) {
  try {
    await prisma.saleListing.create({ data: buildSaleData(data, true) });
    revalidateSalePaths();
    return { success: true };
  } catch (error) {
    console.error("Create sale listing error:", error);
    return { success: false, error: actionError(error, "Không tạo được căn bán") };
  }
}

export async function updateSaleListing(id: string, data: SaleListingInput) {
  try {
    await prisma.saleListing.update({ where: { id }, data: buildSaleData(data, false) });
    revalidateSalePaths();
    return { success: true };
  } catch (error) {
    console.error("Update sale listing error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được căn bán") };
  }
}

export async function deleteSaleListing(id: string) {
  try {
    await prisma.saleListing.delete({ where: { id } });
    revalidateSalePaths();
    return { success: true };
  } catch (error) {
    console.error("Delete sale listing error:", error);
    return { success: false, error: actionError(error, "Không xoá được căn bán") };
  }
}

export const createSell = createSaleListing;
export const updateSell = updateSaleListing;
export const deleteSell = deleteSaleListing;

export async function toggleSaleListingVisibility(id: string, isVisible: boolean) {
  try {
    await prisma.saleListing.update({ where: { id }, data: { isVisible } });
    revalidateSalePaths();
    return { success: true };
  } catch (error) {
    console.error("Toggle sale visibility error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được hiển thị") };
  }
}

export async function toggleSaleListingFeatured(id: string, isFeatured: boolean) {
  try {
    await prisma.saleListing.update({ where: { id }, data: { isFeatured } });
    revalidateSalePaths();
    return { success: true };
  } catch (error) {
    console.error("Toggle sale featured error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được nổi bật") };
  }
}

function revalidateSalePaths() {
  revalidatePath("/");
  revalidatePath("/mua-nha");
  revalidatePath("/admin/sell");
}

function buildSaleData(data: SaleListingInput, includeId: boolean) {
  const sellingPrice = Number(data.sellingPrice ?? 0);
  const contractPrice = data.contractPrice ? Number(data.contractPrice) : null;
  return {
    ...(includeId && data.id ? { id: data.id } : {}),
    projectCode: data.projectCode,
    unitCode: data.unitCode,
    areaSqm: Number(data.areaSqm),
    bedrooms: parseInt(String(data.bedrooms), 10),
    bathrooms: parseInt(String(data.bathrooms), 10),
    furnishingStatus: data.furnishingStatus ?? "DEVELOPER_HANDOVER",
    furnishingNote: emptyToNull(data.furnishingNote),
    view: emptyToNull(data.view),
    contractPrice,
    sellingPrice,
    displayPrice: data.displayPrice || formatSaleDisplayPrice(sellingPrice),
    availability: emptyToNull(data.availability),
    sourceName: emptyToNull(data.sourceName),
    note: emptyToNull(data.note),
    imagePaths: normalizeImagePaths(data.imagePaths ?? data.imageUrls),
    isVisible: data.isVisible ?? true,
    isFeatured: data.isFeatured ?? false,
  };
}

function emptyToNull(value: string | null | undefined) {
  if (value == null) return null;
  return value.trim() || null;
}

function normalizeImagePaths(paths: string[] | undefined | null): string[] {
  return (paths ?? []).map((p) => normalizeStoragePath(p)).filter(Boolean);
}

function formatSaleDisplayPrice(priceVnd: number): string {
  if (priceVnd >= 1_000_000_000) {
    const ty = priceVnd / 1_000_000_000;
    return `${ty % 1 === 0 ? ty.toFixed(0) : ty.toFixed(3).replace(/\.?0+$/, "")} tỷ`;
  }
  const million = priceVnd / 1_000_000;
  return `${million} triệu`;
}

function actionError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
