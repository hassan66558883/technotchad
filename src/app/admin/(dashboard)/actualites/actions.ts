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

const validStatuses = new Set(["DRAFT", "PUBLISHED"]);

function refresh(slug?: string) {
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  revalidatePath("/");
  if (slug) revalidatePath(`/actualites/${slug}`);
}

export async function createArticle(formData: FormData) {
  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const status = String(formData.get("status") ?? "DRAFT");
  if (!category || !title || !excerpt || !content || !validStatuses.has(status)) return;

  const slug = slugify(title);
  await prisma.article.create({
    data: {
      slug,
      category,
      title,
      excerpt,
      content,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
  refresh(slug);
}

export async function updateArticle(slug: string, formData: FormData) {
  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const status = String(formData.get("status") ?? "DRAFT");
  if (!category || !title || !excerpt || !content || !validStatuses.has(status)) return;

  const existing = await prisma.article.findUnique({ where: { slug } });
  await prisma.article.update({
    where: { slug },
    data: {
      category,
      title,
      excerpt,
      content,
      status,
      publishedAt: status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : null,
    },
  });
  refresh(slug);
  redirect("/admin/actualites");
}

export async function deleteArticle(slug: string) {
  await prisma.article.delete({ where: { slug } });
  refresh(slug);
}
