import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateArticle } from "../../actions";

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/actualites/[slug]/edit">) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) notFound();

  const updateWithSlug = updateArticle.bind(null, article.slug);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier l&apos;article</h1>

      <form
        action={updateWithSlug}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <input
          name="category"
          required
          defaultValue={article.category}
          placeholder="Catégorie"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <select
          name="status"
          defaultValue={article.status}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publié</option>
        </select>
        <input
          name="title"
          required
          defaultValue={article.title}
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={article.excerpt}
          placeholder="Résumé"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="content"
          required
          rows={8}
          defaultValue={article.content}
          placeholder="Contenu"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
