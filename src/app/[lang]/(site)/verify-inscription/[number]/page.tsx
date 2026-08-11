import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

const dateLocales: Record<Locale, string> = { fr: "fr-FR", en: "en-US", ar: "ar" };

function formatDate(date: Date, lang: Locale) {
  return new Intl.DateTimeFormat(dateLocales[lang], {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({ params }: PageProps<"/[lang]/verify-inscription/[number]">) {
  const { number } = await params;
  return { title: `Vérification inscription ${number} — TechnoTchad` };
}

export default async function VerifyInscriptionPage({
  params,
}: PageProps<"/[lang]/verify-inscription/[number]">) {
  const { lang, number } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const v = dict.verifyInscription;

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
              <h1 className="mt-5 text-2xl font-bold text-navy">{v.authenticTitle}</h1>
              <p className="mt-2 text-sm text-slate">{v.issuedBy}</p>

              <div className="mt-8 space-y-3 rounded-xl bg-mist p-6 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">{v.inscriptionNumber}</span>
                  <span className="font-semibold text-navy">{registration.inscriptionNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">{v.student}</span>
                  <span className="font-semibold text-navy">
                    {registration.student.firstName} {registration.student.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">{v.formation}</span>
                  <span className="font-semibold text-navy">{formationTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">{v.registrationDate}</span>
                  <span className="font-semibold text-navy">
                    {formatDate(registration.registeredAt, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">{v.status}</span>
                  <span className="font-semibold text-navy">
                    {v.statusLabels[registration.status as keyof typeof v.statusLabels] ?? registration.status}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
                ✕
              </span>
              <h1 className="mt-5 text-2xl font-bold text-navy">{v.notFoundTitle}</h1>
              <p className="mt-2 text-sm text-slate">{v.notFoundText(number)}</p>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
