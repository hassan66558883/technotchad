import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n/config";
import { localeHref } from "@/lib/locale-link";

// See src/app/[lang]/(site)/page.tsx for why this is set explicitly.
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[lang]/projets">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.pages.projets.eyebrow} — TechnoTchad`, description: dict.pages.projets.description };
}

export default async function ProjetsPage({ params }: PageProps<"/[lang]/projets">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.pages.projets;

  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="bg-hero-gradient py-16 text-white sm:py-20">
        <Container>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan">
            {p.eyebrow}
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
            {p.title}
          </h1>
          <p className="mt-4 max-w-xl text-white/70">{p.description}</p>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading title={p.sectionTitle} align="left" />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={localeHref(lang, `/projets/${project.slug}`)}
                className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex h-40 items-center justify-center bg-navy-2 text-5xl text-white">
                  {project.coverImage}
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wide text-blue">
                    {project.category}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-navy">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate">{project.client}</p>
                  <p className="text-xs text-slate/70">{project.location}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue opacity-0 transition-opacity group-hover:opacity-100">
                    {dict.common.viewProject}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
