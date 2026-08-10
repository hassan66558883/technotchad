"use client";

import { useTransition } from "react";
import { generateCertificate } from "@/app/admin/(dashboard)/etudiants/actions";

export default function GenerateCertificateButton({
  registrationId,
}: {
  registrationId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => generateCertificate(registrationId))}
      className="rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Génération…" : "Générer le certificat"}
    </button>
  );
}
