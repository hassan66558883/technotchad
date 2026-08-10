import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RegistrationStatusSelect from "@/components/admin/RegistrationStatusSelect";

export const metadata = { title: "Inscriptions — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function InscriptionsPage() {
  const registrations = await prisma.registration.findMany({
    orderBy: { registeredAt: "desc" },
    include: {
      student: true,
      courseSession: { include: { course: true } },
      workshop: true,
      certificate: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Inscriptions</h1>
        <p className="text-sm text-slate">
          {registrations.length} inscription{registrations.length > 1 ? "s" : ""} aux
          formations et workshops.
        </p>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            Aucune inscription pour le moment. Les inscriptions faites depuis le
            site public apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate">
                  <th className="px-6 py-3 font-semibold">Étudiant</th>
                  <th className="px-6 py-3 font-semibold">Formation / Workshop</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Certificat</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold">Fiche</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-t border-line">
                    <td className="px-6 py-3.5 font-medium text-navy">
                      <Link href={`/admin/etudiants/${reg.student.id}`} className="hover:text-blue">
                        {reg.student.firstName} {reg.student.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {reg.courseSession?.course.title ?? reg.workshop?.title}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {formatDate(reg.registeredAt)}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {reg.certificate ? "✓ Émis" : "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <RegistrationStatusSelect id={reg.id} status={reg.status} />
                    </td>
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/admin/fiche/${reg.id}`}
                        className="text-xs font-semibold text-blue hover:text-blue-dark"
                      >
                        Voir →
                      </Link>
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
