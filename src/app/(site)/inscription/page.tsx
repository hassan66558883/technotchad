import Link from "next/link";
import Container from "@/components/ui/Container";
import RegistrationForm from "@/components/RegistrationForm";
import { formations, workshops } from "@/lib/data";

export const metadata = { title: "Inscription — TechnoTchad" };

export default async function InscriptionPage({
  searchParams,
}: PageProps<"/inscription">) {
  const params = await searchParams;
  const type = params.type === "workshop" ? "workshop" : "course";
  const slug = typeof params.slug === "string" ? params.slug : "";

  const formation = type === "course" ? formations.find((f) => f.slug === slug) : undefined;
  const workshop = type === "workshop" ? workshops.find((w) => w.slug === slug) : undefined;
  const item = formation ?? workshop;

  if (!item) {
    return (
      <section className="bg-white py-24">
        <Container className="max-w-xl text-center">
          <h1 className="text-2xl font-bold text-navy">
            Formation ou workshop introuvable
          </h1>
          <p className="mt-3 text-slate">
            Merci de repartir de la page Formations pour choisir une session.
          </p>
          <Link
            href="/formations"
            className="mt-6 inline-flex rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-dark"
          >
            Voir les formations
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-mist py-16 sm:py-20">
      <Container className="max-w-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-blue">
          Inscription
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy">
          {item.title}
        </h1>
        <p className="mt-2 text-sm text-slate">
          {"category" in item ? item.category : "Workshop"} · {item.duration}
        </p>

        <div className="mt-8">
          <RegistrationForm type={type} slug={slug} />
        </div>
      </Container>
    </section>
  );
}
