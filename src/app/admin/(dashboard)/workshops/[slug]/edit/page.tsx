import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateWorkshop } from "../../actions";

export default async function EditWorkshopPage({
  params,
}: PageProps<"/admin/workshops/[slug]/edit">) {
  const { slug } = await params;
  const workshop = await prisma.workshop.findUnique({ where: { slug } });
  if (!workshop) notFound();

  const updateWithSlug = updateWorkshop.bind(null, workshop.slug);
  const dateValue = workshop.date.toISOString().slice(0, 10);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier le workshop</h1>

      <form
        action={updateWithSlug}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <input
          name="title"
          required
          defaultValue={workshop.title}
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={workshop.description}
          placeholder="Description"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="durationLabel"
          required
          defaultValue={workshop.durationLabel}
          placeholder="Durée"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="schedule"
          required
          defaultValue={workshop.schedule}
          placeholder="Horaire"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="date"
          type="date"
          required
          defaultValue={dateValue}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="seats"
          type="number"
          required
          min={1}
          defaultValue={workshop.seats}
          placeholder="Places"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <select
          name="status"
          defaultValue={workshop.status}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          <option value="UPCOMING">À venir</option>
          <option value="COMPLETED">Terminé</option>
          <option value="CANCELLED">Annulé</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="requiresFullPayment"
            defaultChecked={workshop.requiresFullPayment}
            className="h-4 w-4 rounded border-line"
          />
          Paiement intégral requis avant émission du certificat
        </label>
        <button
          type="submit"
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
