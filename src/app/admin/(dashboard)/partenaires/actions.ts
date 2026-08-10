"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function refresh() {
  revalidatePath("/admin/partenaires");
  revalidatePath("/a-propos");
}

export async function createPartner(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!name) return;

  await prisma.partner.create({ data: { name, order } });
  refresh();
}

export async function updatePartner(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!name) return;

  await prisma.partner.update({ where: { id }, data: { name, order } });
  refresh();
  redirect("/admin/partenaires");
}

export async function deletePartner(id: string) {
  await prisma.partner.delete({ where: { id } });
  refresh();
}
