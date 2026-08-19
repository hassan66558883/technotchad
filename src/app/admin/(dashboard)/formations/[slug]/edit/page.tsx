import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCourse } from "../../actions";

export default async function EditCoursePage({
  params,
}: PageProps<"/admin/formations/[slug]/edit">) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) notFound();

  const updateWithSlug = updateCourse.bind(null, course.slug);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier le cours</h1>

      <form
        action={updateWithSlug}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <input
          name="category"
          required
          defaultValue={course.category}
          placeholder="Catégorie"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="imageUrl"
          defaultValue={course.imageUrl ?? ""}
          placeholder="Icône (emoji)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="title"
          required
          defaultValue={course.title}
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={course.description}
          placeholder="Description"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="durationLabel"
          required
          defaultValue={course.durationLabel}
          placeholder="Durée"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="price"
          required
          defaultValue={course.price}
          placeholder="Prix"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <p className="text-xs text-slate/60">
          Le paiement intégral est requis avant l&apos;émission du certificat pour toutes les formations.
        </p>
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
