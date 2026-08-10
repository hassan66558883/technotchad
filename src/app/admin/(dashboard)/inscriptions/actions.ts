"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const validStatuses = new Set(["PENDING", "CONFIRMED", "CANCELLED"]);

export async function updateRegistrationStatus(id: string, status: string) {
  if (!validStatuses.has(status)) return;

  await prisma.registration.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/inscriptions");
  revalidatePath("/admin");
  revalidatePath("/admin/etudiants");
}
