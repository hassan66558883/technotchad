import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Certificats — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function CertificatsPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      student: true,
      registration: {
        include: { courseSession: { include: { course: true } }, workshop: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Certificats</h1>
        <p className="text-sm text-slate">
          {certificates.length} certificat{certificates.length > 1 ? "s" : ""} émis.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            Aucun certificat émis pour le moment. Générez-en un depuis la fiche
            d&apos;un étudiant après confirmation de son inscription.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Link
              key={cert.id}
              href={`/verify/${cert.certificateNumber}`}
              className="rounded-2xl border border-line bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-blue">
                {cert.certificateNumber}
              </span>
              <h2 className="mt-2 text-base font-semibold text-navy">
                {cert.student.firstName} {cert.student.lastName}
              </h2>
              <p className="mt-1 text-sm text-slate">
                {cert.registration.courseSession?.course.title ?? cert.registration.workshop?.title}
              </p>
              <p className="mt-3 text-xs text-slate/70">
                Émis le {formatDate(cert.issuedAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
