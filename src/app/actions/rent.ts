"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { normalizeStoragePath } from "@/server/storage/resolve-url";
import type { FurnishingStatus } from "@prisma/client";
import { actionError, requirePermission } from "@/lib/admin/auth";

type RentalListingInput = {
  id?: string;
  projectCode: string;
  unitCode: string;
  areaSqm: number | string;
  bedrooms: number | string;
  bathrooms: number | string;
  furnishingStatus?: FurnishingStatus;
  furnishingNote?: string | null;
  view?: string | null;
  rentPrice?: number | string;
  price?: number | string;
  displayPrice?: string | null;
  availability?: string | null;
  sourceName?: string | null;
  note?: string | null;
  imagePaths?: string[];
  imageUrls?: string[];
  isVisible?: boolean;
  isFeatured?: boolean;
};

export async function createRentalListing(data: RentalListingInput) {
  try {
    await requirePermission("listings.create");
    await prisma.rentalListing.create({ data: buildRentalData(data, true) });
    revalidateRentalPaths();
    return { success: true };
  } catch (error) {
    console.error("Create rental listing error:", error);
    return { success: false, error: actionError(error, "Không tạo được căn thuê") };
  }
}

export async function updateRentalListing(id: string, data: RentalListingInput) {
  try {
    await requirePermission("listings.update");
    await prisma.rentalListing.update({ where: { id }, data: buildRentalData(data, false) });
    revalidateRentalPaths();
    return { success: true };
  } catch (error) {
    console.error("Update rental listing error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được căn thuê") };
  }
}

export async function deleteRentalListing(id: string) {
  try {
    await requirePermission("listings.delete_soft");
    await prisma.rentalListing.update({
      where: { id },
      data: { deletedAt: new Date(), isVisible: false },
    });
    revalidateRentalPaths();
    return { success: true };
  } catch (error) {
    console.error("Delete rental listing error:", error);
    return { success: false, error: actionError(error, "Không xoá được căn thuê") };
  }
}

export const createRent = createRentalListing;
export const updateRent = updateRentalListing;
export const deleteRent = deleteRentalListing;

export async function toggleRentalListingVisibility(id: string, isVisible: boolean) {
  try {
    await requirePermission("listings.update");
    await prisma.rentalListing.update({ where: { id }, data: { isVisible } });
    revalidateRentalPaths();
    return { success: true };
  } catch (error) {
    console.error("Toggle rental visibility error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được hiển thị") };
  }
}

export async function toggleRentalListingFeatured(id: string, isFeatured: boolean) {
  try {
    await requirePermission("listings.update");
    await prisma.rentalListing.update({ where: { id }, data: { isFeatured } });
    revalidateRentalPaths();
    return { success: true };
  } catch (error) {
    console.error("Toggle rental featured error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được nổi bật") };
  }
}

function revalidateRentalPaths() {
  revalidatePath("/");
  revalidatePath("/thue-nha");
  revalidatePath("/admin/rent");
}

function buildRentalData(data: RentalListingInput, includeId: boolean) {
  const rentPrice = Number(data.rentPrice ?? data.price ?? 0);
  return {
    ...(includeId && data.id ? { id: data.id } : {}),
    projectCode: data.projectCode,
    unitCode: data.unitCode,
    areaSqm: Number(data.areaSqm),
    bedrooms: parseInt(String(data.bedrooms), 10),
    bathrooms: parseInt(String(data.bathrooms), 10),
    furnishingStatus: data.furnishingStatus ?? "FULLY_FURNISHED",
    furnishingNote: emptyToNull(data.furnishingNote),
    view: emptyToNull(data.view),
    rentPrice,
    displayPrice: data.displayPrice || formatRentDisplayPrice(rentPrice),
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

function formatRentDisplayPrice(priceVnd: number): string {
  const millions = priceVnd / 1_000_000;
  return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} triệu/tháng`;
}
