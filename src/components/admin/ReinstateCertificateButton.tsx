"use client";

import { useTransition } from "react";
import { reinstateCertificate } from "@/app/admin/(dashboard)/etudiants/actions";

export default function ReinstateCertificateButton({ certificateId }: { certificateId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (window.confirm("Réactiver ce certificat ?")) {
          startTransition(() => reinstateCertificate(certificateId));
        }
      }}
      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Réactivation…" : "Réactiver"}
    </button>
  );
}
