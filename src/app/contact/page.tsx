import type { Metadata } from "next";
import ContactPageClient from "./ContactClient";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict: vi } = await getI18n();

  return {
    title: vi.contact_page.meta.title,
    description: vi.contact_page.meta.description,
  };
}

export default function ContactPage() {
  return <ContactPageClient />;
}
