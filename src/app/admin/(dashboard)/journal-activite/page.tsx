import { prisma } from "@/lib/prisma";

export const metadata = { title: "Journal d'activité — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function JournalActivitePage() {
  const entries = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Journal d&apos;activité</h1>
        <p className="text-sm text-slate">
          Les {entries.length} dernières actions administratives enregistrées.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">Aucune activité enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate">
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Utilisateur</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                  <th className="px-6 py-3 font-semibold">Catégorie</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-line">
                    <td className="px-6 py-3.5 text-ink/80">{formatDateTime(entry.createdAt)}</td>
                    <td className="px-6 py-3.5 font-medium text-navy">
                      {entry.user?.name ?? "Système"}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">{entry.action}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-slate">
                        {entry.entityType}
                      </span>
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
