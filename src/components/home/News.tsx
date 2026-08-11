import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { localeHref } from "@/lib/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/dictionaries";

const dateLocales: Record<Locale, string> = { fr: "fr-FR", en: "en-US", ar: "ar" };

function formatDate(date: Date | null, lang: Locale) {
  if (!date) return "";
  return new Intl.DateTimeFormat(dateLocales[lang], { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function News({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (articles.length === 0) return null;

  return (
    <section id="actualites" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow={dict.home.news.eyebrow} title={dict.home.news.title} />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg"
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
                  <Link
                    href={localeHref(lang, `/actualites/${article.slug}`)}
                    className="font-semibold text-blue hover:text-blue-dark"
                  >
                    {dict.common.readArticle}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={localeHref(lang, "/actualites")}
            className="text-sm font-semibold text-blue hover:text-blue-dark"
          >
            {dict.common.seeAllArticles}
          </Link>
        </div>
      </Container>
    </section>
  );
}
