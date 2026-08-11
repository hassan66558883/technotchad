import type { Locale } from "@/i18n/config";

export function localeHref(lang: Locale, path: string) {
  if (path === "/") return `/${lang}`;
  return `/${lang}${path}`;
}
