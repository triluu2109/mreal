"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { createClient } from "@/lib/supabase/server";
import { MASTER_PERMISSIONS } from "@/lib/admin/permissions";

type LoginState = {
  error?: string;
};

export async function loginAdmin(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Vui long nhap email va mat khau." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Email hoac mat khau khong dung." };
  }

  const masterEmail = process.env.MASTER_ADMIN_EMAIL?.trim().toLowerCase();
  const isConfiguredMaster = Boolean(masterEmail && email === masterEmail);

  if (isConfiguredMaster) {
    await prisma.adminProfile.upsert({
      where: { userId: data.user.id },
      update: {
        email,
        role: "master",
        permissions: MASTER_PERMISSIONS,
        isActive: true,
        deletedAt: null,
      },
      create: {
        userId: data.user.id,
        email,
        fullName: data.user.user_metadata?.full_name ?? "Master Admin",
        role: "master",
        permissions: MASTER_PERMISSIONS,
        isActive: true,
        initials: "MA",
      },
    });
  }

  const profile = await prisma.adminProfile.findUnique({
    where: { userId: data.user.id },
    select: { isActive: true, deletedAt: true },
  });

  if (!profile?.isActive || profile.deletedAt) {
    await supabase.auth.signOut();
    return { error: "Tai khoan nay khong co quyen truy cap admin." };
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
