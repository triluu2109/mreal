import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ChatbotClientWrapper from "@/components/chatbot/ChatbotClientWrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "M-Real Estate — Bất động sản TP.HCM & Bình Dương",
    template: "%s | M-Real Estate",
  },
  description:
    "M-Real Estate — Chuyên mua bán, cho thuê, ký gửi bất động sản tại TP.HCM và Bình Dương. Đội ngũ chuyên nghiệp, uy tín, đồng hành cùng bạn từ năm 2018.",
  keywords: [
    "bất động sản TP.HCM",
    "mua bán nhà đất",
    "cho thuê căn hộ",
    "M-Real Estate",
    "bất động sản Bình Chánh",
    "căn hộ giá tốt",
  ],
  authors: [{ name: "M-Real Estate" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    siteName: "M-Real Estate",
    title: "M-Real Estate — Bất động sản TP.HCM & Bình Dương",
    description:
      "Chuyên mua bán, cho thuê, ký gửi bất động sản tại TP.HCM và Bình Dương từ năm 2018.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/assets/logo/favicon.ico",
    shortcut: "/assets/logo/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}
        <ChatbotClientWrapper />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
