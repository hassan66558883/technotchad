import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProject, deleteProject } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Projets — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function AdminProjetsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Projets</h1>
        <p className="text-sm text-slate">
          Le portfolio de réalisations affiché sur la page d&apos;accueil et /projets.
        </p>
      </div>

      <form
        action={createProject}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <input
          name="category"
          required
          placeholder="Catégorie (ex. CCTV)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="coverImage"
          placeholder="Icône de couverture (emoji)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="title"
          required
          placeholder="Titre du projet"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="client"
          required
          placeholder="Client"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="location"
          required
          placeholder="Lieu"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="problem"
          rows={2}
          placeholder="Le besoin / problème"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="solution"
          rows={2}
          placeholder="La solution apportée"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="results"
          rows={3}
          placeholder="Résultats — un par ligne"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="technologies"
          rows={3}
          placeholder="Technologies, séparées par des virgules"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="gallery"
          placeholder="Galerie — icônes séparées par des virgules"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter un projet
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.slug} className="rounded-2xl border border-line bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-blue">{project.category}</span>
            <h3 className="mt-2 text-sm font-semibold text-navy">{project.title}</h3>
            <p className="mt-1 text-sm text-slate">{project.client}</p>
            <p className="text-xs text-slate/70">{project.location}</p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={`/admin/projets/${project.slug}/edit`}
                className="text-xs font-semibold text-blue hover:text-blue-dark"
              >
                Modifier
              </Link>
              <DeleteButton action={deleteProject.bind(null, project.slug)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
