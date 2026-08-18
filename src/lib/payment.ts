export type PaymentStatus = "NON_PAYE" | "PARTIEL" | "PAYE" | "EN_RETARD";

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  NON_PAYE: "Non payé",
  PARTIEL: "Partiellement payé",
  PAYE: "Payé",
  EN_RETARD: "En retard",
};

export const paymentStatusStyles: Record<PaymentStatus, string> = {
  NON_PAYE: "bg-mist text-slate",
  PARTIEL: "bg-amber-100 text-amber-700",
  PAYE: "bg-emerald-100 text-emerald-700",
  EN_RETARD: "bg-red-100 text-red-700",
};

export function computePaymentStatus({
  totalDue,
  totalPaid,
  dueDate,
}: {
  totalDue: number | null | undefined;
  totalPaid: number;
  dueDate: Date | null | undefined;
}): PaymentStatus {
  const due = totalDue ?? 0;
  const remaining = due - totalPaid;

  if (remaining <= 0 && due > 0) return "PAYE";
  if (dueDate && remaining > 0 && dueDate.getTime() < Date.now()) return "EN_RETARD";
  if (totalPaid > 0 && remaining > 0) return "PARTIEL";
  return "NON_PAYE";
}

export function buildPaymentReference(year: number, sequence: number) {
  return `RECU-${year}-${String(sequence).padStart(5, "0")}`;
}
