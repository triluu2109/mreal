import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StaffForm from "../StaffForm";
import { requireMasterPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function CreateStaffPage() {
  await requireMasterPage();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/staff" className="inline-flex items-center gap-2 text-gray-text hover:text-navy transition-colors text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">Thêm nhân sự admin</h1>
      </div>
      <StaffForm />
    </div>
  );
}
