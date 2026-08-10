import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateStudentForm from "@/components/admin/CreateStudentForm";

export const metadata = { title: "Étudiants — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default async function EtudiantsPage() {
  const [students, sessions, workshops] = await Promise.all([
    prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      include: { registrations: true, certificates: true },
    }),
    prisma.courseSession.findMany({
      where: { status: "UPCOMING" },
      include: { course: true },
      orderBy: { startDate: "asc" },
    }),
    prisma.workshop.findMany({
      where: { status: "UPCOMING" },
      orderBy: { date: "asc" },
    }),
  ]);

  const enrollmentOptions = [
    ...sessions.map((s) => ({
      value: `course:${s.id}`,
      label: `${s.course.title} — ${formatDate(s.startDate)}`,
    })),
    ...workshops.map((w) => ({
      value: `workshop:${w.slug}`,
      label: `${w.title} (workshop) — ${formatDate(w.date)}`,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Étudiants</h1>
        <p className="text-sm text-slate">
          {students.length} étudiant{students.length > 1 ? "s" : ""} enregistré
          {students.length > 1 ? "s" : ""}.
        </p>
      </div>

      <CreateStudentForm enrollmentOptions={enrollmentOptions} />

      {students.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            Aucun étudiant pour le moment. Ajoutez-en un ci-dessus, ou laissez les
            inscriptions faites depuis le site public créer un profil automatiquement.
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
