import { prisma } from "@/lib/prisma";
import { createGalleryImage, deleteGalleryImage } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const metadata = { title: "Galerie — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function GaleriePage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { id: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Galerie</h1>
        <p className="text-sm text-slate">
          Bibliothèque d&apos;images réutilisables (URL d&apos;image ou emoji en attendant l&apos;upload de fichiers).
        </p>
      </div>

      <form
        action={createGalleryImage}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
      >
        <input
          name="url"
          required
          placeholder="URL de l'image ou emoji"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
        />
        <input
          name="caption"
          placeholder="Légende (optionnel)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <input
          name="category"
          placeholder="Catégorie (optionnel)"
          className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="sm:col-span-4 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Ajouter à la galerie
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {images.map((image) => (
          <div key={image.id} className="rounded-2xl border border-line bg-white p-4 text-center shadow-sm">
            <div className="flex h-16 items-center justify-center text-3xl">{image.url}</div>
            {image.caption && <p className="mt-2 text-xs text-slate">{image.caption}</p>}
            <div className="mt-3">
              <DeleteButton action={deleteGalleryImage.bind(null, image.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
