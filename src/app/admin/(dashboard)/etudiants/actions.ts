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
