// Which /admin/* sections each role may access. Paths are matched as exact
// matches or prefixes (so "/admin/formations" also covers
// "/admin/formations/sessions/xyz/edit"). SUPER_ADMIN gets everything.
// The dashboard root ("/admin") is handled separately in canAccessPath —
// it must NOT appear in these lists, since "/admin/" is a prefix of every
// other admin path and would defeat the restriction entirely.

const CONTENT_PATHS = [
  "/admin/pages",
  "/admin/services",
  "/admin/filieres",
  "/admin/projets",
  "/admin/actualites",
  "/admin/galerie",
  "/admin/temoignages",
  "/admin/equipe",
  "/admin/partenaires",
  "/admin/valeurs",
  "/admin/statistiques",
];

const TRAINING_OPS_PATHS = [
  "/admin/formations",
  "/admin/workshops",
  "/admin/etudiants",
  "/admin/inscriptions",
  "/admin/presences",
  "/admin/formateurs",
  "/admin/certificats",
];

export const ROLE_PATHS: Record<string, "*" | string[]> = {
  SUPER_ADMIN: "*",
  ADMIN: ["/admin/compte", ...CONTENT_PATHS, ...TRAINING_OPS_PATHS, "/admin/demandes-devis"],
  TRAINER: ["/admin/compte", ...TRAINING_OPS_PATHS],
  SECRETARY: [
    "/admin/compte",
    "/admin/etudiants",
    "/admin/inscriptions",
    "/admin/presences",
    "/admin/paiements",
    "/admin/certificats",
  ],
  ACCOUNTANT: ["/admin/compte", "/admin/paiements"],
  EDITOR: ["/admin/compte", ...CONTENT_PATHS],
  STUDENT: [],
};

export function canAccessPath(role: string, pathname: string): boolean {
  const allowed = ROLE_PATHS[role];
  if (!allowed) return false;
  if (allowed === "*") return true;
  if (pathname === "/admin") return allowed.length > 0;
  return allowed.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function hasAnyAdminAccess(role: string): boolean {
  const allowed = ROLE_PATHS[role];
  return allowed === "*" || (Array.isArray(allowed) && allowed.length > 0);
}
