import Container from "@/components/ui/Container";

export default function About() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue">
            Qui sommes-nous ?
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Un partenaire technologique engagé au Tchad
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate">
            TechnoTchad accompagne les entreprises, institutions et particuliers
            dans leurs projets informatiques, numériques, de sécurité et de
            formation, avec une approche pratique et adaptée au contexte local.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-mist p-7">
            <h3 className="text-sm font-bold uppercase tracking-wide text-blue">
              Notre vision
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink">
              Faire de la technologie un moteur accessible de développement et
              de transformation au Tchad.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-mist p-7">
            <h3 className="text-sm font-bold uppercase tracking-wide text-blue">
              Notre mission
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink">
              Fournir des solutions technologiques fiables, former les
              compétences locales et accompagner les organisations dans leur
              transformation numérique.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
