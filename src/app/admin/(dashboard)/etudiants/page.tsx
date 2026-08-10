import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Étudiants — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function EtudiantsPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      registrations: true,
      certificates: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Étudiants</h1>
        <p className="text-sm text-slate">
          {students.length} étudiant{students.length > 1 ? "s" : ""} enregistré
          {students.length > 1 ? "s" : ""}.
        </p>
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            Aucun étudiant pour le moment. Les inscriptions faites depuis le
            site public créent automatiquement un profil étudiant.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate">
                  <th className="px-6 py-3 font-semibold">Nom</th>
                  <th className="px-6 py-3 font-semibold">Contact</th>
                  <th className="px-6 py-3 font-semibold">Inscriptions</th>
                  <th className="px-6 py-3 font-semibold">Certificats</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t border-line">
                    <td className="px-6 py-3.5 font-medium text-navy">
                      <Link href={`/admin/etudiants/${student.id}`} className="hover:text-blue">
                        {student.firstName} {student.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {student.phone} · {student.email}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {student.registrations.length}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {student.certificates.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
