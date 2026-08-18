"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLog";

function refresh() {
  revalidatePath("/admin/galerie");
}

export async function createGalleryImage(formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!url) return;

  const image = await prisma.galleryImage.create({
    data: { url, caption: caption || null, category: category || null },
  });
  await logActivity({ action: "Image ajoutée à la galerie", entityType: "Galerie", entityId: image.id });
  refresh();
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  await logActivity({ action: "Image supprimée de la galerie", entityType: "Galerie", entityId: id });
  refresh();
}
