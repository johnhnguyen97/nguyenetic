import { NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { buildFeedXml } from "@/lib/blog/rss";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const xml = await buildFeedXml(locale as Locale);
  return new NextResponse(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
