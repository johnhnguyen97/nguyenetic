export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        // Alias --font-mono to JetBrains Mono for the zip components,
        // which hardcode var(--font-mono) in inline styles.
        ["--font-mono" as string]: "var(--font-jetbrains)",
      }}
    >
      {children}
    </div>
  )
}
