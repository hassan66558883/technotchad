import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GenerateCertificateButton from "@/components/admin/GenerateCertificateButton";

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
          </div>
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
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/fiche/${reg.id}`}
                    className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue"
                  >
                    Fiche d&apos;inscription
                  </Link>
                  {reg.certificate ? (
                    <Link
                      href={`/verify/${reg.certificate.certificateNumber}`}
                      className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200"
                    >
                      ✓ Certificat {reg.certificate.certificateNumber}
                    </Link>
                  ) : reg.status === "CONFIRMED" ? (
                    <GenerateCertificateButton registrationId={reg.id} />
                  ) : (
                    <span className="text-xs text-slate/60">
                      Confirmez l&apos;inscription pour émettre un certificat
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
