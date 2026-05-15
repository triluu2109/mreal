import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-border bg-white p-12 text-center">
      {Icon ? <Icon size={44} className="mx-auto mb-4 text-gray-border" /> : null}
      <p className="text-lg font-semibold text-navy">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-gray-text">{description}</p> : null}
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="mt-5 inline-flex items-center justify-center rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
