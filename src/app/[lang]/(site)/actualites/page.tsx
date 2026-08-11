import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { localeHref } from "@/lib/locale-link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[lang]/actualites">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.pages.actualites.eyebrow} — TechnoTchad`, description: dict.pages.actualites.description };
}

const dateLocales: Record<Locale, string> = { fr: "fr-FR", en: "en-US", ar: "ar" };

function formatDate(date: Date | null, lang: Locale) {
  if (!date) return "";
  return new Intl.DateTimeFormat(dateLocales[lang], { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function ActualitesPage({ params }: PageProps<"/[lang]/actualites">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.pages.actualites;

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

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
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={localeHref(lang, `/actualites/${article.slug}`)}
                className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex h-36 items-center justify-center bg-mist-2 text-3xl">
                  📰
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wide text-blue">
                    {article.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-navy">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate/70">{formatDate(article.publishedAt, lang)}</span>
                    <span className="font-semibold text-blue opacity-0 transition-opacity group-hover:opacity-100">
                      {dict.common.read}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
