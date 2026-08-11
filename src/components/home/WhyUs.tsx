import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";
import type { Dictionary } from "@/dictionaries";

const icons = ["🎯", "👨‍🏫", "🏛️", "💻", "🇬🇧", "🤝"];

export default async function WhyUs({ dict }: { dict: Dictionary }) {
  const whyUs = await prisma.companyValue.findMany({
    where: { type: "WHY_US" },
    orderBy: { order: "asc" },
  });

  return (
    <section className="bg-mist py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow={dict.home.whyUs.eyebrow} title={dict.home.whyUs.title} />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item, i) => (
            <div
              key={item.id}
              className="rounded-2xl border border-line bg-white p-7 text-center shadow-sm"
            >
              <span className="text-3xl">{icons[i % icons.length]}</span>
              <h3 className="mt-4 text-base font-semibold text-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
