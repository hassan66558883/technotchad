import Container from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({ params }: PageProps<"/verify/[number]">) {
  const { number } = await params;
  return { title: `Vérification ${number} — TechnoTchad` };
}

export default async function VerifyCertificatePage({
  params,
}: PageProps<"/verify/[number]">) {
  const { number } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: number },
    include: {
      student: true,
      registration: {
        include: { courseSession: { include: { course: true } }, workshop: true },
      },
    },
  });

  const courseTitle =
    certificate?.registration.courseSession?.course.title ??
    certificate?.registration.workshop?.title;

  return (
    <section className="bg-mist py-20 sm:py-24">
      <Container className="max-w-xl">
        <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-sm">
          {certificate ? (
            <>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                ✓
              </span>
              <h1 className="mt-5 text-2xl font-bold text-navy">
                Certificat authentique
              </h1>
              <p className="mt-2 text-sm text-slate">
                Ce certificat a été délivré par TechnoTchad.
              </p>

              <div className="mt-8 space-y-3 rounded-xl bg-mist p-6 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">N° de certificat</span>
                  <span className="font-semibold text-navy">
                    {certificate.certificateNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Titulaire</span>
                  <span className="font-semibold text-navy">
                    {certificate.student.firstName} {certificate.student.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Formation</span>
                  <span className="font-semibold text-navy">{courseTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Date d&apos;émission</span>
                  <span className="font-semibold text-navy">
                    {formatDate(certificate.issuedAt)}
                  </span>
                </div>
              </div>

              {certificate.qrCodeUrl && (
                <img
                  src={certificate.qrCodeUrl}
                  alt="QR code de vérification"
                  className="mx-auto mt-6 h-32 w-32"
                />
              )}
            </>
          ) : (
            <>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                ✕
              </span>
              <h1 className="mt-5 text-2xl font-bold text-navy">
                Certificat introuvable
              </h1>
              <p className="mt-2 text-sm text-slate">
                Aucun certificat ne correspond au numéro{" "}
                <span className="font-semibold">{number}</span>. Vérifiez le
                numéro ou contactez TechnoTchad.
              </p>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
