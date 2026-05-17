import en from "@/locales/en.json";
import vi from "@/locales/vi.json";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const DEFAULT_LOCALE = "vi";
export const SUPPORTED_LOCALES = ["vi", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type Dictionary = typeof vi;

const dictionaries: Record<Locale, Dictionary> = {
  vi,
  en,
};

export function isLocale(value: string | undefined | null): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
