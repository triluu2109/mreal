import "server-only";

import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  hasPermission,
  normalizePermissions,
  type AdminPermission,
  type AdminRoleValue,
} from "./permissions";

export type CurrentAdmin = {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: AdminRoleValue;
  permissions: AdminPermission[];
  isMaster: boolean;
};

export class AdminForbiddenError extends Error {
  constructor(message = "Bạn không có quyền thực hiện thao tác này") {
    super(message);
    this.name = "AdminForbiddenError";
  }
}

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return null;

  const profile = await prisma.adminProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      userId: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      permissions: true,
      isActive: true,
      deletedAt: true,
    },
  });

  if (!profile?.isActive || profile.deletedAt) return null;

  const role = profile.role as AdminRoleValue;
  const permissions = normalizePermissions(role, profile.permissions);

  return {
    id: profile.id,
    userId: profile.userId,
    email: profile.email,
    fullName: profile.fullName,
    phone: profile.phone,
    role,
    permissions,
    isMaster: role === "master",
  };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requirePermission(permission: AdminPermission) {
  const admin = await requireAdmin();
  if (!hasPermission(admin.role, admin.permissions, permission)) {
    throw new AdminForbiddenError();
  }
  return admin;
}

export async function requirePagePermission(permission: AdminPermission) {
  const admin = await requireAdmin();
  if (!hasPermission(admin.role, admin.permissions, permission)) {
    redirect("/admin/403");
  }
  return admin;
}

export async function requireMaster() {
  const admin = await requireAdmin();
  if (!admin.isMaster) {
    throw new AdminForbiddenError("Chỉ master mới có quyền thực hiện thao tác này");
  }
  return admin;
}

export async function requireMasterPage() {
  const admin = await requireAdmin();
  if (!admin.isMaster) {
    redirect("/admin/403");
  }
  return admin;
}

export function assertPermission(admin: CurrentAdmin, permission: AdminPermission) {
  if (!hasPermission(admin.role, admin.permissions, permission)) {
    throw new AdminForbiddenError();
  }
}

export function actionError(error: unknown, fallback = "Có lỗi xảy ra") {
  if (error instanceof AdminForbiddenError) return error.message;
  return error instanceof Error ? error.message : fallback;
}
