import { prisma } from "@/lib/prisma";
import AttendanceToggle from "@/components/admin/AttendanceToggle";

export const metadata = { title: "Présences — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function PresencesPage({
  searchParams,
}: PageProps<"/admin/presences">) {
  const params = await searchParams;
  const date = typeof params.date === "string" ? params.date : todayISO();

  const sessions = await prisma.courseSession.findMany({
    include: { course: true },
    orderBy: { startDate: "asc" },
  });

  const selectedSessionId =
    typeof params.session === "string" ? params.session : sessions[0]?.id;

  const registrations = selectedSessionId
    ? await prisma.registration.findMany({
        where: { courseSessionId: selectedSessionId, status: "CONFIRMED" },
        include: {
          student: true,
          attendance: { where: { courseSessionId: selectedSessionId } },
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Présences</h1>
        <p className="text-sm text-slate">
          Suivi de présence par session de formation.
        </p>
      </div>

      <form className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-3">
        <select
          name="session"
          defaultValue={selectedSessionId ?? ""}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        >
          {sessions.length === 0 && <option value="">Aucune session disponible</option>}
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.course.title} — {session.schedule}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          defaultValue={date}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="sm:col-span-3 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Afficher la liste
        </button>
      </form>

      {!selectedSessionId ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            Aucune session de formation trouvée. Lancez le seed pour en créer.
          </p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            Aucune inscription confirmée pour cette session. Confirmez des
            inscriptions depuis « Inscriptions » pour les faire apparaître ici.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-sm font-semibold text-navy">
              Présences du {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(`${date}T00:00:00`))}
            </h2>
          </div>
          <div className="divide-y divide-line">
            {registrations.map((reg) => {
              const record = reg.attendance.find(
                (a) => a.date.toISOString().slice(0, 10) === date,
              );
              const totalRecords = reg.attendance.length;
              const presentCount = reg.attendance.filter((a) => a.present).length;
              const rate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : null;

              return (
                <div
                  key={reg.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-navy">
                      {reg.student.firstName} {reg.student.lastName}
                    </p>
                    {rate !== null && (
                      <p className="text-xs text-slate">Taux de présence global : {rate}%</p>
                    )}
                  </div>
                  <AttendanceToggle
                    registrationId={reg.id}
                    courseSessionId={selectedSessionId}
                    date={date}
                    present={record ? record.present : null}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
