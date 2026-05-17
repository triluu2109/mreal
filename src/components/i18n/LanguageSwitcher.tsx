"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useTransition } from "react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

function VietnamFlag() {
  return (
    <svg viewBox="0 0 32 24" className="h-4 w-5 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10" aria-hidden="true">
      <rect width="32" height="24" fill="#DA251D" />
      <path
        fill="#FFFF00"
        d="m16 5.05 1.75 5.39h5.66l-4.58 3.33 1.75 5.38L16 15.82l-4.58 3.33 1.75-5.38-4.58-3.33h5.66L16 5.05Z"
      />
    </svg>
  );
}

function UnitedStatesFlag() {
  const stripes = Array.from({ length: 13 }, (_, index) => (
    <rect key={index} y={index * (24 / 13)} width="32" height={24 / 13} fill={index % 2 === 0 ? "#B22234" : "#FFFFFF"} />
  ));

  return (
    <svg viewBox="0 0 32 24" className="h-4 w-5 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10" aria-hidden="true">
      {stripes}
      <rect width="13.7" height="12.9" fill="#3C3B6E" />
      <g fill="#FFFFFF">
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 6 }, (_, column) => (
            <circle key={`a-${row}-${column}`} cx={1.15 + column * 2.2} cy={1.15 + row * 2.35} r="0.34" />
          ))
        )}
        {Array.from({ length: 4 }, (_, row) =>
          Array.from({ length: 5 }, (_, column) => (
            <circle key={`b-${row}-${column}`} cx={2.25 + column * 2.2} cy={2.32 + row * 2.35} r="0.34" />
          ))
        )}
      </g>
    </svg>
  );
}

const languages: Array<{ locale: Locale; label: string; Flag: () => ReactNode }> = [
  { locale: "vi", label: "Tieng Viet", Flag: VietnamFlag },
  { locale: "en", label: "English", Flag: UnitedStatesFlag },
];

export function LanguageSwitcher({
  currentLocale,
  className,
}: {
  currentLocale: Locale;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function switchLocale(locale: Locale) {
    if (locale === currentLocale) return;

    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <div
      className={cn("inline-flex h-9 items-center rounded-full border border-gray-200 bg-white/95 p-0.5 shadow-sm", className)}
      aria-label="Change language"
    >
      {languages.map((item) => (
        <button
          key={item.locale}
          type="button"
          onClick={() => switchLocale(item.locale)}
          disabled={isPending}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full border transition-all duration-200",
            item.locale === currentLocale
              ? "border-gold bg-gold/10 shadow-[0_0_0_1px_rgba(199,161,89,0.15)]"
              : "border-transparent hover:bg-navy/5 hover:shadow-sm",
            isPending && "cursor-wait opacity-70"
          )}
          aria-label={`Switch to ${item.label}`}
          aria-pressed={item.locale === currentLocale}
        >
          <item.Flag />
          <span className="sr-only">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
