import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { computePaymentStatus, paymentStatusLabels, paymentStatusStyles } from "@/lib/payment";

export const metadata = { title: "Mon espace — TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function formatMoney(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function MonEspacePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/admin/login");

  const student = await prisma.student.findUnique({
    where: { userId: session.sub },
    include: {
      registrations: {
        include: {
          courseSession: { include: { course: true } },
          workshop: true,
          payments: true,
          certificate: true,
        },
        orderBy: { registeredAt: "desc" },
      },
    },
  });

  if (!student) {
    return (
      <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
        <p className="text-sm text-slate">
          Aucun profil étudiant n&apos;est associé à ce compte. Contactez TechnoTchad si cela semble incorrect.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">
          Bonjour {student.firstName} 👋
        </h1>
        <p className="text-sm text-slate">Voici un aperçu de vos formations, paiements et certificats.</p>
        {student.studentNumber && (
          <p className="mt-1 font-mono text-xs text-slate/70">Matricule : {student.studentNumber}</p>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-white shadow-sm">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-sm font-semibold text-navy">
            Mes formations &amp; workshops ({student.registrations.length})
          </h2>
        </div>

        {student.registrations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate">Aucune inscription pour le moment.</p>
        ) : (
          <div className="divide-y divide-line">
            {student.registrations.map((reg) => {
              const paid = reg.payments
                .filter((p) => p.status === "PAID")
                .reduce((sum, p) => sum + p.amount, 0);
              const remaining = (reg.paymentAmount ?? 0) - paid;
              const paymentStatus = computePaymentStatus({
                totalDue: reg.paymentAmount,
                totalPaid: paid,
                dueDate: reg.paymentDueDate,
              });

              return (
                <div key={reg.id} className="space-y-3 px-6 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {reg.courseSession?.course.title ?? reg.workshop?.title}
                      </p>
                      <p className="text-xs text-slate">Inscrit le {formatDate(reg.registeredAt)}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[reg.status] ?? "bg-mist text-slate"}`}
                    >
                      {statusLabels[reg.status] ?? reg.status}
                    </span>
                  </div>

                  {reg.paymentAmount != null && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate">
                      <span>Total : {formatMoney(reg.paymentAmount)}</span>
                      <span>Payé : {formatMoney(paid)}</span>
                      {remaining > 0 && <span>Reste : {formatMoney(remaining)}</span>}
                      <span
                        className={`rounded-full px-2.5 py-1 font-semibold ${paymentStatusStyles[paymentStatus]}`}
                      >
                        {paymentStatusLabels[paymentStatus]}
                      </span>
                    </div>
                  )}

                  {reg.certificate && (
                    <Link
                      href={`/verify/${reg.certificate.certificateNumber}`}
                      className={`inline-flex rounded-full px-4 py-1.5 text-xs font-semibold ${
                        reg.certificate.status === "REVOKED"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {reg.certificate.status === "REVOKED" ? "✕" : "✓"} Certificat{" "}
                      {reg.certificate.certificateNumber}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
