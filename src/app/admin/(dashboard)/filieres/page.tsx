import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createFiliere, deleteFiliere } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Filières — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function AdminFilieresPage() {
  const filieres = await prisma.filiere.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Filières</h1>
        <p className="text-sm text-slate">
          Le catalogue de filières affiché sur la page Formations.
        </p>
      </div>

      <form
        action={createFiliere}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
      >
        <input
          name="icon"
          required
          placeholder="Icône (emoji)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="title"
          required
          placeholder="Titre de la filière"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="order"
          type="number"
          placeholder="Ordre"
          defaultValue={filieres.length}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="topics"
          required
          placeholder="Sujets, séparés par des virgules (ex. CCNA, CCNP, MCSA)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-4"
        />
        <button
          type="submit"
          className="sm:col-span-4 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter une filière
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filieres.map((filiere) => (
          <div key={filiere.slug} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <span className="text-2xl">{filiere.icon}</span>
            <h3 className="mt-3 text-sm font-semibold text-navy">{filiere.title}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {filiere.topics.split(",").map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-line bg-mist px-2.5 py-1 text-xs font-medium text-slate"
                >
                  {topic.trim()}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/admin/filieres/${filiere.slug}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteFiliere.bind(null, filiere.slug)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
