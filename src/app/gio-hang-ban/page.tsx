import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicListingPage from "@/components/sections/PublicListingPage";

export const metadata: Metadata = {
  title: "Giỏ hàng bán - M-Real Estate",
  description: "Danh sách căn hộ đang chào bán tại Q7 Saigon Riverside Complex.",
};

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

export default function GioHangBanPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <>
      <Header />
      <main>
        <PublicListingPage mode="buy" searchParams={searchParams} />
      </main>
      <Footer />
    </>
  );
}
