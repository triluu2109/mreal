"use server";

import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function submitAppointment(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const need = (formData.get("need") as string) || null;
    const budget = (formData.get("budget") as string) || null;
    const appointmentTime = (formData.get("appointmentTime") as string) || null;
    const contactMethod = (formData.get("contactMethod") as string) || null;
    const source = (formData.get("source") as string) || null;

    if (!fullName || !phone) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin bắt buộc" };
    }

    await prisma.appointment.create({
      data: {
        fullName,
        phone,
        need: [
          need,
          appointmentTime && `Thời gian hẹn: ${appointmentTime}`,
          contactMethod && `Cách liên hệ: ${contactMethod}`,
          source && `Nguồn: ${source}`,
        ].filter(Boolean).join(" | ") || null,
        budget,
      },
      select: { id: true },
    });

    try {
      revalidatePath("/admin/appointments");
    } catch (error) {
      console.warn("Appointment revalidation skipped:", error);
    }

    return { success: true };
  } catch (error) {
    console.error("Appointment submission error:", error);
    return { success: false, error: "Có lỗi xảy ra. Vui lòng thử lại." };
  }
}
