"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { ROLES } from "@/lib/roles";
import { logActivity } from "@/lib/activityLog";

async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session || session.role !== "SUPER_ADMIN") {
    throw new Error("Accès réservé aux Super Admins.");
  }
  return session;
}

function refresh() {
  revalidatePath("/admin/utilisateurs");
  revalidatePath("/admin/roles");
}

export type UserFormState = { error?: string } | undefined;

export async function createUser(_prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  const session = await requireSuperAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!name || !email || !password || !ROLES.includes(role as (typeof ROLES)[number])) {
    return { error: "Merci de remplir tous les champs correctement." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un utilisateur avec cet email existe déjà." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: passwordHash, role } });

  await logActivity({
    userId: session.sub,
    action: `Création utilisateur (${role})`,
    entityType: "Utilisateur",
    entityId: user.id,
  });

  refresh();
  redirect("/admin/utilisateurs");
}

export async function updateUserRole(id: string, formData: FormData) {
  const session = await requireSuperAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  if (!name || !ROLES.includes(role as (typeof ROLES)[number])) return;

  if (id === session.sub && role !== "SUPER_ADMIN") {
    const otherSuperAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN", id: { not: id } },
    });
    if (otherSuperAdmins === 0) return;
  }

  await prisma.user.update({ where: { id }, data: { name, role } });
  await logActivity({
    userId: session.sub,
    action: `Modification rôle → ${role}`,
    entityType: "Utilisateur",
    entityId: id,
  });
  refresh();
  redirect("/admin/utilisateurs");
}

export async function resetUserPassword(id: string, formData: FormData) {
  const session = await requireSuperAdmin();

  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id }, data: { password: passwordHash } });
  await logActivity({
    userId: session.sub,
    action: "Réinitialisation mot de passe",
    entityType: "Utilisateur",
    entityId: id,
  });
  refresh();
  redirect("/admin/utilisateurs");
}

export async function deleteUser(id: string) {
  const session = await requireSuperAdmin();

  if (id === session.sub) return;

  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "SUPER_ADMIN") {
    const otherSuperAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN", id: { not: id } },
    });
    if (otherSuperAdmins === 0) return;
  }

  await prisma.user.delete({ where: { id } });
  await logActivity({
    userId: session.sub,
    action: `Suppression utilisateur (${target?.name ?? id})`,
    entityType: "Utilisateur",
    entityId: id,
  });
  refresh();
}
