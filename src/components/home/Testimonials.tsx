import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";

export default async function Testimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-mist py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Témoignages" title="Ce qu'ils en disent" />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-line bg-white p-7 shadow-sm"
            >
              <div className="text-amber-400">{"★".repeat(t.rating)}</div>
              <p className="mt-4 text-sm leading-relaxed text-ink">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="mt-5 text-sm font-semibold text-navy">
                — {t.name}
                {t.role && <span className="font-normal text-slate"> · {t.role}</span>}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
