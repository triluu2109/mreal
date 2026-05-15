import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/prisma";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Mail, Phone } from "lucide-react";

export const metadata: Metadata = { title: "Quản lý Liên hệ | Admin" };
export const dynamic = "force-dynamic";

export default async function ContactsAdminPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin" className="text-gray-text hover:text-navy">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Liên hệ</h1>
          <p className="text-gray-text text-sm mt-1">{contacts.length} tin nhắn liên hệ</p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-border p-16 text-center">
          <Mail size={48} className="text-gray-border mx-auto mb-4" />
          <p className="text-gray-text text-lg">Chưa có tin nhắn liên hệ nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-2xl border border-gray-border p-6 hover:border-gold/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-bold text-navy text-lg">{contact.fullName}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1.5 text-sm text-gray-text hover:text-gold transition-colors"
                    >
                      <Phone size={14} />
                      {contact.phone}
                    </a>
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1.5 text-sm text-gray-text hover:text-gold transition-colors"
                      >
                        <Mail size={14} />
                        {contact.email}
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-gray-muted text-xs">{formatDate(contact.createdAt)}</span>
              </div>
              {contact.message && (
                <div className="bg-gray-bg rounded-xl p-4 text-sm text-gray-text leading-relaxed">
                  {contact.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
