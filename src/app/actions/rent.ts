"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma";

export async function createRent(data: any) {
  try {
    await prisma.rent.create({ data: rentData(data) });
    revalidateRentPaths();
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi tạo căn thuê:", error);
    return { success: false, error: error.message };
  }
}

export async function updateRent(id: string, data: any) {
  try {
    await prisma.rent.update({ where: { id }, data: rentData(data) });
    revalidateRentPaths();
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi cập nhật căn thuê:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteRent(id: string) {
  try {
    await prisma.rent.delete({ where: { id } });
    revalidateRentPaths();
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi xoá căn thuê:", error);
    return { success: false, error: error.message };
  }
}

function revalidateRentPaths() {
  revalidatePath("/");
  revalidatePath("/thue-nha");
  revalidatePath("/admin/rent");
}

function rentData(data: any) {
  return {
    projectCode: data.projectCode,
    unitCode: data.unitCode,
    areaSqm: data.areaSqm,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    furnishing: data.furnishing,
    view: data.view,
    price: data.price,
    availability: data.availability,
    sourceName: data.sourceName,
    note: data.note,
    imageUrls: data.imageUrls ?? [],
    isVisible: data.isVisible ?? true,
  };
}
