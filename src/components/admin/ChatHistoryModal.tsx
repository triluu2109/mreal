"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

function parseConversation(raw: unknown): ChatMessage[] {
  if (!raw) return [];
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(data)) {
      return data
        .filter((m): m is ChatMessage => m && typeof m.role === "string" && typeof m.content === "string")
        .filter((m) => m.role !== "system");
    }
    // Some bots store { messages: [...] }
    if (data && Array.isArray(data.messages)) {
      return data.messages
        .filter((m: ChatMessage) => m && typeof m.role === "string" && typeof m.content === "string")
        .filter((m: ChatMessage) => m.role !== "system");
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

export function ChatHistoryButton({ conversation, name }: { conversation: unknown; name: string }) {
  const [open, setOpen] = useState(false);
  const messages = parseConversation(conversation);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-border px-2 text-xs font-semibold text-navy transition-colors hover:bg-gray-bg"
      >
        <MessageSquare size={12} />
        {messages.length > 0 ? `${messages.length} tin` : "Chat"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-border px-5 py-4">
              <div>
                <h2 className="font-heading font-bold text-navy">Lịch sử chat</h2>
                <p className="mt-0.5 text-xs text-gray-muted">{name} · {messages.length} tin nhắn</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-bg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-muted">
                  <MessageSquare size={36} className="mb-3 opacity-30" />
                  <p className="text-sm">Chưa có lịch sử tin nhắn.</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-navy text-white"
                          : "rounded-bl-sm bg-gray-bg text-gray-text"
                      }`}
                    >
                      {msg.content}
                      {msg.timestamp && (
                        <div className={`mt-1 text-xs ${msg.role === "user" ? "text-white/60" : "text-gray-muted"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer label */}
            <div className="border-t border-gray-border px-5 py-3">
              <p className="text-center text-xs text-gray-muted">
                {messages.filter((m) => m.role === "user").length} tin khách ·{" "}
                {messages.filter((m) => m.role === "assistant").length} tin chatbot
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
