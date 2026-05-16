import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import AccountForm from "./AccountForm";

export const metadata: Metadata = { title: "Tài khoản | Admin" };
export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const admin = await requireAdmin();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-navy">Tài khoản cá nhân</h1>
        <p className="text-gray-text mt-1">Cập nhật thông tin cơ bản và đổi mật khẩu đăng nhập admin</p>
      </div>
      <AccountForm fullName={admin.fullName} phone={admin.phone} email={admin.email} role={admin.role} />
    </div>
  );
}
