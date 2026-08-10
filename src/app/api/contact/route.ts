import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json({ id: quoteRequest.id }, { status: 201 });
}
