import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { serializePrisma } from "@/lib/serializers/prisma";
import RentForm, { type RentFormInitialData } from "../RentForm";
import { requirePagePermission } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function EditRentPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission("listings.update");
  const { id } = await params;
  const item = await prisma.rentalListing.findFirst({ where: { id, deletedAt: null } });
  if (!item) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/rent" className="inline-flex items-center gap-2 text-gray-text hover:text-navy transition-colors text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">Cập nhật căn thuê</h1>
      </div>
      <RentForm initialData={serializePrisma(item) as RentFormInitialData} />
    </div>
  );
}
