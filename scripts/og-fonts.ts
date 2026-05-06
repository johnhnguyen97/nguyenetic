// Loads OG-card fonts from @fontsource packages on disk.
// Latin fonts: Instrument Serif + JetBrains Mono (small, always loaded).
// JP fonts: Noto Serif JP (~1.8 MB woff, Japanese subset). Loaded only when
// rendering a ja post — keeps build memory manageable for Latin-only runs.

import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();

function fontFile(rel: string): Buffer {
  const full = path.join(REPO_ROOT, "node_modules", rel);
  if (!fs.existsSync(full)) {
    throw new Error(
      `OG font missing: ${rel}\n` +
        `Did you forget to run \`npm install\`? @fontsource/* are devDependencies.`,
    );
  }
  return fs.readFileSync(full);
}

export type SatoriFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 600;
  style: "normal" | "italic";
};

export function loadLatinFonts(): SatoriFont[] {
  return [
    {
      name: "Instrument Serif",
      data: fontFile(
        "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff",
      ),
      weight: 400,
      style: "normal",
    },
    {
      name: "JetBrains Mono",
      data: fontFile(
        "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff",
      ),
      weight: 500,
      style: "normal",
    },
  ];
}

let _jp: SatoriFont[] | null = null;

// Cached so we only read the 1.8 MB woff once per build run.
export function loadJapaneseFonts(): SatoriFont[] {
  if (_jp) return _jp;
  _jp = [
    {
      name: "Noto Serif JP",
      data: fontFile(
        "@fontsource/noto-serif-jp/files/noto-serif-jp-japanese-400-normal.woff",
      ),
      weight: 400,
      style: "normal",
    },
  ];
  return _jp;
}

// Convenience: returns the right font set for a given post locale.
export function loadFontsForLocale(locale: string): SatoriFont[] {
  if (locale === "ja") {
    return [...loadLatinFonts(), ...loadJapaneseFonts()];
  }
  return loadLatinFonts();
}
