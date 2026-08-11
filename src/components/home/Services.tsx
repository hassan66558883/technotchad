import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { localeHref } from "@/lib/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/dictionaries";

export default async function Services({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" }, take: 6 });

  return (
    <section className="bg-mist py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={dict.home.services.eyebrow}
          title={dict.home.services.title}
          description={dict.home.services.description}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={localeHref(lang, `/services#${service.slug}`)}
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
                {dict.common.learnMore}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={localeHref(lang, "/services")}
            className="text-sm font-semibold text-blue hover:text-blue-dark"
          >
            {dict.common.seeAllServices}
          </Link>
        </div>
      </Container>
    </section>
  );
}
