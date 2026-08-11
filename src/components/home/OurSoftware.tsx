import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { localeHref } from "@/lib/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/dictionaries";

export default async function OurSoftware({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const software = await prisma.software.findMany({ orderBy: { order: "asc" }, take: 3 });

  if (software.length === 0) return null;

  return (
    <section id="logiciels" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={dict.home.software.eyebrow}
          title={dict.home.software.title}
          description={dict.home.software.description}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {software.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl border border-line bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-2xl">
                {item.icon}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={localeHref(lang, "/logiciels")}
            className="text-sm font-semibold text-blue hover:text-blue-dark"
          >
            {dict.common.seeAllSoftware}
          </Link>
        </div>
      </Container>
    </section>
  );
}
