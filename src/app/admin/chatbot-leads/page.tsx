import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Chatbot Leads | Admin" };
export const dynamic = "force-dynamic";

export default async function ChatbotLeadsPage() {
  let leads: Awaited<ReturnType<typeof prisma.chatbotLead.findMany>> = [];
  let error: string | null = null;

  try {
    leads = await prisma.chatbotLead.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    error = err instanceof Error ? err.message : "Lỗi kết nối database.";
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center">
        <p className="text-red-600 font-medium">Không thể tải dữ liệu chatbot leads.</p>
        <p className="text-red-400 text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin" className="text-gray-text hover:text-navy">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Chatbot Leads</h1>
          <p className="text-gray-text text-sm mt-1">{leads.length} leads từ AI chatbot</p>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-border p-16 text-center">
          <MessageSquare size={48} className="text-gray-border mx-auto mb-4" />
          <p className="text-gray-text text-lg">Chưa có lead nào từ chatbot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {leads.map((lead) => {
            const rawConversation = lead.conversation;
            const conversation: Array<{ role: string; content: string }> =
              Array.isArray(rawConversation)
                ? (rawConversation as Array<{ role: string; content: string }>).filter(
                    (msg) => msg && typeof msg === "object" && typeof msg.role === "string" && typeof msg.content === "string"
                  )
                : [];
            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-gray-border p-6 hover:border-gold/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-heading font-bold text-navy text-lg">
                      {lead.fullName ?? lead.phone ?? "Chưa để lại SĐT"}
                    </div>
                    {lead.fullName && (
                      <div className="text-gray-text text-sm mt-1">
                        SĐT: {lead.phone ?? "Chưa có"}
                      </div>
                    )}
                    <div className="text-gray-muted text-sm mt-1">
                      Ngày: {formatDate(lead.createdAt)}
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    lead.status === "new" ? "bg-blue-50 text-blue-600" :
                    lead.status === "contacted" ? "bg-yellow-50 text-yellow-600" :
                    "bg-green-50 text-green-600"
                  }`}>
                    {lead.status === "new" ? "Mới" : lead.status === "contacted" ? "Đã liên hệ" : "Xong"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  {lead.need && (
                    <span className="bg-navy/5 text-navy text-xs px-3 py-1 rounded-full">
                      📋 {lead.need}
                    </span>
                  )}
                  {lead.area && (
                    <span className="bg-navy/5 text-navy text-xs px-3 py-1 rounded-full">
                      📍 {lead.area}
                    </span>
                  )}
                  {lead.budget && (
                    <span className="bg-gold/10 text-gold-dark text-xs px-3 py-1 rounded-full">
                      💰 {lead.budget}
                    </span>
                  )}
                  {lead.bedrooms && (
                    <span className="bg-navy/5 text-navy text-xs px-3 py-1 rounded-full">
                      🛏 {lead.bedrooms} PN
                    </span>
                  )}
                  {lead.neededTime && (
                    <span className="bg-navy/5 text-navy text-xs px-3 py-1 rounded-full">
                      🕒 {lead.neededTime}
                    </span>
                  )}
                  {lead.purpose && (
                    <span className="bg-navy/5 text-navy text-xs px-3 py-1 rounded-full">
                      🎯 {lead.purpose}
                    </span>
                  )}
                  {lead.appointmentTime && (
                    <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                      Lịch: {lead.appointmentTime}
                    </span>
                  )}
                  {lead.contactMethod && (
                    <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                      {lead.contactMethod}
                    </span>
                  )}
                </div>

                {/* Chat history */}
                {conversation && conversation.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-gold text-sm cursor-pointer hover:underline">
                      Xem lịch sử chat ({conversation.length} tin nhắn)
                    </summary>
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto bg-gray-bg rounded-xl p-4">
                      {conversation.slice(-6).map((msg, i) => (
                        <div
                          key={i}
                          className={`text-xs p-2 rounded-lg ${
                            msg.role === "user"
                              ? "bg-navy text-white ml-8"
                              : "bg-white text-navy mr-8 border border-gray-border"
                          }`}
                        >
                          <span className="font-semibold opacity-60">
                            {msg.role === "user" ? "Khách: " : "Bot: "}
                          </span>
                          {msg.content}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
