import { prisma } from "@/lib/prisma";
import { createInstructor } from "./actions";

export const metadata = { title: "Formateurs — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function FormateursPage() {
  const instructors = await prisma.instructor.findMany({
    include: { courses: { include: { course: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Formateurs</h1>
        <p className="text-sm text-slate">
          {instructors.length} formateur{instructors.length > 1 ? "s" : ""} enregistré
          {instructors.length > 1 ? "s" : ""}.
        </p>
      </div>

      <form
        action={createInstructor}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <input
          name="name"
          required
          minLength={2}
          placeholder="Nom complet"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="phone"
          placeholder="Téléphone"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="bio"
          placeholder="Spécialité / bio courte"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un formateur
        </button>
      </form>

      {instructors.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">Aucun formateur enregistré.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {instructor.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <h2 className="mt-3 text-base font-semibold text-navy">{instructor.name}</h2>
              {instructor.bio && <p className="mt-1 text-sm text-slate">{instructor.bio}</p>}
              <div className="mt-2 space-y-0.5 text-xs text-slate/80">
                {instructor.email && <p>✉️ {instructor.email}</p>}
                {instructor.phone && <p>📞 {instructor.phone}</p>}
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue">
                {instructor.courses.length} session{instructor.courses.length > 1 ? "s" : ""} animée
                {instructor.courses.length > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
