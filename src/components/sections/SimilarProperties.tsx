import Link from "next/link";
import Image from "next/image";
import { Bath, BedDouble, Maximize2 } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { buildListingTitle, formatArea } from "@/lib/listing-utils";
import { resolveStorageUrl } from "@/server/storage/resolve-url";

interface Props {
  currentId: string;
  type: "sell" | "rent";
}

export default async function SimilarProperties({ currentId, type }: Props) {
  let items: Array<{
    id: string;
    href: string;
    title: string;
    price: string;
    area: string | null;
    beds: number | null;
    baths: number | null;
    image: string | null;
    badge: string;
    badgeColor: string;
  }> = [];

  try {
    if (type === "sell") {
      const sells = await prisma.saleListing.findMany({
        where: { isVisible: true, NOT: { id: currentId } },
        orderBy: { sellingPrice: "asc" },
        take: 6,
      });
      items = sells.map((s) => ({
        id: s.id,
        href: `/can-ho/ban/${s.id}`,
        title: buildListingTitle(s.projectCode, s.unitCode, s.areaSqm.toString(), s.bedrooms, s.bathrooms),
        price: s.displayPrice,
        area: formatArea(Number(s.areaSqm)),
        beds: s.bedrooms,
        baths: s.bathrooms,
        image: s.imagePaths[0] ?? null,
        badge: "[Bán]",
        badgeColor: "text-gold",
      }));
    } else {
      const rents = await prisma.rentalListing.findMany({
        where: { isVisible: true, NOT: { id: currentId } },
        orderBy: { rentPrice: "asc" },
        take: 6,
      });
      items = rents.map((r) => ({
        id: r.id,
        href: `/can-ho/thue/${r.id}`,
        title: buildListingTitle(r.projectCode, r.unitCode, r.areaSqm.toString(), r.bedrooms, r.bathrooms),
        price: r.displayPrice,
        area: formatArea(Number(r.areaSqm)),
        beds: r.bedrooms,
        baths: r.bathrooms,
        image: r.imagePaths[0] ?? null,
        badge: "[Thuê]",
        badgeColor: "text-navy",
      }));
    }
  } catch {
    return null;
  }

  if (items.length === 0) return null;

  const heading = type === "sell" ? "Căn bán tương tự" : "Căn thuê tương tự";

  return (
    <section className="py-12 bg-gray-bg border-t border-gray-border">
      <div className="container-site">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-navy text-xl">{heading}</h2>
          <Link
            href={type === "sell" ? "/mua-nha" : "/thue-nha"}
            className="text-gold text-sm font-semibold hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                {item.image ? (
                  <Image
                    src={resolveStorageUrl(item.image)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    Chưa có ảnh
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-navy font-semibold mb-1 line-clamp-2 leading-snug">
                  <span className={`${item.badgeColor} font-bold mr-1`}>{item.badge}</span>
                  {item.title}
                </p>
                <div className="flex items-center gap-3 text-gray-text text-xs mt-2">
                  {item.area && <span className="flex items-center gap-1"><Maximize2 size={10} className="text-gold" />{item.area}</span>}
                  {item.beds != null && <span className="flex items-center gap-1"><BedDouble size={10} className="text-gold" />{item.beds} PN</span>}
                  {item.baths != null && <span className="flex items-center gap-1"><Bath size={10} className="text-gold" />{item.baths} WC</span>}
                </div>
                <div className="font-heading font-bold text-gold text-base mt-2">{item.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
