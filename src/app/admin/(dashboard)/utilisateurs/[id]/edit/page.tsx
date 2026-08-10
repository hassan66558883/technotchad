import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ROLES, ROLE_LABELS } from "@/lib/roles";
import { updateUserRole, resetUserPassword } from "../../actions";

export const metadata = { title: "Modifier l'utilisateur — Admin TechnoTchad" };

export default async function EditUserPage({
  params,
}: PageProps<"/admin/utilisateurs/[id]/edit">) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  const updateWithId = updateUserRole.bind(null, user.id);
  const resetWithId = resetUserPassword.bind(null, user.id);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier {user.name}</h1>

      <form
        action={updateWithId}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">Nom</label>
          <input
            name="name"
            required
            defaultValue={user.name}
            className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
        </div>
        <p className="text-xs text-slate/70">Email : {user.email} (non modifiable)</p>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">Rôle</label>
          <select
            name="role"
            required
            defaultValue={user.role}
            className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Enregistrer
        </button>
      </form>

      <form
        action={resetWithId}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-navy">Réinitialiser le mot de passe</h2>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Nouveau mot de passe (8 caractères min.)"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-navy hover:border-blue hover:text-blue"
        >
          Réinitialiser le mot de passe
        </button>
      </form>
    </div>
  );
}
