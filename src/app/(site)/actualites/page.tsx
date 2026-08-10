import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Actualités — TechnoTchad",
  description: "Les actualités de TechnoTchad : formations, technologie, cybersécurité, réseaux, ERP.",
};

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export default async function ActualitesPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="bg-hero-gradient py-16 text-white sm:py-20">
        <Container>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan">
            Actualités
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
            Les dernières actualités TechnoTchad
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            Formations, technologie, cybersécurité, réseaux et ERP : suivez
            l&apos;actualité de TechnoTchad.
          </p>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading title="Tous les articles" align="left" />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/actualites/${article.slug}`}
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
                    <span className="text-slate/70">{formatDate(article.publishedAt)}</span>
                    <span className="font-semibold text-blue opacity-0 transition-opacity group-hover:opacity-100">
                      Lire →
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
