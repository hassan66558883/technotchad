import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateFiliere } from "../../actions";

export default async function EditFilierePage({
  params,
}: PageProps<"/admin/filieres/[slug]/edit">) {
  const { slug } = await params;
  const filiere = await prisma.filiere.findUnique({ where: { slug } });
  if (!filiere) notFound();

  const updateWithSlug = updateFiliere.bind(null, filiere.slug);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier la filière</h1>

      <form
        action={updateWithSlug}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <input
          name="icon"
          required
          defaultValue={filiere.icon}
          placeholder="Icône (emoji)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="title"
          required
          defaultValue={filiere.title}
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="topics"
          required
          defaultValue={filiere.topics}
          placeholder="Sujets, séparés par des virgules"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="order"
          type="number"
          defaultValue={filiere.order}
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
