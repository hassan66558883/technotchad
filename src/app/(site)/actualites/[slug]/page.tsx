import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

export async function generateMetadata({ params }: PageProps<"/actualites/[slug]">) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  return { title: article ? `${article.title} — TechnoTchad` : "Article — TechnoTchad" };
}

export default async function ArticleDetailPage({
  params,
}: PageProps<"/actualites/[slug]">) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article || article.status !== "PUBLISHED") notFound();

  const related = await prisma.article.findMany({
    where: { slug: { not: article.slug }, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 2,
  });

  const paragraphs = article.content.split("\n\n").filter(Boolean);

  return (
    <>
      <section className="bg-navy-2 py-16 text-white sm:py-20">
        <Container className="max-w-3xl">
          <Link href="/actualites" className="text-sm text-white/60 hover:text-cyan">
            ← Toutes les actualités
          </Link>
          <span className="mt-4 block text-xs font-bold uppercase tracking-widest text-cyan">
            {article.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-white/60">{formatDate(article.publishedAt)}</p>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="flex h-56 items-center justify-center rounded-2xl bg-mist text-6xl">
            📰
          </div>

          <div className="mt-10 space-y-5">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-slate">
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/#contact"
            className="mt-10 inline-flex rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-dark"
          >
            Nous contacter
          </Link>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-mist py-16">
          <Container className="max-w-3xl">
            <h2 className="text-lg font-bold text-navy">À lire aussi</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/actualites/${a.slug}`}
                  className="rounded-2xl border border-line bg-white p-5 shadow-sm hover:shadow-lg"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-blue">
                    {a.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-navy">
                    {a.title}
                  </h3>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
