export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "TRAINER",
  "ACCOUNTANT",
  "EDITOR",
  "STUDENT",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrateur",
  TRAINER: "Formateur",
  ACCOUNTANT: "Comptable",
  EDITOR: "Éditeur",
  STUDENT: "Étudiant",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: "Accès complet à toutes les fonctionnalités, y compris la gestion des utilisateurs et des rôles.",
  ADMIN: "Gestion du site web, des étudiants et des formations.",
  TRAINER: "Gestion des formations, des présences et des étudiants inscrits.",
  ACCOUNTANT: "Gestion des paiements et de la facturation.",
  EDITOR: "Gestion des articles, des pages et de la galerie.",
  STUDENT: "Accès à son propre profil, ses formations et ses certificats.",
};
