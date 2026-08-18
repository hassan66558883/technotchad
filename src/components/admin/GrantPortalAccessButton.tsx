"use client";

import { useTransition } from "react";
import { grantPortalAccess } from "@/app/admin/(dashboard)/etudiants/actions";

export default function GrantPortalAccessButton({ studentId }: { studentId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => grantPortalAccess(studentId))}
      className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-navy hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Création…" : "Créer un accès à l'espace étudiant"}
    </button>
  );
}
