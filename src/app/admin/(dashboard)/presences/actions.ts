"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLog";

export async function markAttendance(
  registrationId: string,
  courseSessionId: string,
  dateISO: string,
  present: boolean,
) {
  const date = new Date(`${dateISO}T00:00:00.000Z`);

  const existing = await prisma.attendance.findFirst({
    where: { registrationId, courseSessionId, date },
  });

  if (existing) {
    await prisma.attendance.update({ where: { id: existing.id }, data: { present } });
  } else {
    await prisma.attendance.create({
      data: { registrationId, courseSessionId, date, present },
    });
  }

  await logActivity({
    action: `Présence ${present ? "marquée" : "annulée"} (${dateISO})`,
    entityType: "Présence",
    entityId: registrationId,
  });

  revalidatePath("/admin/presences");
  revalidatePath("/admin/etudiants");
}
