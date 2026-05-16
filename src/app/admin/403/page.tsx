import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AdminForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md rounded-lg border border-gray-border bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <ShieldAlert size={24} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-navy">Không có quyền truy cập</h1>
        <p className="mt-3 text-sm leading-6 text-gray-text">
          Tài khoản của bạn chưa được cấp quyền cho khu vực này. Vui lòng liên hệ master để được phân quyền.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
        >
          Về dashboard
        </Link>
      </div>
    </div>
  );
}
