import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Analytics } from "@vercel/analytics/next"

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

export const metadata: Metadata = {
  metadataBase: new URL("https://nguyenetic.com"),
  title: {
    default: "Nguyenetic — a studio in orbit around you",
    template: "%s | Nguyenetic",
  },
  description:
    "Managed websites, design, and digital ops for small service businesses. Seven shipped products. Fixed price, fixed deadline, receipts on everything.",
  keywords: [
    "managed website",
    "small business website",
    "web development",
    "SEO",
    "digital operations",
    "fixed price web development",
    "restaurant website",
    "contractor website",
    "auto shop website",
    "local SEO",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "John Nguyen", url: "https://nguyenetic.com" }],
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
    locale: "en_US",
    url: "https://nguyenetic.com",
    siteName: "Nguyenetic",
    title: "Nguyenetic — a studio in orbit around you",
    description:
      "Managed websites, design, and digital ops for small service businesses. Seven shipped products. Fixed price, fixed deadline, receipts on everything.",
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
    title: "Nguyenetic — a studio in orbit around you",
    description:
      "Managed websites, design, and digital ops for small service businesses. Fixed price, fixed deadline, receipts on everything.",
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
    canonical: "https://nguyenetic.com",
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
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
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
