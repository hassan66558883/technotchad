import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createArticle, deleteArticle } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Actualités — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default async function AdminActualitesPage() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Actualités</h1>
        <p className="text-sm text-slate">
          Seuls les articles publiés apparaissent sur le site public.
        </p>
      </div>

      <form
        action={createArticle}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <input
          name="category"
          required
          placeholder="Catégorie (ex. Formation)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <select
          name="status"
          defaultValue="DRAFT"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publié</option>
        </select>
        <input
          name="title"
          required
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="excerpt"
          required
          rows={2}
          placeholder="Résumé (affiché dans les cartes)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="content"
          required
          rows={6}
          placeholder="Contenu — un paragraphe par ligne vide"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un article
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate">
              <th className="px-6 py-3 font-semibold">Titre</th>
              <th className="px-6 py-3 font-semibold">Catégorie</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Statut</th>
              <th className="px-6 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.slug} className="border-t border-line">
                <td className="px-6 py-3.5 font-medium text-navy">{article.title}</td>
                <td className="px-6 py-3.5 text-ink/80">{article.category}</td>
                <td className="px-6 py-3.5 text-ink/80">{formatDate(article.publishedAt)}</td>
                <td className="px-6 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      article.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {article.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/actualites/${article.slug}/edit`}
                      className="text-xs font-semibold text-blue hover:text-blue-dark"
                    >
                      Modifier
                    </Link>
                    <DeleteButton action={deleteArticle.bind(null, article.slug)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
