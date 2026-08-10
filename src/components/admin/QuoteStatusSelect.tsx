"use client";

import { useTransition } from "react";
import { updateQuoteStatus } from "@/app/admin/(dashboard)/demandes-devis/actions";

const statusStyles: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-700",
  CONTACTED: "bg-blue/10 text-blue",
  CLOSED: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  CLOSED: "Clôturé",
};

export default function QuoteStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateQuoteStatus(id, e.target.value))}
      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none disabled:opacity-50 ${statusStyles[status] ?? "bg-mist text-slate"}`}
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
