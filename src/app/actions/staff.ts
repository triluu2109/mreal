"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { normalizeImagePath } from "@/lib/image";

type StaffInput = {
  name: string;
  role: string;
  phone: string;
  zalo?: string | null;
  image?: string | null;
  color: string;
  speciality?: string | null;
  order?: number;
};

export async function createStaff(data: StaffInput) {
  try {
    await prisma.staff.create({
      data: {
        ...data,
        image: normalizeImagePath(data.image) || null,
        initials: getInitials(data.name),
      },
    });

    revalidateStaffPaths();
    return { success: true };
  } catch (error) {
    console.error("Create staff error:", error);
    return { success: false, error: actionError(error, "Không tạo được nhân sự") };
  }
}

export async function updateStaff(id: string, data: StaffInput) {
  try {
    await prisma.staff.update({
      where: { id },
      data: {
        ...data,
        image: normalizeImagePath(data.image) || null,
        initials: getInitials(data.name),
      },
    });

    revalidateStaffPaths();
    return { success: true };
  } catch (error) {
    console.error("Update staff error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được nhân sự") };
  }
}

export async function deleteStaff(id: string) {
  try {
    await prisma.staff.delete({ where: { id } });
    revalidateStaffPaths();
    return { success: true };
  } catch (error) {
    console.error("Delete staff error:", error);
    return { success: false, error: actionError(error, "Không xoá được nhân sự") };
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function revalidateStaffPaths() {
  revalidatePath("/admin/staff");
  revalidatePath("/");
}

function actionError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
