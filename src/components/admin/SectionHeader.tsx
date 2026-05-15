import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function SectionHeader({
  title,
  description,
  backHref,
  actionHref,
  actionLabel,
  ActionIcon,
}: {
  title: string;
  description?: string;
  backHref?: string;
  actionHref?: string;
  actionLabel?: string;
  ActionIcon?: LucideIcon;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {backHref ? (
          <Link href={backHref} className="text-gray-text transition-colors hover:text-navy" aria-label="Quay lại">
            ←
          </Link>
        ) : null}
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy sm:text-3xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-gray-text">{description}</p> : null}
        </div>
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-light">
          {ActionIcon ? <ActionIcon size={18} /> : null}
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
