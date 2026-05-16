export const ADMIN_PERMISSIONS = [
  "listings.read",
  "listings.create",
  "listings.update",
  "listings.delete_soft",
  "staff.read",
  "staff.create",
  "staff.update",
  "staff.delete_soft",
  "news.manage",
  "appointments.manage",
  "leads.manage",
  "contacts.manage",
  "settings.manage",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];
export type AdminRoleValue = "master" | "admin" | "telesale" | "staff";

export const MASTER_PERMISSIONS = [...ADMIN_PERMISSIONS];
export const STAFF_DEFAULT_PERMISSIONS: AdminPermission[] = [];

export const PERMISSION_LABELS: Record<AdminPermission, string> = {
  "listings.read": "Xem rổ hàng",
  "listings.create": "Thêm căn thuê/bán",
  "listings.update": "Cập nhật rổ hàng",
  "listings.delete_soft": "Ẩn/xoá mềm rổ hàng",
  "staff.read": "Xem nhân sự",
  "staff.create": "Tạo nhân sự",
  "staff.update": "Cập nhật nhân sự/phân quyền",
  "staff.delete_soft": "Xoá mềm nhân sự",
  "news.manage": "Quản lý tin tức",
  "appointments.manage": "Quản lý lịch hẹn",
  "leads.manage": "Quản lý chat leads",
  "contacts.manage": "Quản lý liên hệ",
  "settings.manage": "Quản lý cấu hình website",
};

export function normalizePermissions(role: AdminRoleValue, permissions: string[] | null | undefined) {
  if (role === "master") return MASTER_PERMISSIONS;
  const allowed = new Set<string>(ADMIN_PERMISSIONS);
  return Array.from(new Set((permissions ?? []).filter((permission) => allowed.has(permission)))) as AdminPermission[];
}

export function hasPermission(role: AdminRoleValue, permissions: string[] | null | undefined, permission: AdminPermission) {
  return role === "master" || normalizePermissions(role, permissions).includes(permission);
}
