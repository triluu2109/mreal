import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { serializePrisma } from "@/lib/serializers/prisma";
import SellForm, { type SellFormInitialData } from "../SellForm";

export const dynamic = "force-dynamic";

export default async function EditSellPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.saleListing.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/sell" className="inline-flex items-center gap-2 text-gray-text hover:text-navy transition-colors text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">Cập nhật căn bán</h1>
      </div>
      <SellForm initialData={serializePrisma(item) as SellFormInitialData} />
    </div>
  );
}
