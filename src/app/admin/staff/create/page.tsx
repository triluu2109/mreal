import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StaffForm from "../StaffForm";

export const dynamic = "force-dynamic";

export default function CreateStaffPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/staff" className="inline-flex items-center gap-2 text-gray-text hover:text-navy transition-colors text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">Thêm Nhân sự mới</h1>
      </div>
      <StaffForm />
    </div>
  );
}
