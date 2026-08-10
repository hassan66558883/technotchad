import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function News() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (articles.length === 0) return null;

  return (
    <section id="actualites" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Actualités" title="Actualités TechnoTchad" />

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
                  <span className="text-slate/70">{formatDate(article.publishedAt)}</span>
                  <Link
                    href={`/actualites/${article.slug}`}
                    className="font-semibold text-blue hover:text-blue-dark"
                  >
                    Lire l&apos;article →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/actualites"
            className="text-sm font-semibold text-blue hover:text-blue-dark"
          >
            Voir toutes les actualités →
          </Link>
        </div>
      </Container>
    </section>
  );
}
