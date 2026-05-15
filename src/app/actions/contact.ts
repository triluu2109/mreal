"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";

const CONTACT_STATUSES = new Set(["new", "contacted", "consulting", "closed", "cancelled"]);

export async function submitContact(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    if (!fullName || !phone) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    }

    await prisma.contact.create({
      data: {
        fullName,
        phone,
        email: (formData.get("email") as string) || null,
        message: (formData.get("message") as string) || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Contact submission error:", error);
    return { success: false, error: "Có lỗi xảy ra. Vui lòng thử lại." };
  }
}

export async function updateContactStatus(id: string, status: string) {
  if (!CONTACT_STATUSES.has(status)) {
    return { success: false, error: "Trạng thái không hợp lệ" };
  }
  try {
    await prisma.contact.update({
      where: { id },
      data: {
        status,
        contactedAt: status === "contacted" ? new Date() : undefined,
      },
    });
    revalidatePath("/admin/contacts");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Contact status update error:", error);
    return { success: false, error: "Không cập nhật được trạng thái" };
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({ where: { id } });
    revalidatePath("/admin/contacts");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Contact delete error:", error);
    return { success: false, error: "Không xoá được liên hệ" };
  }
}
