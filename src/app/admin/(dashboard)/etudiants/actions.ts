"use server";

import QRCode from "qrcode";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { buildCertificateNumber, buildVerifyUrl } from "@/lib/certificate";

export async function generateCertificate(registrationId: string) {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { certificate: true },
  });

  if (!registration || registration.certificate) return;

  const year = new Date().getFullYear();
  const count = await prisma.certificate.count({
    where: { certificateNumber: { startsWith: `CERT-${year}-` } },
  });
  const certificateNumber = buildCertificateNumber(year, count + 1);
  const qrCodeUrl = await QRCode.toDataURL(buildVerifyUrl(certificateNumber));

  await prisma.certificate.create({
    data: {
      registrationId: registration.id,
      studentId: registration.studentId,
      certificateNumber,
      qrCodeUrl,
    },
  });

  revalidatePath("/admin/etudiants");
  revalidatePath(`/admin/etudiants/${registration.studentId}`);
  revalidatePath("/admin/certificats");
  revalidatePath("/admin/inscriptions");
}

export type CreateStudentState = { error?: string } | undefined;

export async function createStudent(
  _prevState: CreateStudentState,
  formData: FormData,
): Promise<CreateStudentState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const enrollment = String(formData.get("enrollment") ?? "").trim();

  if (!firstName || !lastName || !phone || !email) {
    return { error: "Merci de remplir le prénom, le nom, le téléphone et l'email." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
  }

  const student = await prisma.student.upsert({
    where: { email },
    update: { firstName, lastName, phone },
    create: { firstName, lastName, phone, email },
  });

  if (enrollment) {
    const [type, id] = enrollment.split(":");
    await prisma.registration.create({
      data: {
        studentId: student.id,
        status: "CONFIRMED",
        courseSessionId: type === "course" ? id : undefined,
        workshopSlug: type === "workshop" ? id : undefined,
      },
    });
    revalidatePath("/admin/inscriptions");
    revalidatePath("/admin");
  }

  revalidatePath("/admin/etudiants");
}
