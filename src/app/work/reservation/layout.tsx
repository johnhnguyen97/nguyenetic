import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reservation · Nguyenetic Studio",
  description: "Reserve your table with a secure deposit. Fast, simple, and confirmation delivered instantly.",
}

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
