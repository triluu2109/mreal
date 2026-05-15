import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/prisma";
import PropertyListClient from "@/components/sections/PropertyListClient";
import { buildListingTitle, formatArea, formatLayout } from "@/lib/listing-utils";

export const metadata: Metadata = {
  title: "Giỏ hàng Mua bán — M-Real Estate",
  description: "Tất cả căn hộ đang chào bán tại Q7 Saigon Riverside Complex. Lọc theo loại phòng, giá tiền.",
};

export const revalidate = 3600;

export default async function MuaNhaPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const properties = await prisma.sell.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: "desc" },
  });
  const listings = properties.map((property) => ({
    id: property.id,
    href: `/can-ho/ban/${property.id}`,
    title: buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms),
    type: formatLayout(property.bedrooms, property.bathrooms),
    price: property.sellingPrice,
    priceNum: null,
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
              backgroundImage: "url('/assets/Q7 Riverside/images/hero-section/010_tt_duan.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative z-10 container-site h-full flex flex-col justify-center">
            <h1 className="font-heading font-bold text-white text-3xl md:text-4xl mb-3">
              Giỏ hàng <span className="text-gold">Mua bán</span>
            </h1>
            <p className="text-white/70">Tất cả căn hộ đang chào bán tại Q7 Saigon Riverside Complex</p>
          </div>
        </section>

        <PropertyListClient properties={listings} mode="buy" initialPage={Number(params.page) || 1} />

        {/* ── CTA ── */}
        <section className="py-12 bg-gold text-center">
          <div className="container-site">
            <h2 className="font-heading font-bold text-white text-2xl mb-3">Không tìm được căn ưng ý?</h2>
            <p className="text-white/70 mb-6">Để lại thông tin — chuyên viên sẽ tư vấn và giới thiệu căn hộ phù hợp nhất.</p>
            <Link href="/#booking" className="inline-flex items-center gap-2 bg-white text-gold font-heading font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-colors">
              Đặt lịch tư vấn miễn phí
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
