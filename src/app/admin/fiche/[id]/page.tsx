import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { canAccessPath } from "@/lib/permissions";
import { buildInscriptionVerifyUrl } from "@/lib/certificate";
import PrintButton from "@/components/admin/PrintButton";

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function formatMoney(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "—";
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

const genderLabels: Record<string, string> = { M: "Masculin", F: "Féminin" };

export default async function FichePage({ params }: PageProps<"/admin/fiche/[id]">) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/admin/login");
  if (!canAccessPath(session.role, "/admin/etudiants")) redirect("/admin?denied=1");

  const registration = await prisma.registration.findUnique({
    where: { id },
    include: {
      student: true,
      courseSession: { include: { course: true } },
      workshop: true,
    },
  });

  if (!registration) notFound();

  const { student } = registration;
  const formationTitle = registration.courseSession?.course.title ?? registration.workshop?.title ?? "—";
  const remaining =
    registration.paymentAmount != null && registration.paidAmount != null
      ? registration.paymentAmount - registration.paidAmount
      : null;

  const qrCodeUrl = registration.inscriptionNumber
    ? await QRCode.toDataURL(buildInscriptionVerifyUrl(registration.inscriptionNumber), {
        margin: 1,
        width: 160,
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl bg-mist p-6 print:bg-white print:p-0">
      <div className="mb-4 flex justify-end gap-3 print:hidden">
        <Link
          href={`/admin/fiche/${id}/edit`}
          className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:border-blue hover:text-blue"
        >
          Modifier
        </Link>
        <PrintButton />
      </div>

      <div className="rounded-2xl border border-line bg-white p-10 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex items-start justify-between border-b-2 border-navy pb-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="TechnoTchad" className="h-14 w-auto" />
            <p className="text-sm font-semibold text-navy">Centre de Formation TechnoTchad</p>
          </div>
          <div className="text-right">
            <h1 className="text-lg font-bold text-navy">FICHE D&apos;INSCRIPTION ÉTUDIANT</h1>
            <p className="text-xs text-slate">N° {registration.inscriptionNumber ?? "—"}</p>
            <p className="text-xs text-slate">Date : {formatDate(registration.registeredAt)}</p>
          </div>
        </header>

        {qrCodeUrl && (
          <div className="mt-4 flex justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="QR code de vérification" className="h-24 w-24" />
          </div>
        )}

        <section className="mt-6">
          <h2 className="rounded bg-mist px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy print:bg-transparent print:border print:border-navy">
            1. Informations personnelles
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Field label="Nom complet" value={`${student.firstName} ${student.lastName}`} />
            <Field label="Date de naissance" value={formatDate(student.dateOfBirth)} />
            <Field label="Lieu de naissance" value={student.placeOfBirth ?? "—"} />
            <Field label="Sexe" value={student.gender ? genderLabels[student.gender] ?? student.gender : "—"} />
            <Field label="Téléphone" value={student.phone} />
            <Field label="Email" value={student.email} />
            <Field label="Adresse" value={student.address ?? "—"} full />
          </dl>
        </section>

        <section className="mt-6">
          <h2 className="rounded bg-mist px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy print:bg-transparent print:border print:border-navy">
            2. Informations académiques / professionnelles
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Field label="Niveau d'études" value={student.educationLevel ?? "—"} />
            <Field label="Dernier diplôme" value={student.lastDiploma ?? "—"} />
            <Field label="Établissement" value={student.institution ?? "—"} />
            <Field label="Profession actuelle" value={student.profession ?? "—"} />
          </dl>
        </section>

        <section className="mt-6">
          <h2 className="rounded bg-mist px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy print:bg-transparent print:border print:border-navy">
            3. Formation choisie
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Field label="Formation" value={formationTitle} full />
            <Field label="Niveau" value={registration.level ?? "—"} />
          </dl>
        </section>

        <section className="mt-6">
          <h2 className="rounded bg-mist px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy print:bg-transparent print:border print:border-navy">
            4. Logistique & paiement
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Field label="Mode de formation" value={registration.trainingMode ?? "—"} />
            <Field
              label="Remise"
              value={registration.discountPercent != null ? `${registration.discountPercent}%` : "—"}
            />
            <Field
              label="Bourse"
              value={registration.scholarshipPercent != null ? `${registration.scholarshipPercent}%` : "—"}
            />
            <Field label="Montant total" value={formatMoney(registration.paymentAmount)} />
            <Field label="Montant payé" value={formatMoney(registration.paidAmount)} />
            <Field label="Reste à payer" value={formatMoney(remaining)} />
            <Field label="Mode de paiement" value={registration.paymentMethod ?? "—"} />
          </dl>
        </section>

        <section className="mt-6">
          <h2 className="rounded bg-mist px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy print:bg-transparent print:border print:border-navy">
            5. Personne à contacter en cas d&apos;urgence
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Field label="Nom complet" value={student.emergencyContactName ?? "—"} />
            <Field label="Lien de parenté" value={student.emergencyContactRelation ?? "—"} />
            <Field label="Téléphone" value={student.emergencyContactPhone ?? "—"} full />
          </dl>
        </section>

        <section className="mt-6">
          <h2 className="rounded bg-mist px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy print:bg-transparent print:border print:border-navy">
            6. Pièces fournies
          </h2>
          <p className="mt-3 text-sm text-ink/80">
            {registration.documentsProvided || "—"}
          </p>
        </section>

        <section className="mt-8 text-sm">
          <p className="text-ink/80">
            Je soussigné(e) <strong>{student.firstName} {student.lastName}</strong>, certifie l&apos;exactitude
            des informations fournies ci-dessus et m&apos;engage à respecter le règlement intérieur de
            TechnoTchad.
          </p>
          <div className="mt-10 flex justify-between text-xs text-slate">
            <div>
              <p className="mb-10">Signature de l&apos;étudiant(e)</p>
              <p className="border-t border-line pt-1">Date : ______________</p>
            </div>
            <div>
              <p className="mb-10">Signature & cachet TechnoTchad</p>
              <p className="border-t border-line pt-1">Date : ______________</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-xs uppercase tracking-wide text-slate">{label}</dt>
      <dd className="font-medium text-navy">{value}</dd>
    </div>
  );
}
