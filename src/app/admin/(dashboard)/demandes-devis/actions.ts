"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const validStatuses = new Set(["NEW", "CONTACTED", "CLOSED"]);

export async function updateQuoteStatus(id: string, status: string) {
  if (!validStatuses.has(status)) return;

  await prisma.quoteRequest.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/demandes-devis");
  revalidatePath("/admin");
}
