import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

type NeedType = "rent" | "lease_out" | "buy_sell";

type LeadProfile = {
  fullName?: string | null;
  phone?: string | null;
  need?: string | null;
  needType?: NeedType | null;
  area?: string | null;
  budget?: string | null;
  bedrooms?: string | null;
  neededTime?: string | null;
  purpose?: string | null;
};

type AppointmentRequest = {
  requested?: boolean;
  phone?: string | null;
};

const PROJECT_NAME = "Q7 Saigon Riverside Complex";
const PHONE_REGEX = /(?:\+84|84|0)(?:[\s.-]?\d){8,10}\b/;
const VALID_ROLES = new Set(["user", "model"]);
const APPOINTMENT_CONFIRMATION =
  "Em đã ghi nhận thông tin. Tư vấn viên sẽ liên hệ sớm để xác nhận lịch.";

export async function POST(request: NextRequest) {
  let messages: ChatMessage[] = [];
  let leadProfile: LeadProfile | null = null;
  let appointmentCreated = false;

  try {
    const payload = await request.json().catch(() => null);
    const validation = validatePayload(payload);

    if (!validation.ok) {
      return NextResponse.json(
        { error: "Tin nhắn không hợp lệ. Anh/chị vui lòng nhập lại." },
        { status: 400 }
      );
    }

    messages = validation.messages;
    const appointmentRequest = readAppointmentRequest(payload?.appointmentRequest);
    leadProfile = buildLeadProfile(
      messages,
      readLeadProfile(payload?.leadProfile),
      typeof payload?.phone === "string" ? payload.phone : null,
      appointmentRequest
    );

    if (isMeaningfulLead(leadProfile)) {
      appointmentCreated = await saveLeadAndMaybeAppointment(
        messages,
        leadProfile,
        appointmentRequest
      );
    }

    return NextResponse.json({
      content: appointmentCreated ? APPOINTMENT_CONFIRMATION : "",
      leadCreated: Boolean(leadProfile && isMeaningfulLead(leadProfile)),
      appointmentCreated,
    });
  } catch (error) {
    console.error("Chat API error:", {
      error,
      lastMessage: messages.at(-1),
      phone: leadProfile?.phone,
    });

    return NextResponse.json(
      {
        content: "",
        fallback: true,
        leadCreated: Boolean(leadProfile && isMeaningfulLead(leadProfile)),
        appointmentCreated,
      },
      { status: 200 }
    );
  }
}

function validatePayload(payload: unknown):
  | { ok: true; messages: ChatMessage[] }
  | { ok: false } {
  if (!payload || typeof payload !== "object" || !("messages" in payload)) {
    return { ok: false };
  }

  const { messages } = payload as { messages?: unknown };

  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false };
  }

  const normalizedMessages: ChatMessage[] = [];

  for (const message of messages) {
    if (!message || typeof message !== "object") {
      return { ok: false };
    }

    const { role, content } = message as { role?: unknown; content?: unknown };

    if (
      typeof role !== "string" ||
      !VALID_ROLES.has(role) ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return { ok: false };
    }

    normalizedMessages.push({
      role: role as ChatMessage["role"],
      content: content.trim(),
    });
  }

  return { ok: true, messages: normalizedMessages };
}

function readLeadProfile(value: unknown): LeadProfile {
  if (!value || typeof value !== "object") return {};
  const source = value as Record<string, unknown>;
  const needType = readNeedType(source.needType);

  return {
    fullName: readText(source.fullName),
    phone: readText(source.phone),
    need: readText(source.need),
    needType,
    area: PROJECT_NAME,
    budget: readText(source.budget),
    bedrooms: readText(source.bedrooms),
    neededTime: readText(source.neededTime),
    purpose: readText(source.purpose),
  };
}

function readAppointmentRequest(value: unknown): AppointmentRequest | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;

  return {
    requested: source.requested === true,
    phone: readText(source.phone),
  };
}

function buildLeadProfile(
  messages: ChatMessage[],
  profile: LeadProfile,
  explicitPhone: string | null,
  appointmentRequest: AppointmentRequest | null
): LeadProfile {
  const conversationText = messages.map((message) => message.content).join("\n");
  const needType = profile.needType ?? extractNeedType(conversationText);
  const explicitPhoneText = explicitPhone ?? profile.phone ?? appointmentRequest?.phone ?? "";

  return {
    fullName: profile.fullName ?? extractFullName(conversationText),
    phone: normalizePhone(explicitPhoneText) ?? normalizePhone(conversationText),
    need: profile.need ?? (needType ? getNeedLabel(needType) : null),
    needType,
    area: PROJECT_NAME,
    budget: profile.budget ?? extractBudget(conversationText),
    bedrooms: profile.bedrooms ?? extractBedrooms(conversationText),
    neededTime: profile.neededTime ?? extractNeededTime(conversationText),
    purpose:
      profile.purpose ??
      (needType === "lease_out" ? extractFurnished(conversationText) : null),
  };
}

function isMeaningfulLead(profile: LeadProfile | null) {
  return Boolean(profile?.phone || profile?.needType);
}

async function saveLeadAndMaybeAppointment(
  messages: ChatMessage[],
  profile: LeadProfile,
  appointmentRequest: AppointmentRequest | null
) {
  const appointmentReady = Boolean(appointmentRequest?.requested && profile.phone);
  const need = profile.need ?? (profile.needType ? getNeedLabel(profile.needType) : summarizeConversation(messages));

  try {
    const leadCreate = prisma.chatbotLead.create({
      data: {
        fullName: profile.fullName,
        phone: profile.phone,
        need,
        area: PROJECT_NAME,
        budget: profile.budget,
        bedrooms: profile.bedrooms,
        neededTime: profile.neededTime,
        purpose: profile.purpose,
        appointmentTime: null,
        contactMethod: appointmentReady ? "Tư vấn viên gọi xác nhận" : null,
        conversation: messages,
        status: "new",
      },
    });

    if (!appointmentReady) {
      await leadCreate;
      return false;
    }

    await prisma.$transaction([
      leadCreate,
      prisma.appointment.create({
        data: {
          fullName: profile.fullName || "Khách từ chatbot",
          phone: profile.phone!,
          need: [need, "Hình thức: Tư vấn viên gọi xác nhận", "Nguồn: chatbot"].join(" | "),
          budget: profile.budget,
          status: "new",
        },
        select: { id: true },
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Failed to save chatbot lead or appointment:", {
      error,
      phone: profile.phone,
    });
    return false;
  }
}

function readText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 500) : null;
}

function readNeedType(value: unknown): NeedType | null {
  return value === "rent" || value === "lease_out" || value === "buy_sell" ? value : null;
}

function getNeedLabel(needType: NeedType) {
  if (needType === "rent") return "Thuê căn hộ Q7 Saigon Riverside";
  if (needType === "lease_out") return "Cho thuê căn hộ Q7 Saigon Riverside";
  return "Mua bán căn hộ Q7 Saigon Riverside";
}

function normalizePhone(text: string) {
  const match = text.match(PHONE_REGEX);

  if (!match) return null;

  const digits = match[0].replace(/[^\d+]/g, "");

  if (digits.startsWith("+84")) {
    return `0${digits.slice(3)}`;
  }

  if (digits.startsWith("84")) {
    return `0${digits.slice(2)}`;
  }

  return digits;
}

function extractNeedType(text: string): NeedType | null {
  const normalized = normalizeVietnamese(text);

  if (/cho thue|ky gui|gui can/.test(normalized)) return "lease_out";
  if (/mua ban|can mua|muon mua|\bmua\b|\bban\b|can ban|muon ban/.test(normalized)) return "buy_sell";
  if (/can thue|o thue|muon thue|\bthue\b/.test(normalized)) return "rent";

  return null;
}

function extractFullName(text: string) {
  const match = text.match(
    /(?:tôi tên là|mình tên là|em tên là|anh tên là|chị tên là|tên tôi là|mình là|tôi là)\s+([A-ZÀ-Ỹa-zà-ỹ\s]{2,40})/i
  );

  return match?.[1]?.trim().replace(/[.,!?].*$/, "") ?? null;
}

function extractBudget(text: string) {
  const match = text.match(
    /(?:khoảng|tầm|ngân sách|giá|budget)?\s*\d+(?:[.,]\d+)?\s*(?:tỷ|ty|tỉ|triệu|trieu|tr|vnđ|vnd|đồng|dong)(?:\/tháng)?/i
  );

  return match?.[0].trim() ?? null;
}

function extractBedrooms(text: string) {
  const match = text.match(/\b([1-3])\s*(?:pn|phòng ngủ|phong ngu)\b/i);
  return match ? `${match[1]}PN` : null;
}

function extractNeededTime(text: string) {
  const match = text.match(
    /(?:tháng sau|tuần sau|cuối tháng|đầu tháng|trong tháng này|tháng \d{1,2}|ngày \d{1,2}(?:\/\d{1,2})?|tuần này|hôm nay|ngày mai|sang tháng|cuối năm|đầu năm|khi nào cũng được)/i
  );

  return match?.[0].trim() ?? null;
}

function extractFurnished(text: string) {
  const normalized = normalizeVietnamese(text);

  if (/full noi that|day du noi that|du noi that/.test(normalized)) return "Full nội thất";
  if (/co ban|noi that co ban/.test(normalized)) return "Nội thất cơ bản";
  if (/trong|khong noi that|chua noi that/.test(normalized)) return "Nhà trống";
  if (/noi that/.test(normalized)) return "Có nội thất";

  return null;
}

function normalizeVietnamese(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function summarizeConversation(messages: ChatMessage[]) {
  const summary = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join(" | ")
    .slice(0, 500);

  return summary || "Khách trao đổi qua chatbot";
}
