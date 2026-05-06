import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ja", "zh", "ko", "vi"] as const,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  vi: "Tiếng Việt",
};

export const countryToLocale: Record<string, Locale> = {
  JP: "ja",
  CN: "zh",
  HK: "zh",
  TW: "zh",
  MO: "zh",
  SG: "zh",
  KR: "ko",
  KP: "ko",
  VN: "vi",
};
