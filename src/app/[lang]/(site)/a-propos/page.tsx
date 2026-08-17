import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import { getSettings, splitLines, ABOUT_SETTING_KEYS } from "@/lib/settings";
import { getDictionary } from "@/dictionaries";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.nav.company} — TechnoTchad`, description: dict.meta.siteDescription };
}

export default async function AProposPage({ params }: PageProps<"/[lang]/a-propos">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.pages.aPropos;

  const [settings, companyValues, team, partners] = await Promise.all([
    getSettings(ABOUT_SETTING_KEYS),
    prisma.companyValue.findMany({ where: { type: "VALUE" }, orderBy: { order: "asc" } }),
    prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    prisma.partner.findMany({ orderBy: { order: "asc" } }),
  ]);

  const vision = splitLines(settings.about_vision);
  const mission = splitLines(settings.about_mission);
  const infrastructure = splitLines(settings.about_infrastructure);
  const teachingMethods = splitLines(settings.about_teaching_methods);

  return (
    <>
      <section className="bg-hero-gradient py-16 text-white sm:py-20">
        <Container>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan">
            {p.badgePrefix} {settings.about_founded_year}
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
            {p.title}
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">{settings.about_intro}</p>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-mist p-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-blue">
              {p.visionTitle}
            </h2>
            <ul className="mt-4 space-y-3">
              {vision.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-1 shrink-0 text-blue">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-mist p-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-blue">
              {p.missionTitle}
            </h2>
            <ul className="mt-4 space-y-3">
              {mission.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-1 shrink-0 text-blue">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-mist py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue">
              {p.locationEyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy">
              {p.locationTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate">
              {settings.about_location_description}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wide text-blue">
              {p.infrastructureTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {infrastructure.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-1 shrink-0 text-blue">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue">
              {p.teachingEyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy">
              {p.teachingTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate">
              {settings.about_teaching_intro}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-mist p-8">
            <h3 className="text-sm font-bold uppercase tracking-wide text-blue">
              {p.teachingMethodsTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {teachingMethods.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-1 shrink-0 text-blue">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-mist py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow={p.valuesEyebrow} title={p.valuesTitle} />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {companyValues.map((value) => (
              <div
                key={value.id}
                className="rounded-2xl border border-line bg-white p-7 text-center shadow-sm"
              >
                <h3 className="text-base font-semibold text-navy">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow={p.teamEyebrow} title={p.teamTitle} />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-line bg-white p-7 text-center shadow-sm"
              >
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
                  {member.initials}
                </span>
                <h3 className="mt-4 text-base font-semibold text-navy">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-slate">{member.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-mist py-16">
        <Container>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate">
            {p.partnersTitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {partners.map((partner) => (
              <span
                key={partner.id}
                className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy"
              >
                {partner.name}
              </span>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
