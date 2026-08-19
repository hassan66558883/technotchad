import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createWorkshop, deleteWorkshop } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Workshops — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default async function AdminWorkshopsPage() {
  const workshops = await prisma.workshop.findMany({ orderBy: { date: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Workshops</h1>
        <p className="text-sm text-slate">
          Ateliers pratiques affichés sur la page d&apos;accueil.
        </p>
      </div>

      <form
        action={createWorkshop}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
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
          name="durationLabel"
          required
          placeholder="Durée (ex. 2 jours)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="schedule"
          required
          placeholder="Horaire (ex. 11h00 – 13h00)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="date"
          type="date"
          required
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="seats"
          type="number"
          required
          min={1}
          placeholder="Places"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <p className="text-xs text-slate/60 sm:col-span-2">
          Le paiement intégral est requis avant l&apos;émission du certificat pour tous les workshops.
        </p>
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un workshop
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {workshops.map((workshop) => (
          <div key={workshop.slug} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-navy">{workshop.title}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  workshop.status === "UPCOMING"
                    ? "bg-blue/10 text-blue"
                    : workshop.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {workshop.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate">{workshop.description}</p>
            <p className="mt-3 text-xs text-slate/70">
              {formatDate(workshop.date)} · {workshop.schedule} · {workshop.durationLabel} · {workshop.seats} places
            </p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/admin/workshops/${workshop.slug}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteWorkshop.bind(null, workshop.slug)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
