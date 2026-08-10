import { prisma } from "@/lib/prisma";
import { createPayment } from "./actions";
import PaymentStatusSelect from "@/components/admin/PaymentStatusSelect";

export const metadata = { title: "Paiements — Admin TechnoTchad" };
export const dynamic = "force-dynamic";

const paymentMethods = ["Espèces", "Mobile Money", "Virement bancaire", "Chèque"];

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatAmount(amount: number) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

export default async function PaiementsPage() {
  const [registrations, payments] = await Promise.all([
    prisma.registration.findMany({
      include: { student: true, courseSession: { include: { course: true } }, workshop: true },
      orderBy: { registeredAt: "desc" },
    }),
    prisma.payment.findMany({
      include: {
        registration: {
          include: { student: true, courseSession: { include: { course: true } }, workshop: true },
        },
      },
      orderBy: { id: "desc" },
    }),
  ]);

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-navy">Paiements</h1>
          <p className="text-sm text-slate">
            {payments.length} paiement{payments.length > 1 ? "s" : ""} enregistré
            {payments.length > 1 ? "s" : ""}.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white px-6 py-3 text-right shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">Total encaissé</p>
          <p className="text-lg font-bold text-navy">{formatAmount(totalPaid)}</p>
        </div>
      </div>

      {registrations.length > 0 && (
        <form
          action={createPayment}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm sm:grid-cols-4"
        >
          <select
            name="registrationId"
            required
            defaultValue=""
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-2"
          >
            <option value="" disabled>
              Sélectionner une inscription
            </option>
            {registrations.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.student.firstName} {reg.student.lastName} —{" "}
                {reg.courseSession?.course.title ?? reg.workshop?.title}
              </option>
            ))}
          </select>
          <input
            name="amount"
            type="number"
            min={1}
            required
            placeholder="Montant (FCFA)"
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          />
          <select
            name="method"
            required
            defaultValue=""
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue"
          >
            <option value="" disabled>
              Méthode
            </option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="sm:col-span-4 rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
          >
            Enregistrer le paiement
          </button>
        </form>
      )}

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-slate">Aucun paiement enregistré pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate">
                  <th className="px-6 py-3 font-semibold">Étudiant</th>
                  <th className="px-6 py-3 font-semibold">Formation / Workshop</th>
                  <th className="px-6 py-3 font-semibold">Montant</th>
                  <th className="px-6 py-3 font-semibold">Méthode</th>
                  <th className="px-6 py-3 font-semibold">Payé le</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-line">
                    <td className="px-6 py-3.5 font-medium text-navy">
                      {payment.registration.student.firstName} {payment.registration.student.lastName}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {payment.registration.courseSession?.course.title ??
                        payment.registration.workshop?.title}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-navy">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">{payment.method}</td>
                    <td className="px-6 py-3.5 text-ink/80">{formatDate(payment.paidAt)}</td>
                    <td className="px-6 py-3.5">
                      <PaymentStatusSelect id={payment.id} status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
