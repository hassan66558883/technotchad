import Container from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export default async function Stats() {
  const stats = await prisma.stat.findMany({ orderBy: { order: "asc" } });

  return (
    <section className="border-b border-line bg-white">
      <Container className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center">
            <div className="text-3xl font-bold text-navy sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm font-medium text-slate">
              {stat.label}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
