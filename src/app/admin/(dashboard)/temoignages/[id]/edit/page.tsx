import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTestimonial } from "../../actions";

export default async function EditTestimonialPage({
  params,
}: PageProps<"/admin/temoignages/[id]/edit">) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  const updateWithId = updateTestimonial.bind(null, testimonial.id);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier le témoignage</h1>

      <form
        action={updateWithId}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <input
          name="name"
          required
          defaultValue={testimonial.name}
          placeholder="Nom"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="role"
          defaultValue={testimonial.role ?? ""}
          placeholder="Rôle (optionnel)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="text"
          required
          rows={3}
          defaultValue={testimonial.text}
          placeholder="Témoignage"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <select
          name="rating"
          defaultValue={String(testimonial.rating)}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate">
          <input name="approved" type="checkbox" defaultChecked={testimonial.approved} className="h-4 w-4" />
          Approuvé (visible sur le site)
        </label>
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
