"use server";

import { prisma } from "@/prisma";

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
