import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createCourse, deleteCourse, createSession, deleteSession } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Formations — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default async function AdminFormationsPage() {
  const [courses, instructors] = await Promise.all([
    prisma.course.findMany({
      orderBy: { title: "asc" },
      include: { sessions: { orderBy: { startDate: "asc" }, include: { instructor: true } } },
    }),
    prisma.instructor.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Formations</h1>
        <p className="text-sm text-slate">
          Le catalogue de cours et leurs sessions programmées.
        </p>
      </div>

      <form
        action={createCourse}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <input
          name="category"
          required
          placeholder="Catégorie (ex. Bureautique)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="imageUrl"
          placeholder="Icône (emoji)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="title"
          required
          placeholder="Titre du cours"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="description"
          required
          rows={2}
          placeholder="Description"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="durationLabel"
          required
          placeholder="Durée (ex. 20 jours)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="price"
          required
          placeholder="Prix (ex. 45 000 FCFA)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2">
          <input type="checkbox" name="requiresFullPayment" className="h-4 w-4 rounded border-line" />
          Paiement intégral requis avant émission du certificat
        </label>
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un cours
        </button>
      </form>

      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.slug} className="rounded-2xl border border-line bg-white shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl">{course.imageUrl}</span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-blue">
                    {course.category}
                  </span>
                  <h2 className="text-base font-semibold text-navy">{course.title}</h2>
                  <p className="mt-1 text-sm text-slate">{course.description}</p>
                  <p className="mt-1 text-xs text-slate/70">
                    {course.durationLabel} · {course.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/formations/${course.slug}/edit`}
                  className="text-xs font-semibold text-blue hover:text-blue-dark"
                >
                  Modifier
                </Link>
                <DeleteButton
                  action={deleteCourse.bind(null, course.slug)}
                  confirmText="Supprimer ce cours et toutes ses sessions ?"
                />
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate">
                Sessions ({course.sessions.length})
              </h3>
              <div className="mt-3 space-y-2">
                {course.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-mist px-4 py-2.5 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-ink">
                      <span className="font-semibold text-navy">{formatDate(session.startDate)}</span>
                      <span className="text-slate">{session.schedule}</span>
                      <span className="text-slate">{session.seats} places</span>
                      {session.instructor && <span className="text-slate">— {session.instructor.name}</span>}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          session.status === "UPCOMING"
                            ? "bg-blue/10 text-blue"
                            : session.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/formations/sessions/${session.id}/edit`}
                        className="text-xs font-semibold text-blue hover:text-blue-dark"
                      >
                        Modifier
                      </Link>
                      <DeleteButton action={deleteSession.bind(null, session.id)} />
                    </div>
                  </div>
                ))}
                {course.sessions.length === 0 && (
                  <p className="text-sm text-slate">Aucune session programmée.</p>
                )}
              </div>

              <form
                action={createSession}
                className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-dashed border-line p-4 sm:grid-cols-5"
              >
                <input type="hidden" name="courseSlug" value={course.slug} />
                <input
                  name="startDate"
                  type="date"
                  required
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
                />
                <input
                  name="schedule"
                  required
                  placeholder="Horaire (ex. 09h-11h)"
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
                />
                <input
                  name="seats"
                  type="number"
                  required
                  min={1}
                  placeholder="Places"
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
                />
                <select
                  name="instructorId"
                  defaultValue=""
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-blue"
                >
                  <option value="">Formateur</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy-2"
                >
                  Ajouter la session
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
