import Link from "next/link";
import { Edit, Plus } from "lucide-react";
import { prisma } from "@/server/db/prisma";
import { deleteStaff } from "@/app/actions/staff";
import { requireMasterPage } from "@/lib/admin/auth";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  await requireMasterPage();

  const staffs = await prisma.adminProfile.findMany({
    where: {
      role: { in: ["master", "admin", "staff"] },
      isActive: true,
      deletedAt: null,
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy">Nhân sự admin</h1>
          <p className="mt-1 text-gray-text">Quản lý tài khoản, vai trò và quyền truy cập admin dashboard</p>
        </div>
        <Link href="/admin/staff/create" className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2 font-medium text-white transition-colors hover:bg-navy-light">
          <Plus size={18} />
          Thêm mới
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-border bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-gray-border bg-gray-bg text-sm font-medium text-gray-text">
            <tr>
              <th className="px-6 py-4">Nhân sự</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Liên hệ</th>
              <th className="px-6 py-4">Trạng thái/quyền</th>
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
                <tr key={staff.id} className="transition-colors hover:bg-gray-bg/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                        {staff.initials ?? staff.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-navy">{staff.fullName}</div>
                        <div className="text-xs text-gray-muted">{staff.position ?? staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-navy">{staff.role.toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{staff.email}</div>
                    {staff.phone ? <div className="text-xs text-gray-muted">{staff.phone}</div> : null}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-text">
                    <div className="font-medium text-green-700">Đang hoạt động</div>
                    <div className="text-xs text-gray-muted">{staff.role === "master" ? "Toàn quyền" : `${staff.permissions.length} quyền`}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {staff.role === "master" ? (
                        <span className="text-xs text-gray-muted">Không chỉnh sửa</span>
                      ) : (
                        <>
                          <Link href={`/admin/staff/${staff.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100" title="Sửa">
                            <Edit size={16} />
                          </Link>
                          <DeleteButton id={staff.id} action={deleteStaff} />
                        </>
                      )}
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
