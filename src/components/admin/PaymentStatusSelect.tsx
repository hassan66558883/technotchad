"use client";

import { useTransition } from "react";
import { updatePaymentStatus } from "@/app/admin/(dashboard)/paiements/actions";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  REFUNDED: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  REFUNDED: "Remboursé",
};

export default function PaymentStatusSelect({
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
      onChange={(e) => startTransition(() => updatePaymentStatus(id, e.target.value))}
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
