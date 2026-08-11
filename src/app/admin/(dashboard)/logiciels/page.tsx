import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createSoftware, deleteSoftware } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Logiciels — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function AdminLogicielsPage() {
  const software = await prisma.software.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Logiciels</h1>
        <p className="text-sm text-slate">
          Affichés sur la page d&apos;accueil et sur /logiciels.
        </p>
      </div>

      <form
        action={createSoftware}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
      >
        <input
          name="icon"
          required
          placeholder="Icône (emoji)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="name"
          required
          placeholder="Nom du logiciel"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="order"
          type="number"
          placeholder="Ordre"
          defaultValue={software.length}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="description"
          required
          rows={2}
          placeholder="Description"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-4"
        />
        <button
          type="submit"
          className="sm:col-span-4 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un logiciel
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {software.map((item) => (
          <div key={item.slug} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <span className="text-2xl">{item.icon}</span>
            <h3 className="mt-3 text-sm font-semibold text-navy">{item.name}</h3>
            <p className="mt-2 text-sm text-slate">{item.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/admin/logiciels/${item.slug}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteSoftware.bind(null, item.slug)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
