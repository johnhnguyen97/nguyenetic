import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing, countryToLocale, type Locale } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const COOKIE_NAME = "NEXT_LOCALE";
const SUPPORTED = new Set<string>(routing.locales);

function isLocale(value: string | undefined): value is Locale {
  return !!value && SUPPORTED.has(value);
}

function geoLocale(request: NextRequest): Locale | undefined {
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (!country) return undefined;
  return countryToLocale[country];
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocaleInPath = routing.locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  );

  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;

  if (!hasLocaleInPath && !isLocale(cookieLocale)) {
    const detected = geoLocale(request);
    if (detected && detected !== routing.defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${detected}${pathname === "/" ? "" : pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set(COOKIE_NAME, detected, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API, internal Next.js paths, root metadata routes (/sitemap.xml,
  // /robots.txt are NOT locale-prefixed), and static-asset extensions.
  // /[locale]/blog/feed.xml DOES go through middleware so locale rewriting
  // reaches it (en feed served at /blog/feed.xml without prefix).
  matcher: [
    "/((?!api|_next|_vercel|sitemap\\.xml|robots\\.txt|.*\\.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|avif|map|json|webmanifest)).*)",
  ],
};
