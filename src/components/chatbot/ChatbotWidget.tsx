"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Phone,
  CalendarCheck,
} from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

type NeedType = "rent" | "lease_out" | "buy_sell";
type AppointmentStep = "phone" | null;

interface LeadProfile {
  fullName?: string | null;
  need?: string | null;
  needType?: NeedType | null;
  budget?: string | null;
  bedrooms?: string | null;
  area?: string | null;
  neededTime?: string | null;
  purpose?: string | null;
  phone?: string | null;
}

const PROJECT_NAME = "Q7 Saigon Riverside Complex";
const PHONE_REGEX = /(?:\+84|84|0)(?:[\s.-]?\d){8,10}\b/;
const GREETING =
  "Anh/chị cần thuê, cho thuê hay mua bán căn hộ tại Q7 Saigon Riverside?";
const OUT_OF_SCOPE =
  "Hiện chatbot chỉ hỗ trợ Q7 Saigon Riverside. Anh/chị cần thuê, cho thuê hay mua bán căn hộ?";
const APPOINTMENT_PHONE_QUESTION =
  "Anh/chị để lại số điện thoại để tư vấn viên liên hệ xác nhận lịch.";
const APPOINTMENT_CONFIRMATION =
  "Em đã ghi nhận thông tin. Tư vấn viên sẽ liên hệ sớm để xác nhận lịch.";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedPhone, setDetectedPhone] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const [leadProfile, setLeadProfile] = useState<LeadProfile>({ area: PROJECT_NAME });
  const [appointmentMode, setAppointmentMode] = useState(false);
  const [appointmentRequested, setAppointmentRequested] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prev) => (prev.length > 0 ? prev : [{ role: "model", content: GREETING }]));
      if (!isOpen) setUnread(1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const shouldShowAppointmentCta = Boolean(leadProfile.needType || appointmentRequested);

  const startAppointmentFlow = () => {
    setAppointmentRequested(true);
    setAppointmentMode(true);
    setMessages((prev) => {
      if (prev.at(-1)?.content === APPOINTMENT_PHONE_QUESTION) return prev;
      return [...prev, { role: "model", content: APPOINTMENT_PHONE_QUESTION }];
    });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    const userMsg: Message = { role: "user", content: trimmedInput };
    const newMessages = [...messages, userMsg];
    const parsedProfile = extractProfileFromText(trimmedInput, leadProfile.needType);
    const updatedProfile = mergeLeadProfile(leadProfile, parsedProfile);

    if (updatedProfile.phone) {
      setDetectedPhone(updatedProfile.phone);
    }

    setMessages(newMessages);
    setInput("");
    setLeadProfile(updatedProfile);

    if (appointmentMode) {
      await handleAppointmentPhone(newMessages, trimmedInput, updatedProfile);
      return;
    }

    const botContent = getNextBotMessage(updatedProfile, trimmedInput);
    const finalMessages = [...newMessages, { role: "model" as const, content: botContent }];
    setMessages(finalMessages);

    if (isMeaningfulLead(updatedProfile)) {
      await persistChat(finalMessages, updatedProfile);
    }
  };

  const handleAppointmentPhone = async (
    newMessages: Message[],
    text: string,
    profile: LeadProfile
  ) => {
    const phone = normalizePhone(text);

    if (!phone) {
      setMessages((prev) => [...prev, { role: "model", content: "Anh/chị nhập giúp em số điện thoại hợp lệ." }]);
      return;
    }

    const nextProfile = { ...profile, phone, area: PROJECT_NAME };
    const finalMessages = [...newMessages, { role: "model" as const, content: APPOINTMENT_CONFIRMATION }];

    setDetectedPhone(phone);
    setLeadProfile(nextProfile);
    setMessages(finalMessages);
    setAppointmentMode(false);

    await persistChat(finalMessages, nextProfile, true);
  };

  const persistChat = async (
    nextMessages: Message[],
    profile: LeadProfile,
    appointmentRequestedNow = false
  ) => {
    setIsLoading(true);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          phone: profile.phone ?? undefined,
          leadProfile: profile,
          appointmentRequest: appointmentRequestedNow
            ? { requested: true, phone: profile.phone }
            : undefined,
        }),
      });
    } catch (error) {
      console.error("ChatbotWidget persist error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!isOpen && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-2xl rounded-br-sm shadow-lg border border-gray-border px-4 py-3 max-w-56 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <p className="text-navy text-sm font-medium leading-snug">
                Tư vấn Q7 Saigon Riverside
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="chatbot-trigger"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-xl hover:shadow-gold transition-shadow"
          aria-label={isOpen ? "Đóng chat" : "Mở chat"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle size={24} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {unread > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {unread}
            </span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[560px] bg-white rounded-3xl shadow-2xl border border-gray-border flex flex-col overflow-hidden"
            style={{ maxWidth: "calc(100vw - 3rem)" }}
          >
            <div className="bg-gradient-to-r from-navy to-navy-light p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-heading font-semibold text-sm">
                  Trợ lý M-Real Estate
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/60 text-xs">Đang hoạt động</span>
                </div>
              </div>
              <a
                href="tel:0901234567"
                className="w-8 h-8 bg-white/10 hover:bg-gold transition-colors rounded-full flex items-center justify-center"
                title="Gọi ngay"
              >
                <Phone size={15} className="text-white" />
              </a>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-bg/50 min-h-0">
              {shouldShowAppointmentCta && (
                <button
                  type="button"
                  onClick={startAppointmentFlow}
                  disabled={appointmentMode || isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gold text-white rounded-xl px-3 py-2 text-sm font-semibold hover:bg-gold-light transition-colors disabled:opacity-60"
                >
                  <CalendarCheck size={16} />
                  Đặt lịch tư vấn
                </button>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.role}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "model" ? "bg-navy" : "bg-gold"
                    }`}
                  >
                    {msg.role === "model" ? (
                      <Bot size={14} className="text-white" />
                    ) : (
                      <User size={14} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "model"
                        ? "bg-white text-navy rounded-tl-sm shadow-sm"
                        : "bg-navy text-white rounded-tr-sm"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: formatContent(msg.content),
                    }}
                  />
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-gray-muted rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-border bg-white">
              {detectedPhone && (
                <div className="mb-2 text-[11px] text-green-700 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                  Đã ghi nhận SĐT {detectedPhone}.
                </div>
              )}
              <div className="flex gap-2 items-center bg-gray-bg rounded-2xl px-4 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={appointmentMode ? getInputPlaceholder("phone") : "Nhập nhu cầu của anh/chị..."}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-navy placeholder:text-gray-muted outline-none disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-colors disabled:opacity-40 shrink-0"
                  aria-label="Gửi"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="text-white animate-spin" />
                  ) : (
                    <Send size={14} className="text-white" />
                  )}
                </button>
              </div>
              <p className="text-gray-muted text-[10px] text-center mt-2">
                M-Real Estate
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function mergeLeadProfile(current: LeadProfile, next: LeadProfile): LeadProfile {
  const needType = next.needType ?? current.needType ?? null;

  return {
    fullName: next.fullName ?? current.fullName ?? null,
    need: needType ? getNeedLabel(needType) : (current.need ?? next.need ?? null),
    needType,
    budget: next.budget ?? current.budget ?? null,
    bedrooms: next.bedrooms ?? current.bedrooms ?? null,
    area: PROJECT_NAME,
    neededTime: next.neededTime ?? current.neededTime ?? null,
    purpose: next.purpose ?? current.purpose ?? null,
    phone: next.phone ?? current.phone ?? null,
  };
}

function extractProfileFromText(text: string, currentNeedType?: NeedType | null): LeadProfile {
  const needType = extractNeedType(text) ?? currentNeedType ?? null;

  return {
    fullName: extractFullName(text),
    phone: normalizePhone(text),
    needType,
    need: needType ? getNeedLabel(needType) : null,
    budget: extractBudget(text),
    bedrooms: extractBedrooms(text),
    area: PROJECT_NAME,
    neededTime: extractNeededTime(text),
    purpose: needType === "lease_out" ? extractFurnished(text) : null,
  };
}

function getNextBotMessage(profile: LeadProfile, latestText: string) {
  if (isOutOfScope(latestText) && !extractNeedType(latestText)) {
    return OUT_OF_SCOPE;
  }

  if (!profile.needType) {
    return GREETING;
  }

  if (!profile.bedrooms) {
    return "Anh/chị cần căn mấy phòng ngủ?";
  }

  if (profile.needType === "lease_out" && !profile.purpose) {
    return "Căn hộ đang có nội thất như thế nào?";
  }

  if (!profile.budget) {
    return profile.needType === "lease_out"
      ? "Anh/chị mong muốn giá thuê bao nhiêu?"
      : "Anh/chị dự kiến ngân sách khoảng bao nhiêu?";
  }

  if (!profile.neededTime) {
    if (profile.needType === "lease_out") return "Anh/chị muốn cho thuê từ khi nào?";
    if (profile.needType === "rent") return "Anh/chị cần vào ở khi nào?";
    return "Anh/chị cần giao dịch khi nào?";
  }

  if (!profile.fullName) {
    return "Anh/chị cho em xin họ tên.";
  }

  return "Em đã ghi nhận nhu cầu. Anh/chị bấm Đặt lịch tư vấn để tư vấn viên liên hệ.";
}

function isMeaningfulLead(profile: LeadProfile) {
  return Boolean(profile.phone || profile.needType);
}

function getInputPlaceholder(step: AppointmentStep) {
  if (step === "phone") return "Nhập SĐT...";
  return "Nhập tin nhắn...";
}

function getNeedLabel(needType: NeedType) {
  if (needType === "rent") return "Thuê căn hộ Q7 Saigon Riverside";
  if (needType === "lease_out") return "Cho thuê căn hộ Q7 Saigon Riverside";
  return "Mua bán căn hộ Q7 Saigon Riverside";
}

function normalizePhone(phone: string) {
  const match = phone.match(PHONE_REGEX);

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
  if (/noi that/.test(normalized)) return text.trim();

  return null;
}

function isOutOfScope(text: string) {
  const normalized = normalizeVietnamese(text);

  return /du an.*khac|khac.*du an|can ho.*khac|khu khac|quan khac|binh thanh|thu duc|nha be|phu my hung|quan 1|quan 2|quan 4|quan 8/.test(
    normalized
  );
}

function normalizeVietnamese(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}
