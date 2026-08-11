import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { getUpcomingSessions, formatSessionDate } from "@/lib/formations-data";
import { getSettings } from "@/lib/settings";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n/config";
import { localeHref } from "@/lib/locale-link";

export const metadata = {
  title: "Formations — TechnoTchad",
  description: "Toutes les formations professionnelles proposées par TechnoTchad.",
};

export const dynamic = "force-dynamic";

export default async function FormationsPage({ params }: PageProps<"/[lang]/formations">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.pages.formations;

  const [filieres, sessions, settings] = await Promise.all([
    prisma.filiere.findMany({ orderBy: { order: "asc" } }),
    getUpcomingSessions(),
    getSettings(["about_admission"] as const),
  ]);

  return (
    <>
      <section className="bg-hero-gradient py-16 text-white sm:py-20">
        <Container>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan">
            {p.eyebrow}
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
            {p.title}
          </h1>
          <p className="mt-4 max-w-xl text-white/70">{p.description}</p>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={p.catalogEyebrow}
            title={p.catalogTitle}
            description={p.catalogDescription}
            align="left"
          />

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filieres.map((filiere) => (
              <div
                key={filiere.slug}
                className="rounded-2xl border border-line bg-mist p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                  {filiere.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-navy">
                  {filiere.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {filiere.topics.split(",").map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-slate"
                    >
                      {topic.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mist py-20 sm:py-24">
        <Container>
          <SectionHeading title={p.upcomingSessionsTitle} align="left" />

          {sessions.length === 0 ? (
            <p className="mt-10 text-sm text-slate">{p.noSessions}</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  id={session.course.slug}
                  className="scroll-mt-24 flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-36 items-center justify-center bg-navy text-5xl">
                    {session.course.imageUrl}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-bold uppercase tracking-wide text-blue">
                      {session.course.category}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-navy">
                      {session.course.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">
                      {session.course.description}
                    </p>

                    <ul className="mt-4 space-y-1.5 text-sm text-slate">
                      <li>📅 {formatSessionDate(session.startDate)}</li>
                      <li>⏱ {session.course.durationLabel}</li>
                      <li>🕘 {session.schedule}</li>
                      {session.instructor && <li>👨‍🏫 {session.instructor.name}</li>}
                      <li>
                        👥{" "}
                        {session.seatsLeft > 0
                          ? p.seatsLeftOf(session.seatsLeft, session.seats)
                          : dict.common.full}
                      </li>
                      <li className="font-semibold text-navy">
                        💰 {session.course.price}
                      </li>
                    </ul>

                    <Link
                      href={localeHref(lang, `/inscription?type=course&slug=${session.course.slug}`)}
                      className="mt-6 rounded-full bg-blue px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-dark"
                    >
                      {dict.common.register}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container className="max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue">
            {p.admissionEyebrow}
          </span>
          <p className="mt-4 text-base leading-relaxed text-slate">
            {settings.about_admission}
          </p>
        </Container>
      </section>
    </>
  );
}
