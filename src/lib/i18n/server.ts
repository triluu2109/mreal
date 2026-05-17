import { cookies } from "next/headers";
import { getDictionary, LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/config";

export async function getCurrentLocale() {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function getI18n() {
  const locale = await getCurrentLocale();
  return {
    locale,
    dict: getDictionary(locale),
  };
}
