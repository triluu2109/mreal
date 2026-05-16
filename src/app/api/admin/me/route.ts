import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: admin.id,
    email: admin.email,
    fullName: admin.fullName,
    role: admin.role,
    permissions: admin.permissions,
  });
}
