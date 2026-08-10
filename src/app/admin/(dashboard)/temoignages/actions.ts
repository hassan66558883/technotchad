"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function refresh() {
  revalidatePath("/admin/temoignages");
  revalidatePath("/");
}

export async function createTestimonial(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5) || 5));
  const approved = formData.get("approved") === "on";
  if (!name || !text) return;

  await prisma.testimonial.create({
    data: { name, role: role || null, text, rating, approved, publishedAt: approved ? new Date() : null },
  });
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
  refresh();
  redirect("/admin/temoignages");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  refresh();
}
