"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLog";

const validStatuses = new Set(["PENDING", "PAID", "REFUNDED"]);

export async function createPayment(formData: FormData) {
  const registrationId = String(formData.get("registrationId") ?? "");
  const amount = Number(formData.get("amount"));
  const method = String(formData.get("method") ?? "").trim();

  if (!registrationId || !Number.isFinite(amount) || amount <= 0 || !method) return;

  const payment = await prisma.payment.create({
    data: {
      registrationId,
      amount: Math.round(amount),
      method,
      status: "PENDING",
    },
  });

  await logActivity({
    action: `Paiement enregistré (${Math.round(amount)} FCFA)`,
    entityType: "Paiement",
    entityId: payment.id,
  });

  revalidatePath("/admin/paiements");
}

export async function updatePaymentStatus(id: string, status: string) {
  if (!validStatuses.has(status)) return;

  await prisma.payment.update({
    where: { id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : null,
    },
  });

  await logActivity({
    action: `Statut paiement → ${status}`,
    entityType: "Paiement",
    entityId: id,
  });

  revalidatePath("/admin/paiements");
}
