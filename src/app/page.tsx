import type { Metadata } from "next";
import { prisma } from "@/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/layout/FloatingButtons";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import VisionMissionSection from "@/components/sections/VisionMissionSection";
import CombinedListingsSection from "@/components/sections/CombinedListingsSection";
import TeamSection from "@/components/sections/TeamSection";
import NewProjectsSection from "@/components/sections/NewProjectsSection";
import NewsSection from "@/components/sections/NewsSection";
import BookingFormSection from "@/components/sections/BookingFormSection";
import { buildListingTitle, formatArea, formatLayout, formatRentPrice } from "@/lib/listing-utils";

export const metadata: Metadata = {
  title: "M-Real Estate — Bất động sản TP.HCM & Bình Dương",
  description:
    "M-Real Estate — Chuyên mua bán, cho thuê, ký gửi bất động sản tại TP.HCM và Bình Dương. Đội ngũ chuyên nghiệp, uy tín, đồng hành cùng bạn từ năm 2018.",
};

export const revalidate = 3600; // ISR: revalidate mỗi giờ

export default async function HomePage() {
  // Fetch song song để tối ưu performance
  const [saleProps, rentProps, staff] = await Promise.all([
    prisma.sell.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.rent.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.staff.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <VisionMissionSection />
        {/* Sale & Rental side-by-side */}
        <CombinedListingsSection
          saleProps={saleProps.map((property) => ({
            id: property.id,
            href: `/can-ho/ban/${property.id}`,
            title: buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms),
            type: formatLayout(property.bedrooms, property.bathrooms),
            price: property.sellingPrice,
            area: formatArea(Number(property.areaSqm)),
            beds: property.bedrooms,
            baths: property.bathrooms,
            furniture: property.furnishing,
            images: property.imageUrls,
          }))}
          rentProps={rentProps.map((property) => ({
            id: property.id,
            href: `/can-ho/thue/${property.id}`,
            title: buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms),
            type: formatLayout(property.bedrooms, property.bathrooms),
            price: formatRentPrice(property.price.toString()),
            area: formatArea(Number(property.areaSqm)),
            beds: property.bedrooms,
            baths: property.bathrooms,
            furniture: property.furnishing,
            images: property.imageUrls,
          }))}
        />
        <NewProjectsSection />
        <TeamSection staff={staff} />
        <NewsSection />
        <BookingFormSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
