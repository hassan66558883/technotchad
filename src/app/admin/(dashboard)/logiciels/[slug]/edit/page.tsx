import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateSoftware } from "../../actions";

export default async function EditSoftwarePage({
  params,
}: PageProps<"/admin/logiciels/[slug]/edit">) {
  const { slug } = await params;
  const software = await prisma.software.findUnique({ where: { slug } });
  if (!software) notFound();

  const updateWithSlug = updateSoftware.bind(null, software.slug);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier le logiciel</h1>

      <form
        action={updateWithSlug}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <input
          name="icon"
          required
          defaultValue={software.icon}
          placeholder="Icône (emoji)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="name"
          required
          defaultValue={software.name}
          placeholder="Nom du logiciel"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={software.description}
          placeholder="Description"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="order"
          type="number"
          defaultValue={software.order}
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
