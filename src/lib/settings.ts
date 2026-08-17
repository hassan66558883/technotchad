import { prisma } from "@/lib/prisma";

export const ABOUT_SETTING_KEYS = [
  "about_intro",
  "about_founded_year",
  "about_vision",
  "about_mission",
  "about_location_description",
  "about_infrastructure",
  "about_teaching_intro",
  "about_teaching_methods",
  "about_admission",
] as const;

export type AboutSettingKey = (typeof ABOUT_SETTING_KEYS)[number];

export const SOCIAL_SETTING_KEYS = [
  "social_facebook",
  "social_tiktok",
  "social_youtube",
  "social_whatsapp",
] as const;

export type SocialSettingKey = (typeof SOCIAL_SETTING_KEYS)[number];

export async function getSettings<K extends string>(keys: readonly K[]): Promise<Record<K, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: [...keys] } } });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<K, string>;
  for (const key of keys) {
    if (!(key in map)) map[key] = "";
  }
  return map;
}

export function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
