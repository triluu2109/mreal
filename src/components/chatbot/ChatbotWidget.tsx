"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Phone, Send, User, X } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import {
  detectIntent,
  getNeedLabel,
  normalizeBedrooms,
  normalizeBudget,
  normalizePhoneVN,
  parseLeadText,
  type LeadProfile,
  type NeedType,
} from "@/lib/chatbot/parser";

type Message = {
  role: "user" | "model";
  content: string;
};

type FlowStep = "intent" | "budget" | "phone" | "done";

const chatCopy = {
  greeting: "Anh/chị cần mua, thuê hay ký gửi căn hộ tại Q7 Saigon Riverside ạ?",
  chooseIntent: "Anh/chị chọn giúp em mua, thuê hay ký gửi ạ.",
  askBudget: "Anh/chị dự kiến tài chính khoảng bao nhiêu ạ?",
  askConsignPhone: "Anh/chị cho em xin số điện thoại để chuyên viên liên hệ tư vấn ký gửi ạ",
  askBuyRentPhone: "Anh/chị cho em xin số điện thoại để chuyên viên gửi căn phù hợp và hỗ trợ đặt lịch xem nhà ạ",
  invalidPhone: "Anh/chị nhập giúp em số điện thoại hợp lệ nhé",
  invalidBudget: "Anh/chị nhập giúp em ngân sách, ví dụ 10 triệu hoặc 2 tỷ ạ.",
  consignDone: "M-Real Estate đã nhận thông tin. Chuyên viên sẽ liên hệ anh/chị sớm ạ.",
  buyRentDone: "Em đã gửi thông tin cho chuyên viên M-Real Estate rồi ạ. Anh/chị cần thêm thông tin gì cứ nhắn cho em nhé!",
};

const quickReplies: Array<{ label: string; needType: NeedType }> = [
  { label: "Mua", needType: "buy_sell" },
  { label: "Thuê", needType: "rent" },
  { label: "Ký gửi", needType: "lease_out" },
];

export default function ChatbotWidget() {
  const { dict: vi } = useI18n();
  const projectName = vi.chatbot.project_name;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "model", content: chatCopy.greeting }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [step, setStep] = useState<FlowStep>("intent");
  const [leadProfile, setLeadProfile] = useState<LeadProfile>({ area: projectName });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput(delay = 0) {
    window.setTimeout(() => {
      requestAnimationFrame(() => inputRef.current?.focus());
    }, delay);
  }

  useEffect(() => {
    setLeadProfile((profile) => ({ ...profile, area: projectName }));
  }, [projectName]);

  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      focusInput(250);
      return;
    }

    const timer = setTimeout(() => {
      setShowTeaser((prev) => !prev);
    }, showTeaser ? 6000 : 10000);

    return () => clearTimeout(timer);
  }, [showTeaser, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  async function sendMessage(overrideText?: string, overrideIntent?: NeedType) {
    const trimmedInput = (overrideText ?? input).trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmedInput };
    const nextMessages = [...messages, userMessage];
    const flowStep = step === "done" ? "intent" : step;
    const baseProfile: LeadProfile = step === "done" ? { area: projectName } : leadProfile;
    const detectedNeedType = overrideIntent ?? detectIntent(trimmedInput) ?? baseProfile.needType ?? null;
    const parsed = parseLeadText(trimmedInput, detectedNeedType);
    const normalizedBedrooms = normalizeBedrooms(trimmedInput);
    const nextProfile: LeadProfile = {
      ...baseProfile,
      ...parsed,
      needType: detectedNeedType,
      need: detectedNeedType ? getNeedLabel(detectedNeedType) : baseProfile.need ?? null,
      bedrooms: normalizedBedrooms ?? baseProfile.bedrooms ?? null,
      area: projectName,
    };

    setInput("");
    setMessages(nextMessages);

    if (flowStep === "intent") {
      if (!detectedNeedType) {
        pushBotMessage(nextMessages, chatCopy.chooseIntent);
        setLeadProfile(nextProfile);
        return;
      }

      if (detectedNeedType === "lease_out") {
        setStep("phone");
        setLeadProfile(nextProfile);
        pushBotMessage(nextMessages, chatCopy.askConsignPhone);
        return;
      }

      const budget = normalizeBudget(trimmedInput);
      if (budget) {
        const profileWithBudget = { ...nextProfile, budget };
        setStep("phone");
        setLeadProfile(profileWithBudget);
        pushBotMessage(nextMessages, chatCopy.askBuyRentPhone);
        return;
      }

      setStep("budget");
      setLeadProfile(nextProfile);
      pushBotMessage(nextMessages, chatCopy.askBudget);
      return;
    }

    if (flowStep === "budget") {
      const budget = normalizeBudget(trimmedInput);

      if (!budget) {
        setLeadProfile(nextProfile);
        pushBotMessage(nextMessages, chatCopy.invalidBudget);
        return;
      }

      setStep("phone");
      setLeadProfile({ ...nextProfile, budget });
      pushBotMessage(nextMessages, chatCopy.askBuyRentPhone);
      return;
    }

    if (flowStep === "phone") {
      const phone = normalizePhoneVN(trimmedInput);

      if (!phone) {
        setLeadProfile(nextProfile);
        pushBotMessage(nextMessages, chatCopy.invalidPhone);
        return;
      }

      const finalProfile = { ...nextProfile, phone, area: projectName };
      const doneMessage = finalProfile.needType === "lease_out" ? chatCopy.consignDone : chatCopy.buyRentDone;
      const finalMessages = [...nextMessages, { role: "model" as const, content: doneMessage }];

      setStep("done");
      setLeadProfile(finalProfile);
      setMessages(finalMessages);
      await persistLead(finalMessages, finalProfile);
    }
  }

  function pushBotMessage(baseMessages: Message[], content: string) {
    setMessages([...baseMessages, { role: "model", content }]);
    focusInput();
  }

  async function persistLead(nextMessages: Message[], profile: LeadProfile) {
    setIsLoading(true);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          phone: profile.phone,
          leadProfile: profile,
        }),
      });
    } catch (error) {
      console.error("ChatbotWidget persist error:", error);
    } finally {
      setIsLoading(false);
      focusInput();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  function formatContent(text: string) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");
  }

  return (
    <>
      <div className="fixed bottom-5 right-4 z-[80] flex flex-row items-center gap-3 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {!isOpen && showTeaser && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-52 rounded-2xl rounded-br-sm border border-gray-border bg-white px-4 py-3 text-left shadow-lg"
              onClick={() => setIsOpen(true)}
            >
              <span className="whitespace-nowrap text-sm font-medium leading-snug text-navy">
                {vi.chatbot.teaser}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          id="chatbot-trigger"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-navy shadow-xl transition-shadow hover:shadow-navy"
          aria-label={isOpen ? vi.chatbot.close : vi.chatbot.open}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Bot size={26} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-3 z-[80] flex h-[min(560px,calc(100dvh-7rem))] w-[calc(100vw-1.5rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-gray-border bg-white shadow-2xl sm:right-6 sm:w-[380px]"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-navy to-navy-light p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold">
                <Bot size={20} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-heading text-sm font-semibold text-white">
                  {vi.chatbot.assistant_name}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-xs text-white/65">{vi.chatbot.online}</span>
                </div>
              </div>
              <a
                href="tel:0901234567"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gold"
                title={vi.chatbot.call_now}
              >
                <Phone size={16} className="text-white" />
              </a>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gray-bg/50 p-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={`${msg.role}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.role === "model" ? "bg-navy" : "bg-gold"}`}>
                    {msg.role === "model" ? <Bot size={14} className="text-white" /> : <User size={14} className="text-white" />}
                  </div>
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "model"
                        ? "rounded-tl-sm bg-white text-navy shadow-sm"
                        : "rounded-tr-sm bg-navy text-white"
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                  />
                </motion.div>
              ))}

              {step === "intent" && (
                <div className="flex flex-wrap gap-2 pl-9">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.needType}
                      type="button"
                      onClick={() => void sendMessage(reply.label, reply.needType)}
                      disabled={isLoading}
                      className="rounded-full border border-gold/30 bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow-sm transition-colors hover:bg-gold/10 disabled:opacity-60"
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                    <Loader2 size={16} className="animate-spin text-gold" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-border bg-white p-3">
              {leadProfile.phone && (
                <div className="mb-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-[11px] text-green-700">
                  {vi.chatbot.phone_recorded.replace("{phone}", leadProfile.phone)}
                </div>
              )}
              <div className="flex h-12 items-center gap-2 rounded-2xl bg-gray-bg px-4">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={step === "phone" ? vi.chatbot.phone_placeholder : vi.chatbot.message_placeholder}
                  disabled={isLoading}
                  className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-gray-muted disabled:opacity-50"
                />
                <button
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold transition-colors hover:bg-gold-light disabled:opacity-40"
                  aria-label={vi.chatbot.send}
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin text-white" /> : <Send size={14} className="text-white" />}
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-gray-muted">M-Real Estate</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
