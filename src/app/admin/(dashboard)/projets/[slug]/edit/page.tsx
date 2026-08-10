import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProject } from "../../actions";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projets/[slug]/edit">) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { images: true },
  });
  if (!project) notFound();

  const updateWithSlug = updateProject.bind(null, project.slug);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-navy">Modifier le projet</h1>

      <form
        action={updateWithSlug}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-2"
      >
        <input
          name="category"
          required
          defaultValue={project.category}
          placeholder="Catégorie"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="coverImage"
          defaultValue={project.coverImage ?? ""}
          placeholder="Icône de couverture"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="title"
          required
          defaultValue={project.title}
          placeholder="Titre"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="client"
          required
          defaultValue={project.client}
          placeholder="Client"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="location"
          required
          defaultValue={project.location}
          placeholder="Lieu"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="problem"
          rows={3}
          defaultValue={project.problem}
          placeholder="Le besoin"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="solution"
          rows={3}
          defaultValue={project.solution}
          placeholder="La solution"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <textarea
          name="results"
          rows={4}
          defaultValue={project.results}
          placeholder="Résultats — un par ligne"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <textarea
          name="technologies"
          rows={4}
          defaultValue={project.technologies}
          placeholder="Technologies, séparées par des virgules"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="gallery"
          defaultValue={project.images.map((i) => i.url).join(", ")}
          placeholder="Galerie — icônes séparées par des virgules"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
