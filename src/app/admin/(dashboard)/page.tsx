import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
};

const statusClasses: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: PageProps<"/admin">) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (session?.role === "STUDENT") redirect("/admin/mon-espace");

  const params = await searchParams;
  const denied = params.denied === "1";

  const [
    messageCount,
    studentCount,
    courseCount,
    workshopCount,
    projectCount,
    serviceCount,
    softwareCount,
    registrations,
  ] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.student.count(),
    prisma.course.count(),
    prisma.workshop.count(),
    prisma.project.count(),
    prisma.service.count(),
    prisma.software.count(),
    prisma.registration.findMany({
      orderBy: { registeredAt: "desc" },
      take: 5,
      include: {
        student: true,
        courseSession: { include: { course: true } },
        workshop: true,
      },
    }),
  ]);

  const statCards = [
    { label: "Étudiants", value: studentCount, icon: "🎓", href: "/admin/etudiants" },
    { label: "Formations", value: courseCount, icon: "📚" },
    { label: "Workshops", value: workshopCount, icon: "🛠️" },
    { label: "Demandes de devis", value: messageCount, icon: "✉️", href: "/admin/demandes-devis" },
    { label: "Projets", value: projectCount, icon: "🏗️" },
    { label: "Services", value: serviceCount, icon: "⚙️" },
    { label: "Logiciels", value: softwareCount, icon: "💾" },
  ];

  return (
    <div className="space-y-6">
      {denied && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm text-amber-800">
          Vous n&apos;avez pas accès à cette section avec votre rôle actuel.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {statCards.map((card) => {
          const content = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-2xl font-bold text-navy">{card.value}</span>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate">
                {card.label}
              </p>
            </>
          );

          return card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {content}
            </Link>
          ) : (
            <div
              key={card.label}
              className="rounded-2xl border border-line bg-white p-5 shadow-sm"
            >
              {content}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-sm font-semibold text-navy">
            Inscriptions récentes
          </h2>
          <Link href="/admin/inscriptions" className="text-xs font-semibold text-blue hover:text-blue-dark">
            Voir tout →
          </Link>
        </div>
        {registrations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate">
            Aucune inscription pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate">
                  <th className="px-6 py-3 font-semibold">Étudiant</th>
                  <th className="px-6 py-3 font-semibold">Formation</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-t border-line">
                    <td className="px-6 py-3.5 font-medium text-navy">
                      {reg.student.firstName} {reg.student.lastName}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {reg.courseSession?.course.title ?? reg.workshop?.title}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {formatDate(reg.registeredAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[reg.status] ?? "bg-mist text-slate"}`}
                      >
                        {statusLabels[reg.status] ?? reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-navy">
          Dernières demandes de devis
        </h2>
        <p className="mt-1 text-xs text-slate">
          Soumissions reçues via le formulaire de contact du site public.
        </p>
        <Link
          href="/admin/demandes-devis"
          className="mt-4 inline-flex text-xs font-semibold text-blue hover:text-blue-dark"
        >
          Voir toutes les demandes ({messageCount}) →
        </Link>
      </div>
    </div>
  );
}
