import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Services — TechnoTchad",
  description: "Toutes les solutions technologiques proposées par TechnoTchad.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="bg-hero-gradient py-16 text-white sm:py-20">
        <Container>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan">
            Services
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
            Des solutions technologiques complètes pour votre organisation
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Du réseau à la sécurité, du logiciel à la formation : TechnoTchad
            couvre l&apos;ensemble de vos besoins IT.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading title="Nos services" align="left" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.slug}
                id={service.slug}
                className="scroll-mt-24 rounded-2xl border border-line bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
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
                <Link
                  href="/#contact"
                  className="mt-5 inline-flex text-sm font-semibold text-blue hover:text-blue-dark"
                >
                  Demander un devis →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
