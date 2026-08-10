"use client";

import { useActionState, useRef } from "react";
import { createStudent } from "@/app/admin/(dashboard)/etudiants/actions";

type Option = { value: string; label: string; price: number | null };

const inputClass =
  "rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-blue";

const MAX_DISCOUNT_PERCENT = 20;
const MAX_SCHOLARSHIP_PERCENT = 100;

function clampPercent(value: number, max: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), max);
}

export default function CreateStudentForm({ enrollmentOptions }: { enrollmentOptions: Option[] }) {
  const [state, formAction, isPending] = useActionState(createStudent, undefined);
  const paymentAmountRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const scholarshipRef = useRef<HTMLInputElement>(null);
  const basePriceRef = useRef<number | null>(null);

  function applyPrice() {
    if (!paymentAmountRef.current) return;
    const basePrice = basePriceRef.current;
    if (basePrice == null) {
      paymentAmountRef.current.value = "";
      return;
    }
    const discount = clampPercent(Number(discountRef.current?.value ?? 0), MAX_DISCOUNT_PERCENT);
    const scholarship = clampPercent(Number(scholarshipRef.current?.value ?? 0), MAX_SCHOLARSHIP_PERCENT);
    const amount = basePrice * (1 - discount / 100) * (1 - scholarship / 100);
    paymentAmountRef.current.value = String(Math.round(amount));
  }

  function handleEnrollmentChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selected = enrollmentOptions.find((option) => option.value === event.target.value);
    basePriceRef.current = selected?.price ?? null;
    applyPrice();
  }

  function handleDiscountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const clamped = clampPercent(Number(event.target.value), MAX_DISCOUNT_PERCENT);
    event.target.value = event.target.value === "" ? "" : String(clamped);
    applyPrice();
  }

  function handleScholarshipChange(event: React.ChangeEvent<HTMLInputElement>) {
    const clamped = clampPercent(Number(event.target.value), MAX_SCHOLARSHIP_PERCENT);
    event.target.value = event.target.value === "" ? "" : String(clamped);
    applyPrice();
  }

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-line bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-sm font-semibold text-navy">Fiche d&apos;inscription étudiant</h2>
        <p className="mt-1 text-xs text-slate">
          Seuls le prénom, le nom, le téléphone et l&apos;email sont obligatoires — le reste
          alimente la fiche imprimable une fois complété.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          1. Informations personnelles
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input name="firstName" required placeholder="Prénom" className={inputClass} />
          <input name="lastName" required placeholder="Nom" className={inputClass} />
          <input name="phone" required placeholder="Téléphone" className={inputClass} />
          <input name="email" type="email" required placeholder="Email" className={inputClass} />
          <input name="dateOfBirth" type="date" aria-label="Date de naissance" className={inputClass} />
          <input name="placeOfBirth" placeholder="Lieu de naissance" className={inputClass} />
          <select name="gender" defaultValue="" className={inputClass}>
            <option value="">Sexe</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          <input
            name="address"
            placeholder="Adresse"
            className={`${inputClass} sm:col-span-2`}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          2. Informations académiques / professionnelles
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select name="educationLevel" defaultValue="" className={inputClass}>
            <option value="">Niveau d&apos;études</option>
            <option value="Primaire">Primaire</option>
            <option value="Secondaire">Secondaire</option>
            <option value="Bac">Bac</option>
            <option value="Licence">Licence</option>
            <option value="Master">Master</option>
            <option value="Autre">Autre</option>
          </select>
          <input name="lastDiploma" placeholder="Dernier diplôme obtenu" className={inputClass} />
          <input name="institution" placeholder="Établissement" className={inputClass} />
          <input name="profession" placeholder="Profession actuelle" className={inputClass} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          3. Formation choisie
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select
            name="enrollment"
            defaultValue=""
            onChange={handleEnrollmentChange}
            className={`${inputClass} sm:col-span-2`}
          >
            <option value="">Aucune inscription pour le moment</option>
            {enrollmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select name="level" defaultValue="" className={`${inputClass} sm:col-span-2`}>
            <option value="">Niveau</option>
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
          </select>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          4. Logistique & paiement
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <select name="trainingMode" defaultValue="" className={`${inputClass} sm:col-span-2`}>
            <option value="">Mode de formation</option>
            <option value="Présentiel">Présentiel</option>
            <option value="En ligne">En ligne</option>
            <option value="Hybride">Hybride</option>
          </select>
          <input
            name="discountPercent"
            ref={discountRef}
            type="number"
            min="0"
            max={MAX_DISCOUNT_PERCENT}
            placeholder={`Remise (% — max ${MAX_DISCOUNT_PERCENT})`}
            onChange={handleDiscountChange}
            className={inputClass}
          />
          <input
            name="scholarshipPercent"
            ref={scholarshipRef}
            type="number"
            min="0"
            max={MAX_SCHOLARSHIP_PERCENT}
            placeholder="Bourse (%)"
            onChange={handleScholarshipChange}
            className={inputClass}
          />
          <input
            name="paymentAmount"
            ref={paymentAmountRef}
            type="number"
            min="0"
            placeholder="Montant total (FCFA)"
            title="Pré-rempli depuis le tarif de la formation et la remise — modifiable"
            className={inputClass}
          />
          <input
            name="paidAmount"
            type="number"
            min="0"
            placeholder="Montant payé (FCFA)"
            className={inputClass}
          />
          <select name="paymentMethod" defaultValue="" className={inputClass}>
            <option value="">Mode de paiement</option>
            <option value="Espèces">Espèces</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Virement bancaire">Virement bancaire</option>
            <option value="Chèque">Chèque</option>
          </select>
          <input
            name="documentsProvided"
            placeholder="Pièces fournies (ex : CNI, photo, diplôme)"
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate">
          5. Personne à contacter en cas d&apos;urgence
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input name="emergencyContactName" placeholder="Nom complet" className={inputClass} />
          <input name="emergencyContactRelation" placeholder="Lien de parenté" className={inputClass} />
          <input name="emergencyContactPhone" placeholder="Téléphone" className={inputClass} />
        </div>
      </section>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enregistrement…" : "Enregistrer la fiche"}
      </button>
    </form>
  );
}
