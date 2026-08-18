"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLog";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { buildPaymentReference } from "@/lib/payment";

const validStatuses = new Set(["PENDING", "PAID", "REFUNDED"]);

async function currentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  return session?.sub ?? null;
}

export async function createPayment(formData: FormData) {
  const registrationId = String(formData.get("registrationId") ?? "");
  const amount = Number(formData.get("amount"));
  const method = String(formData.get("method") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!registrationId || !Number.isFinite(amount) || amount <= 0 || !method) return;

  const year = new Date().getFullYear();
  const count = await prisma.payment.count({
    where: { reference: { startsWith: `RECU-${year}-` } },
  });
  const reference = buildPaymentReference(year, count + 1);
  const recordedById = await currentUserId();

  const payment = await prisma.payment.create({
    data: {
      registrationId,
      amount: Math.round(amount),
      method,
      status: "PENDING",
      reference,
      note: note || null,
      recordedById,
    },
  });

  await logActivity({
    action: `Paiement enregistré (${reference}, ${Math.round(amount)} FCFA)`,
    entityType: "Paiement",
    entityId: payment.id,
  });

  revalidatePath("/admin/paiements");
  revalidatePath(`/admin/fiche/${registrationId}`);
}

export async function updatePaymentStatus(id: string, status: string) {
  if (!validStatuses.has(status)) return;

  const payment = await prisma.payment.update({
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
  revalidatePath(`/admin/fiche/${payment.registrationId}`);
}

export async function setPaymentDueDate(registrationId: string, dueDate: string) {
  await prisma.registration.update({
    where: { id: registrationId },
    data: { paymentDueDate: dueDate ? new Date(dueDate) : null },
  });

  revalidatePath("/admin/paiements");
  revalidatePath(`/admin/fiche/${registrationId}`);
}
