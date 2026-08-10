import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { canAccessPath } from "@/lib/permissions";
import EditFicheForm from "@/components/admin/EditFicheForm";

export default async function EditFichePage({ params }: PageProps<"/admin/fiche/[id]/edit">) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/admin/login");
  if (!canAccessPath(session.role, "/admin/etudiants")) redirect("/admin?denied=1");

  const registration = await prisma.registration.findUnique({
    where: { id },
    include: { student: true },
  });

  if (!registration) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={`/admin/fiche/${id}`} className="text-sm text-slate hover:text-blue">
        ← Retour à la fiche
      </Link>

      <div>
        <h1 className="text-lg font-semibold text-navy">Modifier la fiche d&apos;inscription</h1>
        <p className="text-sm text-slate">
          N° {registration.inscriptionNumber ?? "—"} · {registration.student.firstName}{" "}
          {registration.student.lastName}
        </p>
      </div>

      <EditFicheForm registrationId={id} student={registration.student} registration={registration} />
    </div>
  );
}
