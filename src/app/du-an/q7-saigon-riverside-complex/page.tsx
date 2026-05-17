import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteImages } from "@/config/images";
import { resolveStorageUrl } from "@/server/storage/resolve-url";
import { getI18n } from "@/lib/i18n/server";

const q7Images = siteImages.project.q7SaigonRiverside;

// ── Supabase-hosted paths (confirmed in storage.objects) ─────────────────────
const SUPABASE_BASE = "projects/q7-saigon-riverside";

// Section 1 — Loại căn hộ
// Section 2 — Mặt bằng tổng thể (S / V / U / M)
const blockPlans = [
  { block: "Block S", src: resolveStorageUrl(`${SUPABASE_BASE}/mat-bang-du-an/mat-bang-block-S.webp`) },
  { block: "Block V", src: resolveStorageUrl(`${SUPABASE_BASE}/mat-bang-du-an/mat-bang-block-V.webp`) },
  { block: "Block U", src: resolveStorageUrl(`${SUPABASE_BASE}/mat-bang-du-an/mat-bang-block-U.webp`) },
  { block: "Block M", src: resolveStorageUrl(`${SUPABASE_BASE}/mat-bang-du-an/mat-bang-block-M.webp`) },
];

// Section 3 — Tiện ích (1 ảnh tổng hợp)
const TIEN_ICH_SRC = resolveStorageUrl(`${SUPABASE_BASE}/tien-ich/tien-ich.webp`);

// Section 4 — Căn hộ mẫu (9 ảnh)
export async function generateMetadata(): Promise<Metadata> {
  const { dict: vi } = await getI18n();

  return {
    title: vi.project_q7.meta.title,
    description: vi.project_q7.meta.description,
  };
}

export default async function Q7RiversidePage() {
  const { dict: vi } = await getI18n();
  const floorplans = vi.project_q7.floorplans.map((floorplan, index) => ({
    ...floorplan,
    src: resolveStorageUrl(`${SUPABASE_BASE}/mat-bang-can-ho/mat-bang-can-ho-${index + 1}pn.webp`),
  }));
  const canHoMauImages = Array.from({ length: 9 }, (_, i) => ({
    src: resolveStorageUrl(`${SUPABASE_BASE}/can-ho-mau/${i + 1}.jpg`),
    alt: vi.project_q7.sample_image_alt.replace("{index}", String(i + 1)),
  }));
  const specs = vi.project_q7.specs;
  const galleryImages = [
    { src: q7Images.hero.overview, alt: vi.project_q7.gallery_images_alt[0] },
    { src: q7Images.actual.image360, alt: vi.project_q7.gallery_images_alt[1] },
    { src: q7Images.actual.image363, alt: vi.project_q7.gallery_images_alt[2] },
    { src: q7Images.actual.image367, alt: vi.project_q7.gallery_images_alt[3] },
    { src: q7Images.actual.image368, alt: vi.project_q7.gallery_images_alt[4] },
    { src: q7Images.actual.flycam, alt: vi.project_q7.gallery_images_alt[5] },
  ];

  return (
    <>
      <Header />
      <main>
        {/* ── HERO ── */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <Image
            src={resolveStorageUrl(`${SUPABASE_BASE}/hero-section/010_tt_duan.webp`)}
            alt={vi.project_q7.hero.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy/70 to-navy/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-site pb-14">
              <span className="inline-block bg-gold text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                {vi.project_q7.hero.label}
              </span>
              <h1
                className="font-heading font-bold text-white leading-tight mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                {vi.project_q7.hero.title}<br /><span className="text-gold">{vi.project_q7.hero.title_highlight}</span>
              </h1>
              <p className="text-white/80 text-lg max-w-xl mb-6">
                {vi.project_q7.hero.desc}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#gallery"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold px-7 py-3 rounded-lg transition-colors"
                >
                  {vi.project_q7.hero.gallery_cta}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── TỔNG QUAN ── */}
        <section className="py-14 bg-white">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-[44%_56%] gap-8 lg:gap-12 items-start">
              <div>
                <span className="section-label mb-3 block">{vi.project_q7.overview.label}</span>
                <h2
                  className="font-heading font-bold text-navy mb-5"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}
                >
                  {vi.project_q7.overview.title} <span className="text-gold">{vi.project_q7.overview.title_highlight}</span>
                </h2>
                <p className="text-gray-text leading-relaxed mb-6">
                  {vi.project_q7.overview.desc}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {specs.map((s) => (
                    <div key={s.label} className="bg-gray-bg rounded-xl p-4">
                      <p className="text-xs text-gray-text uppercase tracking-wide mb-1">{s.label}</p>
                      <p className="font-heading font-bold text-navy text-sm">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-[420px] lg:h-[540px] rounded-2xl overflow-hidden shadow-hover lg:mt-12 lg:translate-x-4">
                <Image
                  src={resolveStorageUrl(`${SUPABASE_BASE}/vi-tri/074_locationmap.webp`)}
                  alt={vi.project_q7.overview.map_alt}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="py-14 bg-gray-bg" id="gallery">
          <div className="container-site">
            <div className="text-center mb-8">
              <span className="section-label mb-3 block">{vi.project_q7.gallery.label}</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                {vi.project_q7.gallery.title} <span className="text-gold">{vi.project_q7.gallery.title_highlight}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl overflow-hidden group ${i === 0 ? "md:col-span-2" : ""}`}
                  style={{ height: i === 0 ? "340px" : "190px" }}
                >
                  <Image
                    src={resolveStorageUrl(img.src)}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/15 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Section 1 — LOẠI CĂN HỘ (ảnh mặt bằng căn hộ)
        ══════════════════════════════════════════════════════ */}
        <section className="py-14 bg-white">
          <div className="container-site">
            <div className="text-center mb-8">
              <span className="section-label mb-3 block">{vi.project_q7.products.label}</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                {vi.project_q7.products.title} <span className="text-gold">{vi.project_q7.products.title_highlight}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {floorplans.map((u) => (
                <div
                  key={u.type}
                  className="group bg-gray-bg rounded-2xl overflow-hidden border border-gray-border hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Badge + diện tích */}
                  <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <span className="bg-navy text-white font-heading font-bold text-sm px-4 py-1.5 rounded-full">
                      {u.type}
                    </span>
                    <span className="text-gold font-heading font-semibold text-sm">{u.area}</span>
                  </div>

                  {/* Floor-plan image — full card width, object-contain, no side margin */}
                  <div className="relative w-full bg-white" style={{ paddingBottom: "80%" }}>
                    <Image
                      src={u.src}
                      alt={vi.project_q7.floorplan_alt.replace("{type}", u.type)}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-contain p-3 group-hover:scale-[1.03] transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  {/* Description */}
                  <div className="px-5 py-4">
                    <p className="text-gray-text text-sm leading-relaxed">{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Section 2 — MẶT BẰNG TỔNG THỂ (U / M / S / V)
        ══════════════════════════════════════════════════════ */}
        {/* Full-bleed section — ảnh tràn ra ngoài container */}
        <section className="py-14 bg-gray-bg">
          <div className="text-center mb-8 container-site">
            <span className="section-label mb-3 block">{vi.project_q7.master_plan.label}</span>
            <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
              {vi.project_q7.master_plan.title} <span className="text-gold">{vi.project_q7.master_plan.title_highlight}</span>
            </h2>
          </div>

          {/* Centered grid with custom max-width for desktop, fluid on mobile */}
          <div className="max-w-[1260px] mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blockPlans.map((b) => (
              <div key={b.block} className="group rounded-2xl overflow-hidden bg-white border border-gray-border shadow-card">
                {/* Label strip */}
                <div className="px-5 py-3 bg-navy">
                  <span className="font-heading font-bold text-white text-sm tracking-wide">{b.block}</span>
                </div>
                {/* Image — wide aspect ratio, full card width */}
                <div className="relative w-full" style={{ paddingBottom: "80%" }}>
                  <Image
                    src={b.src}
                    alt={vi.project_q7.block_plan_alt.replace("{block}", b.block)}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-contain p-5 group-hover:scale-[1.02] transition-transform duration-500"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Section 3 — TIỆN ÍCH (1 ảnh tổng hợp)
        ══════════════════════════════════════════════════════ */}
        <section className="py-14 bg-white">
          <div className="container-site mb-10">
            <div className="text-center">
              <span className="section-label mb-3 block">{vi.project_q7.amenities.label}</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                {vi.project_q7.amenities.title} <span className="text-gold">{vi.project_q7.amenities.title_highlight}</span>
              </h2>
              <p className="text-gray-text text-sm mt-2">{vi.project_q7.amenities.desc}</p>
            </div>
          </div>

          {/* Majestic ultra-wide container for the amenities map */}
          <div className="max-w-[1344px] mx-auto px-4 md:px-8">
            <img
              src={TIEN_ICH_SRC}
              alt={vi.project_q7.amenities_alt}
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Section 4 — HÌNH ẢNH THỰC TẾ (9 ảnh căn hộ mẫu)
        ══════════════════════════════════════════════════════ */}
        <section className="py-14 bg-gray-bg">
          <div className="container-site">
            <div className="text-center mb-8">
              <span className="section-label mb-3 block">{vi.project_q7.master_plan.label}</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                {vi.project_q7.master_plan.title} <span className="text-gold">{vi.project_q7.master_plan.title_highlight}</span>
              </h2>
            </div>

            {/* Uniform grid — tất cả ảnh cùng kích thước, 3 cột desktop / 2 cột mobile */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {canHoMauImages.map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden group"
                  style={{ paddingBottom: "70%" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>


      </main>
      <Footer />
    </>
  );
}
