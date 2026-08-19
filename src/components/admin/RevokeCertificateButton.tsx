"use client";

import { useState, useTransition } from "react";
import { revokeCertificate } from "@/app/admin/(dashboard)/etudiants/actions";

export default function RevokeCertificateButton({ certificateId }: { certificateId: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-red-600 hover:text-red-700"
      >
        Révoquer
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          setError(null);
        }}
        placeholder="Motif de la révocation"
        autoFocus
        disabled={isPending}
        className="w-40 rounded border border-line px-2 py-1 text-xs outline-none focus:border-blue"
      />
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!reason.trim()) {
            setError("Un motif est requis.");
            return;
          }
          startTransition(async () => {
            await revokeCertificate(certificateId, reason.trim());
            setOpen(false);
            setReason("");
          });
        }}
        className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Révocation…" : "Confirmer"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setOpen(false);
          setReason("");
          setError(null);
        }}
        className="text-xs font-semibold text-slate hover:text-navy disabled:cursor-not-allowed disabled:opacity-50"
      >
        Annuler
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
