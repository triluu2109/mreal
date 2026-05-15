import Link from "next/link";
import { prisma } from "@/prisma";
import { ArrowLeft } from "lucide-react";
import StaffForm, { type StaffFormInitialData } from "../StaffForm";
import { notFound } from "next/navigation";
import { serializePrisma } from "@/lib/serializers/prisma";

export const dynamic = "force-dynamic";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const staff = await prisma.staff.findUnique({
    where: { id }
  });

  if (!staff) {
    return notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/staff" className="inline-flex items-center gap-2 text-gray-text hover:text-navy transition-colors text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">Cập nhật Nhân sự</h1>
      </div>
      <StaffForm initialData={serializePrisma(staff) as StaffFormInitialData} />
    </div>
  );
}
