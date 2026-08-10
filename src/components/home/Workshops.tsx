import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getUpcomingWorkshops, formatSessionDate } from "@/lib/formations-data";

export default async function Workshops() {
  const workshops = await getUpcomingWorkshops();

  if (workshops.length === 0) return null;

  return (
    <section className="bg-navy py-20 text-white sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Pratique"
          title="Workshops TechnoTchad"
          description="Des ateliers courts et intensifs, 100% pratiques, en petits groupes."
          dark
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {workshops.map((workshop) => (
            <div
              key={workshop.slug}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {workshop.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {workshop.description}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/70">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-white/40">
                      Durée
                    </dt>
                    <dd>{workshop.durationLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-white/40">
                      Horaire
                    </dt>
                    <dd>{workshop.schedule}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-white/40">
                      Date
                    </dt>
                    <dd>{formatSessionDate(workshop.date)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-white/40">
                      Places
                    </dt>
                    <dd>
                      {workshop.seatsLeft > 0
                        ? `${workshop.seatsLeft} places limitées`
                        : "Complet"}
                    </dd>
                  </div>
                </dl>
              </div>
              <Link
                href={`/inscription?type=workshop&slug=${workshop.slug}`}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-navy hover:bg-cyan/90"
              >
                S&apos;inscrire au workshop
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
