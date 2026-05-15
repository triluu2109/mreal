import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { siteImages } from "@/config/images";
import { getImageUrl } from "@/lib/image";

const q7Images = siteImages.project.q7SaigonRiverside;

export const metadata: Metadata = {
  title: "Q7 Saigon Riverside Complex — Dự án bất động sản | M-Real Estate",
  description: "Q7 Saigon Riverside Complex — Đẳng cấp sống ven sông Sài Gòn tại đường Đào Trí, phường Phú Thuận, TP.HCM. 05 Block, 34 tầng, 3.580 căn hộ.",
};

const galleryImages = [
  { src: q7Images.hero.overview, alt: "Toàn cảnh dự án" },
  { src: q7Images.actual.image360, alt: "Hình ảnh thực tế dự án" },
  { src: q7Images.actual.image363, alt: "Tiện ích nội khu" },
  { src: q7Images.actual.image367, alt: "Không gian sống" },
  { src: q7Images.actual.image368, alt: "View sông Sài Gòn" },
  { src: q7Images.actual.flycam, alt: "Toàn cảnh flycam" },
];

const interiorImages = [
  { src: q7Images.hero.interior, alt: "Nội thất căn hộ" },
  { src: q7Images.hero.bedroom, alt: "Phòng ngủ" },
  { src: q7Images.hero.kitchen, alt: "Phòng bếp" },
  { src: q7Images.hero.livingRoom, alt: "Phòng khách" },
];

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

const unitTypes = [
  {
    type: "1 Phòng ngủ+",
    area: "53,20 – 53,67 m²",
    desc: "Thiết kế thông minh, tối ưu ánh sáng tự nhiên và view sông",
    image: q7Images.floorplan.block1,
  },
  {
    type: "2 Phòng ngủ",
    area: "66,66 – 73,49 m²",
    desc: "Nhiều layout đa dạng, ban công rộng, tầm nhìn thoáng đãng",
    image: q7Images.floorplan.block3,
  },
  {
    type: "3 Phòng ngủ",
    area: "85,52 – 86,69 m²",
    desc: "Không gian sang trọng, đủ tiện nghi cho cả gia đình",
    image: q7Images.floorplan.block4,
  },
];

const amenities = [
  "Trung tâm thương mại", "Hồ bơi Sky View", "Phòng gym & Spa", "Khu vui chơi trẻ em",
  "Quảng trường Symphony", "Cầu khóa tình yêu", "Công viên nội khu", "Khu BBQ ngoài trời",
  "Nhà hàng cao cấp", "Nhà giữ trẻ", "Rạp chiếu phim", "Sân thể thao đa năng",
  "Bãi đậu xe thông minh", "Khu thư giãn bờ sông", "Wi-Fi toàn khu", "Camera an ninh 24/7",
];

export default function Q7RiversidePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── HERO ── */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <Image
            src={getImageUrl(q7Images.hero.overview)}
            alt="Q7 Saigon Riverside Complex"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-site pb-16">
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
                  href="#booking"
                  className="bg-gold hover:bg-gold-dark text-white font-heading font-bold px-8 py-3 rounded-lg transition-colors"
                >
                  Đăng ký nhận bảng giá
                </a>
                <a
                  href="#gallery"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Xem thư viện ảnh
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── TỔNG QUAN ── */}
        <section className="py-16 bg-white">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-label mb-3 block">Tổng quan dự án</span>
                <h2
                  className="font-heading font-bold text-navy mb-6"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}
                >
                  Đẳng cấp sống <span className="text-gold">ven sông</span>
                </h2>
                <p className="text-gray-text leading-relaxed mb-6">
                  Q7 Saigon Riverside Complex tọa lạc ngay bên dòng sông Sài Gòn, kết hợp địa thế
                  hướng thủy, không gian xanh mát và chuỗi tiện ích hiện đại. Dự án phù hợp cho
                  cả nhu cầu an cư và đầu tư sinh lời lâu dài.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {specs.map((s) => (
                    <div key={s.label} className="bg-gray-bg rounded-xl p-4">
                      <p className="text-xs text-gray-text uppercase tracking-wide mb-1">{s.label}</p>
                      <p className="font-heading font-bold text-navy text-sm">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-hover">
                <Image
                  src={getImageUrl(q7Images.locationMap)}
                  alt="Vị trí dự án"
                  fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="py-16 bg-gray-bg" id="gallery">
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="section-label mb-3 block">Thư viện ảnh</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                Hình ảnh <span className="text-gold">dự án</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl overflow-hidden group ${i === 0 ? "md:col-span-2 row-span-1" : ""}`}
                  style={{ height: i === 0 ? "360px" : "200px" }}
                >
                  <Image
                    src={getImageUrl(img.src)}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOẠI CĂN HỘ ── */}
        <section className="py-16 bg-white">
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="section-label mb-3 block">Sản phẩm</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                Loại căn hộ <span className="text-gold">đa dạng</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {unitTypes.map((u) => (
                <div
                  key={u.type}
                  className="group bg-gray-bg rounded-2xl overflow-hidden hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={getImageUrl(u.image)}
                      alt={u.type}
                      fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gold text-white font-heading font-bold text-sm px-4 py-1.5 rounded-full">
                        {u.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gold font-heading font-bold text-lg mb-2">{u.area}</p>
                    <p className="text-gray-text text-sm leading-relaxed">{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mặt bằng tổng thể */}
            <div className="mt-10">
              <h3 className="font-heading font-bold text-navy text-xl text-center mb-6">Mặt bằng tổng thể</h3>
              <div className="relative rounded-2xl overflow-hidden shadow-card" style={{ height: "400px" }}>
                <Image
                  src={getImageUrl(q7Images.floorplan.total)}
                  alt="Mặt bằng tổng thể Q7 Saigon Riverside Complex"
                  fill
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="object-contain bg-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── TIỆN ÍCH ── */}
        <section
          className="py-16"
          style={{ background: "linear-gradient(135deg, #1D2E6F 0%, #141F4A 100%)" }}
        >
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                Nội khu
              </span>
              <h2
                className="font-heading font-bold text-white mb-3"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}
              >
                50+ Tiện ích <span className="text-gold">đẳng cấp</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {amenities.map((a, i) => (
                <div
                  key={i}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-center transition-colors"
                >
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-gold font-bold text-sm">{(i + 1).toString().padStart(2, "0")}</span>
                  </div>
                  <p className="text-white text-sm font-medium">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NỘI THẤT ── */}
        <section className="py-16 bg-gray-bg">
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="section-label mb-3 block">Căn hộ mẫu</span>
              <h2 className="font-heading font-bold text-navy" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}>
                Hình ảnh <span className="text-gold">thực tế</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {interiorImages.map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden group h-56">
                  <Image
                    src={getImageUrl(img.src)}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>

            {/* More project images */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[
                { src: q7Images.actual.model369, alt: "Căn hộ mẫu" },
                { src: q7Images.actual.model372, alt: "Phòng bếp mẫu" },
                { src: q7Images.actual.model375, alt: "Phòng ngủ mẫu" },
                { src: q7Images.actual.model378, alt: "Ban công view sông" },
              ].map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden group h-56">
                  <Image
                    src={getImageUrl(img.src)}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA / BOOKING ── */}
        <section className="py-16 bg-white" id="booking">
          <div className="container-site max-w-3xl">
            <div className="bg-gradient-to-br from-navy to-navy-dark rounded-3xl p-10 text-center shadow-navy">
              <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-4">
                Đăng ký nhận bảng giá
              </h2>
              <p className="text-white/70 mb-6">
                Để lại thông tin — Chuyên viên M-Real Estate sẽ liên hệ tư vấn trong vòng 30 phút
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-heading font-bold px-8 py-3.5 rounded-xl transition-colors"
                >
                  📞 Gọi ngay: {siteConfig.phoneDisplay}
                </a>
                <Link
                  href="/#booking"
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-heading font-semibold px-8 py-3.5 rounded-xl transition-colors"
                >
                  Đặt lịch tư vấn
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
