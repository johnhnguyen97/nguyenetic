import type { Metadata } from "next"
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

export const metadata: Metadata = {
  title: "Nguyenetic | Digital Craftsmanship",
  description: "Building elegant solutions at the intersection of design and technology. Modern web development, AI integration, and digital experiences.",
  keywords: ["web development", "design", "technology", "AI", "Next.js", "React"],
  authors: [{ name: "John Nguyen" }],
  openGraph: {
    title: "Nguyenetic | Digital Craftsmanship",
    description: "Building elegant solutions at the intersection of design and technology.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
