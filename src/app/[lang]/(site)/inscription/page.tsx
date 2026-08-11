import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import RegistrationForm from "@/components/RegistrationForm";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n/config";
import { localeHref } from "@/lib/locale-link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[lang]/inscription">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.pages.inscription.eyebrow} — TechnoTchad` };
}

export default async function InscriptionPage({
  params,
  searchParams,
}: PageProps<"/[lang]/inscription">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.pages.inscription;

  const sp = await searchParams;
  const type = sp.type === "workshop" ? "workshop" : "course";
  const slug = typeof sp.slug === "string" ? sp.slug : "";

  const course = type === "course" && slug ? await prisma.course.findUnique({ where: { slug } }) : null;
  const workshop = type === "workshop" && slug ? await prisma.workshop.findUnique({ where: { slug } }) : null;
  const item = course ?? workshop;

  if (!item) {
    return (
      <section className="bg-white py-24">
        <Container className="max-w-xl text-center">
          <h1 className="text-2xl font-bold text-navy">{p.notFoundTitle}</h1>
          <p className="mt-3 text-slate">{p.notFoundText}</p>
          <Link
            href={localeHref(lang, "/formations")}
            className="mt-6 inline-flex rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-dark"
          >
            {p.seeFormations}
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-mist py-16 sm:py-20">
      <Container className="max-w-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-blue">
          {p.eyebrow}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy">
          {item.title}
        </h1>
        <p className="mt-2 text-sm text-slate">
          {"category" in item ? item.category : p.workshopLabel} · {item.durationLabel}
        </p>

        <div className="mt-8">
          <RegistrationForm type={type} slug={slug} dict={dict.pages.registrationForm} />
        </div>
      </Container>
    </section>
  );
}
