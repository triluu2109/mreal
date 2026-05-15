import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RentForm from "../RentForm";

export const dynamic = "force-dynamic";

export default function CreateRentPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/rent" className="inline-flex items-center gap-2 text-gray-text hover:text-navy transition-colors text-sm font-medium mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 className="font-heading text-2xl font-bold text-navy">Thêm căn thuê</h1>
      </div>
      <RentForm />
    </div>
  );
}
