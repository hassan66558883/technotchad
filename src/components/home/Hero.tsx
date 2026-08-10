import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const chips = [
  { label: "Réseau", icon: "🌐" },
  { label: "CCTV", icon: "📹" },
  { label: "Cloud", icon: "☁️" },
  { label: "Base de données", icon: "🗄️" },
  { label: "IA", icon: "🤖" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <Container className="relative grid grid-cols-1 items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan">
            Technologie • Formation • Innovation • Sécurité
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Nous transformons la technologie en solutions pour votre entreprise.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            TechnoTchad accompagne les entreprises, institutions et particuliers
            dans leurs projets informatiques, numériques, de sécurité et de
            formation.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/services">Découvrir nos services</Button>
            <Button href="/formations" variant="ghost">
              Voir nos formations
            </Button>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
          {chips.map((chip, i) => (
            <div
              key={chip.label}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur ${
                i === 0 ? "col-span-2" : ""
              }`}
            >
              <span className="text-3xl">{chip.icon}</span>
              <span className="text-sm font-semibold text-white/90">
                {chip.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
