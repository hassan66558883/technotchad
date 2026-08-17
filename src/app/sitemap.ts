import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://technotchad.com";

const staticPaths = ["", "/services", "/formations", "/projets", "/logiciels", "/a-propos"];

function localizedEntry(path: string, lastModified?: Date) {
  return {
    url: `${siteUrl}/${locales[0]}${path}`,
    lastModified: lastModified ?? new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, `${siteUrl}/${locale}${path}`])),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({ select: { slug: true } });

  return [
    ...staticPaths.map((path) => localizedEntry(path)),
    ...projects.map((project) => localizedEntry(`/projets/${project.slug}`)),
  ];
}
