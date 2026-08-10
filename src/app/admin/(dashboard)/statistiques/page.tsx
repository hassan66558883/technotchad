import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createStat, deleteStat } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Statistiques — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function StatistiquesPage() {
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">
          Statistiques de la page d&apos;accueil
        </h1>
        <p className="text-sm text-slate">
          Les compteurs affichés juste sous le hero (ex. « 100+ Étudiants »).
        </p>
      </div>

      <form
        action={createStat}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
      >
        <input
          name="value"
          required
          placeholder="Valeur (ex. 100+)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="label"
          required
          placeholder="Libellé (ex. Étudiants)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="order"
          type="number"
          placeholder="Ordre"
          defaultValue={stats.length}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="sm:col-span-4 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter une statistique
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-navy">{stat.value}</p>
            <p className="mt-1 text-sm text-slate">{stat.label}</p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/admin/statistiques/${stat.id}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteStat.bind(null, stat.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
