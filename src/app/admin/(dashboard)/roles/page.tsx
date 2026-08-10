import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, type Role } from "@/lib/roles";

export const metadata = { title: "Rôles — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const counts = await prisma.user.groupBy({
    by: ["role"],
    _count: { role: true },
  });
  const countByRole = Object.fromEntries(counts.map((c) => [c.role, c._count.role]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Rôles</h1>
        <p className="text-sm text-slate">
          Ce que chaque rôle peut faire.{" "}
          <Link href="/admin/utilisateurs" className="font-semibold text-blue hover:text-blue-dark">
            Gérer les utilisateurs →
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLES.map((role) => (
          <div key={role} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-navy">{ROLE_LABELS[role as Role]}</h2>
              <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-slate">
                {countByRole[role] ?? 0} compte{(countByRole[role] ?? 0) > 1 ? "s" : ""}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate">{ROLE_DESCRIPTIONS[role as Role]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
