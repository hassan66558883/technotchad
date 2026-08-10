"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const DIACRITICS_PATTERN = new RegExp(String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f), "g");

function slugify(input: string) {
  const normalized = input.toLowerCase().normalize("NFD");
  const stripped = normalized.replace(new RegExp("[" + DIACRITICS_PATTERN.source + "]", "g"), "");
  return stripped.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function refresh() {
  revalidatePath("/admin/formations");
  revalidatePath("/formations");
  revalidatePath("/");
}

export async function createCourse(formData: FormData) {
  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const durationLabel = String(formData.get("durationLabel") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!category || !title || !description || !price || !durationLabel) return;

  const slug = slugify(title);
  await prisma.course.create({
    data: { slug, category, title, description, price, durationLabel, imageUrl: imageUrl || null },
  });
  refresh();
}

export async function updateCourse(slug: string, formData: FormData) {
  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const durationLabel = String(formData.get("durationLabel") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!category || !title || !description || !price || !durationLabel) return;

  await prisma.course.update({
    where: { slug },
    data: { category, title, description, price, durationLabel, imageUrl: imageUrl || null },
  });
  refresh();
  redirect("/admin/formations");
}

export async function deleteCourse(slug: string) {
  await prisma.attendance.deleteMany({ where: { courseSession: { courseSlug: slug } } });
  await prisma.registration.deleteMany({ where: { courseSession: { courseSlug: slug } } });
  await prisma.courseSession.deleteMany({ where: { courseSlug: slug } });
  await prisma.course.delete({ where: { slug } });
  refresh();
}

export async function createSession(formData: FormData) {
  const courseSlug = String(formData.get("courseSlug") ?? "").trim();
  const instructorId = String(formData.get("instructorId") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "").trim();
  const schedule = String(formData.get("schedule") ?? "").trim();
  const seats = Number(formData.get("seats") ?? 0) || 0;
  if (!courseSlug || !startDate || !schedule || seats <= 0) return;

  await prisma.courseSession.create({
    data: {
      courseSlug,
      instructorId: instructorId || null,
      startDate: new Date(startDate),
      schedule,
      seats,
      status: "UPCOMING",
    },
  });
  refresh();
}

export async function updateSession(id: string, formData: FormData) {
  const instructorId = String(formData.get("instructorId") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "").trim();
  const schedule = String(formData.get("schedule") ?? "").trim();
  const seats = Number(formData.get("seats") ?? 0) || 0;
  const status = String(formData.get("status") ?? "UPCOMING");
  if (!startDate || !schedule || seats <= 0) return;

  await prisma.courseSession.update({
    where: { id },
    data: { instructorId: instructorId || null, startDate: new Date(startDate), schedule, seats, status },
  });
  refresh();
  redirect("/admin/formations");
}

export async function deleteSession(id: string) {
  await prisma.attendance.deleteMany({ where: { courseSessionId: id } });
  await prisma.registration.deleteMany({ where: { courseSessionId: id } });
  await prisma.courseSession.delete({ where: { id } });
  refresh();
}
