import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createTestimonial, deleteTestimonial } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Témoignages — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function TemoignagesPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Témoignages</h1>
        <p className="text-sm text-slate">
          Seuls les témoignages approuvés apparaissent sur la page d&apos;accueil.
        </p>
      </div>

      <form
        action={createTestimonial}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <input
          name="name"
          required
          placeholder="Nom"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="role"
          placeholder="Rôle (optionnel)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="text"
          required
          rows={2}
          placeholder="Témoignage"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <select
          name="rating"
          defaultValue="5"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate">
          <input name="approved" type="checkbox" defaultChecked className="h-4 w-4" />
          Approuvé (visible sur le site)
        </label>
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un témoignage
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-amber-400">{"★".repeat(t.rating)}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  t.approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {t.approved ? "Approuvé" : "En attente"}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink">&ldquo;{t.text}&rdquo;</p>
            <p className="mt-3 text-sm font-semibold text-navy">
              — {t.name}
              {t.role && <span className="font-normal text-slate">, {t.role}</span>}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/admin/temoignages/${t.id}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteTestimonial.bind(null, t.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
