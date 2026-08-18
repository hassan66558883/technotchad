"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ABOUT_SETTING_KEYS } from "@/lib/settings";
import { revalidatePublicPath } from "@/lib/revalidate-locales";
import { logActivity } from "@/lib/activityLog";

export async function updateAboutSettings(formData: FormData) {
  for (const key of ABOUT_SETTING_KEYS) {
    const value = String(formData.get(key) ?? "").trim();
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  await logActivity({ action: "Contenu « À propos » modifié", entityType: "Pages" });

  revalidatePath("/admin/pages");
  revalidatePublicPath("/a-propos");
}
