import Link from "next/link";
import { logout } from "@/app/admin/(dashboard)/actions";

export default function AdminTopbar({ name }: { name: string }) {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";

  return (
    <header className="flex h-16 items-center justify-between border-b border-line bg-white px-6">
      <div>
        <h1 className="text-sm font-semibold text-navy">Tableau de bord</h1>
        <p className="text-xs text-slate">Vue d&apos;ensemble de la plateforme</p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/admin/compte" className="flex items-center gap-2 hover:opacity-80">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue text-xs font-bold text-white">
            {initial}
          </span>
          <span className="text-sm font-semibold text-navy">{name}</span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-slate hover:border-red-300 hover:text-red-600"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  );
}
