"use server";

import { prisma } from "@/server/db/prisma";
import { revalidatePath } from "next/cache";
import type { AppointmentStatus } from "@prisma/client";
import { actionError, requirePermission } from "@/lib/admin/auth";
import { getI18n } from "@/lib/i18n/server";

const workflowStatuses = new Set<AppointmentStatus>(["new", "contacted", "advised", "completed", "cancelled"]);

export async function submitAppointment(formData: FormData) {
  const { dict: vi } = await getI18n();

  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const need = (formData.get("need") as string) || null;
    const budget = (formData.get("budget") as string) || null;
    const appointmentTime = (formData.get("appointmentTime") as string) || null;
    const contactMethod = (formData.get("contactMethod") as string) || null;
    const source = (formData.get("source") as string) || null;

    if (!fullName || !phone) {
      return { success: false, error: vi.form_actions.required_appointment };
    }

    await prisma.appointment.create({
      data: {
        fullName,
        phone,
        need:
          [
            need,
            appointmentTime && `${vi.form_actions.appointment_time}: ${appointmentTime}`,
            contactMethod && `${vi.form_actions.contact_method}: ${contactMethod}`,
            source && `${vi.form_actions.source}: ${source}`,
          ]
            .filter(Boolean)
            .join(" | ") || null,
        budget,
        appointmentTime,
        contactMethod,
        source,
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
    return { success: false, error: vi.form_actions.generic_error };
  }
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  if (!workflowStatuses.has(status)) {
    return { success: false, error: "Trạng thái không hợp lệ" };
  }

  try {
    await requirePermission("appointments.manage");
    await prisma.appointment.update({ where: { id }, data: { status } });
    revalidatePath("/admin/appointments");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Appointment status update error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được trạng thái lịch hẹn") };
  }
}
