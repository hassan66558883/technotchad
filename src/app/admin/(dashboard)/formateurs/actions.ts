"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLog";

export async function createInstructor(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return;

  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const instructor = await prisma.instructor.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      bio: bio || null,
    },
  });

  await logActivity({ action: `Formateur ajouté (${name})`, entityType: "Formateur", entityId: instructor.id });

  revalidatePath("/admin/formateurs");
}
