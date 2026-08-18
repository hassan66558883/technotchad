"use client";

import { useTransition } from "react";
import { revokeCertificate } from "@/app/admin/(dashboard)/etudiants/actions";

export default function RevokeCertificateButton({ certificateId }: { certificateId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const reason = window.prompt("Motif de la révocation (obligatoire) :");
        if (reason === null) return;
        if (!reason.trim()) {
          window.alert("Un motif est requis pour révoquer un certificat.");
          return;
        }
        startTransition(() => revokeCertificate(certificateId, reason));
      }}
      className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Révocation…" : "Révoquer"}
    </button>
  );
}
