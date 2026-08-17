"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-locales";

function refresh() {
  revalidatePath("/admin/equipe");
  revalidatePublicPath("/a-propos");
}

export async function createTeamMember(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const initials = String(formData.get("initials") ?? "").trim().toUpperCase();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!name || !role || !initials) return;

  await prisma.teamMember.create({ data: { name, role, initials, order } });
  refresh();
}

export async function updateTeamMember(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const initials = String(formData.get("initials") ?? "").trim().toUpperCase();
  const order = Number(formData.get("order") ?? 0) || 0;
  if (!name || !role || !initials) return;

  await prisma.teamMember.update({ where: { id }, data: { name, role, initials, order } });
  refresh();
  redirect("/admin/equipe");
}

export async function deleteTeamMember(id: string) {
  await prisma.teamMember.delete({ where: { id } });
  refresh();
}
