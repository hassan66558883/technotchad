"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLog";

const validStatuses = new Set(["PENDING", "CONFIRMED", "CANCELLED"]);

export async function updateRegistrationStatus(id: string, status: string) {
  if (!validStatuses.has(status)) return;

  await prisma.registration.update({
    where: { id },
    data: { status },
  });

  await logActivity({
    action: `Statut inscription → ${status}`,
    entityType: "Inscription",
    entityId: id,
  });

  revalidatePath("/admin/inscriptions");
  revalidatePath("/admin");
  revalidatePath("/admin/etudiants");
}
