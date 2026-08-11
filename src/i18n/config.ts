export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const rtlLocales: Locale[] = ["ar"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
