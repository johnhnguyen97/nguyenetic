import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export async function EmptyLocaleNotice({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "blog" });
  return (
    <div className="border border-[var(--color-neutral-border)] rounded-sm p-8 md:p-12">
      <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-[var(--color-paper)] mb-4">
        {t("emptyLocaleTitle")}
      </p>
      <p className="text-[var(--color-paper-dim)] max-w-xl leading-relaxed">
        {t("emptyLocaleBody")}
      </p>
      <Link
        href="/blog"
        className="mt-6 inline-flex items-center gap-2 text-[var(--color-warm)] hover:text-[var(--color-warm-hover)] transition-colors font-[family-name:var(--font-jetbrains)] text-sm"
      >
        → {t("emptyLocaleCta")}
      </Link>
    </div>
  );
}
