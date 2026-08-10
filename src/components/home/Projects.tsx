import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";

export default async function Projects() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <section id="projets" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Réalisations"
          title="Nos réalisations"
          description="Un aperçu de projets menés pour des entreprises et institutions au Tchad."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projets/${project.slug}`}
              className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex h-32 items-center justify-center bg-navy-2 text-4xl text-white">
                {project.coverImage}
              </div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wide text-blue">
                  {project.category}
                </span>
                <h3 className="mt-2 text-base font-semibold text-navy">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-slate">{project.client}</p>
                <p className="text-xs text-slate/70">{project.location}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projets"
            className="text-sm font-semibold text-blue hover:text-blue-dark"
          >
            Voir tous les projets →
          </Link>
        </div>
      </Container>
    </section>
  );
}
