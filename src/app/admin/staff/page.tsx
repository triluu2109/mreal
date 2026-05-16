import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { Plus, Edit } from "lucide-react";
import DeleteButton from "./DeleteButton";
import { deleteStaff } from "@/app/actions/staff";
import { requireMasterPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  await requireMasterPage();

  const staffs = await prisma.adminProfile.findMany({
    where: {
      role: { not: "master" },
      isActive: true,
      deletedAt: null,
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy">Nhân sự admin</h1>
          <p className="text-gray-text mt-1">Quản lý tài khoản, vai trò và quyền truy cập admin workspace</p>
        </div>
        <Link
          href="/admin/staff/create"
          className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Thêm mới
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-bg border-b border-gray-border text-sm text-gray-text font-medium">
            <tr>
              <th className="px-6 py-4">Nhân sự</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Liên hệ</th>
              <th className="px-6 py-4">Quyền</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {staffs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-muted">
                  Chưa có tài khoản nhân sự đang hoạt động.
                </td>
              </tr>
            ) : (
              staffs.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-navy">
                        {staff.initials ?? staff.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-navy">{staff.fullName}</div>
                        <div className="text-xs text-gray-muted">{staff.position ?? staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-text">{staff.role}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{staff.email}</div>
                    {staff.phone && <div className="text-xs text-gray-muted">{staff.phone}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-text">{staff.permissions.length} quyền</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/staff/${staff.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </Link>
                      <DeleteButton id={staff.id} action={deleteStaff} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
