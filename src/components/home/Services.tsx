import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";

export default async function Services() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" }, take: 6 });

  return (
    <section className="bg-mist py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Nos solutions"
          title="Nos solutions technologiques"
          description="Un accompagnement complet, du réseau à la sécurité, du logiciel à la formation."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services#${service.slug}`}
              className="group rounded-2xl border border-line bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue/30"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-2xl">
                {service.icon}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {service.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue opacity-0 transition-opacity group-hover:opacity-100">
                En savoir plus →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="text-sm font-semibold text-blue hover:text-blue-dark"
          >
            Voir tous les services →
          </Link>
        </div>
      </Container>
    </section>
  );
}
