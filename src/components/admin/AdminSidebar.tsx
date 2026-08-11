"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { canAccessPath } from "@/lib/permissions";

const menu: { section: string; items: { label: string; href: string }[] }[] = [
  {
    section: "Contenu",
    items: [
      { label: "Pages", href: "/admin/pages" },
      { label: "Services", href: "/admin/services" },
      { label: "Filières", href: "/admin/filieres" },
      { label: "Formations", href: "/admin/formations" },
      { label: "Workshops", href: "/admin/workshops" },
      { label: "Projets", href: "/admin/projets" },
      { label: "Actualités", href: "/admin/actualites" },
      { label: "Galerie", href: "/admin/galerie" },
      { label: "Témoignages", href: "/admin/temoignages" },
      { label: "Équipe", href: "/admin/equipe" },
      { label: "Partenaires", href: "/admin/partenaires" },
      { label: "Valeurs", href: "/admin/valeurs" },
      { label: "Statistiques", href: "/admin/statistiques" },
    ],
  },
  {
    section: "Formation",
    items: [
      { label: "Étudiants", href: "/admin/etudiants" },
      { label: "Inscriptions", href: "/admin/inscriptions" },
      { label: "Présences", href: "/admin/presences" },
      { label: "Paiements", href: "/admin/paiements" },
      { label: "Formateurs", href: "/admin/formateurs" },
      { label: "Certificats", href: "/admin/certificats" },
    ],
  },
  {
    section: "Commercial",
    items: [
      { label: "Demandes de devis", href: "/admin/demandes-devis" },
      { label: "Clients", href: "#" },
      { label: "Contrats", href: "#" },
      { label: "Messages", href: "#" },
    ],
  },
  {
    section: "Système",
    items: [
      { label: "Utilisateurs", href: "/admin/utilisateurs" },
      { label: "Rôles", href: "/admin/roles" },
      { label: "Paramètres", href: "/admin/parametres" },
      { label: "Médias", href: "#" },
      { label: "Sauvegardes", href: "#" },
      { label: "Journal d'activité", href: "/admin/journal-activite" },
    ],
  },
];

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const visibleMenu = menu
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessPath(role, item.href)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-navy text-white lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <Image src="/logo-mark-light.png" alt="" width={400} height={582} className="h-8 w-auto" />
        <span className="text-sm font-bold tracking-tight">
          TECHNOTCHAD <span className="text-cyan">ADMIN</span>
        </span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        <Link
          href="/admin"
          className={`block rounded-lg px-3 py-2 text-sm font-semibold ${
            pathname === "/admin" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
          }`}
        >
          📊 Dashboard
        </Link>

        {visibleMenu.map((group) => (
          <div key={group.section}>
            <p className="px-3 text-xs font-bold uppercase tracking-widest text-white/40">
              {group.section}
            </p>
            <div className="mt-2 space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    pathname === item.href
                      ? "bg-white/10 font-semibold text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
