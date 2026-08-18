import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { canAccessPath } from "@/lib/permissions";
import { buildVerifyUrl } from "@/lib/certificate";
import CertificateDocument from "@/components/certificate/CertificateDocument";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session || !canAccessPath(session.role, "/admin/certificats")) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { number } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { certificateNumber: number },
    include: { student: true },
  });

  if (!certificate) {
    return NextResponse.json({ error: "Certificat introuvable." }, { status: 404 });
  }

  const logoPath = path.join(process.cwd(), "src", "assets", "certificate", "logo.jpeg");
  const logoBuffer = await readFile(logoPath);
  const logoDataUri = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;

  const verifyUrl = buildVerifyUrl(certificate.certificateNumber);
  const qrCodeDataUri = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 300 });

  const buffer = await renderToBuffer(
    CertificateDocument({
      logoDataUri,
      certificateNumber: certificate.certificateNumber,
      studentFullName: `${certificate.student.firstName} ${certificate.student.lastName}`,
      dateOfBirth: certificate.student.dateOfBirth,
      placeOfBirth: certificate.student.placeOfBirth,
      gender: certificate.student.gender,
      programTitle: certificate.programTitle,
      trainingDetail: certificate.trainingDetail,
      trainingStartDate: certificate.trainingStartDate,
      trainingEndDate: certificate.trainingEndDate,
      instructorName: certificate.instructorName,
      issuedAt: certificate.issuedAt,
      qrCodeDataUri,
      verifyUrl,
      status: certificate.status === "REVOKED" ? "REVOKED" : "ACTIVE",
    }),
  );

  const url = new URL(request.url);
  const disposition = url.searchParams.get("download") === "1" ? "attachment" : "inline";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${certificate.certificateNumber}.pdf"`,
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
