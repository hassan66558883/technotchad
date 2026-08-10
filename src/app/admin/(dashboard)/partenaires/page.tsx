import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createPartner, deletePartner } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Partenaires — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function PartenairesPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Partenaires</h1>
        <p className="text-sm text-slate">
          Affichés dans la section « Nos partenaires » de la page À propos.
        </p>
      </div>

      <form
        action={createPartner}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
      >
        <input
          name="name"
          required
          placeholder="Nom du partenaire"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-3"
        />
        <input
          name="order"
          type="number"
          placeholder="Ordre"
          defaultValue={partners.length}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="sm:col-span-4 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un partenaire
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="divide-y divide-line">
          {partners.map((partner) => (
            <div key={partner.id} className="flex items-center justify-between px-6 py-3.5">
              <span className="text-sm font-medium text-navy">{partner.name}</span>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/partenaires/${partner.id}/edit`}
                  className="text-xs font-semibold text-blue hover:text-blue-dark"
                >
                  Modifier
                </Link>
                <DeleteButton action={deletePartner.bind(null, partner.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
