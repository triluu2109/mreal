import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, Building2, Maximize2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/server/db/prisma";
import { buildListingTitle, formatArea, formatLayout } from "@/lib/listing-utils";
import ImageGallery from "@/components/ui/ImageGallery";
import SimilarProperties from "@/components/sections/SimilarProperties";
import DetailBookingForm from "@/components/sections/DetailBookingForm";
import { formatFurnishing } from "@/lib/furnishing";

interface Props {
  params: Promise<{ id: string }>;
}

async function getListing(id: string) {
  return prisma.saleListing.findFirst({ where: { id, isVisible: true, deletedAt: null } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getListing(id);
  if (!property) return { title: "Không tìm thấy căn hộ" };
  const title = buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms);

  return {
    title: `[Bán] ${title} - ${property.displayPrice} | M-Real Estate`,
    description: `${title} tại Q7 Saigon Riverside Complex. Liên hệ M-Real Estate để được tư vấn.`,
  };
}

export default async function SellDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getListing(id);
  if (!property) notFound();

  const title = buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms);
  const specs = [
    { icon: <Maximize2 size={16} />, label: "Diện tích", value: formatArea(Number(property.areaSqm)) },
    { icon: <BedDouble size={16} />, label: "Phòng ngủ", value: `${property.bedrooms} phòng` },
    { icon: <Bath size={16} />, label: "Toilet", value: `${property.bathrooms} WC` },
    { icon: <BedDouble size={16} />, label: "Loại căn", value: formatLayout(property.bedrooms, property.bathrooms) },
    { icon: <Building2 size={16} />, label: "Nội thất", value: formatFurnishing(property.furnishingNote, property.furnishingStatus) },
    property.view && { icon: <Building2 size={16} />, label: "View", value: property.view },
    property.availability && { icon: <Building2 size={16} />, label: "Tình trạng", value: property.availability },
    property.contractPrice && { icon: <Building2 size={16} />, label: "Giá HĐ", value: `${(Number(property.contractPrice) / 1e9).toFixed(3).replace(/\.?0+$/, "")} tỷ` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string | null }[];

  return (
    <>
      <Header />
      <main>
        <div className="bg-gray-bg border-b border-gray-border">
          <div className="container-site py-3">
            <div className="flex items-center gap-2 text-sm text-gray-text">
              <Link href="/" className="hover:text-gold transition-colors">Trang chủ</Link>
              <span>/</span>
              <Link href="/mua-nha" className="hover:text-gold transition-colors">Giỏ hàng mua bán</Link>
              <span>/</span>
              <span className="text-navy font-medium line-clamp-1">{title}</span>
            </div>
          </div>
        </div>

        <div className="container-site py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <Link href="/mua-nha" className="inline-flex items-center gap-2 text-sm text-gray-text hover:text-gold transition-colors">
                <ArrowLeft size={16} />
                Giỏ hàng mua bán
              </Link>

              <ImageGallery images={property.imagePaths} alt={title} />

              <div>
                <h1 className="font-heading font-bold text-navy text-2xl md:text-3xl mb-3">{title}</h1>
                <div className="text-3xl font-heading font-bold text-gold mb-2">{property.displayPrice}</div>
                <div className="text-gray-text text-sm">Q7 Saigon Riverside Complex, TP.HCM</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((s) => (
                  <div key={s.label} className="bg-gray-bg rounded-lg p-4 flex items-start gap-3">
                    <div className="text-gold mt-0.5 flex-shrink-0">{s.icon}</div>
                    <div>
                      <p className="text-xs text-gray-text uppercase tracking-wide mb-0.5">{s.label}</p>
                      <p className="font-heading font-semibold text-navy text-sm">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-1">
              <DetailBookingForm
                listingTitle={title}
                listingType="sell"
                price={property.displayPrice}
                source="listing-detail-sell"
              />
            </aside>
          </div>
        </div>
      </main>
      <SimilarProperties currentId={property.id} type="sell" />
      <Footer />
    </>
  );
}
