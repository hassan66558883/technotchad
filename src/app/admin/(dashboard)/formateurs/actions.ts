"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createInstructor(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2) return;

  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  await prisma.instructor.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      bio: bio || null,
    },
  });

  revalidatePath("/admin/formateurs");
}
