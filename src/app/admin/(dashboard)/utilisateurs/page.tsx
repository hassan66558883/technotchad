import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { ROLE_LABELS, type Role } from "@/lib/roles";
import { deleteUser } from "./actions";
import CreateUserForm from "@/components/admin/CreateUserForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Utilisateurs — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default async function UtilisateursPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const users = await prisma.user.findMany({
    where: { role: { not: "STUDENT" } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Utilisateurs</h1>
        <p className="text-sm text-slate">
          Comptes d&apos;équipe ayant accès à l&apos;administration. Voir{" "}
          <Link href="/admin/roles" className="font-semibold text-blue hover:text-blue-dark">
            Rôles
          </Link>{" "}
          pour le détail de chaque rôle.
        </p>
      </div>

      <CreateUserForm />

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate">
              <th className="px-6 py-3 font-semibold">Nom</th>
              <th className="px-6 py-3 font-semibold">Email</th>
              <th className="px-6 py-3 font-semibold">Rôle</th>
              <th className="px-6 py-3 font-semibold">Depuis</th>
              <th className="px-6 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-line">
                <td className="px-6 py-3.5 font-medium text-navy">
                  {user.name}
                  {user.id === session?.sub && (
                    <span className="ml-2 rounded-full bg-blue/10 px-2 py-0.5 text-xs font-semibold text-blue">
                      Vous
                    </span>
                  )}
                </td>
                <td className="px-6 py-3.5 text-ink/80">{user.email}</td>
                <td className="px-6 py-3.5">
                  <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-navy">
                    {ROLE_LABELS[user.role as Role] ?? user.role}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-ink/80">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/utilisateurs/${user.id}/edit`}
                      className="text-xs font-semibold text-blue hover:text-blue-dark"
                    >
                      Modifier
                    </Link>
                    {user.id !== session?.sub && (
                      <DeleteButton
                        action={deleteUser.bind(null, user.id)}
                        confirmText={`Supprimer le compte de ${user.name} ?`}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
