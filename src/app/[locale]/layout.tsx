import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import "../globals.css"
import { Providers } from "@/components/providers"
import { routing, type Locale } from "@/i18n/routing"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
  ],
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const ogLocaleMap: Record<Locale, string> = {
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
  ko: "ko_KR",
  vi: "vi_VN",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const safeLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale
  const t = await getTranslations({ locale: safeLocale, namespace: "metadata" })

  const baseUrl = "https://nguyenetic.com"
  const path = safeLocale === routing.defaultLocale ? "" : `/${safeLocale}`
  const canonical = `${baseUrl}${path || "/"}`

  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = loc === routing.defaultLocale ? `${baseUrl}/` : `${baseUrl}/${loc}`
  }
  languages["x-default"] = `${baseUrl}/`

  const title = t("title")
  const description = t("description")

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: "%s | Nguyenetic",
    },
    description,
    authors: [{ name: "John Nguyen", url: baseUrl }],
    creator: "John Nguyen",
    publisher: "Nguyenetic",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: ogLocaleMap[safeLocale],
      url: canonical,
      siteName: "Nguyenetic",
      title,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Nguyenetic — a studio in orbit",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
      creator: "@nguyenetic",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
      languages,
    },
    category: "technology",
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Nguyenetic",
              alternateName: "A studio in orbit",
              description:
                "Managed websites, design, and digital ops for small service businesses. Seven shipped products. Fixed price, fixed deadline, receipts on everything.",
              url: "https://nguyenetic.com",
              email: "hello@nguyenetic.com",
              founder: {
                "@type": "Person",
                name: "John Nguyen",
              },
              areaServed: "Worldwide",
              serviceType: [
                "Managed Websites",
                "Web Development",
                "Local SEO",
                "Brand Design",
                "Digital Operations",
                "AI Workflow Tools",
              ],
              priceRange: "$$",
              termsOfService: "Fixed scope, fixed price, fixed deadline. Miss the deadline and the month is free.",
              sameAs: [
                "https://github.com/johnhnguyen97",
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
