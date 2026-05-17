"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { actionError, requirePermission } from "@/lib/admin/auth";
import { getI18n } from "@/lib/i18n/server";

const CONTACT_STATUSES = new Set(["new", "contacted", "consulting", "closed", "cancelled"]);

export async function submitContact(formData: FormData) {
  const { dict: vi } = await getI18n();

  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    if (!fullName || !phone) {
      return { success: false, error: vi.form_actions.required_contact };
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
    return { success: false, error: vi.form_actions.generic_error };
  }
}

export async function updateContactStatus(id: string, status: string) {
  if (!CONTACT_STATUSES.has(status)) {
    return { success: false, error: "Trạng thái không hợp lệ" };
  }

  try {
    await requirePermission("contacts.manage");
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
    return { success: false, error: actionError(error, "Không cập nhật được trạng thái") };
  }
}

export async function deleteContact(id: string) {
  try {
    await requirePermission("contacts.manage");
    await prisma.contact.update({ where: { id }, data: { deletedAt: new Date() } });
    revalidatePath("/admin/contacts");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Contact delete error:", error);
    return { success: false, error: actionError(error, "Không xoá được liên hệ") };
  }
}
