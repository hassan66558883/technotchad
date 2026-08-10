import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail, getAdminNotificationEmail } from "@/lib/email";

const serviceOptions = new Set([
  "Site web",
  "Réseau",
  "CCTV",
  "PBX",
  "ERP",
  "Formation",
  "Maintenance",
  "Autre",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { name, company, phone, email, serviceType, budget, message } = body as Record<
    string,
    unknown
  >;

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof phone !== "string" ||
    phone.trim().length < 6 ||
    typeof email !== "string" ||
    !emailPattern.test(email) ||
    typeof serviceType !== "string" ||
    !serviceOptions.has(serviceType) ||
    typeof message !== "string" ||
    message.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "Merci de compléter correctement tous les champs requis." },
      { status: 400 },
    );
  }

  const quoteRequest = await prisma.quoteRequest.create({
    data: {
      name: name.trim(),
      company: typeof company === "string" && company.trim() ? company.trim() : null,
      phone: phone.trim(),
      email: email.trim(),
      serviceType,
      budget: typeof budget === "string" && budget.trim() ? budget.trim() : null,
      message: message.trim(),
    },
  });

  const adminEmail = getAdminNotificationEmail();
  if (adminEmail) {
    void sendMail({
      to: adminEmail,
      subject: `Nouvelle demande de devis — ${quoteRequest.name}`,
      replyTo: quoteRequest.email,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <p><strong>Nom :</strong> ${quoteRequest.name}</p>
        ${quoteRequest.company ? `<p><strong>Entreprise :</strong> ${quoteRequest.company}</p>` : ""}
        <p><strong>Téléphone :</strong> ${quoteRequest.phone}</p>
        <p><strong>Email :</strong> ${quoteRequest.email}</p>
        <p><strong>Service :</strong> ${quoteRequest.serviceType}</p>
        ${quoteRequest.budget ? `<p><strong>Budget :</strong> ${quoteRequest.budget}</p>` : ""}
        <p><strong>Message :</strong></p>
        <p>${quoteRequest.message.replace(/\n/g, "<br />")}</p>
      `,
    });
  }

  void sendMail({
    to: quoteRequest.email,
    subject: "Nous avons bien reçu votre demande — TechnoTchad",
    html: `
      <p>Bonjour ${quoteRequest.name},</p>
      <p>Nous avons bien reçu votre demande concernant <strong>${quoteRequest.serviceType}</strong>.
      Notre équipe vous recontactera très prochainement au ${quoteRequest.phone}.</p>
      <p>Merci de votre confiance,<br />L'équipe TechnoTchad</p>
    `,
  });

  return NextResponse.json({ id: quoteRequest.id }, { status: 201 });
}
