import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { ArrowLeft } from "lucide-react";
import StaffForm, { type StaffFormInitialData } from "../StaffForm";
import { notFound } from "next/navigation";
import { requireMasterPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  await requireMasterPage();
  const { id } = await params;
  const staff = await prisma.adminProfile.findUnique({
    where: { id },
  });

  if (!staff || staff.role === "master") {
    return notFound();
  }

  const initialData: StaffFormInitialData = {
    id: staff.id,
    email: staff.email,
    fullName: staff.fullName,
    phone: staff.phone,
    role: staff.role,
    permissions: staff.permissions,
    position: staff.position,
    specialty: staff.specialty,
    avatarUrl: staff.avatarUrl,
    displayOrder: staff.displayOrder,
    isActive: staff.isActive,
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/staff" className="inline-flex items-center gap-2 text-gray-text hover:text-navy transition-colors text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">Cập nhật nhân sự</h1>
      </div>
      <StaffForm initialData={initialData} />
    </div>
  );
}
