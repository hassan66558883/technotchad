"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-locales";

const DIACRITICS_PATTERN = new RegExp(String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f), "g");

function slugify(input: string) {
  const normalized = input.toLowerCase().normalize("NFD");
  const stripped = normalized.replace(new RegExp("[" + DIACRITICS_PATTERN.source + "]", "g"), "");
  return stripped.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function refresh() {
  revalidatePath("/admin/services");
  revalidatePublicPath("/services");
  revalidatePublicPath("");
}

export async function createService(formData: FormData) {
  const icon = String(formData.get("icon") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!icon || !title || !description) return;

  const slug = slugify(title);
  await prisma.service.create({ data: { slug, icon, title, description, order } });
  refresh();
}

export async function updateService(slug: string, formData: FormData) {
  const icon = String(formData.get("icon") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!icon || !title || !description) return;

  await prisma.service.update({ where: { slug }, data: { icon, title, description, order } });
  refresh();
  redirect("/admin/services");
}

export async function deleteService(slug: string) {
  await prisma.service.delete({ where: { slug } });
  refresh();
}
