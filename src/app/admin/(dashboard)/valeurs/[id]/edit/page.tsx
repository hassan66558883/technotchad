import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCompanyValue } from "../../actions";

export default async function EditCompanyValuePage({
  params,
}: PageProps<"/admin/valeurs/[id]/edit">) {
  const { id } = await params;
  const value = await prisma.companyValue.findUnique({ where: { id } });
  if (!value) notFound();

  const updateWithId = updateCompanyValue.bind(null, value.id);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier</h1>

      <form
        action={updateWithId}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <select
          name="type"
          required
          defaultValue={value.type}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          <option value="VALUE">Nos valeurs (À propos)</option>
          <option value="WHY_US">Pourquoi choisir TechnoTchad (Accueil)</option>
        </select>
        <input
          name="title"
          required
          defaultValue={value.title}
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={value.description}
          placeholder="Description"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="order"
          type="number"
          defaultValue={value.order}
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
