import Link from "next/link";
import { Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getI18n } from "@/lib/i18n/server";

type InvestmentCTAProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  id?: string;
};

export default async function InvestmentCTA({
  title,
  description,
  primaryHref = "/#booking",
  primaryLabel,
  secondaryHref = `tel:${siteConfig.phone}`,
  secondaryLabel = siteConfig.phoneDisplay,
  id,
}: InvestmentCTAProps) {
  const { dict: vi } = await getI18n();
  const resolvedTitle = title ?? vi.investment_cta.title;
  const resolvedDescription = description ?? vi.investment_cta.description;
  const resolvedPrimaryLabel = primaryLabel ?? vi.investment_cta.primary_label;

  return (
    <section id={id} className="bg-white py-10 sm:py-12">
      <div className="container-site">
        <div className="grid items-center gap-5 rounded-lg bg-navy px-5 py-7 text-white sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">{resolvedTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 md:text-base">{resolvedDescription}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-lg bg-gold px-6 py-3 font-heading text-sm font-bold text-white transition-colors hover:bg-gold-dark"
            >
              {resolvedPrimaryLabel}
            </Link>
            <a
              href={secondaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Phone size={16} />
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
