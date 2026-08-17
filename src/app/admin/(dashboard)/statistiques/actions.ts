"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-locales";

function refresh() {
  revalidatePath("/admin/statistiques");
  revalidatePublicPath("");
}

export async function createStat(formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!label || !value) return;

  await prisma.stat.create({ data: { label, value, order } });
  refresh();
}

export async function updateStat(id: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!label || !value) return;

  await prisma.stat.update({ where: { id }, data: { label, value, order } });
  refresh();
  redirect("/admin/statistiques");
}

export async function deleteStat(id: string) {
  await prisma.stat.delete({ where: { id } });
  refresh();
}
