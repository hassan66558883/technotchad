import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateSession } from "../../../actions";

export default async function EditSessionPage({
  params,
}: PageProps<"/admin/formations/sessions/[id]/edit">) {
  const { id } = await params;
  const [session, instructors] = await Promise.all([
    prisma.courseSession.findUnique({ where: { id }, include: { course: true } }),
    prisma.instructor.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!session) notFound();

  const updateWithId = updateSession.bind(null, session.id);
  const dateValue = session.startDate.toISOString().slice(0, 10);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">
        Modifier la session — {session.course.title}
      </h1>

      <form
        action={updateWithId}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <input
          name="startDate"
          type="date"
          required
          defaultValue={dateValue}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="schedule"
          required
          defaultValue={session.schedule}
          placeholder="Horaire"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="seats"
          type="number"
          required
          min={1}
          defaultValue={session.seats}
          placeholder="Places"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <select
          name="instructorId"
          defaultValue={session.instructorId ?? ""}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          <option value="">Formateur</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={session.status}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          <option value="UPCOMING">À venir</option>
          <option value="ONGOING">En cours</option>
          <option value="COMPLETED">Terminée</option>
          <option value="CANCELLED">Annulée</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
