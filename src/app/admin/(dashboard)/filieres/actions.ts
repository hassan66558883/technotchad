"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-locales";
import { logActivity } from "@/lib/activityLog";

const DIACRITICS_PATTERN = new RegExp(String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f), "g");

function slugify(input: string) {
  const normalized = input.toLowerCase().normalize("NFD");
  const stripped = normalized.replace(new RegExp("[" + DIACRITICS_PATTERN.source + "]", "g"), "");
  return stripped.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function refresh() {
  revalidatePath("/admin/filieres");
  revalidatePublicPath("/formations");
}

export async function createFiliere(formData: FormData) {
  const icon = String(formData.get("icon") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const topics = String(formData.get("topics") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!icon || !title || !topics) return;

  const slug = slugify(title);
  await prisma.filiere.create({ data: { slug, icon, title, topics, order } });
  await logActivity({ action: `Filière créée (${title})`, entityType: "Filière", entityId: slug });
  refresh();
}

export async function updateFiliere(slug: string, formData: FormData) {
  const icon = String(formData.get("icon") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const topics = String(formData.get("topics") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!icon || !title || !topics) return;

  await prisma.filiere.update({ where: { slug }, data: { icon, title, topics, order } });
  await logActivity({ action: `Filière modifiée (${title})`, entityType: "Filière", entityId: slug });
  refresh();
  redirect("/admin/filieres");
}

export async function deleteFiliere(slug: string) {
  await prisma.filiere.delete({ where: { slug } });
  await logActivity({ action: "Filière supprimée", entityType: "Filière", entityId: slug });
  refresh();
}
