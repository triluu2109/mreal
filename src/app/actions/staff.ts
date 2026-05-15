"use server";

import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function createStaff(data: any) {
  try {
    // Generate initials from name
    const initials = data.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    await prisma.staff.create({
      data: {
        ...data,
        initials,
      }
    });
    
    revalidatePath("/admin/staff");
    revalidatePath("/(main)");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi tạo nhân sự:", error);
    return { success: false, error: error.message };
  }
}

export async function updateStaff(id: string, data: any) {
  try {
    const initials = data.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    await prisma.staff.update({
      where: { id },
      data: {
        ...data,
        initials
      }
    });
    
    revalidatePath("/admin/staff");
    revalidatePath("/(main)");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi cập nhật nhân sự:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteStaff(id: string) {
  try {
    await prisma.staff.delete({
      where: { id }
    });
    
    revalidatePath("/admin/staff");
    revalidatePath("/(main)");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi xoá nhân sự:", error);
    return { success: false, error: error.message };
  }
}
