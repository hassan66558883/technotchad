"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-locales";
import { logActivity } from "@/lib/activityLog";

function refresh() {
  revalidatePath("/admin/partenaires");
  revalidatePublicPath("/a-propos");
}

export async function createPartner(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!name) return;

  const partner = await prisma.partner.create({ data: { name, order } });
  await logActivity({ action: `Partenaire ajouté (${name})`, entityType: "Partenaire", entityId: partner.id });
  refresh();
}

export async function updatePartner(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!name) return;

  await prisma.partner.update({ where: { id }, data: { name, order } });
  await logActivity({ action: `Partenaire modifié (${name})`, entityType: "Partenaire", entityId: id });
  refresh();
  redirect("/admin/partenaires");
}

export async function deletePartner(id: string) {
  await prisma.partner.delete({ where: { id } });
  await logActivity({ action: "Partenaire supprimé", entityType: "Partenaire", entityId: id });
  refresh();
}
