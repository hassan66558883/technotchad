import Container from "@/components/ui/Container";
import type { Dictionary } from "@/dictionaries";

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue">
            {dict.home.about.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {dict.home.about.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate">
            {dict.home.about.description}
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-mist p-7">
            <h3 className="text-sm font-bold uppercase tracking-wide text-blue">
              {dict.home.about.visionTitle}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink">
              {dict.home.about.visionText}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-mist p-7">
            <h3 className="text-sm font-bold uppercase tracking-wide text-blue">
              {dict.home.about.missionTitle}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-ink">
              {dict.home.about.missionText}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
