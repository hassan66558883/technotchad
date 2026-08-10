import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createCompanyValue, deleteCompanyValue } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Valeurs — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function Section({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: { id: string; title: string; description: string }[];
}) {
  return (
    <div className="rounded-2xl border border-line bg-white shadow-sm">
      <div className="border-b border-line px-6 py-4">
        <h2 className="text-sm font-semibold text-navy">{title}</h2>
        <p className="text-xs text-slate">{description}</p>
      </div>
      <div className="divide-y divide-line">
        {items.length === 0 && (
          <p className="px-6 py-6 text-sm text-slate">Aucun élément pour le moment.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-navy">{item.title}</p>
              <p className="mt-1 text-sm text-slate">{item.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <Link
                href={`/admin/valeurs/${item.id}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteCompanyValue.bind(null, item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ValeursPage() {
  const all = await prisma.companyValue.findMany({ orderBy: { order: "asc" } });
  const values = all.filter((v) => v.type === "VALUE");
  const whyUs = all.filter((v) => v.type === "WHY_US");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Valeurs & différenciateurs</h1>
        <p className="text-sm text-slate">
          « Nos valeurs » (page À propos) et « Pourquoi choisir TechnoTchad ? » (page d&apos;accueil).
        </p>
      </div>

      <form
        action={createCompanyValue}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <select
          name="type"
          required
          defaultValue="VALUE"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        >
          <option value="VALUE">Nos valeurs (À propos)</option>
          <option value="WHY_US">Pourquoi choisir TechnoTchad (Accueil)</option>
        </select>
        <input
          name="title"
          required
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="description"
          required
          rows={2}
          placeholder="Description"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="order"
          type="number"
          placeholder="Ordre"
          defaultValue={all.length}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter
        </button>
      </form>

      <Section
        title="Nos valeurs"
        description="Page À propos — section « Ce qui nous guide au quotidien »."
        items={values}
      />
      <Section
        title="Pourquoi choisir TechnoTchad ?"
        description="Page d'accueil — section juste avant les réalisations."
        items={whyUs}
      />
    </div>
  );
}
