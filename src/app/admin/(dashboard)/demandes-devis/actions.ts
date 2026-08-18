"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLog";

const validStatuses = new Set(["NEW", "CONTACTED", "CLOSED"]);

export async function updateQuoteStatus(id: string, status: string) {
  if (!validStatuses.has(status)) return;

  await prisma.quoteRequest.update({
    where: { id },
    data: { status },
  });

  await logActivity({
    action: `Statut demande de devis → ${status}`,
    entityType: "Demande de devis",
    entityId: id,
  });

  revalidatePath("/admin/demandes-devis");
  revalidatePath("/admin");
}
