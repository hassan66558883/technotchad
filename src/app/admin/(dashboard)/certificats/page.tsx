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
  const statusFilter = typeof params.status === "string" ? params.status : "";
  const programFilter = typeof params.program === "string" ? params.program : "";
  const fromDate = typeof params.from === "string" ? params.from : "";
  const toDate = typeof params.to === "string" ? params.to : "";

  const [allCertificates, programs] = await Promise.all([
    prisma.certificate.findMany({
      orderBy: { issuedAt: "desc" },
      include: {
        student: true,
        registration: {
          include: { courseSession: { include: { course: true } }, workshop: true },
        },
      },
    }),
    prisma.certificate.findMany({
      select: { programTitle: true },
      distinct: ["programTitle"],
      orderBy: { programTitle: "asc" },
    }),
  ]);

  const certificates = allCertificates.filter((cert) => {
    if (q) {
      const haystack = [cert.certificateNumber, cert.student.firstName, cert.student.lastName]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q.toLowerCase())) return false;
    }
    if (statusFilter && cert.status !== statusFilter) return false;
    if (programFilter && cert.programTitle !== programFilter) return false;
    if (fromDate && cert.issuedAt < new Date(`${fromDate}T00:00:00`)) return false;
    if (toDate && cert.issuedAt > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  });

  const hasFilters = Boolean(q || statusFilter || programFilter || fromDate || toDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Certificats</h1>
        <p className="text-sm text-slate">
          {certificates.length} certificat{certificates.length > 1 ? "s" : ""}
          {hasFilters ? " correspondant" + (certificates.length > 1 ? "s" : "") + " aux filtres" : " émis"}.
        </p>
      </div>

      <form className="grid grid-cols-1 gap-3 rounded-2xl border border-line bg-white p-5 shadow-sm sm:grid-cols-5">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Étudiant, n° de certificat"
          className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <select
          name="status"
          defaultValue={statusFilter}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="">Tous les statuts</option>
          <option value="ACTIVE">Valide</option>
          <option value="REVOKED">Annulé</option>
        </select>
        <select
          name="program"
          defaultValue={programFilter}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-blue"
        >
          <option value="">Toutes les formations</option>
          {programs.map((p) => (
            <option key={p.programTitle} value={p.programTitle}>
              {p.programTitle}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            name="from"
            defaultValue={fromDate}
            className="w-full rounded-full border border-line bg-white px-3 py-2 text-xs outline-none focus:border-blue"
          />
          <input
            type="date"
            name="to"
            defaultValue={toDate}
            className="w-full rounded-full border border-line bg-white px-3 py-2 text-xs outline-none focus:border-blue"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white hover:bg-blue-dark sm:col-span-4"
        >
          Filtrer
        </button>
        {hasFilters && (
          <Link
            href="/admin/certificats"
            className="flex items-center justify-center rounded-full border border-line px-4 py-2 text-xs font-semibold text-slate hover:border-blue hover:text-blue"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">
            {hasFilters
              ? "Aucun certificat ne correspond à ces filtres."
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
                  {cert.status === "REVOKED" ? "Annulé" : "Valide"}
                </span>
              </div>
              <Link href={`/verify/${cert.certificateNumber}`}>
                <h2 className="mt-2 text-base font-semibold text-navy hover:text-blue">
                  {cert.student.firstName} {cert.student.lastName}
                </h2>
                <p className="mt-1 text-sm text-slate">
                  {cert.programTitle ||
                    cert.registration.courseSession?.course.title ||
                    cert.registration.workshop?.title}
                </p>
                <p className="mt-3 text-xs text-slate/70">
                  Émis le {formatDate(cert.issuedAt)}
                </p>
              </Link>
              {cert.status === "REVOKED" && cert.revokedReason && (
                <p className="mt-2 text-xs text-red-600">Motif : {cert.revokedReason}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={`/api/certificates/${cert.certificateNumber}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-navy hover:text-blue"
                >
                  Aperçu PDF
                </a>
                <a
                  href={`/api/certificates/${cert.certificateNumber}/pdf?download=1`}
                  className="text-xs font-semibold text-navy hover:text-blue"
                >
                  Télécharger
                </a>
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
