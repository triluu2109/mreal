"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { createServiceClient } from "@/lib/supabase/server";
import { ADMIN_PERMISSIONS, normalizePermissions, type AdminRoleValue } from "@/lib/admin/permissions";
import { actionError, requireAdmin, requireMaster } from "@/lib/admin/auth";

type StaffInput = {
  email: string;
  password?: string | null;
  fullName: string;
  phone?: string | null;
  role: AdminRoleValue;
  permissions?: string[];
  position?: string | null;
  specialty?: string | null;
  avatarUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
};

const MANAGED_ROLES = new Set<AdminRoleValue>(["admin", "staff"]);

export async function createStaff(data: StaffInput) {
  try {
    await requireMaster();
    const input = normalizeStaffInput(data);

    if (!MANAGED_ROLES.has(input.role)) {
      return { success: false, error: "Master không được tạo từ màn hình nhân sự." };
    }

    if (!input.password || input.password.length < 8) {
      return { success: false, error: "Mật khẩu tạm phải có ít nhất 8 ký tự." };
    }

    const supabase = createServiceClient();
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.fullName },
    });

    if (error || !created.user) {
      return { success: false, error: error?.message ?? "Không tạo được tài khoản đăng nhập." };
    }

    await prisma.adminProfile.create({
      data: {
        userId: created.user.id,
        email: input.email,
        fullName: input.fullName,
        phone: input.phone,
        role: input.role,
        permissions: normalizePermissions(input.role, input.permissions),
        position: input.position,
        specialty: input.specialty,
        avatarUrl: input.avatarUrl,
        initials: getInitials(input.fullName),
        displayOrder: input.displayOrder,
        isActive: input.isActive,
      },
    });

    revalidateStaffPaths();
    return { success: true };
  } catch (error) {
    console.error("Create staff error:", error);
    return { success: false, error: actionError(error, "Không tạo được nhân sự") };
  }
}

export async function updateStaff(id: string, data: StaffInput) {
  try {
    await requireMaster();
    const current = await prisma.adminProfile.findUnique({
      where: { id },
      select: { role: true, userId: true },
    });

    if (!current) return { success: false, error: "Không tìm thấy nhân sự." };
    if (current.role === "master") return { success: false, error: "Không được chỉnh tài khoản master từ màn hình này." };

    const input = normalizeStaffInput(data);
    if (!MANAGED_ROLES.has(input.role)) {
      return { success: false, error: "Vai trò không hợp lệ." };
    }

    await prisma.adminProfile.update({
      where: { id },
      data: {
        email: input.email,
        fullName: input.fullName,
        phone: input.phone,
        role: input.role,
        permissions: normalizePermissions(input.role, input.permissions),
        position: input.position,
        specialty: input.specialty,
        avatarUrl: input.avatarUrl,
        initials: getInitials(input.fullName),
        displayOrder: input.displayOrder,
        isActive: input.isActive,
        deletedAt: input.isActive ? null : undefined,
      },
    });

    if (input.password && input.password.length < 8) {
      return { success: false, error: "Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±." };
    }

    const supabase = createServiceClient();
    const { error } = await supabase.auth.admin.updateUserById(current.userId, {
      email: input.email,
      user_metadata: { full_name: input.fullName },
      ...(input.password ? { password: input.password } : {}),
    });
    if (error) return { success: false, error: error.message };

    revalidateStaffPaths();
    return { success: true };
  } catch (error) {
    console.error("Update staff error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được nhân sự") };
  }
}

export async function deleteStaff(id: string) {
  try {
    await requireMaster();
    const current = await prisma.adminProfile.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!current) return { success: false, error: "Không tìm thấy nhân sự." };
    if (current.role === "master") return { success: false, error: "Không được xoá tài khoản master." };

    await prisma.adminProfile.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    revalidateStaffPaths();
    return { success: true };
  } catch (error) {
    console.error("Delete staff error:", error);
    return { success: false, error: actionError(error, "Không xoá được nhân sự") };
  }
}

export async function updateOwnProfile(data: { fullName: string; phone?: string | null; password?: string | null }) {
  try {
    const admin = await requireAdmin();

    await prisma.adminProfile.update({
      where: { id: admin.id },
      data: {
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        initials: getInitials(data.fullName),
      },
    });

    if (data.password) {
      if (data.password.length < 8) return { success: false, error: "Mật khẩu phải có ít nhất 8 ký tự." };
      const supabase = createServiceClient();
      const { error } = await supabase.auth.admin.updateUserById(admin.userId, { password: data.password });
      if (error) return { success: false, error: error.message };
    }

    revalidatePath("/admin/account");
    return { success: true };
  } catch (error) {
    console.error("Update own profile error:", error);
    return { success: false, error: actionError(error, "Không cập nhật được tài khoản") };
  }
}

function normalizeStaffInput(data: StaffInput) {
  const role = data.role === "admin" || data.role === "staff" ? data.role : "staff";
  const permissionSet = new Set(ADMIN_PERMISSIONS);
  return {
    email: data.email.trim().toLowerCase(),
    password: data.password?.trim() || null,
    fullName: data.fullName.trim(),
    phone: data.phone?.trim() || null,
    role,
    permissions: (data.permissions ?? []).filter((permission) => permissionSet.has(permission as (typeof ADMIN_PERMISSIONS)[number])),
    position: data.position?.trim() || null,
    specialty: data.specialty?.trim() || null,
    avatarUrl: data.avatarUrl?.trim() || null,
    displayOrder: Number(data.displayOrder ?? 0),
    isActive: data.isActive ?? true,
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function revalidateStaffPaths() {
  revalidatePath("/admin/staff");
  revalidatePath("/admin");
}
