"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SOCIAL_SETTING_KEYS } from "@/lib/settings";

export async function updateSocialSettings(formData: FormData) {
  for (const key of SOCIAL_SETTING_KEYS) {
    const value = String(formData.get(key) ?? "").trim();
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath("/admin/parametres");
  revalidatePath("/");
}
