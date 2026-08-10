import { prisma } from "@/lib/prisma";

export async function getUpcomingSessions(limit?: number) {
  const sessions = await prisma.courseSession.findMany({
    where: { status: "UPCOMING" },
    orderBy: { startDate: "asc" },
    take: limit,
    include: {
      course: true,
      instructor: true,
      registrations: { where: { status: { not: "CANCELLED" } } },
    },
  });

  return sessions.map((session) => ({
    ...session,
    seatsLeft: Math.max(0, session.seats - session.registrations.length),
  }));
}

export async function getUpcomingWorkshops(limit?: number) {
  const workshops = await prisma.workshop.findMany({
    where: { status: "UPCOMING" },
    orderBy: { date: "asc" },
    take: limit,
    include: {
      registrations: { where: { status: { not: "CANCELLED" } } },
    },
  });

  return workshops.map((workshop) => ({
    ...workshop,
    seatsLeft: Math.max(0, workshop.seats - workshop.registrations.length),
  }));
}

export function formatSessionDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}
