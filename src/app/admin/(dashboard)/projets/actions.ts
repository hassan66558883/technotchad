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

function refresh(slug?: string) {
  revalidatePath("/admin/projets");
  revalidatePublicPath("/projets");
  revalidatePublicPath("");
  if (slug) revalidatePublicPath(`/projets/${slug}`);
}

function readProjectForm(formData: FormData) {
  return {
    category: String(formData.get("category") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    client: String(formData.get("client") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    coverImage: String(formData.get("coverImage") ?? "").trim(),
    problem: String(formData.get("problem") ?? "").trim(),
    solution: String(formData.get("solution") ?? "").trim(),
    results: String(formData.get("results") ?? "").trim(),
    technologies: String(formData.get("technologies") ?? "").trim(),
    gallery: String(formData.get("gallery") ?? "").trim(),
  };
}

export async function createProject(formData: FormData) {
  const f = readProjectForm(formData);
  if (!f.category || !f.title || !f.client || !f.location) return;

  const slug = slugify(f.title);
  const galleryUrls = f.gallery
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.project.create({
    data: {
      slug,
      category: f.category,
      title: f.title,
      client: f.client,
      location: f.location,
      coverImage: f.coverImage || null,
      problem: f.problem,
      solution: f.solution,
      results: f.results,
      technologies: f.technologies,
      images: { create: galleryUrls.map((url) => ({ url })) },
    },
  });
  refresh(slug);
}

export async function updateProject(slug: string, formData: FormData) {
  const f = readProjectForm(formData);
  if (!f.category || !f.title || !f.client || !f.location) return;

  const galleryUrls = f.gallery
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  await prisma.projectImage.deleteMany({ where: { projectSlug: slug } });
  await prisma.project.update({
    where: { slug },
    data: {
      category: f.category,
      title: f.title,
      client: f.client,
      location: f.location,
      coverImage: f.coverImage || null,
      problem: f.problem,
      solution: f.solution,
      results: f.results,
      technologies: f.technologies,
      images: { create: galleryUrls.map((url) => ({ url })) },
    },
  });
  refresh(slug);
  redirect("/admin/projets");
}

export async function deleteProject(slug: string) {
  await prisma.projectImage.deleteMany({ where: { projectSlug: slug } });
  await prisma.project.delete({ where: { slug } });
  refresh(slug);
}
