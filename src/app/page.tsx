import type { Metadata } from "next";
import { prisma } from "@/server/db/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import VisionMissionSection from "@/components/sections/VisionMissionSection";
import CombinedListingsSection from "@/components/sections/CombinedListingsSection";
import NewProjectsSection from "@/components/sections/NewProjectsSection";
import NewsSection from "@/components/sections/NewsSection";
import BookingFormSection from "@/components/sections/BookingFormSection";
import { buildListingTitle, formatArea, formatLayout } from "@/lib/listing-utils";
import { formatFurnishing } from "@/lib/furnishing";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict: vi } = await getI18n();

  return {
    title: vi.home.meta.title_short,
    description: vi.home.meta.description_legacy,
  };
}

export const revalidate = 3600; // ISR: revalidate mỗi giờ

export default async function HomePage() {
  // Fetch song song để tối ưu performance
  const [saleProps, rentProps] = await Promise.all([
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
        <NewsSection />

        {/* Separator between News and Booking Section */}
        <div className="bg-gray-bg py-2">
          <div className="container-site">
            <div className="w-full flex items-center justify-center gap-4">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300/70 to-transparent" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                <span className="w-2 h-2 rounded-full bg-gold/70 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-300/70 to-transparent" />
            </div>
          </div>
        </div>

        <BookingFormSection />
      </main>
      <Footer />
    </>
  );
}
