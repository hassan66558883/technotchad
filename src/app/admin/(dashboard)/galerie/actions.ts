"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function refresh() {
  revalidatePath("/admin/galerie");
}

export async function createGalleryImage(formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!url) return;

  await prisma.galleryImage.create({
    data: { url, caption: caption || null, category: category || null },
  });
  refresh();
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  refresh();
}
