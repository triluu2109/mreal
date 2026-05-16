import type { Metadata } from "next";
import { prisma } from "@/server/db/prisma";
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
import { buildListingTitle, formatArea, formatLayout } from "@/lib/listing-utils";
import { formatFurnishing } from "@/lib/furnishing";

export const metadata: Metadata = {
  title: "M-Real Estate",
  description:
    "M-Real Estate — Chuyên mua bán, cho thuê, ký gửi bất động sản tại TP.HCM và Bình Dương. Đội ngũ chuyên nghiệp, uy tín, đồng hành cùng bạn từ năm 2018.",
};

export const revalidate = 3600; // ISR: revalidate mỗi giờ

export default async function HomePage() {
  // Fetch song song để tối ưu performance
  const [saleProps, rentProps, staff] = await Promise.all([
    prisma.saleListing.findMany({
      where: { isVisible: true, deletedAt: null },
      orderBy: [{ isFeatured: "desc" }, { sellingPrice: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.rentalListing.findMany({
      where: { isVisible: true, deletedAt: null },
      orderBy: [{ isFeatured: "desc" }, { rentPrice: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.staff.findMany({
      where: { isActive: true, deletedAt: null },
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
            price: property.displayPrice,
            area: formatArea(Number(property.areaSqm)),
            beds: property.bedrooms,
            baths: property.bathrooms,
            furniture: formatFurnishing(property.furnishingNote, property.furnishingStatus),
            images: property.imagePaths,
            isFeatured: property.isFeatured,
          }))}
          rentProps={rentProps.map((property) => ({
            id: property.id,
            href: `/can-ho/thue/${property.id}`,
            title: buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms),
            type: formatLayout(property.bedrooms, property.bathrooms),
            price: property.displayPrice,
            area: formatArea(Number(property.areaSqm)),
            beds: property.bedrooms,
            baths: property.bathrooms,
            furniture: formatFurnishing(property.furnishingNote, property.furnishingStatus),
            images: property.imagePaths,
            isFeatured: property.isFeatured,
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
