import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { localeHref } from "@/lib/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/dictionaries";

export default function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const chips = [
    { label: dict.home.hero.chips.network, icon: "🌐" },
    { label: dict.home.hero.chips.cctv, icon: "📹" },
    { label: dict.home.hero.chips.cloud, icon: "☁️" },
    { label: dict.home.hero.chips.database, icon: "🗄️" },
    { label: dict.home.hero.chips.ai, icon: "🤖" },
  ];

  return (
    <section className="relative overflow-hidden bg-hero-gradient text-white">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <Container className="relative grid grid-cols-1 items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan">
            {dict.home.hero.badge}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {dict.home.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            {dict.home.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={localeHref(lang, "/services")}>{dict.home.hero.ctaServices}</Button>
            <Button href={localeHref(lang, "/formations")} variant="ghost">
              {dict.home.hero.ctaFormations}
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
