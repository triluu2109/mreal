import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/prisma";
import PropertyListClient from "@/components/sections/PropertyListClient";
import { buildListingTitle, formatArea, formatLayout, formatRentPrice } from "@/lib/listing-utils";

export const metadata: Metadata = {
  title: "Căn hộ Cho thuê — M-Real Estate",
  description: "Danh sách căn hộ cho thuê tại Q7 Saigon Riverside Complex. Nhiều lựa chọn diện tích, giá cả hợp lý.",
};

export const revalidate = 3600;

export default async function ThueNhaPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const properties = await prisma.rent.findMany({
    where: { isVisible: true },
    orderBy: { price: "asc" },
  });
  const listings = properties.map((property) => ({
    id: property.id,
    href: `/can-ho/thue/${property.id}`,
    title: buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms),
    type: formatLayout(property.bedrooms, property.bathrooms),
    price: formatRentPrice(property.price.toString()),
    priceNum: Number(property.price),
    area: formatArea(Number(property.areaSqm)),
    beds: property.bedrooms,
    baths: property.bathrooms,
    furniture: property.furnishing,
    images: property.imageUrls,
  }));

  return (
    <>
      <Header />
      <main>
        {/* ── HERO BANNER ── */}
        <section className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark to-navy" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('/assets/Q7 Riverside/images/hinh-anh-du-an/360_hung-thinh-61bd45eff1a8b635.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 container-site h-full flex flex-col justify-center">
            <h1 className="font-heading font-bold text-white text-3xl md:text-4xl mb-3">
              Giỏ hàng <span className="text-gold">Cho thuê</span>
            </h1>
            <p className="text-white/70">Danh sách căn hộ cho thuê tại Q7 Saigon Riverside Complex</p>
          </div>
        </section>

        <PropertyListClient properties={listings} mode="rent" initialPage={Number(params.page) || 1} />

        {/* ── QUYỀN LỢI THUÊ ── */}
        <section className="py-12 bg-white">
          <div className="container-site">
            <h2 className="font-heading font-bold text-navy text-center text-2xl mb-8">Thuê qua M-Real Estate — Nhận ngay ưu đãi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "🔑", title: "Không phí môi giới", desc: "Hoàn toàn miễn phí dịch vụ tư vấn và kết nối thuê căn hộ" },
                { icon: "📋", title: "Hợp đồng rõ ràng", desc: "Hỗ trợ soạn thảo hợp đồng, pháp lý minh bạch, bảo vệ quyền lợi hai bên" },
                { icon: "🛋️", title: "Bàn giao tận nơi", desc: "Đội ngũ hỗ trợ kiểm tra căn hộ và bàn giao tận tay khách hàng" },
              ].map((b, i) => (
                <div key={i} className="bg-gray-bg rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-4">{b.icon}</div>
                  <h3 className="font-heading font-bold text-navy mb-2">{b.title}</h3>
                  <p className="text-gray-text text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-12 bg-gold text-center">
          <div className="container-site">
            <h2 className="font-heading font-bold text-white text-2xl mb-3">Cần tìm căn hộ cho thuê?</h2>
            <p className="text-white/80 mb-6">Cho chúng tôi biết nhu cầu — chuyên viên sẽ gợi ý căn phù hợp trong 15 phút.</p>
            <Link href="/#booking" className="inline-flex items-center gap-2 bg-white text-gold font-heading font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
              Liên hệ tư vấn ngay
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
