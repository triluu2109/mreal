"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import type { LeadStatus } from "@prisma/client";
import { actionError, requirePermission } from "@/lib/admin/auth";

const LEAD_STATUSES = new Set<LeadStatus>(["new", "contacted", "advised", "completed", "cancelled", "done"]);

export async function updateChatbotLeadStatus(id: string, status: LeadStatus) {
  if (!LEAD_STATUSES.has(status)) {
    return { success: false, error: "Trạng thái không hợp lệ" };
  }

  try {
    await requirePermission("leads.manage");
    await prisma.chatbotLead.update({ where: { id }, data: { status } });
    revalidatePath("/admin/chatbot-leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Chatbot lead status update error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được trạng thái lead") };
  }
}

export async function deleteChatbotLead(id: string) {
  try {
    await requirePermission("leads.manage");
    await prisma.chatbotLead.update({ where: { id }, data: { deletedAt: new Date() } });
    revalidatePath("/admin/chatbot-leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Chatbot lead delete error:", error);
    return { success: false, error: actionError(error, "Không xoá được lead") };
  }
}
