import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateStat } from "../../actions";

export default async function EditStatPage({
  params,
}: PageProps<"/admin/statistiques/[id]/edit">) {
  const { id } = await params;
  const stat = await prisma.stat.findUnique({ where: { id } });
  if (!stat) notFound();

  const updateWithId = updateStat.bind(null, stat.id);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier la statistique</h1>

      <form
        action={updateWithId}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <input
          name="value"
          required
          defaultValue={stat.value}
          placeholder="Valeur"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="label"
          required
          defaultValue={stat.label}
          placeholder="Libellé"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="order"
          type="number"
          defaultValue={stat.order}
          placeholder="Ordre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
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
