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

const validStatuses = new Set(["UPCOMING", "COMPLETED", "CANCELLED"]);

function refresh() {
  revalidatePath("/admin/workshops");
  revalidatePublicPath("/formations");
  revalidatePublicPath("");
}

function readWorkshopForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    durationLabel: String(formData.get("durationLabel") ?? "").trim(),
    schedule: String(formData.get("schedule") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    seats: Number(formData.get("seats") ?? 0) || 0,
    status: String(formData.get("status") ?? "UPCOMING"),
  };
}

export async function createWorkshop(formData: FormData) {
  const f = readWorkshopForm(formData);
  if (!f.title || !f.description || !f.durationLabel || !f.schedule || !f.date || f.seats <= 0) return;

  const slug = slugify(f.title);
  await prisma.workshop.create({
    data: {
      slug,
      title: f.title,
      description: f.description,
      durationLabel: f.durationLabel,
      schedule: f.schedule,
      date: new Date(f.date),
      seats: f.seats,
      status: validStatuses.has(f.status) ? f.status : "UPCOMING",
    },
  });
  refresh();
}

export async function updateWorkshop(slug: string, formData: FormData) {
  const f = readWorkshopForm(formData);
  if (!f.title || !f.description || !f.durationLabel || !f.schedule || !f.date || f.seats <= 0) return;

  await prisma.workshop.update({
    where: { slug },
    data: {
      title: f.title,
      description: f.description,
      durationLabel: f.durationLabel,
      schedule: f.schedule,
      date: new Date(f.date),
      seats: f.seats,
      status: validStatuses.has(f.status) ? f.status : "UPCOMING",
    },
  });
  refresh();
  redirect("/admin/workshops");
}

export async function deleteWorkshop(slug: string) {
  await prisma.registration.deleteMany({ where: { workshopSlug: slug } });
  await prisma.workshop.delete({ where: { slug } });
  refresh();
}
