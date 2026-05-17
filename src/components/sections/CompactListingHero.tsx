import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { resolveStorageUrl } from "@/server/storage/resolve-url";
import { getI18n } from "@/lib/i18n/server";

// Correct Supabase bucket-relative path (confirmed in storage.objects)
const HERO_IMAGE = resolveStorageUrl(
  "projects/q7-saigon-riverside/hero-section/010_tt_duan.webp"
);

type CompactListingHeroProps = {
  title: string;
  accent: string;
};

export default async function CompactListingHero({ title, accent }: CompactListingHeroProps) {
  const { dict: vi } = await getI18n();

  return (
    <section
      className="relative bg-navy py-7 text-white sm:py-9"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Heavy navy overlay — low transparency = more blue = stronger contrast */}
      <div className="absolute inset-0 bg-navy/85" />

      <div className="container-site relative z-10">
        <nav aria-label="Breadcrumb" className="mb-3 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-white/60">
          <Link href="/" className="shrink-0 transition-colors hover:text-gold">
            {vi.common.home}</Link>
          <ChevronRight size={13} className="shrink-0" />
          <span className="min-w-0 flex-1 truncate text-white/90">{title}</span>
        </nav>
        <h1 className="font-heading text-2xl font-bold text-white md:text-3xl">
          {title} <span className="text-gold">{accent}</span>
        </h1>
      </div>
    </section>
  );
}
