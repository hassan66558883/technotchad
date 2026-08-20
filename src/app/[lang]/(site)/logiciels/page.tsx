import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n/config";

// See src/app/[lang]/(site)/page.tsx for why this is set explicitly.
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/[lang]/logiciels">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.pages.logiciels.eyebrow} — TechnoTchad`, description: dict.pages.logiciels.description };
}

export default async function LogicielsPage({ params }: PageProps<"/[lang]/logiciels">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.pages.logiciels;

  const software = await prisma.software.findMany({ orderBy: { order: "asc" } });

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
            {software.map((item) => (
              <div
                key={item.slug}
                id={item.slug}
                className="scroll-mt-24 rounded-2xl border border-line bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue/10 text-2xl">
                  {item.icon}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-navy">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
