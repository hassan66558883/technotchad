import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GenerateCertificateButton from "@/components/admin/GenerateCertificateButton";
import RevokeCertificateButton from "@/components/admin/RevokeCertificateButton";
import ReinstateCertificateButton from "@/components/admin/ReinstateCertificateButton";
import GrantPortalAccessButton from "@/components/admin/GrantPortalAccessButton";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function StudentDetailPage({
  params,
}: PageProps<"/admin/etudiants/[id]">) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      registrations: {
        include: {
          courseSession: { include: { course: true } },
          workshop: true,
          certificate: true,
          payments: true,
        },
        orderBy: { registeredAt: "desc" },
      },
    },
  });

  if (!student) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/etudiants" className="text-sm text-slate hover:text-blue">
        ← Tous les étudiants
      </Link>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
              {student.firstName[0]}
              {student.lastName[0]}
            </span>
            <div>
              <h1 className="text-lg font-semibold text-navy">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-sm text-slate">
                {student.phone} · {student.email}
              </p>
              {student.studentNumber && (
                <p className="mt-0.5 font-mono text-xs text-slate/70">{student.studentNumber}</p>
              )}
            </div>
          </div>
          {student.userId ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              ✓ Espace étudiant actif
            </span>
          ) : (
            <GrantPortalAccessButton studentId={student.id} />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white shadow-sm">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-sm font-semibold text-navy">
            Formations & workshops ({student.registrations.length})
          </h2>
        </div>

        {student.registrations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate">
            Aucune inscription pour cet étudiant.
          </p>
        ) : (
          <div className="divide-y divide-line">
            {student.registrations.map((reg) => (
              <div key={reg.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {reg.courseSession?.course.title ?? reg.workshop?.title}
                  </p>
                  <p className="text-xs text-slate">
                    Inscrit le {formatDate(reg.registeredAt)} · Statut : {reg.status}
                  </p>
                  {(reg.courseSession?.startDate ?? reg.workshop?.date) && (
                    <p className="text-xs text-slate/70">
                      Formation : du {formatDate(reg.courseSession?.startDate ?? reg.workshop!.date)}
                      {reg.courseSession?.endDate ? ` au ${formatDate(reg.courseSession.endDate)}` : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/fiche/${reg.id}`}
                    className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue"
                  >
                    Fiche d&apos;inscription
                  </Link>
                  {reg.certificate ? (
                    <>
                      <Link
                        href={`/verify/${reg.certificate.certificateNumber}`}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                          reg.certificate.status === "REVOKED"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        }`}
                      >
                        {reg.certificate.status === "REVOKED" ? "✕" : "✓"} Certificat{" "}
                        {reg.certificate.certificateNumber}
                      </Link>
                      <a
                        href={`/api/certificates/${reg.certificate.certificateNumber}/pdf?download=1`}
                        className="text-xs font-semibold text-blue hover:text-blue-dark"
                      >
                        PDF
                      </a>
                      {reg.certificate.status === "REVOKED" ? (
                        <ReinstateCertificateButton certificateId={reg.certificate.id} />
                      ) : (
                        <RevokeCertificateButton certificateId={reg.certificate.id} />
                      )}
                    </>
                  ) : reg.status !== "CONFIRMED" ? (
                    <span className="text-xs text-slate/60">
                      Confirmez l&apos;inscription pour émettre un certificat
                    </span>
                  ) : (() => {
                    const requiresFullPayment =
                      reg.courseSession?.course.requiresFullPayment ??
                      reg.workshop?.requiresFullPayment ??
                      false;
                    if (!requiresFullPayment) return <GenerateCertificateButton registrationId={reg.id} />;
                    const paid = reg.payments
                      .filter((p) => p.status === "PAID")
                      .reduce((sum, p) => sum + p.amount, 0);
                    const remaining = (reg.paymentAmount ?? 0) - paid;
                    if (remaining <= 0) return <GenerateCertificateButton registrationId={reg.id} />;
                    return (
                      <span className="text-xs text-amber-700">
                        Paiement intégral requis ({remaining.toLocaleString("fr-FR")} FCFA restants)
                      </span>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
