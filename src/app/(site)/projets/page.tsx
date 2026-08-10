import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Projets — TechnoTchad",
  description: "Les réalisations de TechnoTchad pour des entreprises et institutions au Tchad.",
};

export const dynamic = "force-dynamic";

export default async function ProjetsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="bg-hero-gradient py-16 text-white sm:py-20">
        <Container>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan">
            Projets
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
            Des réalisations concrètes pour nos clients
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            CCTV, réseaux, ERP, développement web : découvrez quelques projets
            menés par TechnoTchad.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading title="Nos réalisations" align="left" />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projets/${project.slug}`}
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
                    Voir le projet →
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
