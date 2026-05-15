"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/prisma";

export async function createSell(data: any) {
  try {
    await prisma.sell.create({ data: sellData(data) });
    revalidateSellPaths();
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi tạo căn bán:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSell(id: string, data: any) {
  try {
    await prisma.sell.update({ where: { id }, data: sellData(data) });
    revalidateSellPaths();
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi cập nhật căn bán:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSell(id: string) {
  try {
    await prisma.sell.delete({ where: { id } });
    revalidateSellPaths();
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi xoá căn bán:", error);
    return { success: false, error: error.message };
  }
}

function revalidateSellPaths() {
  revalidatePath("/");
  revalidatePath("/mua-nha");
  revalidatePath("/admin/sell");
}

function sellData(data: any) {
  return {
    projectCode: data.projectCode,
    unitCode: data.unitCode,
    areaSqm: data.areaSqm,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    furnishing: data.furnishing,
    view: data.view,
    contractPrice: data.contractPrice,
    sellingPrice: data.sellingPrice,
    availability: data.availability,
    sourceName: data.sourceName,
    note: data.note,
    imageUrls: data.imageUrls ?? [],
    isVisible: data.isVisible ?? true,
  };
}
