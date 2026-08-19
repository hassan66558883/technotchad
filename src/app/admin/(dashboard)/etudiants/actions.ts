"use server";

import QRCode from "qrcode";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { buildCertificateNumber, buildInscriptionNumber, buildVerifyUrl } from "@/lib/certificate";
import { sendMail } from "@/lib/email";
import { logActivity } from "@/lib/activityLog";
import { provisionStudentAccount, assignStudentNumber } from "@/lib/studentAccount";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

async function currentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  return session?.sub ?? null;
}

function str(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

function int(formData: FormData, key: string) {
  const value = str(formData, key);
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function date(formData: FormData, key: string) {
  const value = str(formData, key);
  return value ? new Date(value) : undefined;
}

const MAX_DISCOUNT_PERCENT = 20;
const MAX_SCHOLARSHIP_PERCENT = 100;

function discountPercent(formData: FormData) {
  const value = int(formData, "discountPercent");
  if (value === undefined) return undefined;
  return Math.min(Math.max(value, 0), MAX_DISCOUNT_PERCENT);
}

function scholarshipPercent(formData: FormData) {
  const value = int(formData, "scholarshipPercent");
  if (value === undefined) return undefined;
  return Math.min(Math.max(value, 0), MAX_SCHOLARSHIP_PERCENT);
}

export async function generateCertificate(registrationId: string) {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      certificate: true,
      payments: true,
      courseSession: { include: { course: true, instructor: true } },
      workshop: true,
    },
  });

  if (!registration || registration.certificate) return;

  // Full payment is required before certificate issuance, for every course and workshop.
  const paid = registration.payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const remaining = (registration.paymentAmount ?? 0) - paid;
  if (remaining > 0) return;

  const year = new Date().getFullYear();
  const count = await prisma.certificate.count({
    where: { certificateNumber: { startsWith: `TT-CERT-${year}-` } },
  });
  const certificateNumber = buildCertificateNumber(year, count + 1);
  const qrCodeUrl = await QRCode.toDataURL(buildVerifyUrl(certificateNumber));
  const createdById = await currentUserId();

  const programTitle = registration.courseSession?.course.title ?? registration.workshop?.title ?? "—";
  const trainingDetail = registration.courseSession?.course.description ?? registration.workshop?.description ?? null;
  const durationLabel =
    registration.courseSession?.course.durationLabel ?? registration.workshop?.durationLabel ?? null;
  const trainingStartDate = registration.courseSession?.startDate ?? registration.workshop?.date ?? null;
  const trainingEndDate = registration.courseSession?.endDate ?? null;
  const instructorName = registration.courseSession?.instructor?.name ?? null;

  await prisma.certificate.create({
    data: {
      registrationId: registration.id,
      studentId: registration.studentId,
      certificateNumber,
      qrCodeUrl,
      programTitle,
      trainingDetail,
      durationLabel,
      trainingStartDate,
      trainingEndDate,
      instructorName,
      createdById,
    },
  });

  await logActivity({
    action: `Certificat généré (${certificateNumber})`,
    entityType: "Certificat",
    entityId: registration.id,
  });

  revalidatePath("/admin/etudiants");
  revalidatePath(`/admin/etudiants/${registration.studentId}`);
  revalidatePath("/admin/certificats");
  revalidatePath("/admin/inscriptions");
}

export async function revokeCertificate(certificateId: string, reason: string) {
  const trimmedReason = reason.trim();
  if (!trimmedReason) return;

  const certificate = await prisma.certificate.update({
    where: { id: certificateId },
    data: { status: "REVOKED", revokedAt: new Date(), revokedReason: trimmedReason },
  });

  await logActivity({
    action: `Certificat révoqué (${certificate.certificateNumber}) — ${trimmedReason}`,
    entityType: "Certificat",
    entityId: certificate.id,
  });

  revalidatePath("/admin/etudiants");
  revalidatePath(`/admin/etudiants/${certificate.studentId}`);
  revalidatePath("/admin/certificats");
}

export async function grantPortalAccess(studentId: string) {
  const result = await provisionStudentAccount(studentId);
  if (result) {
    await logActivity({
      action: `Accès à l'espace étudiant créé (${result.email})`,
      entityType: "Étudiant",
      entityId: studentId,
    });
  }
  revalidatePath(`/admin/etudiants/${studentId}`);
}

export async function reinstateCertificate(certificateId: string) {
  const certificate = await prisma.certificate.update({
    where: { id: certificateId },
    data: { status: "ACTIVE", revokedAt: null, revokedReason: null },
  });

  await logActivity({
    action: `Certificat réactivé (${certificate.certificateNumber})`,
    entityType: "Certificat",
    entityId: certificate.id,
  });

  revalidatePath("/admin/etudiants");
  revalidatePath(`/admin/etudiants/${certificate.studentId}`);
  revalidatePath("/admin/certificats");
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

  const ficheFields = {
    dateOfBirth: date(formData, "dateOfBirth"),
    placeOfBirth: str(formData, "placeOfBirth"),
    gender: str(formData, "gender"),
    address: str(formData, "address"),
    educationLevel: str(formData, "educationLevel"),
    lastDiploma: str(formData, "lastDiploma"),
    institution: str(formData, "institution"),
    profession: str(formData, "profession"),
    emergencyContactName: str(formData, "emergencyContactName"),
    emergencyContactRelation: str(formData, "emergencyContactRelation"),
    emergencyContactPhone: str(formData, "emergencyContactPhone"),
  };

  const student = await prisma.student.upsert({
    where: { email },
    update: { firstName, lastName, phone, ...ficheFields },
    create: { firstName, lastName, phone, email, ...ficheFields },
  });

  await logActivity({
    action: `Fiche étudiant enregistrée (${firstName} ${lastName})`,
    entityType: "Étudiant",
    entityId: student.id,
  });

  void provisionStudentAccount(student.id);
  void assignStudentNumber(student.id);

  if (enrollment) {
    const [type, id] = enrollment.split(":");
    const year = new Date().getFullYear();
    const count = await prisma.registration.count({
      where: { inscriptionNumber: { startsWith: `INSC-${year}-` } },
    });
    const inscriptionNumber = buildInscriptionNumber(year, count + 1);

    const formationTitle =
      type === "course"
        ? (await prisma.courseSession.findUnique({ where: { id }, include: { course: true } }))
            ?.course.title
        : (await prisma.workshop.findUnique({ where: { slug: id } }))?.title;

    const paymentMethod = str(formData, "paymentMethod");

    const registration = await prisma.registration.create({
      data: {
        studentId: student.id,
        status: "CONFIRMED",
        courseSessionId: type === "course" ? id : undefined,
        workshopSlug: type === "workshop" ? id : undefined,
        inscriptionNumber,
        level: str(formData, "level"),
        trainingMode: str(formData, "trainingMode"),
        discountPercent: discountPercent(formData),
        scholarshipPercent: scholarshipPercent(formData),
        paymentAmount: int(formData, "paymentAmount"),
        paymentMethod,
        documentsProvided: str(formData, "documentsProvided"),
      },
    });

    await logActivity({
      action: `Inscription créée (${inscriptionNumber})`,
      entityType: "Inscription",
      entityId: registration.id,
    });

    const initialDeposit = int(formData, "paidAmount");
    if (initialDeposit) {
      await prisma.payment.create({
        data: {
          registrationId: registration.id,
          amount: initialDeposit,
          method: paymentMethod ?? "Espèces",
          status: "PAID",
          paidAt: new Date(),
        },
      });
      await logActivity({
        action: `Acompte enregistré (${initialDeposit} FCFA)`,
        entityType: "Paiement",
        entityId: registration.id,
      });
    }

    void sendMail({
      to: student.email,
      subject: `Confirmation d'inscription — ${inscriptionNumber}`,
      html: `
        <p>Bonjour ${student.firstName},</p>
        <p>Votre inscription${formationTitle ? ` à <strong>${formationTitle}</strong>` : ""} a bien été enregistrée.</p>
        <p><strong>Numéro d'inscription :</strong> ${inscriptionNumber}</p>
        <p>Merci de votre confiance,<br />L'équipe TechnoTchad</p>
      `,
    });

    revalidatePath("/admin/inscriptions");
    revalidatePath("/admin/paiements");
    revalidatePath("/admin");
  }

  revalidatePath("/admin/etudiants");
}

export type UpdateFicheState = { error?: string } | undefined;

export async function updateFiche(
  registrationId: string,
  _prevState: UpdateFicheState,
  formData: FormData,
): Promise<UpdateFicheState> {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    select: { studentId: true },
  });
  if (!registration) return { error: "Fiche introuvable." };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!firstName || !lastName || !phone || !email) {
    return { error: "Merci de remplir le prénom, le nom, le téléphone et l'email." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
  }

  const existing = await prisma.student.findUnique({ where: { email } });
  if (existing && existing.id !== registration.studentId) {
    return { error: "Cet email est déjà utilisé par un autre étudiant." };
  }

  await prisma.student.update({
    where: { id: registration.studentId },
    data: {
      firstName,
      lastName,
      phone,
      email,
      dateOfBirth: date(formData, "dateOfBirth") ?? null,
      placeOfBirth: str(formData, "placeOfBirth") ?? null,
      gender: str(formData, "gender") ?? null,
      address: str(formData, "address") ?? null,
      educationLevel: str(formData, "educationLevel") ?? null,
      lastDiploma: str(formData, "lastDiploma") ?? null,
      institution: str(formData, "institution") ?? null,
      profession: str(formData, "profession") ?? null,
      emergencyContactName: str(formData, "emergencyContactName") ?? null,
      emergencyContactRelation: str(formData, "emergencyContactRelation") ?? null,
      emergencyContactPhone: str(formData, "emergencyContactPhone") ?? null,
    },
  });

  await prisma.registration.update({
    where: { id: registrationId },
    data: {
      level: str(formData, "level") ?? null,
      trainingMode: str(formData, "trainingMode") ?? null,
      discountPercent: discountPercent(formData) ?? null,
      scholarshipPercent: scholarshipPercent(formData) ?? null,
      paymentAmount: int(formData, "paymentAmount") ?? null,
      paymentMethod: str(formData, "paymentMethod") ?? null,
      documentsProvided: str(formData, "documentsProvided") ?? null,
    },
  });

  await logActivity({
    action: `Fiche modifiée (${firstName} ${lastName})`,
    entityType: "Inscription",
    entityId: registrationId,
  });

  revalidatePath("/admin/etudiants");
  revalidatePath(`/admin/etudiants/${registration.studentId}`);
  revalidatePath(`/admin/fiche/${registrationId}`);
  revalidatePath("/admin/inscriptions");
}
