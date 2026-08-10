import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTeamMember } from "../../actions";

export default async function EditTeamMemberPage({
  params,
}: PageProps<"/admin/equipe/[id]/edit">) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  const updateWithId = updateTeamMember.bind(null, member.id);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier le membre de l&apos;équipe</h1>

      <form
        action={updateWithId}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <input
          name="name"
          required
          defaultValue={member.name}
          placeholder="Nom complet"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="role"
          required
          defaultValue={member.role}
          placeholder="Fonction"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="initials"
          required
          maxLength={2}
          defaultValue={member.initials}
          placeholder="Initiales"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="order"
          type="number"
          defaultValue={member.order}
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
