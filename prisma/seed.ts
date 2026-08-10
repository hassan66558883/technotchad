import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  formations,
  workshops,
  services,
  projects,
  articles,
  testimonials,
  team,
  partners,
  companyValues,
  whyUs,
  stats,
  filieres,
  companyFacts,
} from "../src/lib/data";

const DEFAULT_ADMIN_EMAIL = "admin@technotchad.com";
const DEFAULT_ADMIN_PASSWORD = "TechnoTchad2026!";
const DEFAULT_ADMIN_NAME = "Hassan Ismail Nassour";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

function parseFrenchDate(label: string): Date {
  const months: Record<string, number> = {
    janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
    juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
  };
  const [day, month, year] = label.toLowerCase().split(" ");
  return new Date(Number(year), months[month] ?? 0, Number(day));
}

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: DEFAULT_ADMIN_EMAIL },
    update: { name: DEFAULT_ADMIN_NAME },
    create: {
      name: DEFAULT_ADMIN_NAME,
      email: DEFAULT_ADMIN_EMAIL,
      password: passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`Admin user ready: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`);

  const instructorNames = Array.from(new Set(formations.map((f) => f.instructor)));
  const instructors = new Map<string, string>();

  for (const name of instructorNames) {
    const instructor = await prisma.instructor.upsert({
      where: { id: name },
      update: { name },
      create: { id: name, name },
    });
    instructors.set(name, instructor.id);
  }

  for (const formation of formations) {
    await prisma.course.upsert({
      where: { slug: formation.slug },
      update: {
        category: formation.category,
        title: formation.title,
        description: formation.description,
        price: formation.price,
        durationLabel: formation.duration,
        imageUrl: formation.image,
      },
      create: {
        slug: formation.slug,
        category: formation.category,
        title: formation.title,
        description: formation.description,
        price: formation.price,
        durationLabel: formation.duration,
        imageUrl: formation.image,
      },
    });

    const existingSession = await prisma.courseSession.findFirst({
      where: { courseSlug: formation.slug },
    });

    if (!existingSession) {
      await prisma.courseSession.create({
        data: {
          courseSlug: formation.slug,
          instructorId: instructors.get(formation.instructor),
          startDate: parseFrenchDate(formation.startDate),
          schedule: formation.schedule,
          seats: formation.seats,
          status: "UPCOMING",
        },
      });
    }
  }

  for (const workshop of workshops) {
    await prisma.workshop.upsert({
      where: { slug: workshop.slug },
      update: {
        title: workshop.title,
        description: workshop.description,
        durationLabel: workshop.duration,
        schedule: workshop.schedule,
        date: parseFrenchDate(workshop.date),
        seats: workshop.seatsLeft,
      },
      create: {
        slug: workshop.slug,
        title: workshop.title,
        description: workshop.description,
        durationLabel: workshop.duration,
        schedule: workshop.schedule,
        date: parseFrenchDate(workshop.date),
        seats: workshop.seatsLeft,
      },
    });
  }

  console.log(
    `Seeded ${formations.length} courses, ${workshops.length} workshops, ${instructorNames.length} instructors.`,
  );

  // Content collections below are seeded once (only if empty) so that
  // re-running this script never overwrites edits made through /admin.

  if ((await prisma.service.count()) === 0) {
    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      await prisma.service.create({
        data: { slug: s.slug, icon: s.icon, title: s.title, description: s.description, order: i },
      });
    }
    console.log(`Seeded ${services.length} services.`);
  }

  if ((await prisma.filiere.count()) === 0) {
    for (let i = 0; i < filieres.length; i++) {
      const f = filieres[i];
      await prisma.filiere.create({
        data: { slug: f.slug, title: f.title, icon: f.icon, topics: f.topics.join(", "), order: i },
      });
    }
    console.log(`Seeded ${filieres.length} filières.`);
  }

  if ((await prisma.project.count()) === 0) {
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      await prisma.project.create({
        data: {
          slug: p.slug,
          category: p.category,
          title: p.title,
          client: p.client,
          location: p.location,
          problem: p.problem,
          solution: p.solution,
          results: p.results.join("\n"),
          technologies: p.technologies.join(", "),
          coverImage: p.image,
          order: i,
          images: { create: p.gallery.map((url) => ({ url })) },
        },
      });
    }
    console.log(`Seeded ${projects.length} projects.`);
  }

  if ((await prisma.article.count()) === 0) {
    for (const a of articles) {
      const publishedAt = parseFrenchDate(a.date);
      await prisma.article.create({
        data: {
          slug: a.slug,
          category: a.category,
          title: a.title,
          excerpt: a.excerpt,
          content: a.content.join("\n\n"),
          status: "PUBLISHED",
          publishedAt,
          createdAt: publishedAt,
        },
      });
    }
    console.log(`Seeded ${articles.length} articles.`);
  }

  if ((await prisma.testimonial.count()) === 0) {
    for (const t of testimonials) {
      await prisma.testimonial.create({
        data: { name: t.name, rating: t.rating, text: t.text, approved: true, publishedAt: new Date() },
      });
    }
    console.log(`Seeded ${testimonials.length} testimonials.`);
  }

  if ((await prisma.teamMember.count()) === 0) {
    for (let i = 0; i < team.length; i++) {
      const m = team[i];
      await prisma.teamMember.create({
        data: { name: m.name, role: m.role, initials: m.initials, order: i },
      });
    }
    console.log(`Seeded ${team.length} team members.`);
  }

  if ((await prisma.partner.count()) === 0) {
    for (let i = 0; i < partners.length; i++) {
      await prisma.partner.create({ data: { name: partners[i], order: i } });
    }
    console.log(`Seeded ${partners.length} partners.`);
  }

  if ((await prisma.companyValue.count()) === 0) {
    for (let i = 0; i < companyValues.length; i++) {
      const v = companyValues[i];
      await prisma.companyValue.create({
        data: { type: "VALUE", title: v.title, description: v.description, order: i },
      });
    }
    for (let i = 0; i < whyUs.length; i++) {
      const v = whyUs[i];
      await prisma.companyValue.create({
        data: { type: "WHY_US", title: v.title, description: v.description, order: i },
      });
    }
    console.log(`Seeded ${companyValues.length} company values and ${whyUs.length} why-us reasons.`);
  }

  if ((await prisma.stat.count()) === 0) {
    for (let i = 0; i < stats.length; i++) {
      const s = stats[i];
      await prisma.stat.create({ data: { label: s.label, value: s.value, order: i } });
    }
    console.log(`Seeded ${stats.length} stats.`);
  }

  const aboutDefaults: Record<string, string> = {
    about_intro:
      "Créé en " +
      companyFacts.foundedYear +
      " en tant que centre d'application technologique, TechnoTchad forme élèves, étudiants et cadres d'entreprise dans le domaine des technologies de l'information et de la communication (TIC) — télécommunications, réseaux informatiques et multimédia web — avec des compétences larges et variées : le digital, la création de sites internet et le développement d'applications.",
    about_founded_year: String(companyFacts.foundedYear),
    about_vision: [
      "Former des leaders de demain dans le domaine des Technologies de l'Information et de la Communication (TIC).",
      "Répondre aux besoins d'accessibilité aux nouvelles technologies de l'information et de la communication des populations et organisations du Tchad.",
      "Développer l'usage du numérique par les entreprises, les organisations et les travailleurs afin de stimuler le développement du Tchad.",
    ].join("\n"),
    about_mission: [
      "Offrir une formation de niveau international à nos apprenants.",
      "Promouvoir des ressources humaines qualifiées et compétentes.",
      "Promouvoir le savoir, le savoir-faire et le savoir être.",
      "Promouvoir les solutions dans le domaine des TIC.",
      "Être la référence en matière d'offre de service.",
      "Être la référence dans l'enseignement technologique au Tchad.",
    ].join("\n"),
    about_location_description: companyFacts.location.description,
    about_infrastructure: companyFacts.infrastructure.join("\n"),
    about_teaching_intro:
      "Des corps enseignants hautement qualifiés et triés sur le volet, des effectifs réduits, des matériels didactiques à la pointe de la technologie et des infrastructures ultramodernes constituent autant d'atouts qui font notre force. Nos enseignants sont recrutés sur la base de leur état d'esprit dans la recherche et de leur expérience professionnelle. Les programmes sont dispensés en cours du jour et du soir.",
    about_teaching_methods: companyFacts.teachingMethods.join("\n"),
    about_admission: companyFacts.admission,
  };

  let seededSettings = 0;
  for (const [key, value] of Object.entries(aboutDefaults)) {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (!existing) {
      await prisma.setting.create({ data: { key, value } });
      seededSettings++;
    }
  }
  if (seededSettings > 0) {
    console.log(`Seeded ${seededSettings} about-page settings.`);
  }

  const socialDefaults: Record<string, string> = {
    social_facebook: "",
    social_tiktok: "",
    social_youtube: "",
    social_whatsapp: "",
  };

  let seededSocial = 0;
  for (const [key, value] of Object.entries(socialDefaults)) {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (!existing) {
      await prisma.setting.create({ data: { key, value } });
      seededSocial++;
    }
  }
  if (seededSocial > 0) {
    console.log(`Seeded ${seededSocial} social media settings.`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
