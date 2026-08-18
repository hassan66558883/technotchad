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
  revalidatePath("/admin/logiciels");
  revalidatePublicPath("/logiciels");
  revalidatePublicPath("");
}

export async function createSoftware(formData: FormData) {
  const icon = String(formData.get("icon") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!icon || !name || !description) return;

  const slug = slugify(name);
  await prisma.software.create({ data: { slug, icon, name, description, order } });
  await logActivity({ action: `Logiciel créé (${name})`, entityType: "Logiciel", entityId: slug });
  refresh();
}

export async function updateSoftware(slug: string, formData: FormData) {
  const icon = String(formData.get("icon") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!icon || !name || !description) return;

  await prisma.software.update({ where: { slug }, data: { icon, name, description, order } });
  await logActivity({ action: `Logiciel modifié (${name})`, entityType: "Logiciel", entityId: slug });
  refresh();
  redirect("/admin/logiciels");
}

export async function deleteSoftware(slug: string) {
  await prisma.software.delete({ where: { slug } });
  await logActivity({ action: "Logiciel supprimé", entityType: "Logiciel", entityId: slug });
  refresh();
}
