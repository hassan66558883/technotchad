import Container from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({ params }: PageProps<"/verify-inscription/[number]">) {
  const { number } = await params;
  return { title: `Vérification inscription ${number} — TechnoTchad` };
}

export default async function VerifyInscriptionPage({
  params,
}: PageProps<"/verify-inscription/[number]">) {
  const { number } = await params;

  const registration = await prisma.registration.findUnique({
    where: { inscriptionNumber: number },
    include: {
      student: true,
      courseSession: { include: { course: true } },
      workshop: true,
    },
  });

  const formationTitle =
    registration?.courseSession?.course.title ?? registration?.workshop?.title;

  return (
    <section className="bg-mist py-20 sm:py-24">
      <Container className="max-w-xl">
        <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-sm">
          {registration ? (
            <>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                ✓
              </span>
              <h1 className="mt-5 text-2xl font-bold text-navy">Inscription authentique</h1>
              <p className="mt-2 text-sm text-slate">
                Cette fiche d&apos;inscription a été délivrée par TechnoTchad.
              </p>

              <div className="mt-8 space-y-3 rounded-xl bg-mist p-6 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">N° d&apos;inscription</span>
                  <span className="font-semibold text-navy">{registration.inscriptionNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Étudiant(e)</span>
                  <span className="font-semibold text-navy">
                    {registration.student.firstName} {registration.student.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Formation</span>
                  <span className="font-semibold text-navy">{formationTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Date d&apos;inscription</span>
                  <span className="font-semibold text-navy">
                    {formatDate(registration.registeredAt)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Statut</span>
                  <span className="font-semibold text-navy">
                    {statusLabels[registration.status] ?? registration.status}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                ✕
              </span>
              <h1 className="mt-5 text-2xl font-bold text-navy">Inscription introuvable</h1>
              <p className="mt-2 text-sm text-slate">
                Aucune fiche ne correspond au numéro{" "}
                <span className="font-semibold">{number}</span>. Vérifiez le numéro ou
                contactez TechnoTchad.
              </p>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
