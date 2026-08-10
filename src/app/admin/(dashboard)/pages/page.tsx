import { getSettings, ABOUT_SETTING_KEYS } from "@/lib/settings";
import { updateAboutSettings } from "./actions";

export const metadata = { title: "Pages — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function PagesSettingsPage() {
  const settings = await getSettings(ABOUT_SETTING_KEYS);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Page « À propos »</h1>
        <p className="text-sm text-slate">
          Le texte de présentation, vision, mission, localisation, infrastructures,
          pédagogie et conditions d&apos;admission. Pour les listes, une entrée par ligne.
        </p>
      </div>

      <form action={updateAboutSettings} className="space-y-6">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-navy">Présentation</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                Année de création
              </label>
              <input
                name="about_founded_year"
                defaultValue={settings.about_founded_year}
                className="mt-1.5 w-32 rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                Paragraphe d&apos;introduction
              </label>
              <textarea
                name="about_intro"
                rows={4}
                defaultValue={settings.about_intro}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-navy">Vision & mission</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                Notre vision (une par ligne)
              </label>
              <textarea
                name="about_vision"
                rows={5}
                defaultValue={settings.about_vision}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                Notre mission (une par ligne)
              </label>
              <textarea
                name="about_mission"
                rows={5}
                defaultValue={settings.about_mission}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-navy">Localisation & infrastructures</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                Description de la localisation
              </label>
              <textarea
                name="about_location_description"
                rows={3}
                defaultValue={settings.about_location_description}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                Infrastructures (une par ligne)
              </label>
              <textarea
                name="about_infrastructure"
                rows={3}
                defaultValue={settings.about_infrastructure}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-navy">Enseignants & pédagogie</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                Paragraphe sur le corps enseignant
              </label>
              <textarea
                name="about_teaching_intro"
                rows={3}
                defaultValue={settings.about_teaching_intro}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate">
                Méthodes pédagogiques (une par ligne)
              </label>
              <textarea
                name="about_teaching_methods"
                rows={4}
                defaultValue={settings.about_teaching_methods}
                className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-navy">Conditions d&apos;admission</h2>
          <textarea
            name="about_admission"
            rows={3}
            defaultValue={settings.about_admission}
            className="mt-4 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
