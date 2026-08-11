import "server-only";
import type { Locale } from "@/i18n/config";
import fr from "./fr";

export type Dictionary = typeof fr;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => Promise.resolve(fr),
  ar: () => import("./ar").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
