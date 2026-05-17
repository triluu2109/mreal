import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lexend } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ChatbotClientWrapper from "@/components/chatbot/ChatbotClientWrapper";
import FloatingClientWrapper from "@/components/layout/FloatingClientWrapper";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { siteImages } from "@/config/images";
import { getI18n } from "@/lib/i18n/server";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans-loaded",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const heading = Lexend({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading-loaded",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { dict, locale } = await getI18n();

  return {
    title: {
      default: dict.layout.metadata.default_title,
      template: dict.layout.metadata.title_template,
    },
    description: dict.layout.metadata.description,
    keywords: dict.layout.metadata.keywords,
    authors: [{ name: "M-Real Estate" }],
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      siteName: "M-Real Estate",
      title: dict.layout.metadata.default_title,
      description: dict.layout.metadata.og_description,
    },
    robots: { index: true, follow: true },
    icons: {
      icon: siteImages.logo.favicon,
      shortcut: siteImages.logo.favicon,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dict, locale } = await getI18n();

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${heading.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <I18nProvider dict={dict} locale={locale}>
          {children}
          <ChatbotClientWrapper />
          <FloatingClientWrapper />
          <Toaster richColors position="top-right" />
        </I18nProvider>
      </body>
    </html>
  );
}
