"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const validTypes = new Set(["VALUE", "WHY_US"]);

function refresh() {
  revalidatePath("/admin/valeurs");
  revalidatePath("/a-propos");
  revalidatePath("/");
}

export async function createCompanyValue(formData: FormData) {
  const type = String(formData.get("type") ?? "VALUE");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!validTypes.has(type) || !title || !description) return;

  await prisma.companyValue.create({ data: { type, title, description, order } });
  refresh();
}

export async function updateCompanyValue(id: string, formData: FormData) {
  const type = String(formData.get("type") ?? "VALUE");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!validTypes.has(type) || !title || !description) return;

  await prisma.companyValue.update({ where: { id }, data: { type, title, description, order } });
  refresh();
  redirect("/admin/valeurs");
}

export async function deleteCompanyValue(id: string) {
  await prisma.companyValue.delete({ where: { id } });
  refresh();
}
