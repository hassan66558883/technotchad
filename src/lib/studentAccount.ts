import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/email";
import { buildStudentNumber } from "@/lib/certificate";

export async function assignStudentNumber(studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.studentNumber) return student?.studentNumber ?? null;

  const year = student.createdAt.getFullYear();
  const count = await prisma.student.count({
    where: { studentNumber: { startsWith: `ETU-${year}-` } },
  });
  const studentNumber = buildStudentNumber(year, count + 1);

  await prisma.student.update({ where: { id: studentId }, data: { studentNumber } });
  return studentNumber;
}

function generatePassword() {
  return crypto.randomBytes(9).toString("base64url");
}

export async function provisionStudentAccount(studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || student.userId) return null;

  const existingUser = await prisma.user.findUnique({ where: { email: student.email } });
  if (existingUser) {
    await prisma.student.update({ where: { id: studentId }, data: { userId: existingUser.id } });
    return null;
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      password: passwordHash,
      role: "STUDENT",
    },
  });

  await prisma.student.update({ where: { id: studentId }, data: { userId: user.id } });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await sendMail({
    to: student.email,
    subject: "Votre espace étudiant TechnoTchad",
    html: `
      <p>Bonjour ${student.firstName},</p>
      <p>Votre espace étudiant TechnoTchad est prêt. Vous pouvez y suivre vos formations, vos paiements et vos certificats.</p>
      <p>
        <strong>Lien de connexion :</strong> ${siteUrl}/admin/login<br />
        <strong>Email :</strong> ${student.email}<br />
        <strong>Mot de passe temporaire :</strong> ${password}
      </p>
      <p>Nous vous recommandons de changer ce mot de passe dès votre première connexion, depuis "Mon compte".</p>
      <p>L'équipe TechnoTchad</p>
    `,
  });

  return { email: student.email, password };
}
