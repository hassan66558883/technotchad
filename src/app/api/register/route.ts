import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePublicPath } from "@/lib/revalidate-locales";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { type, slug, firstName, lastName, phone, email } = body as Record<string, unknown>;

  if (
    (type !== "course" && type !== "workshop") ||
    typeof slug !== "string" ||
    !slug ||
    typeof firstName !== "string" ||
    firstName.trim().length < 2 ||
    typeof lastName !== "string" ||
    lastName.trim().length < 2 ||
    typeof phone !== "string" ||
    phone.trim().length < 6 ||
    typeof email !== "string" ||
    !emailPattern.test(email)
  ) {
    return NextResponse.json(
      { error: "Merci de compléter correctement tous les champs requis." },
      { status: 400 },
    );
  }

  let target: { courseSessionId?: string; workshopSlug?: string; label: string } | null = null;

  if (type === "course") {
    const session = await prisma.courseSession.findFirst({
      where: { courseSlug: slug },
      include: { course: true },
      orderBy: { startDate: "asc" },
    });
    if (!session) {
      return NextResponse.json({ error: "Formation introuvable." }, { status: 404 });
    }
    target = { courseSessionId: session.id, label: session.course.title };
  } else {
    const workshop = await prisma.workshop.findUnique({ where: { slug } });
    if (!workshop) {
      return NextResponse.json({ error: "Workshop introuvable." }, { status: 404 });
    }
    target = { workshopSlug: workshop.slug, label: workshop.title };
  }

  const student = await prisma.student.upsert({
    where: { email: email.trim() },
    update: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    },
    create: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    },
  });

  const registration = await prisma.registration.create({
    data: {
      studentId: student.id,
      courseSessionId: target.courseSessionId,
      workshopSlug: target.workshopSlug,
      status: "PENDING",
    },
  });

  revalidatePublicPath("/formations");
  revalidatePublicPath("");

  return NextResponse.json(
    { id: registration.id, label: target.label },
    { status: 201 },
  );
}
