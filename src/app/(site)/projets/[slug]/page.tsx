import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  return { title: project ? `${project.title} — TechnoTchad` : "Projet — TechnoTchad" };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { images: true },
  });
  if (!project) notFound();

  const related = await prisma.project.findMany({
    where: { slug: { not: project.slug } },
    orderBy: { order: "asc" },
    take: 3,
  });

  const results = project.results.split("\n").filter(Boolean);
  const technologies = project.technologies.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <>
      <section className="bg-navy-2 py-16 text-white sm:py-20">
        <Container>
          <Link href="/projets" className="text-sm text-white/60 hover:text-cyan">
            ← Tous les projets
          </Link>
          <span className="mt-4 block text-xs font-bold uppercase tracking-widest text-cyan">
            {project.category}
          </span>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold tracking-tight">
            {project.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/70">
            <span>👤 {project.client}</span>
            <span>📍 {project.location}</span>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex h-56 items-center justify-center rounded-2xl bg-mist text-7xl">
              {project.coverImage}
            </div>

            <div>
              <h2 className="text-lg font-bold text-navy">Le besoin</h2>
              <p className="mt-3 text-base leading-relaxed text-slate">
                {project.problem}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-navy">Notre solution</h2>
              <p className="mt-3 text-base leading-relaxed text-slate">
                {project.solution}
              </p>
            </div>

            {results.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-navy">Résultats</h2>
                <ul className="mt-3 space-y-2">
                  {results.map((result) => (
                    <li key={result} className="flex items-start gap-2 text-base text-slate">
                      <span className="mt-1 text-blue">✓</span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.images.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-navy">Galerie</h2>
                <div className="mt-3 grid grid-cols-3 gap-4">
                  {project.images.map((image) => (
                    <div
                      key={image.id}
                      className="flex h-24 items-center justify-center rounded-xl bg-mist text-3xl"
                    >
                      {image.url}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {technologies.length > 0 && (
              <div className="rounded-2xl border border-line bg-mist p-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-blue">
                  Technologies
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/#contact"
              className="block rounded-full bg-blue px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-dark"
            >
              Démarrer un projet similaire
            </Link>
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-mist py-16">
          <Container>
            <h2 className="text-lg font-bold text-navy">Projets similaires</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/projets/${r.slug}`}
                  className="rounded-2xl border border-line bg-white p-5 shadow-sm hover:shadow-lg"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-blue">
                    {r.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-navy">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
