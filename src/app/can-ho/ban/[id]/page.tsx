import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, Building2, Maximize2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/server/db/prisma";
import { buildListingTitle, formatArea, formatLayout } from "@/lib/listing-utils";
import ImageGallery from "@/components/ui/ImageGallery";
import SimilarProperties from "@/components/layout/sections/SimilarProperties";
import DetailBookingForm from "@/components/layout/sections/DetailBookingForm";
import { formatFurnishing } from "@/lib/furnishing";
import { getI18n } from "@/lib/i18n/server";
import { normalizeListingImagePaths } from "@/lib/listing-media";

interface Props {
  params: Promise<{ id: string }>;
}

async function getListing(id: string) {
  return prisma.saleListing.findFirst({ where: { id, isVisible: true, deletedAt: null } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dict: vi } = await getI18n();
  const { id } = await params;
  const property = await getListing(id);
  if (!property) return { title: vi.listing_page.detail.not_found };
  const title = buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms);

  return {
    title: `${vi.common.sale_badge} ${title} - ${property.displayPrice} | M-Real Estate`,
    description: `${title} t?i ${vi.common.project_name}. ${vi.listing_page.detail.metadata_contact}`,
  };
}

export default async function SellDetailPage({ params }: Props) {
  const { dict: vi } = await getI18n();
  const { id } = await params;
  const property = await getListing(id);
  if (!property) notFound();

  const title = buildListingTitle(property.projectCode, property.unitCode, property.areaSqm.toString(), property.bedrooms, property.bathrooms);
  const imagePaths = normalizeListingImagePaths(property.imagePaths);
  const specs = [
    { icon: <Maximize2 size={16} />, label: vi.listing_page.detail.specs.area, value: formatArea(Number(property.areaSqm)) },
    { icon: <BedDouble size={16} />, label: vi.listing_page.detail.specs.bedrooms, value: `${property.bedrooms} ${vi.listing_page.detail.room_suffix}` },
    { icon: <Bath size={16} />, label: vi.listing_page.detail.specs.toilet, value: `${property.bathrooms} ${vi.common.bath_short}` },
    { icon: <BedDouble size={16} />, label: vi.listing_page.detail.specs.layout, value: formatLayout(property.bedrooms, property.bathrooms) },
    { icon: <Building2 size={16} />, label: vi.listing_page.detail.specs.furnishing, value: formatFurnishing(property.furnishingNote, property.furnishingStatus) },
    property.view && { icon: <Building2 size={16} />, label: vi.listing_page.detail.specs.view, value: property.view },
    property.contractPrice && { icon: <Building2 size={16} />, label: vi.listing_page.detail.specs.contract_price, value: `${(Number(property.contractPrice) / 1e9).toFixed(3).replace(/\.?0+$/, "")} ${vi.listing_page.detail.billion_suffix}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string | null }[];

  return (
    <>
      <Header />
      <main>
        <div className="bg-gray-bg border-b border-gray-border">
          <div className="container-site py-3 sm:py-4">
            <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-text">
              <Link href="/" className="shrink-0 hover:text-gold transition-colors">{vi.common.home}</Link>
              <span>/</span>
              <Link href="/gio-hang-ban" className="shrink-0 hover:text-gold transition-colors">{vi.listing_page.detail.buy_breadcrumb}</Link>
              <span>/</span>
              <span className="min-w-0 flex-1 truncate text-navy font-medium">{title}</span>
            </nav>
          </div>
        </div>

        <div className="container-site py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <Link href="/gio-hang-ban" className="inline-flex items-center gap-2 text-sm text-gray-text hover:text-gold transition-colors">
                <ArrowLeft size={16} />
                {vi.listing_page.detail.buy_breadcrumb}
              </Link>

              <ImageGallery images={imagePaths} alt={title} />

              <div>
                <h1 className="font-heading font-bold text-navy text-2xl md:text-3xl mb-3">{title}</h1>
                <div className="text-3xl font-heading font-bold text-gold mb-2">{property.displayPrice}</div>
                <div className="text-gray-text text-sm">{vi.common.project_location_short}</div>
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
