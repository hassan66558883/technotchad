import Container from "@/components/ui/Container";
import { technologies } from "@/lib/data";

export default function Technologies() {
  return (
    <section className="border-y border-line bg-mist py-16">
      <Container>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate">
          Technologies & partenaires
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy"
            >
              {tech}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
