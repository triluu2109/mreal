import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteImages } from "@/config/images";
import { resolveStorageUrl } from "@/server/storage/resolve-url";

const q7Images = siteImages.project.q7SaigonRiverside;

// ── Supabase-hosted paths (confirmed in storage.objects) ─────────────────────
const SUPABASE_BASE = "projects/q7-saigon-riverside";

// Section 1 — Loại căn hộ
const floorplans = [
  {
    type: "1 Phòng ngủ+",
    area: "53,20 – 53,67 m²",
    desc: "Có phần mở rộng tạo thêm không gian sinh hoạt, tối ưu ánh sáng tự nhiên và view sông",
    src: resolveStorageUrl(`${SUPABASE_BASE}/mat-bang-can-ho/mat-bang-can-ho-1pn.webp`),
  },
  {
    type: "2 Phòng ngủ",
    area: "66,66 – 73,49 m²",
    desc: "Có 3 layout đa dạng, trong đó có 2 layout căn góc diện tích lớn",
    src: resolveStorageUrl(`${SUPABASE_BASE}/mat-bang-can-ho/mat-bang-can-ho-2pn.webp`),
  },
  {
    type: "3 Phòng ngủ",
    area: "85,52 – 86,69 m²",
    desc: "Toàn bộ là căn góc view sông, không gian rộng rãi và sang trọng cho cả gia đình",
    src: resolveStorageUrl(`${SUPABASE_BASE}/mat-bang-can-ho/mat-bang-can-ho-3pn.webp`),
  },
];

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
const canHoMauImages = Array.from({ length: 9 }, (_, i) => ({
  src: resolveStorageUrl(`${SUPABASE_BASE}/can-ho-mau/${i + 1}.jpg`),
  alt: `Căn hộ mẫu ảnh ${i + 1}`,
}));

export const metadata: Metadata = {
  title: "Q7 Saigon Riverside Complex — Dự án bất động sản | M-Real Estate",
  description:
    "Q7 Saigon Riverside Complex — Đẳng cấp sống ven sông Sài Gòn tại đường Đào Trí, phường Phú Thuận, TP.HCM. 05 Block, 34 tầng, 3.580 căn hộ.",
};

const specs = [
  { label: "Vị trí", value: "Đường Đào Trí, Phường Phú Thuận, TP.HCM" },
  { label: "Diện tích khu đất", value: "75.224,5 m²" },
  { label: "Số Block", value: "05 Block" },
  { label: "Số tầng", value: "34 tầng" },
  { label: "Số căn hộ", value: "3.580 căn" },
  { label: "Số căn Office", value: "12 căn" },
  { label: "Loại diện tích", value: "53,2 — 86,69 m²" },
  { label: "Tầng hầm", value: "01 tầng" },
];

const galleryImages = [
  { src: q7Images.hero.overview, alt: "Toàn cảnh dự án" },
  { src: q7Images.actual.image360, alt: "Hình ảnh thực tế dự án" },
  { src: q7Images.actual.image363, alt: "Tiện ích nội khu" },
  { src: q7Images.actual.image367, alt: "Không gian sống" },
  { src: q7Images.actual.image368, alt: "View sông Sài Gòn" },
  { src: q7Images.actual.flycam, alt: "Toàn cảnh flycam" },
];

export default function Q7RiversidePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── HERO ── */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <Image
            src={resolveStorageUrl(`${SUPABASE_BASE}/hero-section/010_tt_duan.webp`)}
            alt="Q7 Saigon Riverside Complex"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy/70 to-navy/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-site pb-14">
              <span className="inline-block bg-gold text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                Dự án nổi bật
              </span>
              <h1
                className="font-heading font-bold text-white leading-tight mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                Q7 SAIGON<br /><span className="text-gold">RIVERSIDE COMPLEX</span>
              </h1>
              <p className="text-white/80 text-lg max-w-xl mb-6">
                Đẳng cấp sống ven sông Sài Gòn tại đường Đào Trí, Phường Phú Thuận, TP.HCM
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#gallery"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold px-7 py-3 rounded-lg transition-colors"
                >
                  Xem thư viện ảnh
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── TỔNG QUAN ── */}
        <section className="py-14 bg-white">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-label mb-3 block">Tổng quan dự án</span>
                <h2
                  className="font-heading font-bold text-navy mb-5"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}
                >
                  Đẳng cấp sống <span className="text-gold">ven sông</span>
                </h2>
                <p className="text-gray-text leading-relaxed mb-6">
                  Q7 Saigon Riverside Complex tọa lạc ngay bên dòng sông Sài Gòn, kết hợp địa thế
                  hướng thủy, không gian xanh mát và chuỗi tiện ích hiện đại. Dự án phù hợp cho
                  cả nhu cầu an cư và đầu tư sinh lời lâu dài.
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
              <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-hover">
                <Image
                  src={resolveStorageUrl(`${SUPABASE_BASE}/vi-tri/074_locationmap.webp`)}
                  alt="Vị trí dự án"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
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
              <span className="section-label mb-3 block">Thư viện ảnh</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                Hình ảnh <span className="text-gold">dự án</span>
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
              <span className="section-label mb-3 block">Sản phẩm</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                Loại căn hộ <span className="text-gold">đa dạng</span>
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
                      alt={`Mặt bằng ${u.type}`}
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
            <span className="section-label mb-3 block">Mặt bằng</span>
            <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
              Mặt bằng <span className="text-gold">tổng thể</span>
            </h2>
          </div>

          {/* 2×2 grid — full viewport width, no container wrapping */}
          <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    alt={`Mặt bằng ${b.block}`}
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
          <div className="container-site">
            <div className="text-center mb-8">
              <span className="section-label mb-3 block">Nội khu</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                50+ Tiện ích <span className="text-gold">đẳng cấp</span>
              </h2>
              <p className="text-gray-text text-sm mt-2">Toàn bộ tiện ích nội khu được chú thích trong sơ đồ bên dưới</p>
            </div>

            {/* Single amenities map image */}
            <div className="mx-auto max-w-6xl rounded-2xl overflow-hidden shadow-hover border border-gray-border">
              <div className="relative w-full" style={{ paddingBottom: "66.66%" }}>
                <Image
                  src={TIEN_ICH_SRC}
                  alt="Sơ đồ tiện ích Q7 Saigon Riverside Complex"
                  fill
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-contain bg-white"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            Section 4 — HÌNH ẢNH THỰC TẾ (9 ảnh căn hộ mẫu)
        ══════════════════════════════════════════════════════ */}
        <section className="py-14 bg-gray-bg">
          <div className="container-site">
            <div className="text-center mb-8">
              <span className="section-label mb-3 block">Căn hộ mẫu</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                Hình ảnh <span className="text-gold">thực tế</span>
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
