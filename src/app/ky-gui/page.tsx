import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConsignmentForm from "./ConsignmentForm";
import { resolveStorageUrl } from "@/server/storage/resolve-url";
import { getI18n } from "@/lib/i18n/server";

// Confirmed path in storage.objects
const HERO_BG = resolveStorageUrl(
  "projects/q7-saigon-riverside/hero-section/364_hung-thinh-9fcd2a6254b48301.webp"
);

export async function generateMetadata(): Promise<Metadata> {
  const { dict: vi } = await getI18n();

  return {
    title: vi.consignment_page.meta.title,
    description: vi.consignment_page.meta.description,
  };
}

export default async function KyGuiPage() {
  const { dict: vi } = await getI18n();

  return (
    <>
      <Header />
      <main className="bg-gray-bg">
        {/* Hero banner */}
        <section
          className="relative overflow-hidden bg-navy py-16 text-white sm:py-24"
          style={{
            backgroundImage: `url('${HERO_BG}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Heavy navy overlay */}
          <div className="absolute inset-0 bg-navy/85" />
          {/* Subtle gold radial accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(180,144,68,0.12)_0%,_transparent_60%)]" />

          <div className="container-site relative z-10 text-center">
            <span className="mb-5 inline-block rounded-full border border-gold/30 bg-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              {vi.consignment_page.hero.label}
            </span>
            <h1 className="font-heading text-3xl font-bold text-white md:text-5xl">
              {vi.consignment_page.hero.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              {vi.consignment_page.hero.desc}
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="container-site max-w-4xl">
            <ConsignmentForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
