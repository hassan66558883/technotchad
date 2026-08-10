import { getSettings, SOCIAL_SETTING_KEYS } from "@/lib/settings";
import { updateSocialSettings } from "./actions";

export const metadata = { title: "Paramètres — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const settings = await getSettings(SOCIAL_SETTING_KEYS);

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Paramètres</h1>
        <p className="text-sm text-slate">
          Liens vers les réseaux sociaux, affichés dans le pied de page. Laissez
          vide pour masquer une icône.
        </p>
      </div>

      <form
        action={updateSocialSettings}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm"
      >
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            Facebook
          </label>
          <input
            name="social_facebook"
            type="url"
            defaultValue={settings.social_facebook}
            placeholder="https://facebook.com/technotchad"
            className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            TikTok
          </label>
          <input
            name="social_tiktok"
            type="url"
            defaultValue={settings.social_tiktok}
            placeholder="https://tiktok.com/@technotchad"
            className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            YouTube
          </label>
          <input
            name="social_youtube"
            type="url"
            defaultValue={settings.social_youtube}
            placeholder="https://youtube.com/@technotchad"
            className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate">
            WhatsApp
          </label>
          <input
            name="social_whatsapp"
            type="url"
            defaultValue={settings.social_whatsapp}
            placeholder="https://wa.me/23560984849"
            className="mt-1.5 w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-dark"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
