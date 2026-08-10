import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getUpcomingSessions, formatSessionDate } from "@/lib/formations-data";

export default async function UpcomingFormations() {
  const sessions = await getUpcomingSessions(3);

  if (sessions.length === 0) return null;

  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Formations"
            title="Formations à venir"
            description="Des sessions pratiques animées par des formateurs expérimentés."
            align="left"
          />
          <Link
            href="/formations"
            className="shrink-0 text-sm font-semibold text-blue hover:text-blue-dark"
          >
            Voir toutes les formations →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-lg"
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

                <ul className="mt-4 space-y-1.5 text-sm text-slate">
                  <li>📅 {formatSessionDate(session.startDate)}</li>
                  <li>⏱ {session.course.durationLabel}</li>
                  <li>🕘 {session.schedule}</li>
                  <li>
                    👥{" "}
                    {session.seatsLeft > 0
                      ? `${session.seatsLeft} places restantes`
                      : "Complet"}
                  </li>
                </ul>

                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/formations#${session.course.slug}`}
                    className="flex-1 rounded-full border border-line px-4 py-2.5 text-center text-sm font-semibold text-navy hover:border-blue hover:text-blue"
                  >
                    Voir détails
                  </Link>
                  <Link
                    href={`/inscription?type=course&slug=${session.course.slug}`}
                    className="flex-1 rounded-full bg-blue px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-dark"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
