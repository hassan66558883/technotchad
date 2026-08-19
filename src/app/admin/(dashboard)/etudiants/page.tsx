import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parsePriceToNumber } from "@/lib/format";
import CreateStudentForm from "@/components/admin/CreateStudentForm";
import { getStudentStatus, studentStatusLabels, studentStatusStyles } from "@/lib/studentStatus";

export const metadata = { title: "Étudiants — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default async function EtudiantsPage({
  searchParams,
}: PageProps<"/admin/etudiants">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const statut = typeof params.statut === "string" ? params.statut : "";

  const [allStudents, sessions, workshops] = await Promise.all([
    prisma.student.findMany({
      where: q
        ? {
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { studentNumber: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
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

  const students = allStudents.filter((student) => {
    if (!statut) return true;
    return getStudentStatus(student.registrations.length) === statut;
  });

  const enrollmentOptions = [
    ...sessions.map((s) => ({
      value: `course:${s.id}`,
      label: `${s.course.title} — ${formatDate(s.startDate)}`,
      price: parsePriceToNumber(s.course.price),
    })),
    ...workshops.map((w) => ({
      value: `workshop:${w.slug}`,
      label: `${w.title} (workshop) — ${formatDate(w.date)}`,
      price: null as number | null,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Étudiants</h1>
        <p className="text-sm text-slate">
          {students.length} étudiant{students.length > 1 ? "s" : ""}
          {q ? ` trouvé${students.length > 1 ? "s" : ""} pour « ${q} »` : " enregistré" + (students.length > 1 ? "s" : "")}.
        </p>
      </div>

      <CreateStudentForm enrollmentOptions={enrollmentOptions} />

      <form className="flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un étudiant (nom, email, téléphone, matricule)"
          className="w-full max-w-sm rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-blue"
        />
        <select
          name="statut"
          defaultValue={statut}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="">Tous les étudiants</option>
          <option value="NOUVEAU">Nouveaux</option>
          <option value="ANCIEN">Anciens</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Filtrer
        </button>
        {(q || statut) && (
          <Link
            href="/admin/etudiants"
            className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-slate hover:border-blue hover:text-blue"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      {students.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            {q
              ? `Aucun étudiant ne correspond à « ${q} ».`
              : "Aucun étudiant pour le moment. Ajoutez-en un ci-dessus, ou laissez les inscriptions faites depuis le site public créer un profil automatiquement."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate">
                  <th className="px-6 py-3 font-semibold">Matricule</th>
                  <th className="px-6 py-3 font-semibold">Nom</th>
                  <th className="px-6 py-3 font-semibold">Contact</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold">Inscriptions</th>
                  <th className="px-6 py-3 font-semibold">Certificats</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const status = getStudentStatus(student.registrations.length);
                  return (
                    <tr key={student.id} className="border-t border-line">
                      <td className="px-6 py-3.5 font-mono text-xs text-slate">
                        {student.studentNumber ?? "—"}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-navy">
                        <Link href={`/admin/etudiants/${student.id}`} className="hover:text-blue">
                          {student.firstName} {student.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-ink/80">
                        {student.phone} · {student.email}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${studentStatusStyles[status]}`}
                        >
                          {studentStatusLabels[status]}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-ink/80">
                        {student.registrations.length}
                      </td>
                      <td className="px-6 py-3.5 text-ink/80">
                        {student.certificates.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
