import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createService, deleteService } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Services — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Services</h1>
        <p className="text-sm text-slate">
          Affichés sur la page d&apos;accueil et sur /services.
        </p>
      </div>

      <form
        action={createService}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
      >
        <input
          name="icon"
          required
          placeholder="Icône (emoji)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="title"
          required
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="order"
          type="number"
          placeholder="Ordre"
          defaultValue={services.length}
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="description"
          required
          rows={2}
          placeholder="Description"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-4"
        />
        <button
          type="submit"
          className="sm:col-span-4 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un service
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.slug} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <span className="text-2xl">{service.icon}</span>
            <h3 className="mt-3 text-sm font-semibold text-navy">{service.title}</h3>
            <p className="mt-2 text-sm text-slate">{service.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/admin/services/${service.slug}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteService.bind(null, service.slug)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
