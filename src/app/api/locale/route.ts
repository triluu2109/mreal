import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/config";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const locale = normalizeLocale(typeof body?.locale === "string" ? body.locale : null);
  const response = NextResponse.json({ locale });

  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
