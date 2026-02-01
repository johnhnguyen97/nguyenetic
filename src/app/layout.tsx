import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://nguyenetic.com"),
  title: {
    default: "Nguyenetic | Web Development, SEO & AI Solutions",
    template: "%s | Nguyenetic",
  },
  description:
    "Enterprise-grade web development, strategic SEO, and AI-powered solutions. Building elegant digital experiences that drive measurable results. Full-stack expertise with Next.js, React, and modern technologies.",
  keywords: [
    "web development",
    "web design",
    "SEO services",
    "AI solutions",
    "Next.js developer",
    "React developer",
    "full-stack developer",
    "digital marketing",
    "custom web applications",
    "e-commerce development",
    "TypeScript",
    "Tailwind CSS",
    "Vercel",
    "Supabase",
  ],
  authors: [{ name: "John Nguyen", url: "https://nguyenetic.com" }],
  creator: "John Nguyen",
  publisher: "Nguyenetic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nguyenetic.com",
    siteName: "Nguyenetic",
    title: "Nguyenetic | Web Development, SEO & AI Solutions",
    description:
      "Enterprise-grade web development, strategic SEO, and AI-powered solutions. Building elegant digital experiences that drive measurable results.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nguyenetic - Digital Craftsmanship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyenetic | Web Development, SEO & AI Solutions",
    description:
      "Enterprise-grade web development, strategic SEO, and AI-powered solutions. Building elegant digital experiences.",
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
              description:
                "Enterprise-grade web development, strategic SEO, and AI-powered solutions.",
              url: "https://nguyenetic.com",
              email: "hello@nguyenetic.com",
              founder: {
                "@type": "Person",
                name: "John Nguyen",
              },
              areaServed: "Worldwide",
              serviceType: [
                "Web Development",
                "SEO Services",
                "AI Solutions",
                "Digital Marketing",
                "Custom Web Applications",
              ],
              priceRange: "$$",
              sameAs: [
                "https://github.com/johnhnguyen97",
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
