import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicListingPage from "@/components/layout/sections/PublicListingPage";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict: vi } = await getI18n();

  return {
    title: vi.listing_page.meta.rent_title,
    description: vi.listing_page.meta.rent_description,
  };
}

export const revalidate = 3600;

type SearchParams = {
  page?: string;
  pageSize?: string;
  bedrooms?: string;
  bathrooms?: string;
  priceRange?: string;
  sort?: string;
  furnishing?: string;
};

export default function GioHangThuePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <>
      <Header />
      <main>
        <PublicListingPage mode="rent" searchParams={searchParams} />
      </main>
      <Footer />
    </>
  );
}
