import Link from "next/link";
import { prisma } from "@/lib/prisma";
import RevokeCertificateButton from "@/components/admin/RevokeCertificateButton";
import ReinstateCertificateButton from "@/components/admin/ReinstateCertificateButton";

export const metadata = { title: "Certificats — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function CertificatsPage({
  searchParams,
}: PageProps<"/admin/certificats">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";

  const allCertificates = await prisma.certificate.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      student: true,
      registration: {
        include: { courseSession: { include: { course: true } }, workshop: true },
      },
    },
  });

  const certificates = q
    ? allCertificates.filter((cert) => {
        const haystack = [
          cert.certificateNumber,
          cert.student.firstName,
          cert.student.lastName,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q.toLowerCase());
      })
    : allCertificates;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Certificats</h1>
        <p className="text-sm text-slate">
          {certificates.length} certificat{certificates.length > 1 ? "s" : ""}
          {q ? ` trouvé${certificates.length > 1 ? "s" : ""} pour « ${q} »` : " émis"}.
        </p>
      </div>

      <form className="flex gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher (étudiant, n° de certificat)"
          className="w-full max-w-sm rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-blue"
        />
        {q && (
          <Link
            href="/admin/certificats"
            className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-slate hover:border-blue hover:text-blue"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            {q
              ? `Aucun certificat ne correspond à « ${q} ».`
              : "Aucun certificat émis pour le moment. Générez-en un depuis la fiche d'un étudiant après confirmation de son inscription."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl border border-line bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-blue">
                  {cert.certificateNumber}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    cert.status === "REVOKED"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {cert.status === "REVOKED" ? "Révoqué" : "Actif"}
                </span>
              </div>
              <Link href={`/verify/${cert.certificateNumber}`}>
                <h2 className="mt-2 text-base font-semibold text-navy hover:text-blue">
                  {cert.student.firstName} {cert.student.lastName}
                </h2>
                <p className="mt-1 text-sm text-slate">
                  {cert.registration.courseSession?.course.title ?? cert.registration.workshop?.title}
                </p>
                <p className="mt-3 text-xs text-slate/70">
                  Émis le {formatDate(cert.issuedAt)}
                </p>
              </Link>
              {cert.status === "REVOKED" && cert.revokedReason && (
                <p className="mt-2 text-xs text-red-600">Motif : {cert.revokedReason}</p>
              )}
              <div className="mt-4">
                {cert.status === "REVOKED" ? (
                  <ReinstateCertificateButton certificateId={cert.id} />
                ) : (
                  <RevokeCertificateButton certificateId={cert.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
