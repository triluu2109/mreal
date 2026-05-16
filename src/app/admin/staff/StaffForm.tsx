"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStaff, updateStaff } from "@/app/actions/staff";
import {
  ADMIN_PERMISSIONS,
  PERMISSION_LABELS,
  type AdminRoleValue,
} from "@/lib/admin/permissions";

export type StaffFormInitialData = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: AdminRoleValue;
  permissions: string[];
  position: string | null;
  specialty: string | null;
  avatarUrl: string | null;
  displayOrder: number;
  isActive: boolean;
};

export default function StaffForm({ initialData = null }: { initialData?: StaffFormInitialData | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(initialData?.id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "") || null,
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? "") || null,
      role: String(formData.get("role") ?? "staff") as AdminRoleValue,
      permissions: formData.getAll("permissions").map(String),
      position: String(formData.get("position") ?? "") || null,
      specialty: String(formData.get("specialty") ?? "") || null,
      avatarUrl: String(formData.get("avatarUrl") ?? "") || null,
      displayOrder: Number(formData.get("displayOrder") ?? 0),
      isActive: formData.get("isActive") === "on",
    };

    startTransition(async () => {
      const res = isEditing && initialData
        ? await updateStaff(initialData.id, data)
        : await createStaff(data);

      if (res.success) {
        toast.success(isEditing ? "Đã cập nhật nhân sự" : "Đã tạo nhân sự");
        router.push("/admin/staff");
        router.refresh();
      } else {
        toast.error(res.error || "Có lỗi xảy ra");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-6 lg:p-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Họ và tên *">
          <input name="fullName" required defaultValue={initialData?.fullName ?? ""} className={inputClass} />
        </Field>

        <Field label="Email đăng nhập *">
          <input name="email" type="email" required defaultValue={initialData?.email ?? ""} className={inputClass} />
        </Field>

        <Field label={isEditing ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu tạm *"}>
          <input
            name="password"
            type="password"
            required={!isEditing}
            minLength={8}
            className={inputClass}
            placeholder="Tối thiểu 8 ký tự"
          />
        </Field>

        <Field label="Số điện thoại">
          <input name="phone" defaultValue={initialData?.phone ?? ""} className={inputClass} />
        </Field>

        <Field label="Vai trò *">
          <select name="role" required defaultValue={initialData?.role ?? "staff"} className={inputClass}>
            <option value="admin">ADMIN</option>
            <option value="staff">STAFF</option>
          </select>
        </Field>

        <Field label="Chức danh">
          <input name="position" defaultValue={initialData?.position ?? ""} className={inputClass} />
        </Field>

        <Field label="Thứ tự hiển thị">
          <input name="displayOrder" type="number" defaultValue={initialData?.displayOrder ?? 0} className={inputClass} />
        </Field>

        <Field label="Avatar URL">
          <input name="avatarUrl" defaultValue={initialData?.avatarUrl ?? ""} className={inputClass} />
        </Field>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-navy mb-2">Mô tả/chuyên môn</label>
          <textarea
            name="specialty"
            defaultValue={initialData?.specialty ?? ""}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="md:col-span-2 rounded-lg border border-gray-border p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-navy">Phân quyền</h2>
              <p className="mt-1 text-sm text-gray-text">Master có toàn quyền mặc định; các vai trò khác chỉ có quyền được bật.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-text">
              <input name="isActive" type="checkbox" defaultChecked={initialData?.isActive ?? true} className="h-4 w-4 accent-navy" />
              Đang hoạt động
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ADMIN_PERMISSIONS.map((permission) => (
              <label key={permission} className="flex items-center gap-3 rounded-lg border border-gray-border px-4 py-3 text-sm text-gray-text">
                <input
                  type="checkbox"
                  name="permissions"
                  value={permission}
                  defaultChecked={initialData?.permissions.includes(permission)}
                  className="h-4 w-4 accent-navy"
                />
                {PERMISSION_LABELS[permission]}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-4 border-t border-gray-border pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg border border-gray-border text-gray-text font-medium hover:bg-gray-50 transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-navy hover:bg-navy-light text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full border border-gray-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors bg-white";
