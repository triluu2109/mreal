import type { Metadata } from "next";
import ContactPageClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ M-Real Estate để nhận tư vấn miễn phí về mua bán, cho thuê, đầu tư bất động sản TP.HCM. Hotline: 0901 234 567.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
