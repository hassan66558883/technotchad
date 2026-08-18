"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-locales";
import { logActivity } from "@/lib/activityLog";

function refresh() {
  revalidatePath("/admin/temoignages");
  revalidatePublicPath("");
}

export async function createTestimonial(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5) || 5));
  const approved = formData.get("approved") === "on";
  if (!name || !text) return;

  const testimonial = await prisma.testimonial.create({
    data: { name, role: role || null, text, rating, approved, publishedAt: approved ? new Date() : null },
  });
  await logActivity({ action: `Témoignage ajouté (${name})`, entityType: "Témoignage", entityId: testimonial.id });
  refresh();
}

export async function updateTestimonial(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5) || 5));
  const approved = formData.get("approved") === "on";
  if (!name || !text) return;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  await prisma.testimonial.update({
    where: { id },
    data: {
      name,
      role: role || null,
      text,
      rating,
      approved,
      publishedAt: approved ? (existing?.publishedAt ?? new Date()) : null,
    },
  });
  await logActivity({ action: `Témoignage modifié (${name})`, entityType: "Témoignage", entityId: id });
  refresh();
  redirect("/admin/temoignages");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  await logActivity({ action: "Témoignage supprimé", entityType: "Témoignage", entityId: id });
  refresh();
}
