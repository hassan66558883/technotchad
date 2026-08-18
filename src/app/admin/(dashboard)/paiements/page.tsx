import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createPayment } from "./actions";
import PaymentStatusSelect from "@/components/admin/PaymentStatusSelect";
import { computePaymentStatus, paymentStatusLabels, paymentStatusStyles } from "@/lib/payment";

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
      include: {
        student: true,
        courseSession: { include: { course: true } },
        workshop: true,
        payments: true,
      },
      orderBy: { registeredAt: "desc" },
    }),
    prisma.payment.findMany({
      include: {
        registration: {
          include: { student: true, courseSession: { include: { course: true } }, workshop: true },
        },
        recordedBy: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpected = registrations.reduce((sum, r) => sum + (r.paymentAmount ?? 0), 0);

  const registrationsWithBalance = registrations
    .map((reg) => {
      const paid = reg.payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0);
      const remaining = (reg.paymentAmount ?? 0) - paid;
      const status = computePaymentStatus({
        totalDue: reg.paymentAmount,
        totalPaid: paid,
        dueDate: reg.paymentDueDate,
      });
      return { reg, paid, remaining, status };
    })
    .filter((r) => r.remaining > 0 && r.reg.paymentAmount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy">Paiements</h1>
        <p className="text-sm text-slate">
          {payments.length} paiement{payments.length > 1 ? "s" : ""} enregistré
          {payments.length > 1 ? "s" : ""}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">💰 Total attendu</p>
          <p className="mt-2 text-xl font-bold text-navy">{formatAmount(totalExpected)}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">💵 Total encaissé</p>
          <p className="mt-2 text-xl font-bold text-emerald-700">{formatAmount(totalPaid)}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">🟠 Solde impayé</p>
          <p className="mt-2 text-xl font-bold text-red-600">
            {formatAmount(Math.max(totalExpected - totalPaid, 0))}
          </p>
        </div>
      </div>

      {registrationsWithBalance.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-sm font-semibold text-navy">
              👥 Étudiants avec solde impayé ({registrationsWithBalance.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate">
                  <th className="px-6 py-3 font-semibold">Étudiant</th>
                  <th className="px-6 py-3 font-semibold">Formation</th>
                  <th className="px-6 py-3 font-semibold">Total à payer</th>
                  <th className="px-6 py-3 font-semibold">Payé</th>
                  <th className="px-6 py-3 font-semibold">Reste à payer</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold">Fiche</th>
                </tr>
              </thead>
              <tbody>
                {registrationsWithBalance.map(({ reg, paid, remaining, status }) => (
                  <tr key={reg.id} className="border-t border-line">
                    <td className="px-6 py-3.5 font-medium text-navy">
                      {reg.student.firstName} {reg.student.lastName}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">
                      {reg.courseSession?.course.title ?? reg.workshop?.title}
                    </td>
                    <td className="px-6 py-3.5 text-ink/80">{formatAmount(reg.paymentAmount ?? 0)}</td>
                    <td className="px-6 py-3.5 text-ink/80">{formatAmount(paid)}</td>
                    <td className="px-6 py-3.5 font-semibold text-red-600">{formatAmount(remaining)}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentStatusStyles[status]}`}
                      >
                        {paymentStatusLabels[status]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/admin/fiche/${reg.id}`}
                        className="text-xs font-semibold text-blue hover:text-blue-dark"
                      >
                        Voir →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          <input
            name="note"
            placeholder="Note (optionnel)"
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue sm:col-span-4"
          />
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
                  <th className="px-6 py-3 font-semibold">Reçu</th>
                  <th className="px-6 py-3 font-semibold">Étudiant</th>
                  <th className="px-6 py-3 font-semibold">Formation / Workshop</th>
                  <th className="px-6 py-3 font-semibold">Montant</th>
                  <th className="px-6 py-3 font-semibold">Méthode</th>
                  <th className="px-6 py-3 font-semibold">Payé le</th>
                  <th className="px-6 py-3 font-semibold">Enregistré par</th>
                  <th className="px-6 py-3 font-semibold">Note</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-line">
                    <td className="px-6 py-3.5 font-mono text-xs text-slate">
                      {payment.reference ?? "—"}
                    </td>
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
                    <td className="px-6 py-3.5 text-ink/80">{payment.recordedBy?.name ?? "—"}</td>
                    <td className="px-6 py-3.5 text-ink/80">{payment.note ?? "—"}</td>
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
