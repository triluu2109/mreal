import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { getDictionary, LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/config";
import {
  getNeedLabel,
  normalizeBedrooms,
  normalizeBudget,
  normalizePhoneVN,
  parseLeadText,
  type LeadProfile,
  type NeedType,
} from "@/lib/chatbot/parser";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

const VALID_ROLES = new Set(["user", "model"]);

export async function POST(request: NextRequest) {
  const dict = getDictionary(normalizeLocale(request.cookies.get(LOCALE_COOKIE)?.value));
  const projectName = dict.chatbot.project_name;
  let messages: ChatMessage[] = [];
  let leadProfile: LeadProfile | null = null;

  try {
    const payload = await request.json().catch(() => null);
    const validation = validatePayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: dict.chat_api.invalid_message }, { status: 400 });
    }

    messages = validation.messages;
    leadProfile = buildLeadProfile(
      messages,
      readLeadProfile(payload?.leadProfile),
      typeof payload?.phone === "string" ? payload.phone : null,
      projectName
    );

    if (!leadProfile.phone) {
      return NextResponse.json(
        { error: dict.chatbot.invalid_phone, leadCreated: false },
        { status: 400 }
      );
    }

    await prisma.chatbotLead.create({
      data: {
        fullName: leadProfile.fullName,
        phone: leadProfile.phone,
        need: leadProfile.need,
        area: projectName,
        budget: leadProfile.budget,
        bedrooms: leadProfile.bedrooms,
        neededTime: leadProfile.neededTime,
        purpose: leadProfile.purpose,
        appointmentTime: null,
        contactMethod: null,
        conversation: messages,
        status: "new",
      },
    });

    return NextResponse.json({
      content: "",
      leadCreated: true,
      appointmentCreated: false,
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
        leadCreated: false,
        appointmentCreated: false,
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
    area: readText(source.area),
    budget: readText(source.budget),
    bedrooms: readText(source.bedrooms),
    neededTime: readText(source.neededTime),
    purpose: readText(source.purpose),
  };
}

function buildLeadProfile(
  messages: ChatMessage[],
  profile: LeadProfile,
  explicitPhone: string | null,
  projectName: string
): LeadProfile {
  const conversationText = messages.map((message) => message.content).join("\n");
  const parsed = parseLeadText(conversationText, profile.needType);
  const needType = profile.needType ?? parsed.needType ?? null;
  const phone = normalizePhoneVN(explicitPhone ?? "") ?? normalizePhoneVN(profile.phone ?? "") ?? parsed.phone;
  const budget = normalizeBudget(profile.budget ?? "") ?? parsed.budget;
  const bedrooms = normalizeBedrooms(profile.bedrooms ?? "") ?? parsed.bedrooms;

  return {
    fullName: profile.fullName ?? null,
    phone,
    needType,
    need: profile.need ?? (needType ? getNeedLabel(needType) : null),
    area: projectName,
    budget,
    bedrooms,
    neededTime: profile.neededTime ?? null,
    purpose: profile.purpose ?? null,
  };
}

function readText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 500) : null;
}

function readNeedType(value: unknown): NeedType | null {
  return value === "rent" || value === "lease_out" || value === "buy_sell" ? value : null;
}
