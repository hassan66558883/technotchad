import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createTeamMember, deleteTeamMember } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Équipe — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function EquipePage() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Équipe</h1>
        <p className="text-sm text-slate">
          Affichée dans la section « Notre équipe » de la page À propos.
        </p>
      </div>

      <form
        action={createTeamMember}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
      >
        <input
          name="name"
          required
          placeholder="Nom complet"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="role"
          required
          placeholder="Fonction"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="initials"
          required
          maxLength={2}
          placeholder="Initiales"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="order"
          type="number"
          placeholder="Ordre"
          defaultValue={team.length}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="sm:col-span-4 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un membre
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => (
          <div key={member.id} className="rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
              {member.initials}
            </span>
            <h3 className="mt-3 text-sm font-semibold text-navy">{member.name}</h3>
            <p className="mt-1 text-xs text-slate">{member.role}</p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Link
                href={`/admin/equipe/${member.id}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteTeamMember.bind(null, member.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
